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
    const intl = useIntl()
    const theme = useTheme()
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
                        <ButtonComponent
                            label={intl.formatMessage(ordersPageMessages.sendOrderToCasting)}
                            onClick={() => {
                                contextValue.socket.emit('update-casting-status', {
                                    status: 2,
                                    orderId: props.orderId
                                })
                            }}
                        />
                    </Stack>
                )}
            </Stack>
        </Stack>
    )
}

export default OrderModelData