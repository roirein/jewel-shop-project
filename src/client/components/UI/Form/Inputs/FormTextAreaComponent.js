import { TextField, Stack, Typography } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import InputLabelComponent from "../Labels/InputLabelComponent";
import ErrorLabelComponent from "../Labels/ErrorLabelComponent";

const FormTextAreaComponent = (props) => {

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
                        type="text"
                        multiline
                        rows={4}
                        fullWidth
                        inputRef={null}
                        helperText={errors && errors[props.name] ? (
                            <ErrorLabelComponent
                                label={errors[props.name].message}
                            />
                        ): ''}
                        onBlur={() => {
                            if (props.onBlur) {
                                props.onBlur()
                            }
                        }}
                    />
                </Stack>
            )}
        />
    )
}

export default FormTextAreaComponent