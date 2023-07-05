import FormTextFieldComponent from "../../../../../components/UI/Form/Inputs/FormTextFieldComponent"
import FormSelectComponent from "../../../../../components/UI/Form/Inputs/FormSelectComponent"
import FormTextAreaComponent from '../../../../../components/UI/Form/Inputs/FormTextAreaComponent'
import { Typography, Stack, useTheme } from "@mui/material"
import { useIntl } from "react-intl"
import { modelsPageMessages, ordersPageMessages, formMessages } from "../../../../../translations/i18n"
import { ITEM_ENUMS, METAL_ENUM, SIZE_ENUM } from "../../../../../const/Enums"
import FormSwitchComponent from "../../../../../components/UI/Form/Inputs/FormSwitchComponent"
import { useForm, FormProvider } from "react-hook-form"
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"
import { forwardRef, useImperativeHandle } from "react"
import ModelsList from "./ModelsList"



const ExistingModelForm = forwardRef((props, ref) => {

    const intl = useIntl();
    const theme = useTheme()

    const existingModelValidationSchema = yup.object().shape({
        item: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        size: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        metal: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        modelNumber: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        price: yup.number().min(0).required(intl.formatMessage(formMessages.emptyFieldError)),
    })

    const methods = useForm({
        resolver: yupResolver(existingModelValidationSchema)
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

    const itemWatcher = methods.watch('item')

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
                    <Stack
                        direction="row"
                        width='100%'
                        columnGap={theme.spacing(3)}
                    >
                        <FormSelectComponent
                            name="item"
                            fieldLabel={intl.formatMessage(modelsPageMessages.item)}
                            items={getSelectOptions(ITEM_ENUMS)}
                        />
                        <FormSelectComponent
                            name="size"
                            fieldLabel={intl.formatMessage(ordersPageMessages.size)}
                            items={getSelectOptions(SIZE_ENUM)}
                        />
                        <FormSelectComponent
                            name="metal"
                            fieldLabel={intl.formatMessage(ordersPageMessages.metal)}
                            items={getSelectOptions(METAL_ENUM)}
                        />
                    </Stack>
                    <ModelsList
                        item={itemWatcher}
                    />
                    <FormTextAreaComponent
                        name="comments"
                        fieldLabel={intl.formatMessage(ordersPageMessages.comments)}
                        onBlur={() => {}}
                    />
                    <Stack
                        sx={{
                            direction: theme.direction,
                            alignItems: 'flex-start'
                        }}
                    >
                        <FormSwitchComponent
                            name="casting"
                            label={intl.formatMessage(ordersPageMessages.casting)}
                        />
                    </Stack>
                </Stack>
            </form>
        </FormProvider>
    )
})

export default ExistingModelForm