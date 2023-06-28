import { TextField, Stack, Typography } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import InputLabelComponent from "../Labels/InputLabelComponent";
import ErrorLabelComponent from "../Labels/ErrorLabelComponent";

const FormTextFieldComponent = (props) => {

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
                    <TextField
                        {...field}
                        type={props.type}
                        fullWidth
                        inputRef={null}
                        helperText={errors && errors[props.name] ? (
                            <ErrorLabelComponent
                                label={errors[props.name].message}
                            />
                        ): ''}
                    />
                </Stack>
            )}
        />
    )
}

export default FormTextFieldComponent