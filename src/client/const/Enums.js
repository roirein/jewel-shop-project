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
    [-1]: intl.formatMessage(modelsPageMessages.rejeceted),
    [0]: intl.formatMessage(modelsPageMessages.created),
    [1]: intl.formatMessage(modelsPageMessages.updated),
    [2]: intl.formatMessage(modelsPageMessages.approved),
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
    [1]: intl.formatMessage(ordersPageMessages.approvedByManager),
    [2]: intl.formatMessage(ordersPageMessages.inDesign),
    [3]: intl.formatMessage(ordersPageMessages.designCompleted),
    [4]: intl.formatMessage(ordersPageMessages.waitToCustomerApproval),
    [5]: intl.formatMessage(ordersPageMessages.customerApproved),
    [6]: intl.formatMessage(ordersPageMessages.inCasting),
    [7]: intl.formatMessage(ordersPageMessages.castingCompleted),
    [8]: intl.formatMessage(ordersPageMessages.inProduction),
    [9]: intl.formatMessage(ordersPageMessages.productionCompleted),
    [10]: intl.formatMessage(ordersPageMessages.customerUpdated),
    [11]: intl.formatMessage(ordersPageMessages.orderCompleted)
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

export const POSITIONS = {
    [1]: intl.formatMessage(employeesPageMessages.jeweller),
    [2]: intl.formatMessage(modelsPageMessages.setting),
    [3]: intl.formatMessage(ordersPageMessages.finishing),
    [4]: intl.formatMessage(ordersPageMessages.qualityEnsurance)
}

export const RING_SIZES = [
    '1/41',
    '2/42',
    '3/43',
    '4/44',
    '5/45',
    '6/46',
    '7/47',
    '8/48',
    '9/49',
    '10/50',
    '11/51',
    '12/52',
    '13/53',
    '14/54',
    '15/55',
    '16/56',
    '17/57',
    '18/58',
    '19/59'
]

export const PENDANT_SIZES = [
    '38 CM',
    '42 CM',
    '45 CM',
    '50 CM'
]

export const BRACELET_SIZES = [
    'XS - 15-16 CM',
    'S - 16.5-17 CM',
    'M - 17-18 CM',
    'L - 18-18.5 CM'
]