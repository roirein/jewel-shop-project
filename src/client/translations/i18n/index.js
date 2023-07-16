import {defineMessages} from 'react-intl';

export const formMessages = defineMessages({
    email: {
        id: 'email',
        defaultMessage: 'email'
    },
    password: {
        id: 'password',
        defaultMessage: 'password'
    },
    emptyFieldError: {
        id: 'emptyFieldError',
        defaultMessage: 'field is required'
    },
    emailError: {
        id: 'emailError',
        defaultMessage: 'email invalid'
    },
    rememberMe: {
        id: 'rememberMe',
        defaultMessage: 'remember me'
    },
    forgotPassword: {
        id: 'forgotPassword',
        defaultMessage: "forgot password"
    },
    firstName: {
        id: 'firstName',
        defaultMessage: 'firstName'
    },
    lastName: {
        id: 'lastName',
        defaultMessage: 'lastName'
    },
    businessName: {
        id: 'businessName',
        defaultMessage: 'business name'
    },
    businessId: {
        id: 'businessId',
        defaultMessage: 'business id'
    },
    confirmPassword: {
        id: 'confirmPassword',
        defaultMessage: 'confirm password'
    },
    phoneNumber: {
        id: 'phoneNumber',
        defaultMessage: 'phone number'
    },
    businessPhoneNumber: {
        id: 'businessPhoneNumber',
        defaultMessage: 'business phone number'
    },
    phoneError: {
        id: 'phoneError',
        defaultMessage: 'phone number invalid'
    },
    passwordError: {
        id: 'passwordError',
        defaultMessage: 'password must be 8 characters length and include numbers, uppercase and lowercase letters, and special char'
    },
    confirmPasswordError: {
        id: 'confirmPasswordError',
        defaultMessage: 'confirmed password not like the original'
    },
    code: {
        id: 'code',
        defaultMessage: 'code'
    },
    enterNewPassword: {
        id: 'enterNewPassword',
        defaultMessage: 'enter new password'
    },
    passwordChanged: {
        id: 'passwordChanged',
        defaultMessage: 'password changed successfully'
    },
    dragImage: {
        id: 'dragImage',
        defaultMessage: 'drag image here'
    },
    selectOrDrop: {
        id: 'selectOrDrop',
        defaultMessage: 'select or drop image here'
    },
    imageOnly: {
        id: 'imageOnly',
        defaultMessage: 'file must be in image format'
    },
    positive: {
        id: 'positive',
        defaultMessage: 'value must be a positive value'
    }
})

export const homePageMessages = defineMessages({
    welcome: {
        id: 'welcome',
        defaultMessage: 'welcome'
    },
    login: {
        id: 'login',
        defaultMessage: 'login'
    },
    toRegister: {
        id: 'toRegister',
        defaultMessage: 'to register'
    },
    register: {
        id: 'register',
        defaultMessage: 'register'
    },
    toLogin: {
        id: 'toLogin',
        defaultMessage: 'toLogin'
    },
    loginError: {
        id: 'loginError',
        defaultMessage: 'Email or password are incorrect'
    },
    userExistError: {
        id: 'userExistError',
        defaultMessage: 'User with email, phone number or businessId above already exist'
    },
    registerError: {
        id: 'registerError',
        defaultMessage: 'password does not match the confirmation'
    },
    thanksForRegister: {
        id: 'thanksForRegister',
        defaultMessage: 'thank you for your registration'
    },
    registerMessage: {
        id: 'registerMessage',
        defaultMessage: 'your request sent to the manager and you will recive an email when approved'
    },
    logout: {
        id: 'logout',
        defaultMessage: 'logout'
    },
    enterEmail: {
        id: 'enterEmail',
        defaultMessage: 'Enter email to recive verification code'
    },
    emailNotExist: {
        id: 'emailNotExist',
        defaultMessage: 'email not exist'
    },
    unapproveError: {
        id: 'unapproveError',
        defaultMessage: 'you have to wait to manager approval in order to login'
    },
    resetPasswrodError: {
        id: 'resetPasswrodError',
        defaultMessage: 'you must change your password before you will be able to ligin'
    },
    resetPassword: {
        id: 'resetPassword',
        defaultMessage: 'Reset Password'
    },
    enterCode: {
        id: 'enterCode',
        defaultMessage: 'enter the code tou recived in mail'
    },
    invalidCode: {
        id: 'invalidCode',
        defaultMessage: 'code invalid'
    },
    codeExpired: {
        id: 'codeExpired',
        defaultMessage: 'code expired'
    }
})

