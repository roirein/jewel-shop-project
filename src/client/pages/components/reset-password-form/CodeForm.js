import {FormProvider, useForm} from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useIntl } from 'react-intl';
import { buttonMessages, formMessages, homePageMessages } from '../../../translations/i18n';
import { Stack, useTheme, Typography } from '@mui/material';
import FormTextFieldComponent from '../../../components/UI/Form/Inputs/FormTextFieldComponent';
import ButtonComponent from '../../../components/UI/ButtonComponent';
import axios from 'axios';
import { useState } from 'react';
import ErrorLabelComponent from '../../../components/UI/Form/Labels/ErrorLabelComponent';

const CodeFormComponent = (props) => {

    const intl = useIntl()
    const theme = useTheme()
    
    const codeValidationSchema = yup.object().shape({
        code: yup.string().matches(/^\d{6}$/, intl.formatMessage(formMessages.emailError)).required(intl.formatMessage(formMessages.emptyFieldError))
    }).required()

    const methods = useForm({
        resolver: yupResolver(codeValidationSchema)
    });

    const [codeError, setCodeError] = useState(null)

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:3002/user/verifyCode', {
                email: props.email,
                code: data.code
            })
            if (response.status === 200) {
                props.onCodeVerify()
            }
        } catch (e) {
            if (e.response.status === 400) {
                if (e.response.data === 'invalid-code') {
                    setCodeError(intl.formatMessage(homePageMessages.invalidCode))
                }
                if (e.response.data === 'token-expired') {
                    setCodeError(intl.formatMessage(homePageMessages.codeExpired))
                }
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
                        {intl.formatMessage(homePageMessages.enterCode)}
                    </Typography>
                    <FormTextFieldComponent
                        name="code"
                        type="text"
                        fieldLabel={intl.formatMessage(formMessages.code)}
                        onBlur={() => setCodeError(null)}
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
                {codeError && (
                    <CenteredStack>
                        <ErrorLabelComponent
                            label={codeError}
                        />
                    </CenteredStack>
                )}
            </form>
        </FormProvider>
    )
}

export default CodeFormComponent