import { Typography, useTheme, Stack, Link, CircularProgress } from "@mui/material"
import CenteredStack from "../../components/UI/CenteredStack"
import { useIntl } from "react-intl"
import { buttonMessages, formMessages, homePageMessages } from "../../translations/i18n";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import FormTextFieldComponent from "../../components/UI/Form/Inputs/FormTextFieldComponent";
import FormPasswordFieldComponent from "../../components/UI/Form/Inputs/FormPasswordFieldComponent";
import ButtonComponent from "../../components/UI/ButtonComponent";
import FormCheckboxComponent from "../../components/UI/Form/Inputs/FormCheckboxComponent";
import axios from 'axios';
import { useRouter } from "next/router";
import { useState } from "react";
import ErrorLabelComponent from "../../components/UI/Form/Labels/ErrorLabelComponent";

const LoginFormComponent = (props) => {

    const intl = useIntl();
    const router = useRouter()

    const loginValidationSchema = yup.object().shape({
        email: yup.string().email(intl.formatMessage(formMessages.emailError)).required(intl.formatMessage(formMessages.emptyFieldError)),
        password: yup.string().required(intl.formatMessage(formMessages.emptyFieldError))
    }).required()

    const methods = useForm({
        resolver: yupResolver(loginValidationSchema)
    })
    const theme = useTheme()
    const [loginError, setLoginError] = useState(null)

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:3002/user/login', {
                email: data.email,
                password: data.password
            })
            if (response.status === 200) {
                router.push('/customers')
            }
        } catch(e) {
            setLoginError(intl.formatMessage(homePageMessages.loginError))
        }

    }

    return (
        <CenteredStack
            width="100%"
        >
            <Typography
                variant="h4"
                fontWeight="bold"
            >
                {intl.formatMessage(homePageMessages.login)}
            </Typography>
            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    style={{
                        width: '100%'
                    }}
                >
                    <Stack
                        width='100%'
                        rowGap={theme.spacing(3)}
                    >
                        <FormTextFieldComponent
                            name="email"
                            type="text"
                            fieldLabel={intl.formatMessage(formMessages.email)}
                        />
                        <FormPasswordFieldComponent
                            name="password"
                            fieldLabel={intl.formatMessage(formMessages.password)}
                        />
                        <Stack
                            width="100%"
                            alignItems="flex-end"
                            position="relative"
                        >
                            <Link
                                variant="caption"
                                underline="none"
                                color="primary"
                                href="#"
                                sx={{
                                    position: 'absolute',
                                    bottom: methods.formState.errors['password'] ? '12px' : '-10px'
                                }}
                            >
                                {intl.formatMessage(formMessages.forgotPassword)}
                            </Link>
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
                                label={intl.formatMessage(buttonMessages.entry)}
                            />
                        </Stack>
                        <Stack
                            width="100%"
                            direction="row"
                            alignItems="baseline"
                        >
                            <Link
                                variant="caption"
                                underline="none"
                                color="primary"
                                href="#"
                                onClick={() => props.onSwitchToRegister()}
                            >
                                {intl.formatMessage(homePageMessages.toRegister)}
                            </Link>
                            <Stack
                                sx={{
                                    mr: 'auto'
                                }}
                            >
                                <FormCheckboxComponent
                                    name="rememberMe"
                                    label={intl.formatMessage(formMessages.rememberMe)}
                                />
                            </Stack>
                        </Stack>
                        {loginError && (
                            <ErrorLabelComponent
                                label={loginError}
                            />
                        )}
                    </Stack>
                </form>
            </FormProvider>
        </CenteredStack>
    )
}

export default LoginFormComponent;