export const buttonMessages = defineMessages({
    entry: {
        id: 'entry',
        defaultMessage: 'entry'
    },
    login: {
        id: 'login',
        defineMessages: 'login'
    },
    register: {
        id: 'register',
        defaultMessage: 'register'
    },
    showMore: {
        id: 'showMore',
        defaultMessage: 'showMore'
    }, 
    close: {
        id: 'close',
        defaultMessage: 'close'
    },
    approve: {
        id: 'approve',
        defaultMessage: 'approve'
    },
    reject: {
        id: 'reject',
        defaultMessage: 'reject'
    },
    send: {
        id: 'send',
        defaultMessage: 'send'
    },
    continue: {
        id: 'continue',
        defaultMessage: 'continue'
    },
    goBack: {
        id: 'goBack',
        defaultMessage: 'goBack'
    },
    cancel: {
        id: 'cancel',
        defaultMessage: 'cancel'
    },
    update: {
        id: 'update',
        defaultMessage: 'update'
    },
    skip: {
        id: 'skip',
        defaultMessage: 'skip'
    },
    showAll: {
        id: 'showAll',
        defaultMessage: 'show all'
    },
    filterBy: {
        id: 'filterBy',
        defaultMessage: 'filter by:'
    }
})

export const tabsMessages = {
    customers: {
        id: 'customers',
        defaultMessage: 'customers'
    },
    employess: {
        id: 'employees',
        defaultMessage: 'employees'
    },
    orders: {
        id: 'orders',
        defaultMessage: 'orders'
    },
    models: {
        id: 'models',
        defaultMessage:'models'
    },
    requests: {
        id: 'requests',
        defaultMessage: 'requests'
    },
    reports: {
        id: 'reports',
        defaultMessage: 'reports'
    }
}

export const notificationMessages = defineMessages({
    joinRequest: {
        id: 'joinRequest',
        defaultMessage: 'joining request from {name}'
    },
    newModel: {
        id: 'newModel',
        defaultMessage: 'model number {number} that called {name} was uploaded to the system'
    },
    modelApproved: {
        id: `modelApproved`,
        defaultMessage: 'model number {number} approved by the manager'
    },
    modelReject: {
        id: 'modelReject',
        defaultMessage: 'model number {number} was rejected by the manager'
    },
    modelUpdated: {
        id: 'modelUpdated',
        defaultMessage: 'model number {numner} was updated'
    },
    newOrder: {
        id: 'newOrder',
        defaultMessage: 'new order from {name}'
    },
    newDesign: {
        id: 'newDesign',
        defaultMessage: 'new design request from order number {number}'
    }
})

export const customerPageMessages = defineMessages({
    customerName: {
        id: 'customerName',
        defaultMessage: 'customer name'
    },
    requestStatus: {
        id: 'requestStatus',
        defaultMessage: 'request status'
    },
    pending: {
        id: 'pending',
        defaultMessage: 'pending'
    },
    approved: {
        id: 'approved',
        defaultMessage: 'approved'
    },
    rejeceted: {
        id: 'rejected',
        defaultMessage: 'rejected'
    },
    contactDetails: {
        id: 'contactDetails',
        defaultMessage: 'contact details'
    },
    email: {
        id: 'email',
        defaultMessage: 'email'
    },
    phoneNumber: {
        id: 'phoneNumber',
        defaultMessage: 'phone number'
    },
    businessPhoneNumber: {
        id: 'businessPhoneNumber',
        defaultMessage: 'business phone number'
    },
    businessName: {
        id: 'businessName',
        defaultMessage: 'business name'
    },
    joinDate: {
        id: 'joinDate',
        defaultMessage: 'joining date'
    },
    removeCustomer: {
        id: 'removeCustomer',
        defaultMessage: 'remove customer'
    },
    requestApproved: {
        id: 'requestApproved',
        defaultMessage: 'requestApproved'
    },
    requestDeclined: {
        id: 'requestDeclined',
        defaultMessage: 'request declined'
    }
})

