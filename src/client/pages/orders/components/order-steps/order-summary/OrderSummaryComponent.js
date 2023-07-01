import { Typography, Stack } from "@mui/material"
import { useIntl } from "react-intl"
import { useFormContext } from "react-hook-form"
import { ordersPageMessages } from "../../../../../translations/i18n";
import { ORDER_TYPES } from "../../../../../const/Enums";
import { useState, useEffect } from "react";
import OrderSummaryComponent from "../../OrderSummary";

const OrderSummary = (props) => {

    const {getValues} = useFormContext();
    const intl = useIntl()

    const [imageUrl, setImageUrl] = useState()

    useEffect(() => {
        const reader  = new FileReader();
        reader.onload = () => {
            setImageUrl(reader.result)
        }
        reader.readAsDataURL(getValues('design')[0])
    }, [])

    return (
        <Stack
            width="100%"
        >
            <OrderSummaryComponent
                title={`${intl.formatMessage(ordersPageMessages.orderSummary)} - ${ORDER_TYPES[props.orderType]}`}
                imageSrc={imageUrl}
                item={getValues('item')}
                setting={getValues('setting')}
                sideStoneSize={getValues('sideStoneSize')}
                mainStoneSize={getValues('mainStoneSize')}
                size={getValues('size')}
                metal={getValues('metal')}
                casting={getValues('casting')}
                comment={getValues('comments')}
                customerName={getValues('customerName')}
                email={getValues('email')}
                phoneNumber={getValues('phoneNumber')}
                deadline={getValues('deadline')}
            />
        </Stack>
    )
}

export default OrderSummary