import { Typography, useTheme, Stack, Link } from "@mui/material"
import CenteredStack from "../../components/UI/CenteredStack"
import { useIntl } from "react-intl"
import { buttonMessages, formMessages, homePageMessages } from "../../translations/i18n";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import FormTextFieldComponent from "../../components/UI/Form/Inputs/FormTextFieldComponent";
import FormPasswordFieldComponent from "../../components/UI/Form/Inputs/FormPasswordFieldComponent";
import ButtonComponent from "../../components/UI/ButtonComponent";
import axios from "axios";
import { useState } from "react";

const RegisterFormComponent = (props) => {

    const intl = useIntl();

    const registerValidationSchema = yup.object().shape({
        email: yup.string().email(intl.formatMessage(formMessages.emailError)).required(intl.formatMessage(formMessages.emptyFieldError)),
        firstName: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        lastName: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        businessName: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        businessId: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        phoneNumber: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)).matches(/^\d{10}$/, intl.formatMessage(formMessages.phoneError)),
        businessPhoneNumber: yup.string().matches(/^\d{10}$/, intl.formatMessage(formMessages.phoneError)),
        password: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)).
            matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$*])[A-Za-z\d@#$*]{8,}$/, intl.formatMessage(formMessages.passwordError)),
        confirmPassword: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)).oneOf([yup.ref('password'), null], intl.formatMessage(formMessages.confirmPasswordError))
    }).required()

    const theme = useTheme()
    const methods = useForm({
        resolver: yupResolver(registerValidationSchema)
    });

    const [isRegisterSuccessful, setIsRegisterSuccessful] = useState(false);
    const [registerError, setRegisterError] = useState(null)

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:3002/user/register', data)
            if (response.status === 201) {
                setIsRegisterSuccessful(true)
            }
        } catch (e) {
            if (e.message === 'password-confirm-error') {
                setRegisterError(intl.formatMessage(homePageMessages.registerError))
            }
            if (e.message === 'user-exist-error') {
                setRegisterError(intl.formatMessage(homePageMessages.userExistError))
            }
        }
    }

    return (
        <>
            {!isRegisterSuccessful && (
                <CenteredStack
                    width='100%'
                >
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        {intl.formatMessage(homePageMessages.register)}
                    </Typography>
                    <FormProvider {...methods}>
                        <form
                            onSubmit={methods.handleSubmit(onSubmit)}
                            style={{
                                width: '100%'
                            }}
                        >
                            <Stack
                                width="100%"
                                rowGap={theme.spacing(3)}
                            >
                                <FormTextFieldComponent
                                    name="email"
                                    type="text"
                                    fieldLabel={intl.formatMessage(formMessages.email)}
                                    onBlur={() => setRegisterError(null)}
                                />
                                <Stack
                                    width='100%'
                                    direction="row"
                                    columnGap={theme.spacing(3)}
                                >
                                    <FormTextFieldComponent
                                        name="firstName"
                                        type="text"
                                        fieldLabel={intl.formatMessage(formMessages.firstName)}
                                        onBlur={() => setRegisterError(null)}
                                    />
                                    <FormTextFieldComponent
                                        name="lastName"
                                        type="text"
                                        fieldLabel={intl.formatMessage(formMessages.lastName)}
                                        onBlur={() => setRegisterError(null)}
                                    />
                                </Stack>
                                <Stack
                                    width='100%'
                                    direction="row"
                                    columnGap={theme.spacing(3)}
                                >
                                    <FormTextFieldComponent
                                        name="businessName"
                                        type="text"
                                        fieldLabel={intl.formatMessage(formMessages.businessName)}
                                        onBlur={() => setRegisterError(null)}
                                    />
                                    <FormTextFieldComponent
                                        name="businessId"
                                        type="text"
                                        fieldLabel={intl.formatMessage(formMessages.businessId)}
                                        onBlur={() => setRegisterError(null)}
                                    />
                                </Stack>
                                <Stack
                                    width='100%'
                                    direction="row"
                                    columnGap={theme.spacing(3)}
                                >
                                    <FormTextFieldComponent
                                        name="phoneNumber"
                                        type="text"
                                        fieldLabel={intl.formatMessage(formMessages.phoneNumber)}
                                        onBlur={() => setRegisterError(null)}
                                    />
                                    <FormTextFieldComponent
                                        name="businessPhoneNumber"
                                        type="text"
                                        fieldLabel={intl.formatMessage(formMessages.businessPhoneNumber)}
                                        onBlur={() => setRegisterError(null)}
                                    />
                                </Stack>
                                <FormPasswordFieldComponent
                                    name="password"
                                    fieldLabel={intl.formatMessage(formMessages.password)}
                                    onBlur={() => setRegisterError(null)}
                                />
                                <FormPasswordFieldComponent
                                    name="confirmPassword"
                                    fieldLabel={intl.formatMessage(formMessages.confirmPassword)}
                                    onBlur={() => setRegisterError(null)}
                                />
                                <Stack
                                    width="50%"
                                    sx={{
                                        margin: '0 auto'
                                    }}
                                >
                                    <ButtonComponent
                                        type="submit"
                                        onClick={() => {}}
                                        label={intl.formatMessage(buttonMessages.register)}
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
                                        onClick={() => props.onSwitchToLogin()}
                                    >
                                        {intl.formatMessage(homePageMessages.toLogin)}
                                    </Link>
                                </Stack>
                                {registerError && (
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
            )}
            {isRegisterSuccessful && (
                <CenteredStack
                    rowsGap={theme.spacing(3)}
                >
                    <Typography
                        variant="h3"
                        fontWeight="bold"
                    >
                        {intl.formatMessage(homePageMessages.thanksForRegister)}
                    </Typography>
                    <Typography
                        variant="body1"
                        fontWeight="bold"
                    >
                        {intl.formatMessage(homePageMessages.registerMessage)}
                    </Typography> 
                    <Link
                        variant="body2"
                        underline="none"
                        color="primary"
                        href="#"
                        onClick={() => props.onSwitchToLogin()}
                    >
                        {intl.formatMessage(homePageMessages.toLogin)}
                    </Link>              
                </CenteredStack>
            )}
        </>
    )
}

export default RegisterFormComponent