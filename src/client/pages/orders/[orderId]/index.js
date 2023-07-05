import axios from "axios"
import { getAuthorizationHeader, getUserToken } from "../../../utils/utils"
import { useIntl } from "react-intl"
import OrderSummaryComponent from "../components/OrderSummary"
import { useState, useEffect, useContext } from "react"
import AppContext from "../../../context/AppContext"
import { ordersPageMessages } from "../../../translations/i18n"
import { ITEM_ENUMS, METAL_ENUM, SIZE_ENUM } from "../../../const/Enums"
import { Stack, Typography, useTheme } from "@mui/material"
import ButtonComponent from "../../../components/UI/ButtonComponent"
import OrderModelData from "../components/OrderModelData"
import CreateTasksModal from "../components/tasks/CreateTasksModal"
import TaskSummaryComponent from "../components/tasks/TasksSummary"
import CustomerDetails from "../components/order-summary/CustomerDetails"
import OrderDeatils from "../components/order-summary/OrderDetails"
import { useRouter } from "next/router"
import CenteredStack from "../../../components/UI/CenteredStack"
import ModelComponent from "../components/order-steps/existing-model-odrer/ModelComponent"
import PriceOfferModal from "./OfferPriceModal"

const OrderPage = (props) => {

    const intl = useIntl();
    const theme = useTheme()
    const router = useRouter()
    const [imageUrl, setImageUrl] = useState('');
    const [showPriceOfferModal, setShowPriceOfferModal] = useState(false)
    const [showTaskModal, setShowTaskModal] = useState(false)
    const contextValue = useContext(AppContext);
    const [tasks, setTasks] = useState([])
    const [orderSummary, setOrderSummary] = useState();

    useEffect(() => {
        if (props.order['type'] === 1) {
            axios.get(`http://localhost:3002/order/image/${props.order['design']}`, {
                headers: {
                    Authorization: getAuthorizationHeader(contextValue.token)
                },
                responseType: 'blob'
            }).then((res) => {
                const image = URL.createObjectURL(res.data);
                setImageUrl(image)
            })
        }
    }, [])

    useEffect(() => {
        if ((contextValue.permissionLevel === 1 || contextValue.permissionLevel === 3) && props.order['status'] === 6) {
            axios.get(`localhost:3002/order/tasks/${props.order['orderId']}`, {
                headers: {
                    Authorization: getAuthorizationHeader(contextValue.token)
                }
            }).then((res) => setTasks(res.data.task))
        }
    }, [props.order])

    const sendOrderToDesignManager = () => {
        contextValue.socket.emit('new-design', {
            orderId: props.order['orderId']
        })
        router.push('/orders/design')
    }

    useEffect(() => {
        const detailsProps = {}
        if (props.order['type']=== 3) {
            detailsProps['description'] = props.order['description']
        } else {
            detailsProps['size'] = props.order['size']
            detailsProps['metal'] = props.order['metal']
            if (props.order['type'] === 1) {
                detailsProps['setting'] = props.order['setting'];
                detailsProps['sideStoneSize'] = props.order['sideStoneSize']
                detailsProps['mainStoneSize'] = props.order['mainStoneSize']
            }
            if (props.order['type'] === 2) {
                detailsProps['price'] = props.order['price']
            }
        }
       setOrderSummary(detailsProps)
    }, [])

    const getShowPriceDataInModel = () => {
        if (props.order['type'] === 2) {
            return true
        }
        if (contextValue.permissionLevel !== 5) {
            return true
        } else {
            if (props['order'].status === 2) {
                return false
            }
        }
        return true
    }

    const onChoosePrice = (price) => {
        contextValue.socket.emit('customer-approval', {
            orderId: props.order['orderId'],
            price,
            casting: props.order['casting']
        })
        router.push('/orders')
    }

    const updateCastingStatus = (castingStatus) => {
        contextValue.socket.emit('update-casting-status', {
            orderId: props.order['orderId'],
            castingStatus: castingStatus
        })
        router.push('/orders/casting')
    }

    return (
        <CenteredStack
            width="100%"
        >
            <Stack
                width='fit-content'
                sx={{
                    mt: theme.spacing(4),
                    direction: theme.direction
                }}
                direction="row"
                columnGap={theme.spacing(4)}
            >
             {props.order['type'] === 1 && (
                    <Stack
                        columnGap={theme.spacing(4)}
                    >
                        <Typography
                            variant="h5"
                        >
                            {intl.formatMessage(ordersPageMessages.design)}
                        </Typography>
                        <img
                            width="300px"
                            height="300px"
                            src={imageUrl}
                        />
                    </Stack>
                )}
                {props.order['status'] >= 2 && props.order['type'] !== 3 && (
                    <ModelComponent
                        image={props.order['image']}
                        title={props['order'].title}
                        description={props.order['description']}
                        selected
                        onClick={() => {}}
                        price={getShowPriceDataInModel()}
                        materials={props.order['materials']}
                        priceWith={props.order['priceWithMaterials']}
                        priceWithout={props.order['priceWithoutMaterials']}
                        onClickPrice={(price) => onChoosePrice(price)}
                    />
                )}
                <CustomerDetails
                    customerName={props.order['customerName']}
                    email={props.order['email']}
                    phoneNumber={props.order['phoneNumber']}
                />
                <OrderDeatils
                    orderType={props.order['type']}
                    item={ITEM_ENUMS[props.order['item']]}
                    casting={props.order['casting']}
                    comments={props.order['comments'] !== 'undefined' ? props.order['comments'] : ''}
                    deadline={new Date(props.order['deadline']).toLocaleDateString('he-IL')}
                    {...orderSummary}
                />
            </Stack>
            <Stack>
               {contextValue.permissionLevel === 1 && (
                <>
                    {props.order['status'] === 0 && props.order['type'] === 1 && (
                        <CenteredStack
                            width="100%"
                            height="40px"
                            sx={{
                                mt: theme.spacing(4)
                            }}
                        >
                            <ButtonComponent
                                label={intl.formatMessage(ordersPageMessages.sendToDesignManager)}
                                onClick={() => sendOrderToDesignManager()}
                            />
                        </CenteredStack>
                    )}
                    {props.order['status'] === 0 && props.order['type'] === 3 && !props.order['priceOffer'] && (
                        <CenteredStack
                            width="100%"
                            height="40px"
                            sx={{
                                mt: theme.spacing(4)
                            }}
                        >
                            <ButtonComponent
                                label={intl.formatMessage(ordersPageMessages.priceOffer)}
                                onClick={() => setShowPriceOfferModal(true)}
                            />
                        </CenteredStack>
                    )}
                    {props.order['status'] === 1 && (
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            {intl.formatMessage(ordersPageMessages.orderInDesign)}
                        </Typography>
                    )}
                    {props.order['status'] === 3 && (
                        <>
                            {props.order['casting'] && (
                                <CenteredStack
                                    width="100%"
                                    height="40px"
                                    sx={{
                                        mt: theme.spacing(4)
                                    }}
                                >
                                    <ButtonComponent
                                        label={intl.formatMessage(ordersPageMessages.sendOrderToCasting)}
                                        onClick={() => updateCastingStatus(2)}
                                    />
                                </CenteredStack>
                            )}
                            {!props.order['casting'] && (
                                <CenteredStack
                                    width="100%"
                                    height="40px"
                                    sx={{
                                        mt: theme.spacing(4)
                                    }}
                                >
                                    <ButtonComponent
                                        label={intl.formatMessage(ordersPageMessages.sendOrderToProduction)}
                                        onClick={() => {
                                            contextValue.socket.emit('send-order-to-production', {
                                                orderId: props.order['orderId'],
                                                status: 6
                                            })
                                            router.push('/orders/production')
                                        }}
                                    />
                                </CenteredStack>
                            )}
                        </>
                    )}
                    {props.order['status'] === 4 && (
                        <>
                            {props.order['casting'] && (
                                <CenteredStack
                                    width="100%"
                                    height="40px"
                                    sx={{
                                        mt: theme.spacing(4)
                                    }}
                                >
                                    <ButtonComponent
                                        label={intl.formatMessage(ordersPageMessages.completeCasting)}
                                        onClick={() => updateCastingStatus(3)}
                                    />
                                </CenteredStack>
                            )}
                        </>
                    )}
                    {(props.order['status'] === 5) && (
                        <>
                            {props.order['casting'] && (
                                <CenteredStack
                                    width="100%"
                                    height="40px"
                                    sx={{
                                        mt: theme.spacing(4)
                                    }}
                                >
                                    <ButtonComponent
                                        label={intl.formatMessage(ordersPageMessages.sendOrderToProduction)}
                                        onClick={() => {
                                            contextValue.socket.emit('send-order-to-production', {
                                                orderId: props.order['orderId'],
                                                status: 6
                                            })
                                            router.push('/orders/production')
                                        }}
                                    />
                                </CenteredStack>
                            )}
                        </>
                    )}
                </>
               )}
               {contextValue.permissionLevel === 5 && (
                    <>
                        {props.order['status'] === 0 && props.order['priceOffer'] && (
                            <CenteredStack
                                width="100%"
                                height="40px"
                                sx={{
                                    mt: theme.spacing(4)
                                }}
                            >
                                <Typography>
                                    {`${intl.formatMessage(ordersPageMessages.priceOffer)}: ${props.order['priceOffer']}`}
                                </Typography>
                                <ButtonComponent
                                    label={intl.formatMessage(ordersPageMessages.acceptPriceOffer)}
                                    onClick={() => {
                                        contextValue.socket.emit('accept-price-offer', {
                                            orderId: props.order['orderId'],
                                            price: props.order['priceOffer']
                                        })
                                    }}
                                />
                            </CenteredStack>                   
                        )}
                    </>
               )}
            </Stack>
            {contextValue.permissionLevel === 3 && props.order['status'] === 6 (
                <CenteredStack
                    width="100%"
                    height="40px"
                    sx={{
                        mt: theme.spacing(4)
                    }}
                >
                    <ButtonComponent
                        label={intl.formatMessage(ordersPageMessages.defineTasks)}
                        onClick={() => setShowTaskModal(true)}
                    />
                </CenteredStack>
            )}
            {contextValue.permissionLevel === 1 && props.order['type'] === 3 && (
                <PriceOfferModal
                    open={showPriceOfferModal}
                    onClose={() => setShowPriceOfferModal(false)}
                    onSend={(data) => {
                        console.log(data.price)
                        contextValue.socket.emit('send-price-offer', {
                            price: data.price,
                            orderId: props.order['orderId']
                        })
                        router.push('/orders')
                    }}
                />
            )}
            {contextValue.permissionLevel === 3 && (
                <CreateTasksModal
                    open={showTaskModal}
                    onClose={() => setShowTaskModal(false)}
                />
            )}
        </CenteredStack>
    )
}

export default OrderPage

export const getServerSideProps = async (context) => {
    const token = getUserToken(context.req.headers.cookie)
    const response = await axios.get(`http://localhost:3002/order/order/${context.params.orderId}`, {
        headers: {
            Authorization: getAuthorizationHeader(token)
        }
    })


    return {
        props: {
            order: response.data.order
        }
    }
}