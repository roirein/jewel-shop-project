import FormTextFieldComponent from "../../../../components/UI/Form/Inputs/FormTextFieldComponent"
import { Stack, Typography, useTheme } from "@mui/material"
import { useIntl } from "react-intl"
import { customerPageMessages, formMessages, ordersPageMessages } from "../../../../translations/i18n"
import FormDatePickerComponent from "../../../../components/UI/Form/Inputs/FormDatePickerComponent"

const CustomerDetails = (props) => {

    const intl = useIntl();
    const theme = useTheme();


    return (
        <>
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
        </>
    )
}

export default CustomerDetails