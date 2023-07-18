import { Stack, useTheme } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from "dayjs";
import { useState } from "react"

const DateRangePicker = (props) => {

    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    const theme = useTheme()

    return (
        <Stack
            direction="row"
            columnGap={theme.spacing(4)}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    format="DD/MM/YYYY"
                    Date={dayjs()}
                    onChange={(value) => {
                        setStartDate(value)
                        props.onChooseStartDate(value)
                    }}
                />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    format="DD/MM/YYYY"
                    minDate={startDate}
                    disabled={!startDate}
                    onChange={(value) => {
                        setEndDate(value)
                        props.onChooseEndDate(value)
                    }}
                />
            </LocalizationProvider>
        </Stack>
    )
}

export default DateRangePicker