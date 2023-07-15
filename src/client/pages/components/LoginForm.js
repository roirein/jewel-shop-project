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
import { useState, useContext } from "react";
import ErrorLabelComponent from "../../components/UI/Form/Labels/ErrorLabelComponent";
import AppContext from "../../context/AppContext";
import { sendHttpRequest } from "../../utils/requests";
import { USER_ROUTES } from "../../utils/server-routes";
import { getRouteAfterLogin } from "../../utils/utils";
import { getLoginErrorMessage } from "../../utils/error";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

const LoginFormComponent = (props) => {

    const intl = useIntl();
    const router = useRouter()
    const contextValue = useContext(AppContext)

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
            const response = await sendHttpRequest(USER_ROUTES.LOGIN, 'POST', {
                email: data.email,
                password: data.password
            })
            if (response.status === 200) {
                contextValue.onLogin(response.data.user, data.rememberMe)
                router.push(getRouteAfterLogin(response.data.user.permissionLevel))
            }
        } catch(e) {
            console.log(e)
            setLoginError(getLoginErrorMessage(e.response.status, e.response.data))
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
                            onBlur={() => setLoginError(null)}
                        />
                        <FormPasswordFieldComponent
                            name="password"
                            fieldLabel={intl.formatMessage(formMessages.password)}
                            onBlur={() => setLoginError(null)}
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
                                onClick={() => props.onForgotPassword()}
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
                            <CenteredStack>
                                <ErrorLabelComponent
                                    label={loginError}
                                />
                            </CenteredStack>
                        )}
                    </Stack>
                </form>
            </FormProvider>
        </CenteredStack>
    )
}

export default LoginFormComponent;