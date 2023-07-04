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



const PersonalDesignOrderDetails = forwardRef((props, ref) => {

    const intl = useIntl();
    const theme = useTheme()

    const personalDesignValidationSchema = yup.object().shape({
        item: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        size: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        metal: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        setting: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        sideStoneSize: yup.number().min(0).required(intl.formatMessage(formMessages.emptyFieldError)),
        mainStoneSize: yup.number().min(0).required(intl.formatMessage(formMessages.emptyFieldError)),
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
                    <FormTextFieldComponent
                        name="setting"
                        type="text"
                        fieldLabel={intl.formatMessage(modelsPageMessages.setting)}
                        onBlur={() => {}}
                    />
                    <Stack
                        direction="row"
                        width='100%'
                        columnGap={theme.spacing(3)}
                    >
                        <FormTextFieldComponent
                            name="sideStoneSize"
                            type="number"
                            fieldLabel={intl.formatMessage(modelsPageMessages.sideStoneSize)}
                            onBlur={() => {}}
                        />
                        <FormTextFieldComponent
                            name="mainStoneSize"
                            type="number"
                            fieldLabel={intl.formatMessage(modelsPageMessages.mainStoneSize)}
                            onBlur={() => {}}
                        />
                    </Stack>
                    <FormTextAreaComponent
                        name="comments"
                        fieldLabel={intl.formatMessage(ordersPageMessages.comments)}
                        onBlur={() => {}}
                    />
                    <Stack
                        direction="row"
                        width='100%'
                        columnGap={theme.spacing(3)}
                        sx={{
                            alignItems: 'baseline'
                        }}
                    >
                        <input
                            type="file"
                            {...methods.register('design', {required: true})}
                        />
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

export default PersonalDesignOrderDetails