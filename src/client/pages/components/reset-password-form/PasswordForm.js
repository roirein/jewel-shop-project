import {FormProvider, useForm} from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useIntl } from 'react-intl';
import { buttonMessages, formMessages, homePageMessages } from '../../../translations/i18n';
import { Stack, useTheme, Typography } from '@mui/material';
import FormPasswordFieldComponent from "../../../components/UI/Form/Inputs/FormPasswordFieldComponent";
import ButtonComponent from '../../../components/UI/ButtonComponent';
import axios from 'axios';
import { useState } from 'react';
import ErrorLabelComponent from '../../../components/UI/Form/Labels/ErrorLabelComponent';
import userApi from "../../../store/user/user-api";

const PasswordFormComponent = (props) => {

    const intl = useIntl()
    const theme = useTheme()
    
    const passwordValidationSchema = yup.object().shape({
        password: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)).
            matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$*])[A-Za-z\d@#$*]{8,}$/, intl.formatMessage(formMessages.passwordError)),
        confirmPassword: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)).oneOf([yup.ref('password'), null], intl.formatMessage(formMessages.confirmPasswordError))
    }).required()

    const methods = useForm({
        resolver: yupResolver(passwordValidationSchema)
    });

    const [passwordError, setPasswordError] = useState(null)

    const onSubmit = async (data) => {
        try {
            const passwordUpdated = await userApi.resetPassword(props.email, data.password, data.confirmPassword)
            if (passwordUpdated) {
                props.onChangePassword()
            }
        } catch (e) {
            console.log(e)
            if (e.response.status === 400) {
                setPasswordError(intl.formatMessage(homePageMessages.passwordError))
            }
        }
    }

    return (
        <FormProvider {...methods}>
            <form
                style={{
                    width: '100%'
                }}
                onSubmit={methods.handleSubmit(onSubmit)}
            >
                <Stack
                    width='100%'
                    rowGap={theme.spacing(3)}
                    sx={{
                        mb: theme.spacing(4)
                    }}
                >
                    <Typography
                        variant="body1"
                    >
                        {intl.formatMessage(formMessages.enterNewPassword)}
                    </Typography>
                    <FormPasswordFieldComponent
                        name="password"
                        fieldLabel={intl.formatMessage(formMessages.password)}
                        onBlur={() => setPasswordError(null)}
                    />
                    <FormPasswordFieldComponent
                        name="confirmPassword"
                        fieldLabel={intl.formatMessage(formMessages.confirmPassword)}
                        onBlur={() => setPasswordError(null)}
                    />
                </Stack>
                <Stack
                    width="50%"
                    sx={{
                        margin: '0 auto'
                    }}
                >
                    <ButtonComponent
                        type="submit"
                        onClick={() => {}}
                        label={intl.formatMessage(buttonMessages.send)}
                    />
                </Stack>
                {passwordError && (
                    <CenteredStack>
                        <ErrorLabelComponent
                            label={passwordError}
                        />
                    </CenteredStack>
                )}
            </form>
        </FormProvider>
    )
}

export default PasswordFormComponent