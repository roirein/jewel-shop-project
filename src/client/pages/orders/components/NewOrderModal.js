import ModalComponent from "../../../components/UI/ModalComponent"
import { useIntl } from "react-intl"
import { buttonMessages, employeesPageMessages, formMessages, homePageMessages, ordersPageMessages } from "../../../translations/i18n"
import { FormProvider, useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Stack, useTheme, Stepper, Step, StepLabel } from "@mui/material";
import { useState, useContext } from "react";
import AppContext from '../../../context/AppContext'
import FormSelectComponent from "../../../components/UI/Form/Inputs/FormSelectComponent";
import FormTextFieldComponent from '../../../components/UI/Form/Inputs/FormTextFieldComponent'
import { ROLES_ENUM } from "../../../const/Enums";
import ButtonComponent from "../../../components/UI/ButtonComponent";
import axios from "axios";
import { getAuthorizationHeader } from "../../../utils/utils";
import CustomerDetails from "./order-steps/CustomerDetails";
import OrdersMenuComponent from "./order-steps/OrderTypesMenu";
import PersonalDesignOrderDetails from "./order-steps/order-detail/PersonalDesginForm";
import OrderSummary from "./order-steps/order-summary/OrderSummaryCOmponent";

const CreateOrderModal = (props) => {

    const intl = useIntl();
    const theme = useTheme();
    const contextValue = useContext(AppContext)

    const [activeStep, setActiveStep] = useState(0);
    const [selectedOrderType, setSelectedOrderType] = useState(0);

    const initialSteps = [
        {
            id: 1,
            label: intl.formatMessage(ordersPageMessages.customerDetails),
            completed: false,
        },
        {
            id: 2,
            label: intl.formatMessage(ordersPageMessages.orderType),
            completed: false,
        },
        {
            id: 3,
            label: intl.formatMessage(ordersPageMessages.orderDeatils),
            completed: false,
        },
        {
            id: 4,
            label: intl.formatMessage(ordersPageMessages.orderSummary),
            completed: false,
        }
    ]

    const [steps, setSteps] = useState(initialSteps);
    const orderDetailsValidationSchema = yup.object().shape({
        email: yup.string().email(intl.formatMessage(formMessages.emailError)).required(intl.formatMessage(formMessages.emptyFieldError)),
        customerName:  yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        phoneNumber: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)).matches(/^\d{10}$/, intl.formatMessage(formMessages.phoneError)),
        deadline: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        item: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        size: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        metal: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        setting: yup.string().required(intl.formatMessage(formMessages.emptyFieldError)),
        sideStoneSize: yup.number().min(0).required(intl.formatMessage(formMessages.emptyFieldError)),
        mainStoneSize: yup.number().min(0).required(intl.formatMessage(formMessages.emptyFieldError)),
    })

    const methods = useForm({
        resolver: yupResolver(orderDetailsValidationSchema)
    });

    const handleContinue = async () => {
        switch(activeStep) {
            case 0: 
                const customerDetailsRes = await methods.trigger(['email', 'customerName', 'phoneNumber', 'deadline'])
                if (customerDetailsRes) {
                    const updatedSteps = [...steps]
                    updatedSteps[activeStep].completed = true
                    setActiveStep(1)
                    setSteps(updatedSteps)
                }
                break;
            case 1: 
                const updatedSteps = [...steps]
                updatedSteps[activeStep].completed = true
                setActiveStep(2)
                setSteps(updatedSteps)
            case 2: 
                const orderDetailsRes = await methods.trigger(['item', 'size', 'metal', 'setting', 'mainStoneSize', 'sideStoneSize'])
                if (orderDetailsRes) {
                    const updatedSteps = [...steps]
                    updatedSteps[activeStep].completed = true
                    setActiveStep(3)
                    setSteps(updatedSteps)
                }
            default:
                break
        }
    }
    

    const getModalActions = () => {
        return (
            <Stack
                direction="row"
                width="100%"
            >
                <Stack
                    width="12.5%"
                    justifyContent="left"
                >
                    <ButtonComponent
                        onClick={() => props.onClose()}
                        label={intl.formatMessage(buttonMessages.close)}
                    >
                    </ButtonComponent>
                </Stack>
                <Stack
                    direction="row"
                    columnGap={theme.spacing(3)}
                    width="12%"
                    justifyContent="right"
                    sx={{
                        ml: 'auto'
                    }}
                >
                    {activeStep > 0 && (
                        <ButtonComponent
                            label={intl.formatMessage(buttonMessages.goBack)}
                            onClick={() => {}}
                        /> 
                    )}
                    {activeStep < steps.length - 1 && (
                        <ButtonComponent
                            label={intl.formatMessage(buttonMessages.continue)}
                            onClick={() => handleContinue()}
                            disabled={activeStep === 1 && selectedOrderType === 0}
                        />
                    )}
                    {activeStep === steps.length - 1 && (
                        <ButtonComponent
                            label={intl.formatMessage(buttonMessages.send)}
                            onClick={() => {}}
                        />
                    )}
                </Stack>
            </Stack>
        )
    }

    return (
        <ModalComponent
            title={intl.formatMessage(ordersPageMessages.createNewOrder)}
            onClose={props.onClose}
            open={props.open}
            width="md"
            actions={getModalActions()}
        >
            <Stepper
                activeStep={activeStep}
            >
                {steps.map((step) => (
                    <Step key={step.id}>
                        <StepLabel>
                            {step.label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
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
                            {activeStep === 0 && (
                                <CustomerDetails/>
                            )}
                            {activeStep === 1 && (
                                <OrdersMenuComponent
                                    onChooseOrder={(orderType) => setSelectedOrderType(orderType)}
                                />
                            )}
                            {activeStep === 2 && (
                                <>
                                    {selectedOrderType === 1 && (
                                        <PersonalDesignOrderDetails/>
                                    )}
                                </>
                            )}
                            {activeStep === 3 && (
                                <OrderSummary
                                    orderType={selectedOrderType}
                                />
                            )}
                        </Stack>
                    </form>
                </FormProvider>
            </Stack>
        </ModalComponent>
    )
}

export default CreateOrderModal