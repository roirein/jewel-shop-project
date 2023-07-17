import FormSelectComponent from '../../../../../components/UI/Form/Inputs/FormSelectComponent'
import FormTextAreaComponent from '../../../../../components/UI/Form/Inputs/FormTextAreaComponent'
import { Typography, Stack, useTheme } from "@mui/material"
import { useIntl } from "react-intl"
import { modelsPageMessages, ordersPageMessages, formMessages } from "../../../../../translations/i18n"
import {ITEM_ENUMS} from "../../../../../const/Enums"
import { useForm, FormProvider } from "react-hook-form"
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"
import { forwardRef, useImperativeHandle } from "react"



const FixOrderForm= forwardRef((props, ref) => {

    const intl = useIntl();
    const theme = useTheme()

    const personalDesignValidationSchema = yup.object().shape({
        item: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        description: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
    })

    const methods = useForm({
        resolver: yupResolver(personalDesignValidationSchema)
    })

    const getSelectOptions = (items) => {
        console.log(items)
        return Object.entries(items).map((entry) => {
            return {
                value: entry[0],
                label: entry[1]
            }
        })
    }

    useImperativeHandle(ref, () => ({
        onSubmitOrderDetails: () => {
            methods.trigger().then((res) => {
                if (res) {
                    props.onSubmitOrderDetails(methods.getValues())
                }
            })
        }
    }))

    return (
        <FormProvider {...methods}>
            <form
                style={{
                    width: '100%'
                }}
            >
                <Typography
                    variant="h3"
                >
                    {intl.formatMessage(ordersPageMessages.orderDeatils)}
                </Typography>
                <Stack
                    rowGap={theme.spacing(3)}
                >
                    <FormSelectComponent
                        name="item"
                        fieldLabel={intl.formatMessage(modelsPageMessages.item)}
                        items={getSelectOptions(ITEM_ENUMS)}
                        onChange={(value) => methods.setValue('item', value)}
                    />
                    <FormTextAreaComponent
                        name="description"
                        fieldLabel={intl.formatMessage(ordersPageMessages.comments)}
                        onBlur={() => {}}
                    />
                </Stack>
            </form>
        </FormProvider>
    )
})

export default FixOrderForm