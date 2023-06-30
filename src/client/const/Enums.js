import { createIntl } from "react-intl";
import messages from '../translations/locales/he.json';
import { employeesPageMessages, modelsPageMessages } from "../translations/i18n";

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

export const ITEM_ENUMS = {
    [1]: intl.formatMessage(modelsPageMessages.ring),
    [2]: intl.formatMessage(modelsPageMessages.earrings),
    [3]: intl.formatMessage(modelsPageMessages.bracelet),
    [4]: intl.formatMessage(modelsPageMessages.pendant),
}

export const MODEL_STATUS_ENUM = {
    [0]: intl.formatMessage(modelsPageMessages.rejeceted),
    [1]: intl.formatMessage(modelsPageMessages.created),
    [2]: intl.formatMessage(modelsPageMessages.updated),
    [3]: intl.formatMessage(modelsPageMessages.approved),
    [4]: intl.formatMessage(modelsPageMessages.completed),
}