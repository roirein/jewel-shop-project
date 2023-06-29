import ModalComponent from "../../../components/UI/ModalComponent"
import { useIntl } from "react-intl"
import { buttonMessages, customerPageMessages, notificationMessages } from "../../../translations/i18n";
import { Typography, useTheme, Stack } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import AppContext from '../../../context/AppContext'
import axios from "axios";
import { getAuthorizationHeader } from "../../../utils/utils";
import ButtonComponent from "../../../components/UI/ButtonComponent";


const RequestModalComponent = (props) => {

    const intl = useIntl();
    const theme = useTheme();

    const [user, setUser] = useState({})
    const contextValue = useContext(AppContext)

    useEffect(() => {
        if (props.userId) {
            axios.get(`http://localhost:3002/customer/getCustomerById/${props.userId}`, {
                headers: {
                    Authorization: getAuthorizationHeader(contextValue.token)
                }
            }).then((resUser) => {
                setUser(resUser.data.customer)
            })
        }
    }, [props.userId])

    const getButtonActions = () => {
        return (
            <Stack
                direction="row"
                width="100%"
                flexDirection="row-reverse"
            >
                <Stack
                    width="50%"
                    direction="row"
                    flexDirection="row-reverse"
                    columnGap={theme.spacing(4)}
                >
                    <Stack
                        width="25%"
                    >
                         <ButtonComponent
                            label={intl.formatMessage(buttonMessages.approve)}
                            onClick={() => props.onResponse(true)}
                        />
                    </Stack>
                    <Stack>
                        <ButtonComponent
                            label={intl.formatMessage(buttonMessages.reject)}
                            onClick={() => props.onResponse(false)}
                        />
                    </Stack>
                </Stack>
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
                <Typography>
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
            </Stack>
        </ModalComponent>
    )
}

export default RequestModalComponent