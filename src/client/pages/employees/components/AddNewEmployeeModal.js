import ModalComponent from "../../../components/UI/ModalComponent"
import { useIntl } from "react-intl"
import { buttonMessages, employeesPageMessages, formMessages, homePageMessages } from "../../../translations/i18n"
import { FormProvider, useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Stack, useTheme } from "@mui/system";
import { useState, useContext } from "react";
import FormSelectComponent from "../../../components/UI/Form/Inputs/FormSelectComponent";
import FormTextFieldComponent from '../../../components/UI/Form/Inputs/FormTextFieldComponent'
import { ROLES_ENUM } from "../../../const/Enums";
import ButtonComponent from "../../../components/UI/ButtonComponent";
import ErrorLabelComponent from "../../../components/UI/Form/Labels/ErrorLabelComponent";
import employeesApi from "../../../store/employees/employees-api";

const AddNewEmployeeModalComponent = (props) => {

    const intl = useIntl();
    const theme = useTheme();

    const newEmployeeValidationSchema = yup.object().shape({
        email: yup.string().email(intl.formatMessage(formMessages.emailError)).required(intl.formatMessage(formMessages.emptyFieldError)),
        firstName: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        lastName: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        phoneNumber: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)).matches(/^\d{10}$/, intl.formatMessage(formMessages.phoneError)),
        role: yup.string().required(intl.formatMessage(formMessages.emptyFieldError))
    }).required()

    const methods = useForm({
        resolver: yupResolver(newEmployeeValidationSchema)
    });
    
    const [newEmployeeError, setNewEmployeeError] = useState(null);

    const getRoleOptions = () => {
        const { 1: manager, 2: designManager, 3: productionManager, ...rest} = ROLES_ENUM;
        return Object.entries(rest).map((entry) => {
            return {
                value: entry[0],
                label: entry[1]
            }
        })
    }

    const clearFields = () => {
        methods.setValue('firstName', '')
        methods.setValue('lastName', '')
        methods.setValue('email', '')
        methods.setValue('phoneNumber', '')
        methods.setValue('role', '')
    }

    const handleClose = () => {
        clearFields()
        props.onClose();
    }

    const onSubmit = async (data) => {
        try {
            await employeesApi.addNewEmployee(data)
            clearFields()
            props.onClose()
        } catch (e) {
            if (e.response.status === 409) {
                setNewEmployeeError(intl.formatMessage(homePageMessages.userExistError))
            }
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

    return (
        <ModalComponent
            title={intl.formatMessage(employeesPageMessages.addNewEmployee)}
            onClose={handleClose}
            open={props.open}
            width="sm"
            actions={getModalActions()}
        >
            <FormProvider {...methods}>
                <form
                    id="employee-form"
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
                                name="email"
                                type="text"
                                fieldLabel={intl.formatMessage(formMessages.email)}
                                onBlur={() => setNewEmployeeError(null)}
                            />
                            <Stack
                                width='100%'
                                direction="row"
                                columnGap={theme.spacing(3)}
                            >
                                <FormTextFieldComponent
                                    name="firstName"
                                    type="text"
                                    fieldLabel={intl.formatMessage(formMessages.firstName)}
                                    onBlur={() => setNewEmployeeError(null)}
                                />
                                <FormTextFieldComponent
                                    name="lastName"
                                    type="text"
                                    fieldLabel={intl.formatMessage(formMessages.lastName)}
                                    onBlur={() => setNewEmployeeError(null)}
                                />
                            </Stack>
                            <FormTextFieldComponent
                                name="phoneNumber"
                                type="text"
                                fieldLabel={intl.formatMessage(formMessages.phoneNumber)}
                                onBlur={() => setNewEmployeeError(null)}
                            />
                            <FormSelectComponent
                                name="role"
                                fieldLabel={intl.formatMessage(employeesPageMessages.role)}
                                items={getRoleOptions()}
                                onChange={(value) => {
                                    methods.setValue('role', value)
                                }}
                            />
                    </Stack>
                </form>
            </FormProvider>
            {newEmployeeError && (
                <ErrorLabelComponent
                    label={newEmployeeError}
                />
            )}
        </ModalComponent>
    )
}

export default AddNewEmployeeModalComponent