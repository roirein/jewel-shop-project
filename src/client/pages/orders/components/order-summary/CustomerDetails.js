import {Stack, useTheme, Typography} from '@mui/material'
import { useIntl } from 'react-intl';
import { customerPageMessages, formMessages, modelsPageMessages, ordersPageMessages } from '../../../../translations/i18n';

const CustomerDetails = (props) => {

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
            </Stack>
        </Stack>
    )
}

export default CustomerDetails