export const employeesPageMessages = defineMessages({
    addNewEmployee: {
        id: 'addNewEmployee',
        defaultMessage: 'add new employee'
    },
    employeeName: {
        id: 'employeeName',
        defaultMessage: 'employee name'
    },
    role: {
        id: 'role',
        defaultMessage: 'role'
    },
    manager: {
        id: 'manager',
        defaultMessage: "manager"
    },
    designManager: {
        id: 'designManager',
        defaultMessage: 'design manager'
    }, 
    productionManager: {
        id: 'productionManager',
        defaultMessage: 'production manager'
    },
    jeweller: {
        id: 'jeweller',
        defaultMessage: 'jeweller'
    },
    setter: {
        id: 'setter',
        defaultMessage: 'setter'
    },
    removeEmployee: {
        id: 'removeEmployee',
        defaultMessage: 'remobe employee'
    }
})

export const modelsPageMessages = defineMessages({
    createNewModel: {
        id: 'createNewModel',
        defaultMessage: 'create new model'
    }, 
    modelNumber: {
        id: 'modelNumber',
        defaultMessage: 'model number',
    },
    setting: {
        id: 'setting',
        defaultMessage: 'setting'
    },
    sideStoneSize: {
        id: 'sideStoneSize',
        defaultMessage: 'side stone size'
    },
    mainStoneSize: {
        id: 'mainStoneSize',
        defaultMessage: 'main stone size'
    },
    modelImage: {
        id: 'modelImage',
        defaultMessage: 'model image'
    },
    item: {
        id: 'item',
        defaultMessage: 'item'
    },
    ring: {
        id: 'ring',
        defaultMessage: 'ring'
    },
    earrings: {
        id: 'earrings',
        defaultMessage: 'earrings'
    },
    pendant: {
        id: 'pendant',
        defaultMessage: 'pendant'
    },
    bracelet: {
        id: 'bracelet',
        defaultMessage: 'bracelet'
    },
    title: {
        id: 'title',
        defaultMessage: 'title'
    },
    description: {
        id: 'description',
        defaultMessage: 'description'
    },
    status: {
        id: 'status',
        defaultMessage: 'status'
    },
    approved: {
        id: 'approved',
        defaultMessage: 'approved'
    },
    rejeceted: {
        id: 'rejected',
        defaultMessage: 'rejected'
    },
    created: {
        id: 'created',
        defaultMessage: 'created'
    },
    updated: {
        id: 'updated',
        defaultMessage: 'updated'
    },
    completed: {
        id: 'completed',
        defaultMessage: 'completed'
    },
    updatePrice: {
        id: 'updatePrice',
        defaultMessage: 'Update material and price'
    },
    numberOfModel: {
        id: 'numberOfModel',
        defaultMessage: 'model number {number}'
    },
    notCreated: {
        id: 'notCreated',
        defaultMessage: 'not created'
    },
    addModel: {
        id: 'addModel',
        defaultMessage: 'add model'
    },
    materials: {
        id: 'materials',
        defaultMessage: 'materials'
    },
    priceWithMaterials: {
        id: 'priceWithMaterials',
        defaultMessage: 'price with material'
    },
    priceWithoutMaterials: {
        id: 'priceWithoutMaterials',
        defaultMessage: 'price without materials'
    },
    modelsInProgress: {
        id: 'modelsInProgress',
        defaultMessage: 'models in progress'
    },
    modelsApproved: {
        id: 'modelsApproved',
        defaultMessage: 'models approved'
    },
    carat: {
        id: 'carat',
        defaultMessage: 'carat'
    },
    modelStatus: {
        id: 'modelStatus',
        defaultMessage: 'model status'
    }
})

