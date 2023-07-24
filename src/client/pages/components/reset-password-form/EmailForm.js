import {FormProvider, useForm} from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useIntl } from 'react-intl';
import { buttonMessages, formMessages, homePageMessages } from '../../../translations/i18n';
import { Stack, useTheme, Typography } from '@mui/material';
import FormTextFieldComponent from '../../../components/UI/Form/Inputs/FormTextFieldComponent';
import ButtonComponent from '../../../components/UI/ButtonComponent';
import { useState } from 'react';
import ErrorLabelComponent from '../../../components/UI/Form/Labels/ErrorLabelComponent';
import userApi from "../../../store/user/user-api";
import CenteredStack from '../../../components/UI/CenteredStack'

const EmailFormComponent = (props) => {

    const intl = useIntl()
    const theme = useTheme()
    
    const emailValidationSchema = yup.object().shape({
        email: yup.string().email(intl.formatMessage(formMessages.emailError)).required(intl.formatMessage(formMessages.emptyFieldError))
    }).required()

    const methods = useForm({
        resolver: yupResolver(emailValidationSchema)
    });

    const [emailError, setEmailError] = useState(null)

    const onSubmit = async (data) => {
        try {
            const res = await userApi.getResetPasswordCode(data.email)
            if (res) {
                props.onSendEmail(data.email)
            }
        } catch (e) {
            if (e.response.status === 404) {
                setEmailError(intl.formatMessage(homePageMessages.emailNotExist))
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
                        {intl.formatMessage(homePageMessages.enterEmail)}
                    </Typography>
                    <FormTextFieldComponent
                        name="email"
                        type="text"
                        fieldLabel={intl.formatMessage(formMessages.email)}
                        onBlur={() => setEmailError(null)}
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
                {emailError && (
                    <CenteredStack>
                        <ErrorLabelComponent
                            label={emailError}
                        />
                    </CenteredStack>
                )}
            </form>
        </FormProvider>
    )
}

export default EmailFormComponent