import { Stack, useTheme } from "@mui/material"
import TableComponent from '../../components/UI/TableComponent'
import axios from "axios"
import { useIntl } from "react-intl"
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import {getAuthorizationHeader, getUserToken} from '../../utils/utils'
import FormDatePickerComponent from "../../components/UI/Form/Inputs/FormDatePickerComponent";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const ReportsPage = (props) => {

    const theme = useTheme();

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getYear();

    const methods = useForm({
        defaultValues: {
            startDate: dayjs(`${currentYear}-${currentMonth}-1`),
            endDate: dayjs(`${currentYear}-${currentMonth}-${new Date().getDate()}`)
        }
    })

    const [selectedMonthOrders, setSelectedMonthsOrders] = useState([])
    const [previousMonthsOrder, setPreviousMonthsOrders] = useState([])

    const startDayWatcher = methods.watch('startDate')
    const endDayWatcher = methods.watch('endDate')
    console.log(startDayWatcher, endDayWatcher)

    useEffect(() => {
        if (startDayWatcher.month === endDayWatcher.month) {
            const currentMonthData = props.orders.filter((order) => {
                const orderDate = dayjs(order.created)
                return orderDate.isAfter(startDayWatcher) && orderDate.isBefore(endDayWatcher)
            })
            const prevMonthStart = dayjs(`${currentYear}-${currentMonth - 1}-1`).format('DD/MM/YYYY')
            const prevMonthEnd = dayjs(`${currentYear}-${currentMonth - 1}-${new Date().getDate()}`).format('DD/MM/YYYY')
            const prevMonthData = props.orders.filter((order) => {
                const orderDate = dayjs(order.created)
                return orderDate.isAfter(prevMonthStart) && orderDate.isBefore(prevMonthEnd)
            })
            console.log(currentMonthData)
            console.log(prevMonthData)
            setSelectedMonthsOrders(currentMonthData)
            setPreviousMonthsOrders(prevMonthData)
        }
    }, [startDayWatcher, endDayWatcher])

    return (
        <Stack>
            <Stack
                width="30%"
                sx={{
                    ml: 'auto',
                    mr: theme.spacing(4)
                }}
            >
                <FormProvider {...methods}>
                    <form
                        style={{
                            width: '100%'
                        }}
                    >
                        <Stack
                            width="100%"
                            direction="row"
                        >   
                            <FormDatePickerComponent
                                name="startDate"
                                maxDate={dayjs()}
                            />
                            <FormDatePickerComponent
                                name="endDate"
                                maxDate={dayjs()}
                            />
                        </Stack>
                    </form>
                </FormProvider>
            </Stack>
        </Stack>
    )
}

export const getServerSideProps = async (context) => {
    const token = getUserToken(context.req.headers.cookie)
    const response = await axios.get('http://localhost:3002/order/orders', {
        headers: {
            Authorization: getAuthorizationHeader(token)
        }
    })

    const ordersData = response.data.orders.filter((order) => order.status === 9)

    return {
        props: {
         orders: ordersData
        }
    }
}

export default ReportsPage