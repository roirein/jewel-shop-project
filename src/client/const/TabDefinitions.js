import { createIntl } from "react-intl";
import messages from '../translations/locales/he.json'
import { modelsPageMessages, ordersPageMessages, tabsMessages } from "../translations/i18n";

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
    },
    {
        label: intl.formatMessage(tabsMessages.reports),
        route: '/reports'
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

export const DESIGN_MANGER_MODELS_PAGE_TABS = [
    {
        label: intl.formatMessage(tabsMessages.models),
        route: '/models'
    },
    {
        label: intl.formatMessage(modelsPageMessages.modelsInProgress),
        route: '/models/inProgress'
    },
    {
        label: intl.formatMessage(modelsPageMessages.modelsApproved),
        route: '/models/ready'
    },
]

export const MANAGER_ORDERS_TABS = [
    {
        label: intl.formatMessage(tabsMessages.orders)
    },
    {
        label: intl.formatMessage(ordersPageMessages.incomingOrders)
    },
    {
        label: intl.formatMessage(ordersPageMessages.rejectedOrders)
    },
    {
        label: intl.formatMessage(ordersPageMessages.orderInDesign)
    },
    {
        label: intl.formatMessage(ordersPageMessages.ordersInApproval)
    },
    {
        label: intl.formatMessage(ordersPageMessages.ordersInCasting)
    },
    {
        label: intl.formatMessage(ordersPageMessages.ordersInProduction)
    },
    {
        label: intl.formatMessage(ordersPageMessages.orderCompleted)
    }
]

export const DESIGN_MANAGER_ORDERS_TABS = [
    {
        label: intl.formatMessage(tabsMessages.orders)
    },
    {
        label: intl.formatMessage(ordersPageMessages.orderInDesign)
    },
    {
        label: intl.formatMessage(ordersPageMessages.ordersInProduction)
    },
    {
        label: intl.formatMessage(ordersPageMessages.orderCompleted)
    }
]

export const CUSTOMER_ORDERS_TABS = [
    {
        label: intl.formatMessage(tabsMessages.orders)
    },
    {
        label: intl.formatMessage(ordersPageMessages.rejectedOrders)
    },
    {
        label: intl.formatMessage(ordersPageMessages.ordersInApproval)
    },
    {
        label: intl.formatMessage(ordersPageMessages.orderCompleted)
    },
    {
        label: intl.formatMessage(ordersPageMessages.ordersHistory)
    }
]