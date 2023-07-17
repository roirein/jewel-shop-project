import axios from "axios"
import { getAuthorizationHeader, getUserToken } from "../../../utils/utils"
import { useIntl } from "react-intl"
import OrderSummaryComponent from "../components/OrderSummary"
import { useState, useEffect, useContext } from "react"
import AppContext from "../../../context/AppContext"
import { buttonMessages, modelsPageMessages, ordersPageMessages } from "../../../translations/i18n"
import { ITEM_ENUMS, METAL_ENUM, ORDER_STATUS, POSITIONS, SIZE_ENUM } from "../../../const/Enums"
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
import { MODELS_ROUTES, ORDERS_ROUTES } from "../../../utils/server-routes"
import { sendHttpRequest } from "../../../utils/requests"
import ModelCardComponent from "../../models/components/ModelCard"

const OrderPage = () => {

    const intl = useIntl();
    const theme = useTheme();
    const router = useRouter();
    const contextValue = useContext(AppContext);

    const [order, setOrder] = useState();
    const [imageUrl, setImageUrl] = useState();
    const [modelImageUrl, setModelImageUrl] = useState();
    const [orderSummary, setOrderSummary] = useState();
    const [showTaskModal, setShowTaskModal] = useState();
    const [showPriceOfferModal, setShowPriceOfferModal] = useState(false)
    const [tasks, setTasks] = useState([]);

    const fetchOrder = async () => {
        const orderId = router.query.orderId
        const response = await sendHttpRequest(ORDERS_ROUTES.GET_ORDER(orderId), "GET", {}, {
            Authorization: `Bearer ${contextValue.token}`
        })
        return response.data.order
    }

    useEffect(() => {
        fetchOrder().then((order) => setOrder(order));        
    }, [])

    useEffect(() => {
        if (order?.type === 1) {
            sendHttpRequest(ORDERS_ROUTES.IMAGE(order.design), 'GET', {}, {
                Authorization: `Bearer ${contextValue.token}`
            }, 'blob').then((res) => {
                const image = URL.createObjectURL(res.data)
                setImageUrl(image)
            })
        }
    }, [order])

    useEffect(() => {
        if (order?.status > 2 && order?.type !== 3) {
            sendHttpRequest(MODELS_ROUTES.IMAGE(order.image), 'GET', {}, {
                Authorization: `Bearer ${contextValue.token}`
            }, 'blob').then((res) => {
                const image = URL.createObjectURL(res.data)
                setModelImageUrl(image)
            }) 
        }
    }, [order])

    useEffect(() => {
        const detailsProps = {}
        if (order?.type === 3) {
            detailsProps['description'] = order?.description
        } else {
            detailsProps['size'] = order?.size
            detailsProps['metal'] = METAL_ENUM[order?.metal]
            if (order?.type === 1) {
                detailsProps['setting'] = order?.setting;
                detailsProps['sideStoneSize'] = order?.sideStoneSize
                detailsProps['mainStoneSize'] = order?.mainStoneSize
            }
            // if (props.order['type'] === 2) {
            //     detailsProps['price'] = props.order['price']
            // }
        }
       setOrderSummary(detailsProps)
    }, [order])

    useEffect(() => {
        if (order?.status === 8 && contextValue.permissionLevel === 3) {
            sendHttpRequest(ORDERS_ROUTES.TASKS(order?.orderId), 'GET', null, {
                Authorization: `Bearer ${contextValue.token}`
            }).then((response) => {
                const tasksData = response.data.tasks.map((task, index) => {
                    return {
                        index: index + 1,
                        employee: task.employeeName,
                        description: task.description,
                        position: POSITIONS[task.position],
                        isCompleted: task.isCompleted
                    }
                })
                setTasks(tasksData)
            })
        }
    }, [order])


    useEffect(() => {
        if (order?.status === 8 && contextValue.permissionLevel === 4) {
            sendHttpRequest(ORDERS_ROUTES.TASK_BY_EMPLOYEE(order?.orderId, contextValue.userId), 'GET', null, {
                Authorization: `Bearer ${contextValue.token}`
            }).then((response) => {
                const taskData = response.data.task
                const result =  {
                        index: 1,
                        taskId: taskData.taskId,
                        employee: taskData.employeeName,
                        description: taskData.description,
                        position: POSITIONS[taskData.position],
                        isCompleted: taskData.isCompleted,
                        isBlocked: taskData.isBlocked
                    }
                setTasks([result])
            })
        }
    }, [order])

    const handleCloseTasksModal = (toFetchOrder) => {
        setShowTaskModal(false);
        if (toFetchOrder) {
            fetchOrder().then((order) => setOrder(order))
        }
    }

    const sendOrderToDesign = () => {
        contextValue.socket.emit('new-design', {
            orderId: order?.orderId
        })

        fetchOrder().then((order) => setOrder(order))
    }

    const sendOrderToCustomerApproval = () => {
        contextValue.socket.emit('customer-design-complete', {
            orderId: order?.orderId
        })

        fetchOrder().then((order) => setOrder(order))
    }

    const approveOrderByCustomer = (price) => {
        contextValue.socket.emit('customer-order-approval', {
            price,
            orderId: order.orderId
        })

        fetchOrder().then((order) => setOrder(order))
    }

    const sendOrderToCasting = () => {
        contextValue.socket.emit('casting-start', {
            orderId: order.orderId
        })

        fetchOrder().then((order) => setOrder(order))
    }

    const completeCasting = () => {
        contextValue.socket.emit('casting-end', {
            orderId: order.orderId
        })

        fetchOrder().then((order) => setOrder(order))
    }

    const sendOrderToProduction = () => {
        contextValue.socket.emit('production-start', {
            orderId: order.orderId
        })

        fetchOrder().then((order) => setOrder(order))
    }

    const completeTask = () => {
        contextValue.socket.emit('task-complete', {
            orderId: order.orderId,
            username: contextValue.name,
            taskId: tasks[0].taskId
        })

        fetchOrder().then((order) => setOrder(order))
    }

    const completeProduction = () => {
        contextValue.socket.emit('production-end', {
            orderId: order.orderId
        })

        fetchOrder().then((order) => setOrder(order))
    }

    const updateCustomer = () => {
        contextValue.socket.emit('order-ready', {
            orderId: order.orderId
        })

        fetchOrder().then((order) => setOrder(order))
    }

    const completeOrder = () => {
        contextValue.socket.emit('order-complete', {
            orderId: order.orderId
        })

        fetchOrder().then((order) => setOrder(order))
    }

    const sendPriceOffer = (price) => {
        contextValue.socket.emit('price-offer', {
            price,
            orderId: order.orderId
        })
        setShowPriceOfferModal(false)
        fetchOrder().then((order) => setOrder(order))
    }

    return (
        <CenteredStack
            width="100%"
            sx={{
                direction: theme.direction
            }}
        >
            <Stack
                direction="row"
                columnGap={theme.spacing(8)}
            >
                <Stack>
                    <CustomerDetails
                        customerName={order?.customerName}
                        email={order?.email}
                        phoneNumber={order?.phoneNumber}
                    />
                    {order?.type === 1 && (
                        <Stack
                            columnGap={theme.spacing(4)}
                        >
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                            >
                                {intl.formatMessage(ordersPageMessages.design)}
                            </Typography>
                            <img
                                width="150px"
                                height="150px"
                                src={imageUrl}
                            />
                        </Stack>
                    )}
                </Stack>
                <Stack>
                    <OrderDeatils
                        orderType={order?.type}
                        item={ITEM_ENUMS[order?.item]}
                        casting={order?.casting}
                        comments={order?.comments !== 'undefined' ? order?.comments : ''}
                        deadline={new Date(order?.deadline).toLocaleDateString('he-IL')}
                        {...orderSummary}
                    />
                </Stack>
                {order?.status > 2 && order?.type !== 3 && (
                    <Stack
                        rowGap={theme.spacing(3)}
                    >
                        <ModelCardComponent
                            image={modelImageUrl}
                            title={order.title}
                            description={order.description}
                        />
                        <Typography>
                                {`${intl.formatMessage(modelsPageMessages.materials)}: ${order.materials}`}
                        </Typography>
                        {contextValue.permissionLevel !== 5 && (
                            <Stack
                                rowGap={theme.spacing(3)}
                            >
                                <Typography>
                                        {`${intl.formatMessage(modelsPageMessages.priceWithMaterials)}: ${order.priceWithMaterials}`}
                                </Typography>
                                <Typography>
                                        {`${intl.formatMessage(modelsPageMessages.priceWithoutMaterials)}: ${order.priceWithoutMaterials}`}
                                </Typography>
                            </Stack>
                        )}
                    </Stack>
                )}
            </Stack>
            <Stack
                direction="row"
                sx={{
                    mt: theme.spacing(3)
                }}
                columnGap={theme.spacing(4)}
            >
                <Stack
                    direction="row"
                    columnGap={theme.spacing(2)}
                >
                    <Typography
                        variant="body1"
                        fontSize="22px"
                    >
                        {`${intl.formatMessage(modelsPageMessages.status)}:`}
                    </Typography>
                    <Typography
                        varinat="body1"
                        fontWeight="bold"
                        fontSize="22px"
                    >
                        {ORDER_STATUS[order?.status]}
                    </Typography>
                </Stack>
                {order?.price && (
                    <Stack
                        direction="row"
                        columnGap={theme.spacing(2)}
                    >
                        <Typography
                            variant="body1"
                            fontSize="22px"
                        >
                            {`${intl.formatMessage(ordersPageMessages.price)}:`}
                        </Typography>
                        <Typography
                            varinat="body1"
                            fontWeight="bold"
                            fontSize="22px"
                        >
                            {order?.price}
                        </Typography>
                    </Stack>
                )}
            </Stack>
            {contextValue.permissionLevel === 1 && (
                <>
                    {order?.status === 0 && (
                        <Stack
                            direction="row"
                            columnGap={theme.spacing(4)}
                            sx={{
                                mt: theme.spacing(4)
                            }}
                            width="35%"
                        >
                            {order?.type === 1 && (
                                <ButtonComponent
                                    label={intl.formatMessage(ordersPageMessages.sendToDesignManager)}
                                    onClick={() => sendOrderToDesign()}
                                />
                            )}
                            {order?.type === 3 && (
                                <ButtonComponent
                                    label={intl.formatMessage(ordersPageMessages.priceOffer)}
                                    onClick={() => setShowPriceOfferModal(true)}
                                />
                            )}
                            <ButtonComponent
                                label={intl.formatMessage(ordersPageMessages.rejectOrder)}
                                onClick={() => {}}
                            />
                        </Stack>
                    )}
                    {order?.status === 3 && (
                        <Stack
                            direction="row"
                            columnGap={theme.spacing(2)}
                        >
                            <ButtonComponent
                                label={intl.formatMessage(ordersPageMessages.sendToCustomerApproval)}
                                onClick={() => sendOrderToCustomerApproval()}
                            />
                        </Stack>
                    )}
                    {order?.status === 5 && (
                        <Stack
                            width="20%"
                        >
                            {order?.type !== 3 && (
                                <>
                                    {order?.casting && (
                                        <ButtonComponent
                                            label={intl.formatMessage(ordersPageMessages.sendOrderToCasting)}
                                            onClick={() => sendOrderToCasting()}
                                        />
                                    )}
                                </>
                            )}
                            {order?.type === 3 && (
                                <Stack
                                    width="20%"
                                >
                                    <ButtonComponent
                                        label={intl.formatMessage(ordersPageMessages.sendOrderToProduction)}
                                        onClick={() => sendOrderToProduction()}
                                    />
                                </Stack>
                            )}
                        </Stack>
                    )}
                    {order?.status === 6 && (
                        <Stack
                            width="20%"
                        >
                            {order?.casting && (
                                <ButtonComponent
                                    label={intl.formatMessage(ordersPageMessages.completeCasting)}
                                    onClick={() => completeCasting()}
                                />
                            )}
                        </Stack>
                    )}
                    {order?.status === 7 && (
                        <Stack
                            width="20%"
                        >
                            <ButtonComponent
                                label={intl.formatMessage(ordersPageMessages.sendOrderToProduction)}
                                onClick={() => sendOrderToProduction()}
                            />
                        </Stack>
                    )}
                    {order?.status === 9 && (
                        <Stack
                            width="20%"
                        >
                            <ButtonComponent
                                label={intl.formatMessage(ordersPageMessages.updateCustomer)}
                                onClick={() => updateCustomer()}
                            />
                        </Stack>
                    )}
                    {order?.status === 10 && (
                        <Stack
                            width="20%"
                        >
                            <ButtonComponent
                                label={intl.formatMessage(ordersPageMessages.completeOrder)}
                                onClick={() => completeOrder()}
                            />
                        </Stack>
                    )}
                    
                </>
            )}
            {contextValue.permissionLevel === 3 && (
                <>
                    {tasks.length === 0 && order?.status === 8 && (
                        <Stack
                            width="20%"
                        >
                            <ButtonComponent
                                label={intl.formatMessage(ordersPageMessages.defineTasks)}
                                onClick={() => setShowTaskModal(true)}
                            />
                        </Stack>
                    )}
                    {tasks.length > 0 && order?.status === 8 && (
                        <Stack
                            width="50%"
                            columnGap={theme.spacing(3)}
                        >
                            <TaskSummaryComponent
                                showStatus
                                tasks={tasks}
                            />
                            <Stack
                                width="20%"
                                sx={{
                                    margin: '0 auto'
                                }}
                            >
                                <ButtonComponent
                                    label={intl.formatMessage(ordersPageMessages.completeProduction)}
                                    onClick={() => completeProduction()}
                                    disabled={!(tasks.every((task) => task.isCompleted))}
                                />
                            </Stack>
                        </Stack>
                    )}
                </>
            )}
            {contextValue.permissionLevel === 4 && (
                <>
                    {tasks.length > 0 && (
                        <Stack
                            width="50%"
                            columnGap={theme.spacing(3)}
                        >
                            <TaskSummaryComponent
                                showStatus
                                tasks={tasks}
                            />
                            <CenteredStack
                                width="20%"
                                sx={{
                                    margin: '0 auto'
                                }}
                            >
                                <ButtonComponent
                                    label={intl.formatMessage(ordersPageMessages.completeTask)}
                                    onClick={() => completeTask()}
                                    disabled={tasks[0].isBlocked || tasks[0].isCompleted}
                                />
                            </CenteredStack>
                        </Stack>
                    )}
                </>
            )}
            {contextValue.permissionLevel === 5 && (
                <>
                    {order?.status === 4 && (
                        <Stack
                            direction="row"
                            columnGap={theme.spacing(4)}
                            sx={{
                                mt: theme.spacing(4)
                            }}
                            width="20%"
                        >
                            {order?.type === 1 && (
                                <>
                                    <ButtonComponent
                                        label={`${intl.formatMessage(modelsPageMessages.priceWithMaterials)}: ${order.priceWithMaterials}`}
                                        onClick={() => approveOrderByCustomer(order.priceWithMaterials)}
                                    />
                                    <ButtonComponent
                                        label={`${intl.formatMessage(modelsPageMessages.priceWithoutMaterials)}: ${order.priceWithoutMaterials}`}
                                        onClick={() => approveOrderByCustomer(order.priceWithoutMaterials)}
                                    />
                                </>
                            )}
                            {order?.type === 3 && (
                                <>
                                    <Stack
                                        direction="row"
                                        sx={{
                                            direction: theme.direction
                                        }}
                                        columnGap={theme.spacing(2)}
                                    >
                                        <Typography
                                            variant="body1"
                                            fontSize="22px"
                                        >
                                            {`${intl.formatMessage(ordersPageMessages.priceOffer)}:`}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            fontSize="22px"
                                            fontWeight="bold"
                                        >
                                            {order?.priceOffer}
                                        </Typography>
                                    </Stack>
                                    <ButtonComponent
                                        label={intl.formatMessage(buttonMessages.approve)}
                                        onClick={() => approveOrderByCustomer(order?.priceOffer)}
                                    />
                                </>
                            )}
                            <ButtonComponent
                                label={intl.formatMessage(ordersPageMessages.rejectOrder)}
                                onClick={() => {}}
                            />
                        </Stack>
                    )}
                </>
            )}
            {contextValue.permissionLevel === 3 && tasks.length === 0 && (
                <CreateTasksModal
                    open={showTaskModal}
                    onClose={(fetchOrder) => handleCloseTasksModal(fetchOrder)}
                />
            )}
            {contextValue.permissionLevel === 1 && order?.type === 3 && order?.status === 0 && (
                <PriceOfferModal
                    open={showPriceOfferModal}
                    onClose={() => setShowPriceOfferModal(false)}
                    onSend={(data) => sendPriceOffer(data.price)}
                />
            )}
        </CenteredStack>
    )
}

export default OrderPage
