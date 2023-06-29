import { createIntl } from "react-intl";
import messages from '../translations/locales/he.json';
import { employeesPageMessages } from "../translations/i18n";

const intl = createIntl({
    locale: 'he',
    messages: messages
})

export const ROLES_ENUM = {
    [1]: intl.formatMessage(employeesPageMessages.manager),
    [2]: intl.formatMessage(employeesPageMessages.designManager),
    [3]: intl.formatMessage(employeesPageMessages.productionManager),
    [4]: intl.formatMessage(employeesPageMessages.jeweller),
    [5]: intl.formatMessage(employeesPageMessages.setter)
}