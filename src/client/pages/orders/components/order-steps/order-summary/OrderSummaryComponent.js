import { Typography, Stack, useTheme } from "@mui/material"
import { useIntl } from "react-intl"
import { useFormContext } from "react-hook-form"
import { ordersPageMessages } from "../../../../../translations/i18n";
import { ITEM_ENUMS, METAL_ENUM, ORDER_TYPES, SIZE_ENUM } from "../../../../../const/Enums";
import { useState, useEffect, useContext } from "react";
import OrderSummaryComponent from "../../OrderSummary";
import CustomerDetails from "../../order-summary/CustomerDetails";
import OrderDeatils from "../../order-summary/OrderDetails";
import axios from "axios";
import AppContext from "../../../../../context/AppContext";
import { getAuthorizationHeader } from "../../../../../utils/utils";
import ModelComponent from "../existing-model-odrer/ModelComponent";

const OrderSummary = (props) => {

    const intl = useIntl();
    const theme = useTheme()

    const [imageUrl, setImageUrl] = useState();
    const [summaryProps, setSummaryProps] = useState({});
    const [modelData, setModelData] = useState({})
    const contextValue = useContext(AppContext)

    useEffect(() => {
        if (props.orderData['design']) {
            const reader  = new FileReader();
            reader.onload = () => {
                setImageUrl(reader.result)
            }
            reader.readAsDataURL(props.orderData['design'][0])
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
            if (props.orderType === 2) {
                detailsProps['price'] = props.orderData['price']
            }
        }
       setSummaryProps(detailsProps)
    }, [])

    useEffect(() => {
        if (props.orderData['modelNumber']) {
            axios.get(`http://localhost:3002/model/model/${props.orderData['modelNumber']}`, {
                headers: {
                    Authorization: getAuthorizationHeader(contextValue.token)
                }
            }).then((res) => setModelData(res.data.model))
        } 
    }, [])

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
            >   
                {props.orderType === 1 && (
                    <Stack
                        columnGap={theme.spacing(4)}
                    >
                        <Typography
                            variant="h5"
                        >
                            {intl.formatMessage(ordersPageMessages.design)}
                        </Typography>
                        <img
                            width="300px"
                            height="300px"
                            src={imageUrl}
                        />
                    </Stack>
                )}
                {props.orderType === 2 && (
                    <ModelComponent
                        modelNumber={props.orderData['modelNumber']}
                        title={modelData.title}
                        image={modelData.image}
                        description={modelData.description}
                        price={props.orderData['price']}
                        selected={false}
                    />
                )} 
                <CustomerDetails
                    customerName={props.orderData['customerName']}
                    email={props.orderData['email']}
                    phoneNumber={props.orderData['phoneNumber']}
                />
                <OrderDeatils
                    orderType={props.orderType}
                    item={ITEM_ENUMS[props.orderData['item']]}
                    casting={props.orderData['casting']}
                    comments={props.orderData['comments']}
                    deadline={new Date(props.orderData['deadline']).toLocaleDateString('he-IL')}
                    {...summaryProps}
                />
            </Stack>
        </Stack>
    )
}

export default OrderSummary