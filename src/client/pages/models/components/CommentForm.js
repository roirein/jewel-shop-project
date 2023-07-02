import { Stack, useTheme } from "@mui/material"
import { FormProvider, useForm } from "react-hook-form"
import FormTextAreaComponent from "../../../components/UI/Form/Inputs/FormTextAreaComponent"
import { useIntl } from "react-intl"
import { buttonMessages, formMessages, ordersPageMessages } from "../../../translations/i18n"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import ButtonComponent from "../../../components/UI/ButtonComponent"

const CommentsForm = (props) => {

    const intl= useIntl();
    const theme = useTheme()

    const validationSchema = yup.object().shape({
        comments: yup.string().required(intl.formatMessage(formMessages.emptyFieldError))
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
                    <FormTextAreaComponent
                        name="comments"
                        fieldLabel={intl.formatMessage(ordersPageMessages.comments)}
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

export default CommentsForm