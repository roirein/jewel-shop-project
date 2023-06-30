import { createIntl } from "react-intl";
import messages from '../translations/locales/he.json';
import { customerPageMessages, employeesPageMessages } from "../translations/i18n";

const intl = createIntl({
    locale: 'he',
    messages: messages
})


export const REQUEST_TABLE_COLUMNS = [
    intl.formatMessage(customerPageMessages.customerName),
    intl.formatMessage(customerPageMessages.requestStatus)
]

export const CUSTOMER_TABLE_COLUMNS = [
    intl.formatMessage(customerPageMessages.customerName),
    intl.formatMessage(customerPageMessages.email),
    intl.formatMessage(customerPageMessages.phoneNumber),
    intl.formatMessage(customerPageMessages.businessName),
    intl.formatMessage(customerPageMessages.businessPhoneNumber),
    intl.formatMessage(customerPageMessages.joinDate)
]

export const EMPLOYEES_TABLE_COLUMNS = [
    intl.formatMessage(employeesPageMessages.employeeName),
    intl.formatMessage(employeesPageMessages.role),
    intl.formatMessage(customerPageMessages.email),
    intl.formatMessage(customerPageMessages.phoneNumber),
    intl.formatMessage(customerPageMessages.joinDate)
]