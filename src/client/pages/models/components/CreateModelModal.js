import ModalComponent from '../../../components/UI/ModalComponent'
import { useIntl } from 'react-intl'
import { buttonMessages, formMessages, modelsPageMessages } from '../../../translations/i18n'
import { FormProvider, useForm } from "react-hook-form"
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

const CreateModelModal = (props) => {

    const intl = useIntl();
    const theme = useTheme();
    const contextValue = useContext(AppContext)

    const newModelValidationSchema = yup.object().shape({
        item: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        modelNumber: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        setting: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        sideStoneSize: yup.number().min(0).required(intl.formatMessage(formMessages.emptyFieldError)),
        mainStoneSize: yup.number().min(0).required(intl.formatMessage(formMessages.emptyFieldError)),
        title: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        description: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
    }).required()

    useEffect(() => {
        if (props.modelData) {
            methods.reset({
                item: props.modelData.item,
                setting: props.modelData.setting,
                mainStoneSize: props.modelData.mainStoneSize,
                sideStoneSize: props.modelData.sideStoneSize
            }
        ) } else {
            methods.reset({})
        }
    }, [props.modelData])

    useEffect(() => {
        if (props.modelData) {
            methods.reset({
                item: props.modelData.item,
                setting: props.modelData.setting,
                mainStoneSize: props.modelData.mainStoneSize,
                sideStoneSize: props.modelData.sideStoneSize
            }
        )
        }
    }, [props.modelData])


    const methods = useForm({
        resolver: yupResolver(newModelValidationSchema)
    });

    
    const getItemsOptions = () => {
        return Object.entries(ITEM_ENUMS).map((entry) => {
            return {
                value: entry[0],
                label: entry[1]
            }
        })
    }

    const onSubmit = async (data) => {
        const {model, ...rest} = data;
        const formData = new FormData();
        Object.entries(rest).forEach((entry) => {
            formData.append(entry[0], entry[1])
        })
        formData.append('model', data.model[0])
        try {
            const response = await axios.post('http://localhost:3002/model/newModel', formData, {
                headers: {
                    'Authorization': getAuthorizationHeader(contextValue.token),
                    'Content-Type': `multipart/form-data`
                }
            })
            if (response.status === 201){
                props.onAddNewModel(response.data.model)
            }
        } catch(e) {

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
                        onClick={() => props.onClose()}
                    />
                </Stack>
            </Stack>
        )
    }

    return (
        <ModalComponent
            open={props.open}
            onClose={() => props.onClose()}
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
                        />
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
                        <input
                            type="file"
                            {...methods.register('model', {required: true})}
                        />
                    </Stack>
                </form>
            </FormProvider>
        </ModalComponent>
    )
}

export default CreateModelModal