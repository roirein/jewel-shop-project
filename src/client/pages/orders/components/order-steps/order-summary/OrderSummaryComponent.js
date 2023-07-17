import { Typography, Stack, useTheme } from "@mui/material"
import { useIntl } from "react-intl"
import { useFormContext } from "react-hook-form"
import { ordersPageMessages } from "../../../../../translations/i18n";
import { ITEM_ENUMS, METAL_ENUM, ORDER_TYPES, SIZE_ENUM } from "../../../../../const/Enums";
import { useState, useEffect, useContext } from "react";
import CustomerDetails from "../../order-summary/CustomerDetails";
import OrderDeatils from "../../order-summary/OrderDetails";
import axios from "axios";
import AppContext from "../../../../../context/AppContext";
import { getAuthorizationHeader } from "../../../../../utils/utils";
import ModelComponent from "../existing-model-odrer/ModelComponent";
import { sendHttpRequest } from "../../../../../utils/requests";
import { MODELS_ROUTES } from "../../../../../utils/server-routes";
import ModelCardComponent from "../../../../models/components/ModelCard";

const OrderSummary = (props) => {

    const intl = useIntl();
    const theme = useTheme()

    const [imageUrl, setImageUrl] = useState();
    const [summaryProps, setSummaryProps] = useState({});
    const [modelData, setModelData] = useState({})
    const [modelImage, setModelImage] = useState();
    const contextValue = useContext(AppContext)

    useEffect(() => {
        if (props.orderData['design']) {
            const reader  = new FileReader();
            reader.onload = () => {
                setImageUrl(reader.result)
            }
            reader.readAsDataURL(props.orderData['design'])
        }
    }, [])

    useEffect(() => {
        const detailsProps = {}
        if (props.orderType === 3) {
            detailsProps['description'] = props.orderData['description']
        } else {
            detailsProps['size'] = props.orderData['size']
            detailsProps['metal'] = props.orderData['metal']
            if (props.orderType === 1) {
                detailsProps['setting'] = props.orderData['setting'];
                detailsProps['sideStoneSize'] = props.orderData['sideStoneSize']
                detailsProps['mainStoneSize'] = props.orderData['mainStoneSize']
            }
        }
       setSummaryProps(detailsProps)
    }, [])

    useEffect(() => {
        if (props.orderData['modelNumber']) {
            sendHttpRequest(MODELS_ROUTES.GET_MODEL(props.orderData['modelNumber']), 'GET', null, {
                Authorization: `Bearer ${contextValue.token}`
            }).then((res) => setModelData(res.data.model))
        } 
    }, [])

    useEffect(() => {
        if (modelData?.image) {
            console.log(modelData)
            sendHttpRequest(MODELS_ROUTES.IMAGE(modelData?.image), 'GET', null, {
                Authorization: `Bearer ${contextValue.token}`
            }, 'blob').then((res) => {
                const image = URL.createObjectURL(res.data)
                setModelImage(image)
            })
        }
    }, [modelData])

    return (
        <Stack
            width="100%"
        >
            <Typography
                variant="h3"
                fontWeight="bold"
            >
                {`${intl.formatMessage(ordersPageMessages.orderSummary)} - ${ORDER_TYPES[props.orderType]}`}
            </Typography>
            <Stack
                width="100%"
                direction="row"
                columnGap={theme.spacing(4)}
                justifyContent="center"
                sx={{
                    mt: theme.spacing(4)
                }}
            >   
                <Stack
                    rowGap={theme.spacing(4)}
                >
                    <CustomerDetails
                        customerName={props.orderData['customerName']}
                        email={props.orderData['email']}
                        phoneNumber={props.orderData['phoneNumber']}
                    />
                    {props.orderType === 1 && (
                        <Stack
                            columnGap={theme.spacing(4)}
                            width="33%"
                        >
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                sx={{
                                    mb: theme.spacing(3)
                                }}
                            >
                                {intl.formatMessage(ordersPageMessages.design)}
                            </Typography>
                            <img
                                width="150px"
                                height="150px"
                                src={imageUrl}
                            />
                        </Stack>
                    )}
                </Stack>
                <Stack
                    width="33%"
                >
                    <OrderDeatils
                        orderType={props.orderType}
                        item={ITEM_ENUMS[props.orderData['item']]}
                        casting={props.orderData['casting']}
                        comments={props.orderData['comments']}
                        deadline={new Date(props.orderData['deadline']).toLocaleDateString('he-IL')}
                        {...summaryProps}
                    />
                </Stack>
                <Stack
                    width="33%"
                >
                    <ModelCardComponent
                        title={modelData.title}
                        description={modelData.description}
                        image={modelImage}
                    />
                </Stack>
            </Stack>
            {props.orderType === 2 && (
                <Stack
                    direction="row"
                    columnGap={theme.spacing(2)}
                >
                    <Typography
                        variant="body1"
                        fontSize="22px"
                    >
                        {`${intl.formatMessage(ordersPageMessages.price)}:`}
                    </Typography>
                    <Typography
                        varinat="body1"
                        fontWeight="bold"
                        fontSize="22px"
                    >
                        {props.orderData.price}
                    </Typography>
                </Stack>
            )}
        </Stack>
    )
}

export default OrderSummary