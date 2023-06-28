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

const RegisterFormComponent = () => {

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

    const onSubmit = (data) => {
        console.log(data)
    }

    return (
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
                            />
                            <FormTextFieldComponent
                                name="lastName"
                                type="text"
                                fieldLabel={intl.formatMessage(formMessages.lastName)}
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
                            />
                            <FormTextFieldComponent
                                name="businessId"
                                type="text"
                                fieldLabel={intl.formatMessage(formMessages.businessId)}
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
                            />
                            <FormTextFieldComponent
                                name="businessPhoneNumber"
                                type="text"
                                fieldLabel={intl.formatMessage(formMessages.businessPhoneNumber)}
                            />
                        </Stack>
                        <FormPasswordFieldComponent
                            name="password"
                            fieldLabel={intl.formatMessage(formMessages.password)}
                        />
                        <FormPasswordFieldComponent
                            name="confirmPassword"
                            fieldLabel={intl.formatMessage(formMessages.confirmPassword)}
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
                                label={intl.formatMessage(buttonMessages.login)}
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
                    </Stack>
                </form>
            </FormProvider>
        </CenteredStack>
    )
}

export default RegisterFormComponent