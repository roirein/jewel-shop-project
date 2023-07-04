import ModalComponent from "../../../components/UI/ModalComponent"
import { useIntl } from "react-intl"
import { buttonMessages, employeesPageMessages, formMessages, homePageMessages, ordersPageMessages } from "../../../translations/i18n"
import { FormProvider, useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Stack, useTheme, Stepper, Step, StepLabel } from "@mui/material";
import { useState, useContext, useRef } from "react";
import AppContext from '../../../context/AppContext'
import ButtonComponent from "../../../components/UI/ButtonComponent";
import axios from "axios";
import { getAuthorizationHeader } from "../../../utils/utils";
import CustomerDetails from "./order-steps/CustomerDetails";
import OrdersMenuComponent from "./order-steps/OrderTypesMenu";
import PersonalDesignOrderDetails from "./order-steps/order-detail/PersonalDesginForm";
import OrderSummary from "./order-steps/order-summary/OrderSummaryCOmponent";
import { useRouter } from "next/router";


const CreateOrderModal = (props) => {

    const intl = useIntl();
    const theme = useTheme();
    const router = useRouter();
    const contextValue = useContext(AppContext);
    const customerDetasilsFormRef = useRef();
    const orderDetailsFormRef = useRef()

    const [activeStep, setActiveStep] = useState(0);
    const [selectedOrderType, setSelectedOrderType] = useState(0);
    const [orderDetails, setOrderDetails] = useState({})

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

    console.log(orderDetails)

    const handleUpdateNextStep = (nextStep) => {
        const updatedSteps = [...steps];
        updatedSteps[activeStep].completed = true,
        setActiveStep(nextStep)
        setSteps(updatedSteps)
    }

    const onSubmitCustomerDetails = (data) => {
        setOrderDetails({
            ...orderDetails,
            ...data
        })
        handleUpdateNextStep(1)
    }

    const onSubmitOrderDetails = (data) => {
        setOrderDetails({
            ...orderDetails,
            ...data
        })
        handleUpdateNextStep(3)
    }


    const handleContinue = async () => {
        switch(activeStep) {
            case 0: 
                customerDetasilsFormRef.current.onSetCustomerDetails()
                break;
            case 1: 
                setOrderDetails({
                    ...orderDetails,
                    orderType: selectedOrderType
                })
                handleUpdateNextStep(2)
                break;
            case 2:
                orderDetailsFormRef.current.onSubmitOrderDetails();
                break
            default:
                break
        }
    }

    const handleClose = () => {
        setSelectedOrderType(0)
        setActiveStep(0),
        setSteps(initialSteps)
        props.onClose()
    }

    const onSubmit = async () => {
        const formData = new FormData()
        Object.entries(orderDetails).forEach((entry) => {
            if (entry[0] === 'design') {
                formData.append(entry[0], entry[1][0])
            } else {
                formData.append(entry[0], entry[1]);
            }
        })
        const response = await axios.post('http://localhost:3002/order/newOrder', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': getAuthorizationHeader(contextValue.token)
            }
        })
        if (response.status === 201) {
            handleClose()
            console.log(response.data)
            router.push(`orders/${response.data.dataValues.orderId}`)
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
                        onClick={() => handleClose()}
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
                            onClick={() => onSubmit()}
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
                {activeStep === 0 && (
                    <CustomerDetails
                        ref={customerDetasilsFormRef}
                        onSubmitCustomerDetails={(data) => onSubmitCustomerDetails(data)}
                    />
                )}
                {activeStep === 1 && (
                    <OrdersMenuComponent
                        onChooseOrder={(orderType) => setSelectedOrderType(orderType)}
                    />
                )}
                {activeStep === 2 && (
                    <>
                        {selectedOrderType === 1 && (
                            <PersonalDesignOrderDetails
                                ref={orderDetailsFormRef}
                                onSubmitOrderDetails={(data) => onSubmitOrderDetails(data)}
                            />
                        )}
                    </>
                )}
                {activeStep === 3 && (
                    <OrderSummary
                        orderType={selectedOrderType}
                        orderData={orderDetails}
                    />
                )}
            </Stack>
        </ModalComponent>
    )
}

export default CreateOrderModal