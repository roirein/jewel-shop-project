import { Controller, useFormContext } from "react-hook-form";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {Stack} from '@mui/material'
import ErrorLabelComponent from "../Labels/ErrorLabelComponent";
import InputLabelComponent from "../Labels/InputLabelComponent";

const FormDatePickerComponent = (props) => {

    const {control, formState: {errors}} = useFormContext()

    return (
        <Stack>
            <Controller
                name={props.name}
                control={control}
                rules={props.rules}
                defaultValue={props.defaultValue || null}
                render={({field}) => (
                    <Stack
                        sx={{
                            width: '100%'
                        }}
                    >   
                        <InputLabelComponent
                            label={props.fieldLabel}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker {...field} 
                                format="DD/MM/YYYY" 
                                //onChange={field.onChange()}
                                minDate={props.minDate || null}
                                maxDate={props.maxDate || null}
                            />
                        </LocalizationProvider>
                        {errors && errors[props.name] && (
                            <ErrorLabelComponent
                                label={errors[props.name].message}
                            />
                        )}
                    </Stack>
                )}
            />
    </Stack>
    )
}

export default FormDatePickerComponent