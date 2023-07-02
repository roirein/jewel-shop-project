import axios from "axios"
import CenteredStack from "../../components/UI/CenteredStack"
import { getAuthorizationHeader, getUserToken } from "../../utils/utils"
import { useIntl } from "react-intl"
import OrderSummaryComponent from "./components/OrderSummary"
import { useState, useEffect, useContext } from "react"
import AppContext from "../../context/AppContext"
import { ordersPageMessages } from "../../translations/i18n"
import { ITEM_ENUMS, METAL_ENUM, SIZE_ENUM } from "../../const/Enums"
import { Stack, Typography, useTheme } from "@mui/material"
import ButtonComponent from "../../components/UI/ButtonComponent"

const OrderPage = (props) => {

    const intl = useIntl();
    const theme = useTheme()
    const [imageUrl, setImageUrl] = useState('');
    const [buttonClick, setButtonClick] = useState(false)
    const contextValue = useContext(AppContext);

    useEffect(() => {
        axios.get(`http://localhost:3002/order/image/${props.design}`, {
            headers: {
                Authorization: getAuthorizationHeader(contextValue.token)
            },
            responseType: 'blob'
        }).then((res) => {
            const image = URL.createObjectURL(res.data);
            setImageUrl(image)
        })
    }, [])

    const sendOrderToDesignManager = () => {
        contextValue.socket.emit('new-design', {
            orderId: props.orderId
        })
        setButtonClick(true)
    }

    return (
        <CenteredStack
            width="100%"
        >
            <Stack
                width='fit-content'
                sx={{
                    mt: theme.spacing(4)
                }}
            >
                <OrderSummaryComponent
                    title={intl.formatMessage(ordersPageMessages.numberOfOrder, {number: props.orderId})}
                    imageSrc={imageUrl}
                    item={ITEM_ENUMS[props.item]}
                    setting={props.setting}
                    sideStoneSize={props.sideStoneSize}
                    mainStoneSize={props.mainStoneSize}
                    size={SIZE_ENUM[props.size]}
                    metal={METAL_ENUM[props.metal]}
                    casting={props.casting}
                    comment={props.comments}
                    customerName={props.customerName}
                    email={props.email}
                    phoneNumber={props.phoneNumber}
                    deadline={props.deadline}
                />
                {contextValue.permissionLevel === 1 && props.status === 0 && (
                    <Stack
                        width="50%"
                        sx={{
                            m: '0 auto'
                        }}
                    > 
                        {!buttonClick && (
                            <ButtonComponent
                                label={intl.formatMessage(ordersPageMessages.sendToDesignManager)}
                                onClick={() => sendOrderToDesignManager()}
                            />
                        )}
                        {buttonClick && (
                            <Typography
                                fontWeight="bold"
                                variant="body1"
                            >
                                {intl.formatMessage(ordersPageMessages.orderSentSucessfully)}
                            </Typography>
                        )}
                    </Stack>
                )}
            </Stack>
        </CenteredStack>
    )
}

export default OrderPage

export const getServerSideProps = async (context) => {
    const token = getUserToken(context.req.headers.cookie)
    const response = await axios.get(`http://localhost:3002/order/order/${context.params.orderId}`, {
        headers: {
            Authorization: getAuthorizationHeader(token)
        }
    })
    console.log(response.data)
    return {
        props: {
            orderId: response.data.order.orderId,
            item: response.data.order.item,
            setting: response.data.order.setting,
            sideStoneSize: response.data.order.sideStoneSize,
            mainStoneSize: response.data.order.mainStoneSize,
            design: response.data.order.design,
            size: response.data.order.size,
            metal: response.data.order.metal,
            comments: response.data.order.comments,
            casting: response.data.order.casting,
            customerName: response.data.order.customerName,
            email: response.data.order.email,
            phoneNumber: response.data.order.phoneNumber,
            deadline: response.data.order.deadline,
            status: response.data.order.status
        }
    }
}