export const ordersPageMessages = defineMessages({
    createNewOrder: {
        id: 'createNewOrder',
        defaultMessage: 'create new order'
    }, 
    customerDetails: {
        id: 'customerDetails',
        defaultMessage: 'customer details'
    },
    orderType: {
        id: 'orderType',
        defaultMessage: 'order type'
    },
    personalDesign: {
        id: "personalDesign",
        defaultMessage: 'personal design'
    },
    existingModel: {
        id: 'existingModel',
        defaultMessage: 'existing model'
    },
    fix: {
        id: 'fix',
        defaultMessage: 'fix'
    }, 
    orderDeatils: {
        id: 'orderDeatils',
        defaultMessage: 'order details'
    },
    size: {
        id: 'size',
        defaultMessage: 'size'
    },
    finger: {
        id: 'finger',
        defaultMessage: 'finger'
    },
    hand: {
        id: 'hand',
        defaultMessage: 'hand'
    },
    neck: {
        id: 'neck',
        defaultMessage: 'neck'
    },
    metal: {
        id: 'metal',
        defaultMessage: 'metal'
    }, 
    yellow: {
        id: 'yellow',
        defaultMessage: 'yellow'
    },
    white: {
        id: 'white',
        defaultMessage: 'white'
    },
    rose: {
        id: 'rose',
        defaultMessage: 'rose'
    },
    platinum: {
        id: 'platinum',
        defaultMessage: 'platinum'
    },
    casting: {
        id: 'casting',
        defaultMessage: 'casting'
    },
    design: {
        id: 'design',
        defaultMessage: 'design'
    },
    comments: {
        id: 'comments',
        defaultMessage: 'comments'
    },
    orderSummary: {
        id: 'orderSummary',
        defaultMessage: 'order summary'
    },
    deadline: {
        id: 'deadline',
        defaultMessage: 'deadline'
    },
    required: {
        id: 'required',
        defaultMessage: 'required'
    },
    notRequired: {
        id: 'notRequired',
        defaultMessage: 'not required'
    },
    orderNumber: {
        id: 'orderNumber',
        defaultMessage: 'order number'
    },
    inDesign: {
        id: 'inDesign',
        defaultMessage: 'in design',
    },
    designCompleted: {
        id: 'designCompleted',
        defaultMessage: 'design completed'
    },
    customerApproved: {
        id: 'customerApproved',
        defaultMessage: 'customer approved'
    },
    numberOfOrder: {
        id: 'numberOfOrder',
        defaultMessage: 'order number {number}'
    },
    sendToDesignManager: {
        id: 'sendToDesignManager',
        defaultMessage: 'sent to design manager'
    },
    orderSentSucessfully: {
        id: 'orderSentSucessfully',
        defaultMessage: 'order sent to design manager successfully'
    },
    chooseOption: {
        id: 'chooseOption',
        defaultMessage: 'choose your preferred option'
    },
    pricePaid: {
        id: 'pricePaid',
        defaultMessage: 'price paid: {price}'
    },
    sendOrderToCasting: {
        id: 'sendOrderToCasting',
        defaultMessage: 'send order to casting'
    },
    ordersInDesign: {
        id: 'ordersInDesign',
        defaultMessage: 'orders in design'
    },
    ordersInCasting: {
        id: 'ordersInCasting',
        defaultMessage: 'orders in casting'
    },
    ordersInProduction: {
        id: 'ordersInProduction',
        defaultMessage: 'orders in production'
    },
    orderCompleted: {
        id: 'orderCompleted',
        defaultMessage: 'orders completed'
    },
    notSend: {
        id: 'notSend',
        defaultMessage: 'not send'
    },
    inCasting: {
        id: 'inCasting',
        defaultMessage: 'in casting'
    },
    castingCompleted: {
        id: 'castingCompleted',
        defaultMessage: 'casting completed'
    },
    senToCasting: {
        id: 'sentToCasting',
        defaultMessage: 'order sent to casting successfully'
    },
    sendOrderToProduction: {
        id: 'sendOrderToProduction',
        defaultMessage: 'send order to production manager',
    },
    orderSentToProductionSuccessfully: {
        id: 'orderSentToProductionSuccessfully',
        defaultMessage: 'order successfully sent to design manager'
    },
    completeCasting: {
        id: 'completeCasting',
        defaultMessage: 'complete casting'
    },
    castingCompleted: {
        id: 'castingCompleted',
        defaultMessage: 'casting completed'
    },
    tasksToOrder: {
        id: 'tasksToOrder',
        defaultMessage: 'create tasks for order'
    },
    finishing: {
        id: 'finishing',
        defaultMessage: 'finishing'
    },
    qualityEnsurance: {
        id: 'qualityEnsurance',
        defaultMessage: 'quality ensurance'
    },
    summary: {
        id: 'summary',
        defaultMessage: 'summary'
    },
    defineTasks: {
        id: 'defineTasks',
        defaultMessage: 'define tasks'
    },
    taskNumber: {
        id: 'taskNumber',
        defaultMessage: 'task number'
    },
    inProduction: {
        id: 'inProduction',
        defaultMessage: 'בהכנה'
    },
    priceWith: {
        id: 'priceWith',
        defaultMessage: 'price with material: {price}'
    },
    priceWithout: {
        id: 'priceWithout',
        defaultMessage: 'price without materials: {price}'
    },
    orderInDesign: {
        id: 'orderInDesign',
        defaultMessage: 'Order In Design'
    },
    priceOffer: {
        id: 'priceOffer',
        defaultMessage: 'price offer'
    },
    acceptPriceOffer: {
        id: 'acceptPriceOffer',
        defaultMessage: 'accept price offer'
    },
    price: {
        id: 'price',
        defaultMessage: 'price {price}'
    },
    position: {
        id: 'position',
        defaultMessage: 'position'
    },
    taskCompleted: {
        id: 'taskCompleted',
        defaultMessage: 'task completed',
    },
    taskNotCompleted: {
        id: 'taskNotCompleted',
        defaultMessage: 'task not completed'
    },
    completeTask: {
        id: 'completeTask',
        defaultMessage: 'complete task'
    },
    completeProduction: {
        id: 'completeProduction',
        defaultMessage: 'complete production'
    },
    completeProduction: {
        id: 'completeProduction',
        defaultMessage: 'complete production'
    },
    updateCustomer: {
        id: 'updateCustomer',
        defaultMessage: 'updateCustomer'
    },
    completeOrder: {
        id: 'completeOrder',
        defaultMessage: 'complete order'
    },
    productionCompleted: {
        id: 'productionCompleted',
        defaultMessage: 'production completed'
    },
    customerUpdated: {
        id: 'customerUpdated',
        defaultMessage: 'customer updated'
    },
    incomingOrders: {
        id: 'incomingOrders',
        defaultMessage: 'incoming orders'
    },
    ordersInApproval: {
        id: 'ordersInApproval',
        defaultMessage: 'orders in approval'
    },
    rejectedOrders: {
        id: 'rejectedOrders',
        defaultMessage: 'rejectedOrders'
    },
    ordersHistory: {
        id: 'ordersHistory',
        defaultMessage: 'ordersHistory'
    },
    approvedByManager: {
        id: 'approvedByManager',
        defaultMessage: 'approved by manager'
    },
    waitToCustomerApproval: {
        id: 'waitToCustomerApproval',
        defaultMessage: 'waiting for customer approval'
    },
    rejectOrder: {
        id: 'rejectOrder',
        defaultMessage: 'rejectOrder'
    }
})