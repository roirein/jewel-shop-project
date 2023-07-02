import { createIntl } from "react-intl";
import messages from '../translations/locales/he.json'
import { tabsMessages } from "../translations/i18n";

const intl = createIntl({
    locale: 'he',
    messages: messages
})

export const MANAGER_TABS = [
    {
        label: intl.formatMessage(tabsMessages.customers),
        route: '/customers'
    },
    {
        label: intl.formatMessage(tabsMessages.employess),
        route: '/employees'
    },
    {
        label: intl.formatMessage(tabsMessages.orders),
        route: '/orders'
    },
    {
        label: intl.formatMessage(tabsMessages.models),
        route: '/models'
    }
]

export const CUSTOMER_TABS = [
    {
        label: intl.formatMessage(tabsMessages.customers),
        route: '/customers'
    }, 
    {
        label: intl.formatMessage(tabsMessages.requests),
        route: '/customers/requests'
    }
]

export const DESIGN_MANGER_TABS = [
    {
        label: intl.formatMessage(tabsMessages.models),
        route: '/customers'
    }, 
    {
        label: intl.formatMessage(tabsMessages.orders),
        route: '/orders'
    }
]

