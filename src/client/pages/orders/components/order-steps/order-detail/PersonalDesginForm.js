import FormTextFieldComponent from "../../../../../components/UI/Form/Inputs/FormTextFieldComponent"
import FormSelectComponent from "../../../../../components/UI/Form/Inputs/FormSelectComponent"
import FormTextAreaComponent from '../../../../../components/UI/Form/Inputs/FormTextAreaComponent'
import { Typography, Stack, useTheme } from "@mui/material"
import { useIntl } from "react-intl"
import { modelsPageMessages, ordersPageMessages } from "../../../../../translations/i18n"
import { ITEM_ENUMS, METAL_ENUM, SIZE_ENUM } from "../../../../../const/Enums"
import FormSwitchComponent from "../../../../../components/UI/Form/Inputs/FormSwitchComponent"
import { useFormContext } from "react-hook-form"


const PersonalDesignOrderDetails = () => {

    const intl = useIntl();
    const theme = useTheme()

    const getSelectOptions = (items) => {
        console.log(items)
        return Object.entries(items).map((entry) => {
            return {
                value: entry[0],
                label: entry[1]
            }
        })
    }

    const {register} = useFormContext()

    return (
        <>
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
                        {...register('design', {required: true})}
                    />
                    <FormSwitchComponent
                        name="casting"
                        label={intl.formatMessage(ordersPageMessages.casting)}
                    />
                </Stack>
            </Stack>
        </>
    )
}

export default PersonalDesignOrderDetails