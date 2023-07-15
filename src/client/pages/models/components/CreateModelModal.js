import ModalComponent from '../../../components/UI/ModalComponent'
import { useIntl } from 'react-intl'
import { buttonMessages, formMessages, modelsPageMessages } from '../../../translations/i18n'
import { FormProvider, useForm, Controller } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Stack, useTheme } from "@mui/system";
import FormTextFieldComponent from '../../../components/UI/Form/Inputs/FormTextFieldComponent';
import FormSelectComponent from '../../../components/UI/Form/Inputs/FormSelectComponent';
import { ITEM_ENUMS } from '../../../const/Enums';
import FormTextAreaComponent from '../../../components/UI/Form/Inputs/FormTextAreaComponent';
import ButtonComponent from '../../../components/UI/ButtonComponent';
import axios from 'axios';
import { getAuthorizationHeader } from '../../../utils/utils';
import { useContext, useEffect, useState } from 'react';
import AppContext from '../../../context/AppContext';
import FormNumberFieldComponent from '../../../components/UI/Form/Inputs/FormNumberFieldComponent';
import { Typography } from '@mui/material';
import ImageUploader from '../../../components/UI/Form/Inputs/ImageUploader';
import CenteredStack from '../../../components/UI/CenteredStack';
import ErrorLabelComponent from '../../../components/UI/Form/Labels/ErrorLabelComponent';
import { sendHttpRequest } from '../../../utils/requests';
import { MODELS_ROUTES } from '../../../utils/server-routes';

const CreateModelModal = (props) => {

    const intl = useIntl();
    const theme = useTheme();
    const contextValue = useContext(AppContext)

    const newModelValidationSchema = yup.object().shape({
        item: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        modelNumber: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        setting: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        sideStoneSize: yup.number().min(0, intl.formatMessage(formMessages.positive)).required(intl.formatMessage(formMessages.emptyFieldError)),
        mainStoneSize: yup.number().min(0, intl.formatMessage(formMessages.positive)).required(intl.formatMessage(formMessages.emptyFieldError)),
        title: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        description: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        model: yup.mixed().required(intl.formatMessage(formMessages.emptyFieldError)).test('file type', intl.formatMessage(formMessages.imageOnly), (value) => {
            if (!value) {
                return true
            }
            return ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type);
        })
    }).required()

    const modelData = props.modelData
    const defaultValues = {
        item: modelData ? props.modelData.item : '',
        setting: modelData ? props.modelData.setting: '',
        sideStoneSize: modelData ? props.modelData.sideStoneSize : '',
        mainStoneSize: modelData ? props.modelData.mainStoneSize: ''
    }

    const methods = useForm({
        resolver: yupResolver(newModelValidationSchema)
    });

    useEffect(() => {
        Object.entries(defaultValues).forEach((entry) => {
            methods.setValue(entry[0], entry[1])
        })
    }, [modelData])

    const getItemsOptions = () => {
        return Object.entries(ITEM_ENUMS).map((entry) => {
            return {
                value: entry[0],
                label: entry[1]
            }
        })
    }

    const onSubmit = async (data) => {
        const formData = new FormData();
        Object.entries(data).forEach((entry) => {
            formData.append(entry[0], entry[1])
        })
        if (modelData) {
            formData.append('metadataId', modelData.id)
        }
        try {
            const response = await sendHttpRequest(MODELS_ROUTES.ADD_MODEL, 'POST', formData, {
                'Authorization': `Bearer ${contextValue.token}`,
                'Content-Type': `multipart/form-data`
            })
            if (response.status === 201){
                contextValue.socket.emit('new-model', {
                    modelNumber: response.data.model.modelNumber,
                    title: response.data.model.title
                })
                handleClose();
            }
        } catch(e) {
            console.log(e)
        }
    }

    const getModalActions = () => {
        return (
            <Stack
                direction="row"
                width="100%"
                flexDirection="row-reverse"
                columnGap={theme.spacing(4)}
            >
                <Stack
                    width="12.5%"
                >
                     <ButtonComponent
                        type="submit"
                        label={intl.formatMessage(buttonMessages.send)}
                        onClick={async () => {
                            const res = await methods.trigger();
                            if (res) {
                                onSubmit(methods.getValues())
                            }
                        }}
                    />
                </Stack>
                <Stack
                    width="12.5%"
                >
                    <ButtonComponent
                        label={intl.formatMessage(buttonMessages.close)}
                        onClick={() => handleClose()}
                    />
                </Stack>
            </Stack>
        )
    }

    const handleClose = () => {
        methods.setValue('modelNumber', '')
        methods.setValue('item', '')
        methods.setValue('setting', '')
        methods.setValue('mainStoneSize', '')
        methods.setValue('sideStoneSize', '')
        methods.setValue('title', '')
        methods.setValue('description', '')
        methods.setValue('model', null)
        props.onClose(true)
    }

    return (
        <ModalComponent
            open={props.open}
            onClose={() => {
                handleClose()
            }}
            title={intl.formatMessage(modelsPageMessages.createNewModel)}
            width="sm"
            actions={getModalActions()}
        >
            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <Stack
                        width="100%"
                        rowGap={theme.spacing(3)}
                        sx={{
                            direction: theme.direction
                        }}
                    >
                        <Stack
                            direction="row"
                            width="100%"
                            columnGap={theme.spacing(3)}
                        >
                            <FormTextFieldComponent
                                name="modelNumber"
                                type="text"
                                fieldLabel={intl.formatMessage(modelsPageMessages.modelNumber)}
                                onBlur={() => {}}
                            />
                            <FormSelectComponent
                                name="item"
                                fieldLabel={intl.formatMessage(modelsPageMessages.item)}
                                items={getItemsOptions()}
                                onChange={(value) => {
                                    methods.setValue('item', value)
                                }}
                            />
                        </Stack>
                        <FormTextFieldComponent
                            name="setting"
                            type="text"
                            fieldLabel={intl.formatMessage(modelsPageMessages.setting)}
                            onBlur={() => {}}
                        />
                        <Stack
                            width='100%'
                            direction="row"
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
                        <CenteredStack>
                            <ImageUploader
                                name="model"
                            />
                        </CenteredStack>
                    </Stack>
                </form>
            </FormProvider>
        </ModalComponent>
    )
}

export default CreateModelModal