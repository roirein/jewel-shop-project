import { createIntl } from "react-intl";
import messages from '../translations/locales/he.json';
import { customerPageMessages } from "../translations/i18n";

const intl = createIntl({
    locale: 'he',
    messages: messages
})


export const REQUEST_TABLE_COLUMNS = [
    intl.formatMessage(customerPageMessages.customerName),
    intl.formatMessage(customerPageMessages.requestStatus)
]