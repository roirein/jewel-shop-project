import {Checkbox, FormControlLabel} from '@mui/material'
import { useFormContext, Controller } from 'react-hook-form'


const FormCheckboxComponent = (props) => {
    const {control} = useFormContext;

    return (
        <Controller
            name={props.name}
            control={control}
            render={({field}) => (
                <FormControlLabel
                    componentsProps={{
                        typography: {
                            variant:"caption",
                            color: "primary"
                        }
                    }}
                    sx={{
                        flexDirection: 'row-reverse'
                    }}
                    control={<Checkbox {...field} color='primary' sx={{fontSize: '11px'}}/>}
                    label={props.label}
                />
            )}
        />
    )
}

export default FormCheckboxComponent