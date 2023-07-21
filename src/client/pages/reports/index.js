import { Stack, useTheme } from "@mui/material"
import TableComponent from '../../components/UI/TableComponent'
import axios from "axios"
import {getAuthorizationHeader, getUserToken} from '../../utils/utils'
import { useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import DateRangePicker from "./components/date-range-picker";
import AppContext from "../../context/AppContext";
import {sendHttpRequest} from '../../utils/requests'
import { ORDERS_ROUTES } from "../../utils/server-routes";
import dayjs from "dayjs";
import CenteredStack from "../../components/UI/CenteredStack";
import PerformanceTable from "./components/performanceTable";
import PerformanceByOrders from "./components/PertformanceByOrders";
import GraphComponent from "./components/graph";
import { useIntl } from "react-intl";
import { reportsPageMessages, tabsMessages } from "../../translations/i18n";

const ReportsPage = (props) => {

    const [orders, setOrders] = useState([])
    const contextValue = useContext(AppContext)
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [selectedMonthsOrders, setSelectedMonthsOrders] = useState([])
    const [prevMonthsOrders, setPrevMonthOrders] = useState([]);
    const theme = useTheme();
    const intl = useIntl()

    const onChooseStartDate = (selectedStartDate) => {
        setStartDate(dayjs(selectedStartDate))
        //setMonthBeforeStartDate(selectedStartDate.substract(1, 'month'))
    }

    const onChooseEndDate= (selectedEndDate) => {
        setEndDate(dayjs(selectedEndDate))
        //setMonthBeforeEndDate(selectedEndDate.substract(1, 'month'))
    }

    useEffect(() => {
        sendHttpRequest(ORDERS_ROUTES.ORDETS_BY_STATUS('completed'), 'GET', null, {
            Authorization: `Bearer ${contextValue.token}`
        }).then(response => setOrders(response.data.orders))
    }, [])

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

    return (
        <Stack
            width="100%"
        >
            <Stack
                width="100%"
                alignItems="flex-end"
            >
                <DateRangePicker
                    onChooseStartDate={(selectedStartDate) => onChooseStartDate(selectedStartDate)}
                    onChooseEndDate={(selectedEndDate) => onChooseEndDate(selectedEndDate)}
                />
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