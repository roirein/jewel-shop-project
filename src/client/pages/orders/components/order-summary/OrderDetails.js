import {Stack, useTheme, Typography} from '@mui/material'
import { useIntl } from 'react-intl';
import { customerPageMessages, formMessages, modelsPageMessages, ordersPageMessages } from '../../../../translations/i18n';

const OrderDeatils = (props) => {

    const theme = useTheme();
    const intl = useIntl()

    return (
        <Stack
            width="100%"
            sx={{
                direction: theme.direction
            }}
        >
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
                {props.orderType === 3 && (
                        <Typography
                            variant="body1"
                        >
                            {`${intl.formatMessage(modelsPageMessages.description)}: ${props.description}`}
                        </Typography>
                )}
                {props.orderType !== 3 && (
                    <>
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
                        {props.orderType === 1 && (
                            <>
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
                                    {`${intl.formatMessage(ordersPageMessages.casting)}: ${props.casting ? intl.formatMessage(ordersPageMessages.required) : intl.formatMessage(ordersPageMessages.notRequired)}`}
                                </Typography>
                                {props.comments && (
                                <Typography
                                    variant="body1"
                                >
                                    {`${intl.formatMessage(ordersPageMessages.comments)}: ${props.comments}`}
                                </Typography>
                                )}
                            </>
                        )}
                    </>
                )}
                <Typography
                    variant="body1"
                >
                    {`${intl.formatMessage(ordersPageMessages.deadline)}: ${props.deadline}`}
                </Typography>
            </Stack>
        </Stack>
    )
}

export default OrderDeatils