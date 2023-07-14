import { useFormContext, Controller } from "react-hook-form";
import InputLabelComponent from "../Labels/InputLabelComponent";
import ErrorLabelComponent from "../Labels/ErrorLabelComponent";
import { MenuItem, Select, Stack } from "@mui/material";

const FormSelectComponent = (props) => {

    const {control, formState: {errors}, getValues} = useFormContext();

    return (
        <Controller
            name={props.name}
            control={control}
            defaultValue={getValues(props.name)}
            render={({field}) => (
                <Stack
                    width="100%"
                >   
                    <InputLabelComponent
                        label={props.fieldLabel}
                    />
                    <Select
                        {...field}
                        fullWidth
                        inputRef={null}
                        onChange={(e) => {
                            if (props.onChange) {
                                field.onChange(e.target.value)
                                props.onChange(e.target.value)
                            }
                        }}
                    >
                        {props.items.map((item, index) => (
                            <MenuItem
                                key={index}
                                value={item.value}
                                sx={{
                                    direction: 'rtl'
                                }}
                            >
                                {item.label}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors && errors[props.name] && (
                        <ErrorLabelComponent
                            label={errors[props.name].message}
                        />
                    )}
                </Stack>
            )}
        />   
    )
}

export default FormSelectComponent