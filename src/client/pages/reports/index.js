import { Button, Menu, MenuItem, Stack, useTheme } from "@mui/material"
import TableComponent from '../../components/UI/TableComponent'
import axios from "axios"
import {getAuthorizationHeader, getUserToken} from '../../utils/utils'
import { useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import DateRangePicker from "./components/date-range-picker";
import AppContext from "../../context/AppContext";
import {sendHttpRequest} from '../../utils/requests'
import { CUSTOMER_ROUTES, ORDERS_ROUTES } from "../../utils/server-routes";
import dayjs from "dayjs";
import CenteredStack from "../../components/UI/CenteredStack";
import PerformanceTable from "./components/performanceTable";
import PerformanceByOrders from "./components/PertformanceByOrders";
import GraphComponent from "./components/graph";
import { useIntl } from "react-intl";
import { formMessages, ordersPageMessages, reportsPageMessages, tabsMessages } from "../../translations/i18n";
import { KeyboardArrowDown } from "@mui/icons-material";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import ordersApi from "../../store/orders/orders-api";
import customersApi from '../../store/customers/customer-api'

const ReportsPage = (props) => {

    const [orders, setOrders] = useState([])
    const [customers, setCustomers] = useState([])
    const [menuAnchor, setMenuAnchor] = useState()
    const contextValue = useContext(AppContext)
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [selectedMonthsOrders, setSelectedMonthsOrders] = useState([])
    const [prevMonthsOrders, setPrevMonthOrders] = useState([]);
    const [showMenu, setShowMenu] = useState(false)
    const theme = useTheme();
    const intl = useIntl()

    const onChooseStartDate = (selectedStartDate) => {
        setStartDate(dayjs(selectedStartDate))
    }

    const onChooseEndDate= (selectedEndDate) => {
        setEndDate(dayjs(selectedEndDate))
    }

    useEffect(() => {
        ordersApi.loadOrdersByStatus('completed').then((ords) => setOrders(ords))
    }, [])

    useEffect(() => {
        customersApi.retrieveCustomer().then((custs) => setCustomers(custs)).then((response) => {
            const customersData = response.data.customers.map((customer) => {
                const customerOrders = orders.filter((ord) => {
                    return ord.customerName === customer.name
                })
                const totalPrice = customerOrders.reduce((sum, obj) => sum + obj.price, 0)
                return {
                    userId: customer.userId,
                    firstName: customer.name.split(' ')[0],
                    lastName: customer.name.split(' ')[1],
                    businessName: customer.businessName,
                    phoneNumber: customer.phoneNumber,
                    ordersAmount: customerOrders.length,
                    totalPrice
                }
            })
            setCustomers(customersData)
        })
    }, [orders])

    useEffect(() => {
        if (startDate && endDate) {
            const relevantOrders = orders.filter((ord) => {
                const created = dayjs(ord.createdAt)
                return created.isBefore(endDate) && created.isAfter(startDate)
            })
            const prevMonth= orders.filter((ord) => {
                const created = dayjs(ord.createdAt)
                return created.isBefore(endDate.subtract(1, 'month')) && created.isAfter(startDate.subtract(1, 'month'))
            })
            setSelectedMonthsOrders(relevantOrders)
            setPrevMonthOrders(prevMonth)
        }
    }, [startDate, endDate])

    const generatePdf = async () => {
        const doc = new jsPDF('p', 'pt', 'a4', true); 

        const fontUrl = "https://fonts.googleapis.com/css2?family=Assistant:wght@400;800&family=Lato:wght@300&family=Roboto+Condensed:wght@300&display=swap"

        const response = await axios.get(fontUrl);
        const fontCss = response.data;
    
        // Extract the font URL from the CSS response
        const fontUrlMatch = fontCss.match(/url\('(.+?)'\)/);
        if (fontUrlMatch && fontUrlMatch[1]) {
          const fontFileUrl = fontUrlMatch[1];
    
          // Fetch the font file
          const fontResponse = await axios.get(fontFileUrl, { responseType: 'blob' });
          const fontBlob = fontResponse.data;
    
          // Convert the font blob to data URL
          const fontDataUrl = URL.createObjectURL(fontBlob);
    
          // Add the Hebrew font to the PDF
          doc.addFileToVFS('Assistant.ttf', fontDataUrl);
          doc.addFont('Assistant.ttf', 'HebrewFont', 'normal');
    
          doc.setFont('Assistant'); // Set
          
        }

        doc.autoTable({
          head: [[
            formMessages.firstName.defaultMessage,
            formMessages.lastName.defaultMessage,
            formMessages.businessName.defaultMessage,
            formMessages.phoneNumber.defaultMessage,
            tabsMessages.orders.defaultMessage,
            ordersPageMessages.price.defaultMessage
        ]],
          body: customers.map((item) => [item.firstName, item.lastName, item.businessName, item.phoneNumber, item.ordersAmount, item.totalPrice]),
          styles: {
            direction: 'rtl', // Set the text direction to RTL
          }
        });
        doc.save('customers.pdf');
        setShowMenu(false)
    }

    return (
        <Stack
            width="100%"
        >
            <Stack
                direction="row"
                width="100%"
                alignItems="flex-end"
            >
                <Stack
                    sx={{
                        marginRight: 'auto'
                    }}
                >
                    <Button
                        varinat="outlined"
                        color="primary"
                        onClick={(e) => {
                            setShowMenu(true)
                            setMenuAnchor(e.currentTarget)

                        }}
                    >
                        {intl.formatMessage(reportsPageMessages.createReport)}
                        <KeyboardArrowDown/>
                    </Button>
                    <Menu
                        open={showMenu}
                        anchorOrigin={{
                            horizontal: 'left',
                            vertical: 'bottom'
                        }}
                        anchorEl={menuAnchor}
                    >
                        <MenuItem
                            onClick={generatePdf}
                        >
                            {intl.formatMessage(tabsMessages.customers)}
                        </MenuItem>
                        <MenuItem>
                            {intl.formatMessage(tabsMessages.orders)}
                        </MenuItem>
                    </Menu>
                </Stack>
                <Stack
                    sx={{
                        mr: theme.spacing(4)
                    }}
                >
                    <DateRangePicker
                        onChooseStartDate={(selectedStartDate) => onChooseStartDate(selectedStartDate)}
                        onChooseEndDate={(selectedEndDate) => onChooseEndDate(selectedEndDate)}
                    />
                </Stack>
            </Stack>
            <CenteredStack
                width="100%"
            >
                {startDate && endDate && (
                    <>
                        <PerformanceTable
                            selectedMonthOrders={selectedMonthsOrders}
                            prevMonthOrders={prevMonthsOrders}
                        />
                        <PerformanceByOrders
                            selectedOrders={selectedMonthsOrders}
                            prevOrders={prevMonthsOrders}
                        />
                        <Stack
                            width="60%"
                            rowGap={theme.spacing(5)}
                        >
                            <GraphComponent
                                selectedOrders={selectedMonthsOrders}
                                prevOrders={prevMonthsOrders}
                                field="order"
                                selectedMonthLabel={intl.formatMessage(reportsPageMessages.ordersPerDay, {month: dayjs(selectedMonthsOrders?.[0]?.createdAt).month() + 1})}
                                prevMonthLabel={intl.formatMessage(reportsPageMessages.ordersPerDay, {month: dayjs(prevMonthsOrders?.[0]?.createdAt).month() + 1})}
                                yAxisLabel={intl.formatMessage(tabsMessages.orders)}
                            />
                            <GraphComponent
                                selectedOrders={selectedMonthsOrders}
                                prevOrders={prevMonthsOrders}
                                field="price"
                                selectedMonthLabel={intl.formatMessage(reportsPageMessages.incomesPerDay, {month: dayjs(selectedMonthsOrders?.[0]?.createdAt).month() + 1})}
                                prevMonthLabel={intl.formatMessage(reportsPageMessages.incomesPerDay, {month: dayjs(prevMonthsOrders?.[0]?.createdAt).month() + 1})}
                                yAxisLabel={intl.formatMessage(reportsPageMessages.incomes)}
                            />
                        </Stack>
                    </>
                )}
            </CenteredStack>
        </Stack>
    )
}

export default ReportsPage