import { createIntl } from "react-intl"
import { homePageMessages } from "../translations/i18n"
import messages from '../translations/locales/he.json'

const intl = createIntl({
    locale: 'he',
    messages: messages
})

export const getLoginErrorMessage = (errorStatus, errMessage) => {
    if (errorStatus === 401) {
        return intl.formatMessage(homePageMessages.loginError)
    }
    if (errorStatus === 403) {
        if (errMessage === 'manager-approval-required') {
            return intl.formatMessage(homePageMessages.unapproveError)
        }
        if (errMessage === 'replace-password-required') {
            return intl.formatMessage(homePageMessages.resetPasswrodError)
        }
    }
    return ''
}

export const getRegisterErrorMessages = (errorStatus) => {
        if (errorStatus = 400) {
            return intl.formatMessage(homePageMessages.registerError)
        }
        if (errorStatus === 409) {
            return intl.formatMessage(homePageMessages.userExistError)
        }
}