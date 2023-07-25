import FormTextFieldComponent from "../../../../components/UI/Form/Inputs/FormTextFieldComponent"
import { Stack, Typography, useTheme } from "@mui/material"
import { useIntl } from "react-intl"
import { customerPageMessages, formMessages, ordersPageMessages } from "../../../../translations/i18n"
import FormDatePickerComponent from "../../../../components/UI/Form/Inputs/FormDatePickerComponent"
import {forwardRef, useImperativeHandle} from "react"
import {useForm, FormProvider} from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"
import { useSelector } from "react-redux"
import userApi from "../../../../store/user/user-api"

const CustomerDetails = forwardRef((props, ref) => {

    const intl = useIntl();
    const theme = useTheme();
    const user = useSelector((state) => userApi.getUser(state))

    const customerValidationSchema = yup.object().shape({
        email: yup.string().email(intl.formatMessage(formMessages.emailError)).required(intl.formatMessage(formMessages.emptyFieldError)),
        customerName:  yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        phoneNumber: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)).matches(/^\d{10}$/, intl.formatMessage(formMessages.phoneError)),
        deadline: yup.string().required(intl.formatMessage(formMessages.emptyFieldError))
    }).required();

    const defaultValues = {
        customerName: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber
    }

    const methods = useForm({
        resolver: yupResolver(customerValidationSchema),
        defaultValues: user.permissionLevel === 5 ? defaultValues : {}
    })

    useImperativeHandle(ref, () => ({
        onSetCustomerDetails: () => {
            methods.trigger().then((res) => {
                if (res) {
                    props.onSubmitCustomerDetails(methods.getValues())
                }
            })
        },
        onCloseStepper: () => {
            methods.setValue('email', '')
            methods.setValue('customerName', '')
            methods.setValue('phoneNumber', '')
            methods.setValue('deadline', '')
        }
    }))

    return (
        <FormProvider {...methods}>
            <form
                style={{
                    width: '100%'
                }}
            >
                <Typography
                    variant="h3"
                >
                    {intl.formatMessage(ordersPageMessages.customerDetails)}
                </Typography>
                <Stack
                    rowGap={theme.spacing(3)}
                >
                    <FormTextFieldComponent
                        name="email"
                        type="text"
                        fieldLabel={intl.formatMessage(formMessages.email)}
                        onBlur={() => {}}
                    />
                    <FormTextFieldComponent
                        name="customerName"
                        type="text"
                        fieldLabel={intl.formatMessage(customerPageMessages.customerName)}
                        onBlur={() => {}}
                    />
                    <FormTextFieldComponent
                        name="phoneNumber"
                        type="text"
                        fieldLabel={intl.formatMessage(formMessages.phoneNumber)}
                        onBlur={() => {}}
                    />
                    <FormDatePickerComponent
                        name="deadline"
                        fieldLabel={intl.formatMessage(ordersPageMessages.deadline)}
                    />
                </Stack>
            </form>
        </FormProvider>
    )
})

export default CustomerDetails