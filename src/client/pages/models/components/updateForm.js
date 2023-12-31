import { Stack, useTheme } from "@mui/material"
import { FormProvider, useForm } from "react-hook-form"
import FormTextAreaComponent from "../../../components/UI/Form/Inputs/FormTextAreaComponent"
import FormTextFieldComponent from "../../../components/UI/Form/Inputs/FormTextFieldComponent"
import { useIntl } from "react-intl"
import { buttonMessages, formMessages, modelsPageMessages } from "../../../translations/i18n"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import ButtonComponent from "../../../components/UI/ButtonComponent"
import CenteredStack from "../../../components/UI/CenteredStack"
import ImageUploader from "../../../components/UI/Form/Inputs/ImageUploader"

const UpdateForm = (props) => {

    const intl= useIntl();
    const theme = useTheme()

    const validationSchema = yup.object().shape({
        title: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        description: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        model: yup.mixed().required(intl.formatMessage(formMessages.emptyFieldError)).test('file type', intl.formatMessage(formMessages.imageOnly), (value) => {
            if (!value) {
                return true
            }
            return ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type);
        })
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
                        name="title"
                        type="text"
                        fieldLabel={intl.formatMessage(modelsPageMessages.title)}
                        onBlur={() => {}}
                    />
                    <FormTextAreaComponent
                        name="description"
                        fieldLabel={intl.formatMessage(modelsPageMessages.description)}
                        onBlur={() => {}}
                    />
                    <CenteredStack
                        sx={{
                            mt: theme.spacing(3)
                        }}
                    >
                        <ImageUploader
                            name="model"
                        />
                    </CenteredStack>
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

export default UpdateForm