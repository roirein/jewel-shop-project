import { useIntl } from "react-intl"
import { useState, useEffect, useContext } from "react"
import AppContext from "../../../context/AppContext"
import { buttonMessages, modelsPageMessages, ordersPageMessages } from "../../../translations/i18n"
import { ITEM_ENUMS, METAL_ENUM, ORDER_STATUS, POSITIONS, SIZE_ENUM } from "../../../const/Enums"
import { Stack, Typography, useTheme } from "@mui/material"
import ButtonComponent from "../../../components/UI/ButtonComponent"
import CreateTasksModal from "../components/tasks/CreateTasksModal"
import TaskSummaryComponent from "../components/tasks/TasksSummary"
import CustomerDetails from "../components/order-summary/CustomerDetails"
import OrderDeatils from "../components/order-summary/OrderDetails"
import { useRouter } from "next/router"
import CenteredStack from "../../../components/UI/CenteredStack"
import PriceOfferModal from "./OfferPriceModal"
import ModelCardComponent from "../../models/components/ModelCard"
import ordersApi from "../../../store/orders/orders-api"
import notifcationsApi from "../../../store/notifications/notification-api"
import { useSelector } from "react-redux"
import userApi from "../../../store/user/user-api"

const OrderPage = () => {

    const intl = useIntl();
    const theme = useTheme();
    const router = useRouter();

    const [order, setOrder] = useState();
    const user = useSelector((state) => userApi.getUser(state))
    const [orderSummary, setOrderSummary] = useState();
    const [showTaskModal, setShowTaskModal] = useState();
    const [showPriceOfferModal, setShowPriceOfferModal] = useState(false)
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if (user.token && router.query.orderId) {
            ordersApi.loadOrder(router.query.orderId).then((order) => {
                setOrder(order)
                notifcationsApi.readNotification(router.query.orderId, 'order')
            })  
        } 
    }, [user.token, router.query.orderId])

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
        }
       setOrderSummary(detailsProps)
    }, [order])

    useEffect(() => {
        if (order?.status === 8 && user.permissionLevel === 3) {
            ordersApi.getTasks(order?.orderId).then((taskData) => setTasks(taskData))
        }
    }, [order])


    useEffect(() => {
        if (order?.status === 8 && user.permissionLevel === 4) {
            ordersApi.getTaskByEmployee(user.userId, order?.orderId).then((tsk) => setTasks([tsk]))
        }
    }, [order])

    const updateOrderStatus = (eventName, data) => {
        ordersApi.updateOrderStatus(eventName, data).then(() => {
            ordersApi.loadOrder(router.query.orderId).then((order) => setOrder(order))
        })
    }

    const handleCloseTasksModal = () => {
        setShowTaskModal(false);
        ordersApi.loadOrder(router.query.orderId).then((order) => setOrder(order))
    }

    const completeTask = () => {
        updateOrderStatus('task-complete', {
            orderId: order.orderId,
            username: user.username,
            taskId: tasks[0].taskId
        })
        ordersApi.loadOrder(router.query.orderId).then((order) => setOrder(order))
    }

    const sendPriceOffer = (price) => {
        updateOrderStatus('price-offer', {
            price,
            orderId: order.orderId
        })
        setShowPriceOfferModal(false)
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
                                src={order.imageUrl}
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
                {order?.type === 2 && (
                    <Stack>
                        <ModelCardComponent
                            image={order.modelImageUrl}
                            title={order.title}
                            description={order.description}
                        />
                    </Stack>
                )}
                {order?.status > 2 && order?.type === 1 && (
                    <Stack
                        rowGap={theme.spacing(3)}
                    >
                        <ModelCardComponent
                            image={order.modelImageUrl}
                            title={order.title}
                            description={order.description}
                        />
                        <Typography>
                                {`${intl.formatMessage(modelsPageMessages.materials)}: ${order.materials}`}
                        </Typography>
                        {user.permissionLevel !== 5 && (
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
            {user.permissionLevel === 1 && (
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
                                    onClick={() => updateOrderStatus('new-design', {orderId: order?.orderId})}
                                />
                            )}
                            {order?.type === 2 && (
                                <>
                                    {order?.casting && (
                                        <ButtonComponent
                                            label={intl.formatMessage(ordersPageMessages.sendOrderToCasting)}
                                            onClick={() => updateOrderStatus('casting-start', {orderId: order?.orderId})}
                                        />
                                    )}
                                    {!order?.casting && (
                                        <ButtonComponent
                                            label={intl.formatMessage(ordersPageMessages.sendOrderToProduction)}
                                            onClick={() => updateOrderStatus('production-start', {orderId: order?.orderId})}
                                        />
                                    )}
                                </>
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
                                onClick={() => updateOrderStatus('customer-design-complete', {orderId: order?.orderId})}
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
                                            onClick={() => updateOrderStatus('casting-start', {orderId: order?.orderId})}
                                        />
                                    )}
                                    {!order?.casting && (
                                        <ButtonComponent
                                            label={intl.formatMessage(ordersPageMessages.sendOrderToProduction)}
                                            onClick={() =>  updateOrderStatus('production-start', {orderId: order?.orderId})}
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
                                        onClick={() => updateOrderStatus('production-start', {orderId: order?.orderId})}
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
                                    onClick={() => updateOrderStatus('casting-end', {orderId: order?.orderId})}
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
                                onClick={() => updateOrderStatus('production-start', {orderId: order?.orderId})}
                            />
                        </Stack>
                    )}
                    {order?.status === 9 && (
                        <Stack
                            width="20%"
                        >
                            <ButtonComponent
                                label={intl.formatMessage(ordersPageMessages.updateCustomer)}
                                onClick={() => updateOrderStatus('order-ready', {orderId: order?.orderId})}
                            />
                        </Stack>
                    )}
                    {order?.status === 10 && (
                        <Stack
                            width="20%"
                        >
                            <ButtonComponent
                                label={intl.formatMessage(ordersPageMessages.completeOrder)}
                                onClick={() => updateOrderStatus('order-complete', {orderId: order?.orderId})}
                            />
                        </Stack>
                    )}
                    
                </>
            )}
            {user.permissionLevel === 3 && (
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
                                    onClick={() => updateOrderStatus('production-end', {orderId: order.orderId})}
                                    disabled={!(tasks.every((task) => task.isCompleted))}
                                />
                            </Stack>
                        </Stack>
                    )}
                </>
            )}
            {user.permissionLevel === 4 && (
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
                                direction="row"
                                columnGap={theme.spacing(3)}
                                sx={{
                                    margin: '0 auto'
                                }}
                            >
                                <ButtonComponent
                                    label={intl.formatMessage(ordersPageMessages.completeTask)}
                                    onClick={() => completeTask()}
                                    disabled={tasks[0].isBlocked || tasks[0].isCompleted}
                                />
                                <ButtonComponent
                                    label={intl.formatMessage(buttonMessages.goBack)}
                                    onClick={() => router.push('/employee')}
                                />
                            </CenteredStack>
                        </Stack>
                    )}
                </>
            )}
            {user.permissionLevel === 5 && (
                <>
                    {order?.status === 4 && (
                        <Stack
                            direction="row"
                            columnGap={theme.spacing(4)}
                            sx={{
                                mt: theme.spacing(4)
                            }}
                            width="30%"
                        >
                            {order?.type === 1 && (
                                <>
                                    <ButtonComponent
                                        label={`${intl.formatMessage(modelsPageMessages.priceWithMaterials)}: ${order.priceWithMaterials}`}
                                        onClick={() => updateOrderStatus('customer-order-approval', {
                                            orderId: order.orderId,
                                            price: order.priceWithMaterials,
                                            customerName: user.username
                                        })}
                                    />
                                    <ButtonComponent
                                        label={`${intl.formatMessage(modelsPageMessages.priceWithoutMaterials)}: ${order.priceWithoutMaterials}`}
                                        onClick={() => updateOrderStatus('customer-order-approval', {
                                            orderId: order.orderId,
                                            price: order.priceWithoutMaterials,
                                            customerName: user.username
                                        })}
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
                                        onClick={() => updateOrderStatus('customer-order-approval', {
                                            orderId: order.orderId,
                                            price: order.priceOffer,
                                            customerName: user.username
                                        })}
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
            {user.permissionLevel === 3 && tasks.length === 0 && (
                <CreateTasksModal
                    open={showTaskModal}
                    onClose={() => handleCloseTasksModal()}
                />
            )}
            {user.permissionLevel === 1 && order?.type === 3 && order?.status === 0 && (
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
