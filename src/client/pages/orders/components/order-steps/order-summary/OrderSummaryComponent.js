import { Typography, Stack } from "@mui/material"
import { useIntl } from "react-intl"
import { useFormContext } from "react-hook-form"
import { ordersPageMessages } from "../../../../../translations/i18n";
import { ITEM_ENUMS, METAL_ENUM, ORDER_TYPES, SIZE_ENUM } from "../../../../../const/Enums";
import { useState, useEffect } from "react";
import OrderSummaryComponent from "../../OrderSummary";

const OrderSummary = (props) => {

    const intl = useIntl()

    const [imageUrl, setImageUrl] = useState()
    console.log(props.orderData)

    useEffect(() => {
        const reader  = new FileReader();
        reader.onload = () => {
            setImageUrl(reader.result)
        }
        reader.readAsDataURL(props.orderData['design'][0])
    }, [])

    return (
        <Stack
            width="100%"
        >
            <OrderSummaryComponent
                title={`${intl.formatMessage(ordersPageMessages.orderSummary)} - ${ORDER_TYPES[props.orderType]}`}
                imageSrc={imageUrl}
                item={ITEM_ENUMS[props.orderData['item']]}
                setting={props.orderData['setting']}
                sideStoneSize={props.orderData['sideStoneSize']}
                mainStoneSize={props.orderData['mainStoneSize']}
                size={SIZE_ENUM[props.orderData['size']]}
                metal={METAL_ENUM[props.orderData['metal']]}
                casting={props.orderData['casting']}
                comment={props.orderData['comments']}
                customerName={props.orderData['customerName']}
                email={props.orderData['email']}
                phoneNumber={props.orderData['phoneNumber']}
                deadline={props.orderData['deadline']}
            />
        </Stack>
    )
}

export default OrderSummary