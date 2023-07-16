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
import ImageUploader from '../../../../../components/UI/Form/Inputs/ImageUploader'
import FormNumberFieldComponent from "../../../../../components/UI/Form/Inputs/FormNumberFieldComponent"

const PersonalDesignOrderDetails = forwardRef((props, ref) => {

    const intl = useIntl();
    const theme = useTheme()

    const personalDesignValidationSchema = yup.object().shape({
        item: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        size: yup.string().when('item', {
            is: (value) => ["1", "3", "4"].includes(value),
            then: () => yup.string().required(intl.formatMessage(formMessages.emptyFieldError))
        }),
        metal: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        setting: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        sideStoneSize: yup.number().min(0).required(intl.formatMessage(formMessages.emptyFieldError)),
        mainStoneSize: yup.number().min(0).required(intl.formatMessage(formMessages.emptyFieldError)),
        design: yup.mixed().required(intl.formatMessage(formMessages.emptyFieldError)).test('file type', intl.formatMessage(formMessages.imageOnly), (value) => {
            if (!value) {
                return true
            }
            return ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type);
        })
    })

    const [sizeSelectDisabled, setSizeSelectDisabled] = useState(true)
    const [sizeOption, setSizeOption] = useState([])

    const methods = useForm({
        resolver: yupResolver(personalDesignValidationSchema)
    })

    const itemWatcher = methods.watch('item')

    const getSelectOptions = (items) => {
        return Object.entries(items).map((entry) => {
            return {
                value: entry[0],
                label: entry[1]
            }
        })
    }

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

                        <Stack
                            width="50%"
                            direction="row"
                            alignItems="end"
                            columnGap={theme.spacing(2)}
                        >
                            <FormNumberFieldComponent
                                name="sideStoneSize"
                                fieldLabel={intl.formatMessage(modelsPageMessages.sideStoneSize)}
                                onBlur={() => {}}
                            />
                            <Typography>
                                {intl.formatMessage(modelsPageMessages.carat)}
                            </Typography>
                        </Stack>
                        <Stack
                            width="50%"
                            direction="row"
                            alignItems="end"
                            columnGap={theme.spacing(2)}
                            sx={{
                                mr: 'auto'
                            }}
                        >
                            <FormNumberFieldComponent
                                name="mainStoneSize"
                                fieldLabel={intl.formatMessage(modelsPageMessages.mainStoneSize)}
                                onBlur={() => {}}
                            />
                            <Typography>
                                {intl.formatMessage(modelsPageMessages.carat)}
                            </Typography>
                        </Stack>
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
                        <Stack
                            width="50%"
                        >
                            <ImageUploader
                                name="design"
                            />
                        </Stack>
                        <Stack
                            width="50%"
                            alignItems="flex-end"
                        >
                            <FormSwitchComponent
                                name="casting"
                                label={intl.formatMessage(ordersPageMessages.casting)}
                            />
                        </Stack>
                    </Stack>
                </Stack>
            </form>
        </FormProvider>
    )
})

export default PersonalDesignOrderDetails