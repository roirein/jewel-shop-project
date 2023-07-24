import ModalComponent from "../../../components/UI/ModalComponent"
import { useIntl } from "react-intl"
import { buttonMessages, customerPageMessages, notificationMessages } from "../../../translations/i18n";
import { Typography, useTheme, Stack, Button } from "@mui/material";
import {useState, useEffect} from "react";
import ButtonComponent from "../../../components/UI/ButtonComponent";
import LoadingSpinner from "../../../components/UI/LoadingSpinner";
import customersApi from "../../../store/customers/customer-api";
import notifcationsApi from "../../../store/notifications/notification-api";
import { useSelector } from "react-redux";


const RequestModalComponent = (props) => {

    const intl = useIntl();
    const theme = useTheme();

    const [user, setUser] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState()

    useEffect(() => {
        if (props.open) {
            setIsLoading(true)
            customersApi.loadCustomer(props.userId).then((customer) => {
                setUser(customer)
                customersApi.getRequestStatus(props.userId).then((requestStatus) => {
                    notifcationsApi.readNotification(props.userId, 'customer')
                    setStatus(requestStatus)
                    setIsLoading(false)
                })
            })
        }
    }, [props.userId])

    const onResponse = (response) => {
        customersApi.respondCustomerRequest(response, props.userId)
        props.onClose()
    }

    const getButtonActions = () => {
        return (
            <Stack
                direction="row"
                width="100%"
                flexDirection="row-reverse"
                justifyContent="flex-end"
            >
                <Stack
                    width="50%"
                >
                    <Stack
                        width="25%"
                    >
                        <ButtonComponent
                            label={intl.formatMessage(buttonMessages.close)}
                            onClick={() => props.onClose()}
                        />
                    </Stack>
                </Stack>
            </Stack>
        )
    }

    return (
        <ModalComponent
            title={intl.formatMessage(notificationMessages.joinRequest, {name: user.name})}
            onClose={props.onClose}
            open={props.open}
            width="sm"
            actions={getButtonActions()}
        >
            {isLoading && (
                <LoadingSpinner/>
            )}
            {!isLoading && (
                <Stack
                    sx={{
                        p: theme.spacing(4)
                    }}
                    rowGap={theme.spacing(3)}
                    alignItems="flex-end"
                >
                    <Typography
                        fontWeight="bold"
                        variant="h6"
                        
                    >
                        {intl.formatMessage(customerPageMessages.contactDetails)}
                    </Typography>
                    <Typography
                        sx={{
                            direction: theme.direction
                        }}
                    >
                        {`${intl.formatMessage(customerPageMessages.businessName)}: ${user.businessName}`}
                    </Typography>
                    <Typography
                        sx={{
                            direction: theme.direction
                        }}
                    >
                        {`${intl.formatMessage(customerPageMessages.email)}: ${user.email}`}
                    </Typography>
                    <Typography>
                        {`${intl.formatMessage(customerPageMessages.phoneNumber)}: ${user.phoneNumber}`}
                    </Typography>
                    {user.businessPhone && (
                        <Typography>
                            {`${intl.formatMessage(customerPageMessages.businessPhoneNumber)}: ${user.businessPhone}`}
                        </Typography>
                    )}
                    <Stack
                        direction="row"
                        columnGap={theme.spacing(3)}
                    >
                        {status === 0 && (
                            <>     
                                <Button
                                    variant="text"
                                    color="success"
                                    onClick={() => onResponse(true)}
                                >
                                    {intl.formatMessage(buttonMessages.approve)}
                                </Button>
                                <Button
                                    variant="text"
                                    color="error"
                                    onClick={() => onResponse(false)}
                                >
                                    {intl.formatMessage(buttonMessages.reject)}
                                </Button>
                            </>
                        )}
                        {status === -1 && (
                            <Typography
                                varinat="body1"
                                color="error"
                            >
                                {intl.formatMessage(customerPageMessages.requestDeclined)}
                            </Typography>
                        )}
                        {status === 1 && (
                            <Typography
                                varinat="body1"
                                color="green"
                            >
                                {intl.formatMessage(customerPageMessages.requestApproved)}
                            </Typography>
                        )}
                    </Stack>
                </Stack>
            )}
        </ModalComponent>
    )
}

export default RequestModalComponent