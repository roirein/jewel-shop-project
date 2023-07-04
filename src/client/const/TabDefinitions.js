import { createIntl } from "react-intl";
import messages from '../translations/locales/he.json'
import { ordersPageMessages, tabsMessages } from "../translations/i18n";

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
        route: '/models'
    }, 
    {
        label: intl.formatMessage(tabsMessages.orders),
        route: '/orders'
    }
]

export const CUSTOMER_INTERFACE_TABS = [
    {
        label: intl.formatMessage(tabsMessages.orders),
        route: '/orders'
    }
]

export const MANAGER_ORDERS_PAGE_TABS = [
    {
        label: intl.formatMessage(tabsMessages.orders),
        route: '/orders'
    },
    {
        label: intl.formatMessage(ordersPageMessages.ordersInDesign),
        route: '/orders/design'
    },
    {
        label: intl.formatMessage(ordersPageMessages.ordersInCasting),
        route: '/orders/casting'
    },
    {
        label: intl.formatMessage(ordersPageMessages.ordersInProduction),
        route: '/orders/production'
    }
]