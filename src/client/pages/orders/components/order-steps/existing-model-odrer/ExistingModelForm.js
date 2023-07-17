import FormTextFieldComponent from "../../../../../components/UI/Form/Inputs/FormTextFieldComponent"
import FormSelectComponent from "../../../../../components/UI/Form/Inputs/FormSelectComponent"
import FormTextAreaComponent from '../../../../../components/UI/Form/Inputs/FormTextAreaComponent'
import { Typography, Stack, useTheme } from "@mui/material"
import { useIntl } from "react-intl"
import { modelsPageMessages, ordersPageMessages, formMessages } from "../../../../../translations/i18n"
import { BRACELET_SIZES, ITEM_ENUMS, METAL_ENUM, PENDANT_SIZES, RING_SIZES, SIZE_ENUM } from "../../../../../const/Enums"
import FormSwitchComponent from "../../../../../components/UI/Form/Inputs/FormSwitchComponent"
import { useForm, FormProvider } from "react-hook-form"
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import ModelsList from "./ModelsList"



const ExistingModelForm = forwardRef((props, ref) => {

    const intl = useIntl();
    const theme = useTheme()

    const existingModelValidationSchema = yup.object().shape({
        item: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        size: yup.string().when('item', {
            is: (value) => ["1", "3", "4"].includes(value),
            then: () => yup.string().required(intl.formatMessage(formMessages.emptyFieldError))
        }),
        metal: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        modelNumber: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        price: yup.number().min(0).required(intl.formatMessage(formMessages.emptyFieldError)),
    })

    const methods = useForm({
        resolver: yupResolver(existingModelValidationSchema)
    })

    const [sizeSelectDisabled, setSizeSelectDisabled] = useState(true)
    const [sizeOption, setSizeOption] = useState([])

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

    useEffect(() => {
        let options;
        switch(itemWatcher) {
            case "1": 
                options = RING_SIZES
                setSizeSelectDisabled(false)
                break;
            case "2": 
                options = []
                setSizeSelectDisabled(true)
                break;
            case "3": 
                options = BRACELET_SIZES
                setSizeSelectDisabled(false)
                break;
            case "4": 
                options = PENDANT_SIZES
                setSizeSelectDisabled(false)
                break
            default: 
                options = []
                break
        }
        options = options.map(opt => {
            return {
                value: opt,
                label: opt
            }
        })
        methods.setValue('size', '')
        setSizeOption(options)
    }, [itemWatcher])

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
                            onChange={(value) => methods.setValue('item', value)}
                        />
                        <FormSelectComponent
                            name="size"
                            fieldLabel={intl.formatMessage(ordersPageMessages.size)}
                            items={sizeOption}
                            disabled={sizeSelectDisabled}
                            onChange={(value) => methods.setValue('size', value)}
                        />
                        <FormSelectComponent
                            name="metal"
                            fieldLabel={intl.formatMessage(ordersPageMessages.metal)}
                            items={getSelectOptions(METAL_ENUM)}
                            onChange={(value) => methods.setValue('metal', value)}
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