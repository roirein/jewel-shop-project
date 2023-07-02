import { Stack, useTheme } from "@mui/material"
import { FormProvider, useForm } from "react-hook-form"
import FormTextAreaComponent from "../../../components/UI/Form/Inputs/FormTextAreaComponent"
import FormTextFieldComponent from "../../../components/UI/Form/Inputs/FormTextFieldComponent"
import { useIntl } from "react-intl"
import { buttonMessages, formMessages, modelsPageMessages } from "../../../translations/i18n"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import ButtonComponent from "../../../components/UI/ButtonComponent"

const UpdatePriceForm = (props) => {

    const intl= useIntl();
    const theme = useTheme()

    const validationSchema = yup.object().shape({
        materials: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        priceWithMaterials: yup.number().required(intl.formatMessage(formMessages.emptyFieldError)),
        priceWithoutMaterials: yup.number().required(intl.formatMessage(formMessages.emptyFieldError))
    })

    const methods = useForm({
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = (data) => {
        props.onSubmit(data)
    }

    return (
        <Stack
            width="100%"
            sx={{
                direction: theme.direction
            }}
        >
            <FormProvider {...methods}>
                <form
                    style={{
                        width: '100%'
                    }}
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <FormTextFieldComponent
                        name="materials"
                        type="text"
                        fieldLabel={intl.formatMessage(modelsPageMessages.materials)}
                        onBlur={() => {}}
                    />
                    <FormTextFieldComponent
                        type="number"
                        name="priceWithMaterials"
                        fieldLabel={intl.formatMessage(modelsPageMessages.priceWithMaterials)}
                        onBlur={() => {}}
                    />
                    <FormTextFieldComponent
                        type="number"
                        name="priceWithoutMaterials"
                        fieldLabel={intl.formatMessage(modelsPageMessages.priceWithoutMaterials)}
                        onBlur={() => {}}
                    />
                    <Stack
                        direction="row"
                        columnGap={theme.spacing(4)}
                        width="100%"
                        sx={{
                            mt: theme.spacing(3)
                        }}
                    >
                        <ButtonComponent
                            type="submit"
                            label={intl.formatMessage(buttonMessages.send)}
                            onClick={() => {}}
                        />
                        <ButtonComponent
                            type="button"
                            label={intl.formatMessage(buttonMessages.cancel)}
                            onClick={() => props.onCancel()}
                        />
                    </Stack>
                </form>
            </FormProvider>
        </Stack>
    )
}

export default UpdatePriceForm