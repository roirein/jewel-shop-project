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
    }
}

export const notificationMessages = defineMessages({
    joinRequest: {
        id: 'joinRequest',
        defaultMessage: 'joining request from {name}'
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
    }
})