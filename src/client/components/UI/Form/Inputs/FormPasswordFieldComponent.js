import {TextField, Stack, IconButton} from "@mui/material";
import {Visibility, VisibilityOff} from '@mui/icons-material'
import {useFormContext, Controller} from "react-hook-form";
import InputLabelComponent from "../Labels/InputLabelComponent";
import {useState} from "react";
import ErrorLabelComponent from "../Labels/ErrorLabelComponent";

const FormPasswordFieldComponent = (props) => {

    const {control, formState: {errors}} = useFormContext();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Controller
            name={props.name}
            control={control}
            render={({field}) => (
                <Stack
                    width="100%"
                >
                    <InputLabelComponent
                        label={props.fieldLabel}
                    />
                    <TextField
                        {...field}
                        type={showPassword ? "text" : "password"}
                        inputRef={null}
                        fullWidth
                        helperText={errors && errors[props.name] ? (
                            <ErrorLabelComponent
                                label={errors[props.name].message}
                            />
                        ) : ''}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? (
                                        <Visibility/>
                                    ) : (
                                        <VisibilityOff/>
                                    )}
                                </IconButton>
                            )
                        }}
                    />
                </Stack>
            )}  
        />
    )
}

export default FormPasswordFieldComponent