import { createIntl } from "react-intl";
import messages from '../translations/locales/he.json';
import { employeesPageMessages, modelsPageMessages, ordersPageMessages } from "../translations/i18n";

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
    [-1]: intl.formatMessage(modelsPageMessages.notCreated),
    [0]: intl.formatMessage(modelsPageMessages.rejeceted),
    [1]: intl.formatMessage(modelsPageMessages.created),
    [2]: intl.formatMessage(modelsPageMessages.updated),
    [3]: intl.formatMessage(modelsPageMessages.approved),
    [4]: intl.formatMessage(modelsPageMessages.completed),
}

export const SIZE_ENUM = {
    [1]: intl.formatMessage(ordersPageMessages.finger),
    [2]: intl.formatMessage(ordersPageMessages.hand),
    [3]: intl.formatMessage(ordersPageMessages.neck)
}

export const METAL_ENUM = {
    [1]: intl.formatMessage(ordersPageMessages.yellow),
    [2]: intl.formatMessage(ordersPageMessages.white),
    [3]: intl.formatMessage(ordersPageMessages.rose),
    [4]: intl.formatMessage(ordersPageMessages.platinum),
}

export const ORDER_TYPES = {
    [1]: intl.formatMessage(ordersPageMessages.personalDesign),
    [2]: intl.formatMessage(ordersPageMessages.existingModel),
    [3]: intl.formatMessage(ordersPageMessages.fix)
}

export const ORDER_STATUS = {
    [-1]: intl.formatMessage(modelsPageMessages.rejeceted),
    [0]: intl.formatMessage(modelsPageMessages.created),
    [1]: intl.formatMessage(ordersPageMessages.inDesign),
    [2]: intl.formatMessage(ordersPageMessages.designCompleted),
    [3]: intl.formatMessage(ordersPageMessages.customerApproved),
    [4]: intl.formatMessage(ordersPageMessages.inCasting),
    [5]: intl.formatMessage(ordersPageMessages.castingCompleted),
    [6]: intl.formatMessage(ordersPageMessages.inProduction)
}

export const CASTING_STATUS = {
    [1]: intl.formatMessage(ordersPageMessages.notSend),
    [2]: intl.formatMessage(ordersPageMessages.inCasting),
    [3]: intl.formatMessage(modelsPageMessages.completed)
}

export const PRODUCTION_STATUS = {
    [1]: intl.formatMessage(modelsPageMessages.created),
    [2]: intl.formatMessage(employeesPageMessages.jeweller),
    [3]: intl.formatMessage(employeesPageMessages.setter),
    [4]: intl.formatMessage(ordersPageMessages.finishing),
    [5]: intl.formatMessage(ordersPageMessages.qualityEnsurance),
    [6]: intl.formatMessage(modelsPageMessages.completed)
}