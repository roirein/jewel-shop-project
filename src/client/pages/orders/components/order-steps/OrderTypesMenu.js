import {Stack, useTheme, Typography, Button} from '@mui/material'
import { useIntl } from 'react-intl'
import CenteredStack from '../../../../components/UI/CenteredStack'
import { ordersPageMessages } from '../../../../translations/i18n'
import { useState } from 'react'

const OrdersMenuComponent = (props) => {

    const intl = useIntl()
    const theme = useTheme();

    const [selectedOrderType, setSelectedOrderType] = useState(0)

    const getButton = (message, orderType) => {
        return (
            <Button
                varinat="outlined"
                sx={{
                    border: `${selectedOrderType === orderType ? theme.spacing(2) : theme.spacing(0)} solid ${theme.palette.primary.main}` ,
                    width: '70%'
                }}
                onClick={() => {
                    setSelectedOrderType(orderType)
                    props.onChooseOrder(orderType)
                }}
            >
                {message}
            </Button>
        )
    }

    return (
        <CenteredStack
            width="100%"
            rowGap={theme.spacing(4)}
            sx={{
                mt: theme.spacing(3)
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    textAlign: 'right',
                    width: '100%'
                }}
            >
                {intl.formatMessage(ordersPageMessages.orderType)}
            </Typography>
            {getButton(intl.formatMessage(ordersPageMessages.personalDesign), 1)}
            {getButton(intl.formatMessage(ordersPageMessages.existingModel), 2)}
            {getButton(intl.formatMessage(ordersPageMessages.fix), 3)}
        </CenteredStack>    
    )
} 

export default OrdersMenuComponent