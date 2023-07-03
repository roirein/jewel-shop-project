import { Stack, useTheme, Typography } from "@mui/material"
import ModelCardComponent from "../../models/components/ModelCard"
import ButtonComponent from "../../../components/UI/ButtonComponent"
import { useState, useEffect, useContext} from "react"
import AppContext from "../../../context/AppContext"
import { useIntl } from "react-intl"
import { modelsPageMessages, ordersPageMessages } from "../../../translations/i18n"
import axios from "axios"
import { getAuthorizationHeader } from "../../../utils/utils"

const OrderModelData = (props) => {

    const [imageUrl, setImageUrl] = useState();
    const [status, setStatus] = useState(props.status)
    const [price, setPrice] = useState(props.price)
    const [sentToCasting, setSentToCasting] = useState(false);
    const [castingCompleted, setCastingCompleted] = useState(false)
    const [sentToProduction, setSentToProduction] = useState(false);
    const intl = useIntl();
    const theme = useTheme();
    const contextValue = useContext(AppContext)

    useEffect(() => {
        axios.get(`http://localhost:3002/model/image/${props.image}`, {
            headers: {
                Authorization: getAuthorizationHeader(contextValue.token)
            },
            responseType: 'blob'
        }).then((res) => {
            const image = URL.createObjectURL(res.data);
            setImageUrl(image)
        })
    }, [])

    const onChoosePrice = (price) => {
        contextValue.socket.emit('customer-approval', {
            orderId: props.orderId,
            price,
            casting: props.casting
        })
        setPrice(price)
        setStatus(3)
    }

    const updateCasting = (castingStatus) => {
        contextValue.socket.emit('update-casting-status', {
            orderId: props.orderId,
            castingStatus: castingStatus
        })
        if (castingStatus === 2) {
            setStatus(4)
            setSentToCasting(true)
        }
        if (castingStatus === 3) {
            setStatus(5)
            setCastingCompleted(true)
        }
    }

    const sendOrderToProduction = () => {
        contextValue.socket.emit('send-order-to-production', {
            orderId: props.orderId,
            status: 6
        })
        setStatus(6)
        setSentToProduction(true)
    }

    return (
        <Stack
            direction="row"
            width="100%"
            sx={{
                direction: theme.direction
            }}
            columnGap={theme.spacing(4)}
        >
            <Stack
                width="50%"
            >
                <ModelCardComponent
                    title={props.title}
                    description={props.description}
                    image={imageUrl}
                />
            </Stack>
            <Stack
                width="50%"
                rowGap={theme.spacing(3)}
            >
                {status === 2 && contextValue.permissionLevel === 5 && (
                    <Stack
                        rowGap={theme.spacing(3)}
                    >
                        <Typography>
                            {`${intl.formatMessage(modelsPageMessages.materials)}: ${props.materials}`}
                        </Typography>
                        <Stack
                            direction="row"
                            columnGap={theme.spacing(4)}
                        >
                            <ButtonComponent
                                onClick={() => onChoosePrice(props.priceWithMaterials)}
                                label={props.priceWithMaterials}
                            />
                            <ButtonComponent
                                onClick={() => onChoosePrice(props.priceWithoutMaterials)}
                                label={props.priceWithoutMaterials}
                            />
                        </Stack>
                        <Typography>
                            {intl.formatMessage(ordersPageMessages.chooseOption)}
                        </Typography>
                    </Stack>
                )}
                {status > 2 && (
                    <Typography>
                        {intl.formatMessage(ordersPageMessages.pricePaid, {price: price})}
                    </Typography>
                )}
                {status === 3 && contextValue.permissionLevel === 1 && (
                    <Stack
                        width="75%"
                        height="40px"
                    >
                        {!sentToCasting && (
                            <ButtonComponent
                                label={intl.formatMessage(ordersPageMessages.sendOrderToCasting)}
                                onClick={() => updateCasting(2)}
                            />
                        )}
                    </Stack>
                )}
                {status === 4 && (
                    <>
                        {sentToCasting && (
                            <Typography>
                                {intl.formatMessage(ordersPageMessages.senToCasting)}
                            </Typography>
                        )}
                        {(!sentToCasting) && (
                            <Stack
                                width="75%"
                                height="40px"
                            >
                                <ButtonComponent
                                    label={intl.formatMessage(ordersPageMessages.completeCasting)}
                                    onClick={() => updateCasting(3)}
                                />
                            </Stack>
                        )} 
                    </>
                )}
                {(status === 5 || (status === 3 && !props.casting && price)) && (
                    <>
                        {castingCompleted && (
                            <Typography>
                                {intl.formatMessage(ordersPageMessages.castingCompleted)}
                            </Typography>
                        )}
                        <Stack
                            width="75%"
                            height="40px"
                        >
                            <ButtonComponent
                                label={intl.formatMessage(ordersPageMessages.sendOrderToProduction)}
                                onClick={() => sendOrderToProduction()}
                            />
                        </Stack>
                    </>
                )}
                {status === 6 && (
                    <>
                        {sentToProduction && (
                            <Typography>
                                {intl.formatMessage(ordersPageMessages.orderSentToProductionSuccessfully)}
                            </Typography>
                        )}
                    </>
                )}
            </Stack>
        </Stack>
    )
}

export default OrderModelData