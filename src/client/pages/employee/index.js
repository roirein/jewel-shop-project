import CenteredStack from '../../components/UI/CenteredStack'
import ButtonComponent from '../../components/UI/ButtonComponent'
import FormTextFieldComponent from '../../components/UI/Form/Inputs/FormTextFieldComponent'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import {useForm, FormProvider} from 'react-hook-form'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import { buttonMessages, formMessages, ordersPageMessages } from '../../translations/i18n'
import { useTheme, Stack } from '@mui/material'

const EmployeePage = () => {

    const intl = useIntl();
    const theme = useTheme();
    const router = useRouter();

    const orderValidationSchema = yup.object().shape({
        orderNumber: yup.number().required(intl.formatMessage(formMessages.emptyFieldError))
    })

    const methods = useForm({
        resolver: yupResolver(orderValidationSchema)
    })

    const onSubmit = (data) => {
        router.push(`/orders/${data.orderNumber}`)
    }

    return (
        <CenteredStack
            width="40%"
            margin="0 auto"
            maxWidth="600px"
            height="50%"

        >
            <FormProvider {...methods}>
                <form
                    style={{
                        width: '100%'
                    }}
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <Stack
                        rowGap={theme.spacing(3)}
                        sx={{
                            p: theme.spacing(4),
                            border: `${theme.spacing(0)} solid ${theme.palette.primary.main}`
                        }}
                    >
                        <FormTextFieldComponent
                            name="orderNumber"
                            type="text"
                            onBlur={() => {}}
                            fieldLabel={intl.formatMessage(ordersPageMessages.orderNumber)}
                        />
                        <ButtonComponent
                            type="submit"
                            label={intl.formatMessage(buttonMessages.continue)}
                            onClick={() => {}}
                        />
                    </Stack>
                </form>
            </FormProvider>
        </CenteredStack>
    )
}

export default EmployeePage