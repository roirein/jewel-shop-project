import { useState } from "react"
import CenteredStack from "../../components/UI/CenteredStack"
import {Link, Typography, useTheme} from '@mui/material'
import { useIntl } from "react-intl"
import { formMessages, homePageMessages } from "../../translations/i18n"
import EmailFormComponent from "./reset-password-form/EmailForm"
import CodeFormComponent from "./reset-password-form/CodeForm"
import PasswordFormComponent from "./reset-password-form/PasswordForm"

const RestePasswordComponent = (props) => {

    const theme = useTheme()
    const intl = useIntl()
    const [resetStep, setResetStep] = useState(1);
    const [email, setEmail] = useState('')

    return (
        <CenteredStack
            rowGap={theme.spacing(4)}
            width="100%"
        >
            <Typography
                variant="h4"
                fontWeight="bold"
            >
                {intl.formatMessage(homePageMessages.resetPassword)}
            </Typography>
            {resetStep === 1 && (
                <EmailFormComponent
                    onSendEmail={(email) => {
                        setEmail(email)
                        setResetStep(2)
                    }}
                />
            )}
            {resetStep === 2 && (
                <CodeFormComponent
                    onCodeVerify={() => setResetStep(3)}
                    email={email}
                />
            )}
            {resetStep === 3 && (
                <PasswordFormComponent
                    email={email}
                    onChangePassword={() => setResetStep(4)}
                />
            )}
            {resetStep === 4 && (
                <CenteredStack>
                    <Typography
                        variant="h3"
                        fontWeight="bold"
                    >
                        {intl.formatMessage(formMessages.passwordChanged)}
                    </Typography>
                    <Link
                        variant="caption"
                        underline="none"
                        color="primary"
                        href="#"
                        onClick={() => props.onSwitchToLogin()}
                    >
                        {intl.formatMessage(homePageMessages.toLogin)}
                    </Link>
                </CenteredStack>
            )}
        </CenteredStack>
    )
}

export default RestePasswordComponent