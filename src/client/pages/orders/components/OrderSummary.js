import {Stack, useTheme, Typography} from '@mui/material'
import { useIntl } from 'react-intl';
import { customerPageMessages, formMessages, modelsPageMessages, ordersPageMessages } from '../../../translations/i18n';

const OrderSummaryComponent = (props) => {

    const theme = useTheme();
    const intl = useIntl()

    return (
        <Stack
            width="100%"
            sx={{
                direction: theme.direction
            }}
        >
            <Typography
                variant="h3"
                fontWeight="bold"
            >
                {props.title}
            </Typography>
            <Stack
                width="100%"
                direction="row"
                columnGap={theme.spacing(5)}
            >
                <Stack>
                    <img
                        width="300px"
                        height="300px"
                        src={props.imageSrc}
                    />
                </Stack>
                <Stack
                    rowGap={theme.spacing(4)}
                >
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        {intl.formatMessage(ordersPageMessages.orderDeatils)}
                    </Typography>
                    <Typography
                        variant="body1"
                    >
                        {`${intl.formatMessage(modelsPageMessages.item)}: ${props.item}`}
                    </Typography>
                    <Typography
                        variant="body1"
                    >
                        {`${intl.formatMessage(modelsPageMessages.setting)}: ${props.setting}`}
                    </Typography>
                    <Typography
                        variant="body1"
                    >
                        {`${intl.formatMessage(modelsPageMessages.sideStoneSize)}: ${props.sideStoneSize}`}
                    </Typography>
                    <Typography
                        variant="body1"
                    >
                        {`${intl.formatMessage(modelsPageMessages.mainStoneSize)}: ${props.mainStoneSize}`}
                    </Typography>
                    <Typography
                        variant="body1"
                    >
                        {`${intl.formatMessage(ordersPageMessages.size)}: ${props.size}`}
                    </Typography>
                    <Typography
                        variant="body1"
                    >
                        {`${intl.formatMessage(ordersPageMessages.metal)}: ${props.metal}`}
                    </Typography>
                    <Typography
                        variant="body1"
                    >
                        {`${intl.formatMessage(ordersPageMessages.casting)}: ${props.casting ? intl.formatMessage(ordersPageMessages.required) : intl.formatMessage(ordersPageMessages.notRequired)}`}
                    </Typography>
                    {props.comments && (
                        <Typography
                            variant="body1"
                        >
                            {`${intl.formatMessage(ordersPageMessages.comments)}: ${props.required}`}
                        </Typography>
                    )}
                </Stack>
                <Stack
                    rowGap={theme.spacing(4)}
                >
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        {intl.formatMessage(ordersPageMessages.customerDetails)}
                    </Typography>
                    <Typography
                        variant="body1"
                    >
                        {`${intl.formatMessage(customerPageMessages.customerName)}: ${props.customerName}`}
                    </Typography>
                    <Typography
                        variant="body1"
                    >
                        {`${intl.formatMessage(formMessages.email)}: ${props.email}`}
                    </Typography>
                    <Typography
                        variant="body1"
                    >
                        {`${intl.formatMessage(formMessages.phoneNumber)}: ${props.phoneNumber}`}
                    </Typography>
                    <Typography
                        variant="body1"
                    >
                        {`${intl.formatMessage(ordersPageMessages.deadline)}: ${new Date(props.deadline).toLocaleDateString('he-IL')}`}
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default OrderSummaryComponent