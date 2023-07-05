import { FormProvider, useForm } from "react-hook-form"
import ModalComponent from "../../../components/UI/ModalComponent"
import FormTextFieldComponent from "../../../components/UI/Form/Inputs/FormTextFieldComponent"
import { Stack, useTheme } from "@mui/material"
import {useIntl} from 'react-intl'
import { buttonMessages, formMessages, ordersPageMessages } from "../../../translations/i18n"
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"
import ButtonComponent from "../../../components/UI/ButtonComponent"

const PriceOfferModal = (props) => {

    const intl = useIntl();
    const theme = useTheme();

    const priceValidationSchema = yup.object().shape({
        price: yup.number().required(intl.formatMessage(formMessages.emptyFieldError))
    })

    const methods = useForm({
        resolver: yupResolver(priceValidationSchema)
    })

    const onSend = () => {
        methods.trigger().then((res) => {
            if (res) {
                props.onSend(methods.getValues())
            }
        })
    }

    const getModalActions = () => {
        return (
            <Stack
                direction="row"
                width="100%"
                flexDirection="row-reverse"
            >
                <Stack
                    width="50%"
                    direction="row"
                    flexDirection="row-reverse"
                    columnGap={theme.spacing(4)}
                >
                    <Stack
                        width="25%"
                    >
                         <ButtonComponent
                            label={intl.formatMessage(buttonMessages.send)}
                            onClick={() => onSend()}
                        />
                    </Stack>
                </Stack>
                <Stack
                    width="50%"
                >
                    <Stack
                        width="25%"
                    >
                        <ButtonComponent
                            label={intl.formatMessage(buttonMessages.cancel)}
                            onClick={() => props.onClose()}
                        />
                    </Stack>
                </Stack>
            </Stack>
        )
    }

    return (
        <ModalComponent
            open={props.open}
            onClose={props.onClose}
            width="sm"
            actions={getModalActions()}
        >
            <FormProvider {...methods}>
                <Stack
                    width="100%"
                    sx={{
                        p: theme.spacing(4),
                        direction: theme.direction
                    }}
                >
                    <form
                        style={{
                            width: '100%'
                        }}
                    >
                        <FormTextFieldComponent
                            name="price"
                            type="number"
                            onBlur={() => {}}
                            fieldLabel={intl.formatMessage(ordersPageMessages.priceOffer)}
                        />
                    </form>
                </Stack>
            </FormProvider>
        </ModalComponent>
    )
}

export default PriceOfferModal