import { Stack, useTheme } from "@mui/material"
import {useForm, FormProvider} from 'react-hook-form'
import FormTextAreaComponent from "../../../../components/UI/Form/Inputs/FormTextAreaComponent"
import axios from 'axios'
import { useIntl } from "react-intl"
import { useEffect, useState, useContext, forwardRef, useImperativeHandle } from "react"
import AppContext from '../../../../context/AppContext'
import {getAuthorizationHeader} from '../../../../utils/utils'
import FormSelectComponent from "../../../../components/UI/Form/Inputs/FormSelectComponent"
import { employeesPageMessages, formMessages, modelsPageMessages } from "../../../../translations/i18n"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

const TaskFormComponent = forwardRef((props, ref) => {
    const intl = useIntl()

    const taskValidationSchema = yup.object().shape({
        employee: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        description: yup.string().required(intl.formatMessage(formMessages.emptyFieldError))
    }).required()

    const methods = useForm({
        resolver: yupResolver(taskValidationSchema)
    });
    const theme = useTheme();
    const contextValue = useContext(AppContext)
    

    useImperativeHandle(ref, () => ({
        createTask: () => {
            methods.trigger().then((res) => {
                if (res) {
                    props.onCreateNewTask(methods.getValues());
                    methods.setValue('description', '')
                    methods.setValue('employee', null)
                }
            })
        }
    }))

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
                >
                    <Stack
                        rowGap={theme.spacing(3)}
                    >
                        <FormSelectComponent
                            name="employee"
                            fieldLabel={intl.formatMessage(employeesPageMessages.employeeName)}
                            items={props.employees}
                        />
                        <FormTextAreaComponent
                            name="description"
                            onBlur={() => {}}
                            fieldLabel={intl.formatMessage(modelsPageMessages.description)}
                        />
                    </Stack>
                </form>
            </FormProvider>
        </Stack>
    )
})

export default TaskFormComponent