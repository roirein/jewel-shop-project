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

const ReportsPage = (props) => {

    const [orders, setOrders] = useState([])
    const contextValue = useContext(AppContext)
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [selectedMonthsOrders, setSelectedMonthsOrders] = useState([])
    const [prevMonthsOrders, setPrevMonthOrders] = useState([]);

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
        </Stack>
    )
}

export default ReportsPage