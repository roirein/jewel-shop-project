import { Typography, useTheme } from "@mui/material"
import { useIntl } from "react-intl"
import { homePageMessages } from "../translations/i18n"
import CenteredStack from "../components/UI/CenteredStack"
import LoginFormComponent from "./components/LoginForm"
import { useState } from "react"
import RegisterFormComponent from "./components/RegisterForm"
import RestePasswordComponent from "./components/ResetPassword"

const AUTH_OPTIONS = {
    REGISTER: 'register',
    LOGIN: 'login',
    RESET_PASSWORD: 'reset_password'
}

const HomePage = () => {

    const intl = useIntl();
    const theme = useTheme();

    const [authOption, setAuthOption] = useState(AUTH_OPTIONS.LOGIN)

    return (
        <CenteredStack
            sx={{
                direction: theme.direction
            }}
        >
            <Typography
                variant="h2"
                color="textContrast"
                fontWeight="bold"
            >
                {intl.formatMessage(homePageMessages.welcome)}
            </Typography>
            <CenteredStack
                width="30%"
                sx={{
                    p: theme.spacing(3),
                    mt: theme.spacing(6),
                    border: `${theme.spacing(0)} solid ${theme.palette.primary.main}`
                }}
            >
                {authOption === AUTH_OPTIONS.LOGIN && (
                    <LoginFormComponent
                        onSwitchToRegister={() => setAuthOption(AUTH_OPTIONS.REGISTER)}
                        onForgotPassword={() => setAuthOption(AUTH_OPTIONS.RESET_PASSWORD)}

                    />
                )}
                {authOption === AUTH_OPTIONS.REGISTER && (
                    <RegisterFormComponent 
                        onSwitchToLogin={() => setAuthOption(AUTH_OPTIONS.LOGIN)}
                    />
                )}
                {authOption === AUTH_OPTIONS.RESET_PASSWORD && (
                    <RestePasswordComponent
                        onSwitchToLogin={() => setAuthOption(AUTH_OPTIONS.LOGIN)}
                    />
                )}
            </CenteredStack>
        </CenteredStack>
    )
}

export default HomePage