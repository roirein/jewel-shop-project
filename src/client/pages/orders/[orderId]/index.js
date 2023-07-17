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
        if (order?.status > 2) {
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
                            {order?.casting && (
                                <ButtonComponent
                                    label={intl.formatMessage(ordersPageMessages.sendOrderToCasting)}
                                    onClick={() => sendOrderToCasting()}
                                />
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
                            {order?.casting && (
                                <ButtonComponent
                                    label={intl.formatMessage(ordersPageMessages.sendOrderToProduction)}
                                    onClick={() => sendOrderToProduction()}
                                />
                            )}
                        </Stack>
                    )}
                    {order?.status === 9 && (
                        <Stack
                            width="20%"
                        >
                            {order?.casting && (
                                <ButtonComponent
                                    label={intl.formatMessage(ordersPageMessages.updateCustomer)}
                                    onClick={() => updateCustomer()}
                                />
                            )}
                        </Stack>
                    )}
                    {order?.status === 10 && (
                        <Stack
                            width="20%"
                        >
                            {order?.casting && (
                                <ButtonComponent
                                    label={intl.formatMessage(ordersPageMessages.completeOrder)}
                                    onClick={() => completeOrder()}
                                />
                            )}
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
                            {order?.casting && (
                                <ButtonComponent
                                    label={intl.formatMessage(ordersPageMessages.defineTasks)}
                                    onClick={() => setShowTaskModal(true)}
                                />
                            )}
                        </Stack>
                    )}
                    {tasks.length > 0 && order?.status === 8 (
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
                            <ButtonComponent
                                label={`${intl.formatMessage(modelsPageMessages.priceWithMaterials)}: ${order.priceWithMaterials}`}
                                onClick={() => approveOrderByCustomer(order.priceWithMaterials)}
                            />
                            <ButtonComponent
                                label={`${intl.formatMessage(modelsPageMessages.priceWithoutMaterials)}: ${order.priceWithoutMaterials}`}
                                onClick={() => approveOrderByCustomer(order.priceWithoutMaterials)}
                            />
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
        </CenteredStack>
    )

//     const intl = useIntl();
//     const theme = useTheme()
//     const router = useRouter()
//     const [imageUrl, setImageUrl] = useState('');
//     const [showPriceOfferModal, setShowPriceOfferModal] = useState(false)
//     const [showTaskModal, setShowTaskModal] = useState(false)
//     const contextValue = useContext(AppContext);
//     const [tasks, setTasks] = useState([])
//     const [orderSummary, setOrderSummary] = useState();

//     useEffect(() => {
//         if (props.order['type'] === 1) {
//             axios.get(`http://localhost:3002/order/image/${props.order['design']}`, {
//                 headers: {
//                     Authorization: getAuthorizationHeader(contextValue.token)
//                 },
//                 responseType: 'blob'
//             }).then((res) => {
//                 const image = URL.createObjectURL(res.data);
//                 setImageUrl(image)
//             })
//         }
//     }, [])

//     useEffect(() => {
//         if ((contextValue.permissionLevel === 1 || contextValue.permissionLevel === 3) && props.order['status'] === 6) {
//             axios.get(`http://localhost:3002/order/tasks/${props.order['orderId']}`, {
//                 headers: {
//                     Authorization: getAuthorizationHeader(contextValue.token)
//                 }
//             }).then((res) => {
//                 const taskData = res.data.tasks
//                 const result = taskData.map((task, index) => {
//                     return {
//                         index: index + 1,
//                         employee: task.employeeName,
//                         description: task.description,
//                         position: POSITIONS[task.position],
//                         isCompleted: task.isCompleted
//                     }
//                 })
//                 setTasks(result)
//             })
//         }
//     }, [props.order])


//     useEffect(() => {
//         if (contextValue.permissionLevel === 4 && props.order['status'] === 6) {
//             axios.get(`http://localhost:3002/order/task/${contextValue.userId}/${props.order['orderId']}`, {
//                 headers: {
//                     Authorization: getAuthorizationHeader(contextValue.token)
//                 }
//             }).then((res) => {
//                 const taskData = res.data.task
//                 const result =  {
//                         index: 1,
//                         taskId: taskData.taskId,
//                         employee: taskData.employeeName,
//                         description: taskData.description,
//                         position: POSITIONS[taskData.position],
//                         isCompleted: taskData.isCompleted,
//                         isBlocked: taskData.isBlocked
//                     }
//                 setTasks([result])
//             })
//         }
//     }, [props.order])

//     const sendOrderToDesignManager = () => {
//         contextValue.socket.emit('new-design', {
//             orderId: props.order['orderId']
//         })
//         router.push('/orders/design')
//     }


//     const getShowPriceDataInModel = () => {
//         if (props.order['type'] === 2) {
//             return true
//         }
//         if (contextValue.permissionLevel !== 5) {
//             return true
//         } else {
//             if (props['order'].status === 2) {
//                 return false
//             }
//         }
//         return true
//     }

//     const onChoosePrice = (price) => {
//         contextValue.socket.emit('customer-approval', {
//             orderId: props.order['orderId'],
//             price,
//             casting: props.order['casting']
//         })
//         router.push('/orders')
//     }

//     const updateCastingStatus = (castingStatus) => {
//         contextValue.socket.emit('update-casting-status', {
//             orderId: props.order['orderId'],
//             castingStatus: castingStatus
//         })
//         router.push('/orders/casting')
//     }

//     return (
//         <CenteredStack
//             width="100%"
//         >
//             <Stack
//                 width='fit-content'
//                 sx={{
//                     mt: theme.spacing(4),
//                     direction: theme.direction
//                 }}
//                 direction="row"
//                 columnGap={theme.spacing(4)}
//             >
//                 {props.order['status'] >= 2 && props.order['type'] !== 3 && (
//                     <ModelComponent
//                         image={props.order['image']}
//                         title={props['order'].title}
//                         description={props.order['description']}
//                         selected
//                         onClick={() => {}}
//                         price={getShowPriceDataInModel()}
//                         materials={props.order['materials']}
//                         priceWith={props.order['priceWithMaterials']}
//                         priceWithout={props.order['priceWithoutMaterials']}
//                         onClickPrice={(price) => onChoosePrice(price)}
//                     />
//                 )}
//                 <CustomerDetails
//                     customerName={props.order['customerName']}
//                     email={props.order['email']}
//                     phoneNumber={props.order['phoneNumber']}
//                 />
//             </Stack>
//             <Stack>
//                {contextValue.permissionLevel === 1 && (
//                 <>
//                     {props.order['status'] === 0 && props.order['type'] === 1 && (
//                         <CenteredStack
//                             width="100%"
//                             height="40px"
//                             sx={{
//                                 mt: theme.spacing(4)
//                             }}
//                         >
//                             <ButtonComponent
//                                 label={intl.formatMessage(ordersPageMessages.sendToDesignManager)}
//                                 onClick={() => sendOrderToDesignManager()}
//                             />
//                         </CenteredStack>
//                     )}
//                     {props.order['status'] === 0 && props.order['type'] === 3 && !props.order['priceOffer'] && (
//                         <CenteredStack
//                             width="100%"
//                             height="40px"
//                             sx={{
//                                 mt: theme.spacing(4)
//                             }}
//                         >
//                             <ButtonComponent
//                                 label={intl.formatMessage(ordersPageMessages.priceOffer)}
//                                 onClick={() => setShowPriceOfferModal(true)}
//                             />
//                         </CenteredStack>
//                     )}
//                     {props.order['status'] === 1 && (
//                         <Typography
//                             variant="h6"
//                             fontWeight="bold"
//                         >
//                             {intl.formatMessage(ordersPageMessages.orderInDesign)}
//                         </Typography>
//                     )}
//                     {props.order['status'] === 3 && (
//                         <>
//                             {props.order['casting'] && (
//                                 <CenteredStack
//                                     width="100%"
//                                     height="40px"
//                                     sx={{
//                                         mt: theme.spacing(4)
//                                     }}
//                                 >
//                                     <ButtonComponent
//                                         label={intl.formatMessage(ordersPageMessages.sendOrderToCasting)}
//                                         onClick={() => updateCastingStatus(2)}
//                                     />
//                                 </CenteredStack>
//                             )}
//                             {!props.order['casting'] && (
//                                 <CenteredStack
//                                     width="100%"
//                                     height="40px"
//                                     sx={{
//                                         mt: theme.spacing(4)
//                                     }}
//                                 >
//                                     <ButtonComponent
//                                         label={intl.formatMessage(ordersPageMessages.sendOrderToProduction)}
//                                         onClick={() => {
//                                             contextValue.socket.emit('send-order-to-production', {
//                                                 orderId: props.order['orderId'],
//                                                 status: 6
//                                             })
//                                             router.push('/orders/production')
//                                         }}
//                                     />
//                                 </CenteredStack>
//                             )}
//                         </>
//                     )}
//                     {props.order['status'] === 4 && (
//                         <>
//                             {props.order['casting'] && (
//                                 <CenteredStack
//                                     width="100%"
//                                     height="40px"
//                                     sx={{
//                                         mt: theme.spacing(4)
//                                     }}
//                                 >
//                                     <ButtonComponent
//                                         label={intl.formatMessage(ordersPageMessages.completeCasting)}
//                                         onClick={() => updateCastingStatus(3)}
//                                     />
//                                 </CenteredStack>
//                             )}
//                         </>
//                     )}
//                     {(props.order['status'] === 5) && (
//                         <>
//                             {props.order['casting'] && (
//                                 <CenteredStack
//                                     width="100%"
//                                     height="40px"
//                                     sx={{
//                                         mt: theme.spacing(4)
//                                     }}
//                                 >
//                                     <ButtonComponent
//                                         label={intl.formatMessage(ordersPageMessages.sendOrderToProduction)}
//                                         onClick={() => {
//                                             contextValue.socket.emit('send-order-to-production', {
//                                                 orderId: props.order['orderId'],
//                                                 status: 6
//                                             })
//                                             router.push('/orders/production')
//                                         }}
//                                     />
//                                 </CenteredStack>
//                             )}
//                         </>
//                     )}
//                     {props.order['status'] === 7 && (
//                         <CenteredStack
//                             width="100%"
//                             height="40px"
//                             sx={{
//                                 mt: theme.spacing(4)
//                             }}
//                         >
//                             <ButtonComponent
//                                 label={intl.formatMessage(ordersPageMessages.updateCustomer)}
//                                 onClick={() => {
//                                     contextValue.socket.emit('update-customer', {
//                                         orderId: props.order['orderId'],
//                                     })
//                                     router.push('/orders')
//                                 }}
//                             />
//                         </CenteredStack>
//                     )}
//                     {props.order['status'] === 8 && (
//                         <CenteredStack
//                             width="100%"
//                             height="40px"
//                             sx={{
//                                 mt: theme.spacing(4)
//                             }}
//                         >
//                             <ButtonComponent
//                                 label={intl.formatMessage(ordersPageMessages.completeOrder)}
//                                 onClick={() => {
//                                     contextValue.socket.emit('complete-order', {
//                                         orderId: props.order['orderId'],
//                                     })
//                                     router.push('/orders')
//                                 }}
//                             />
//                         </CenteredStack>
//                     )}
//                 </>
//                )}
//                {contextValue.permissionLevel === 5 && (
//                     <>
//                         {props.order['status'] === 0 && props.order['priceOffer'] && (
//                             <CenteredStack
//                                 width="100%"
//                                 height="40px"
//                                 sx={{
//                                     mt: theme.spacing(4)
//                                 }}
//                             >
//                                 <Typography>
//                                     {`${intl.formatMessage(ordersPageMessages.priceOffer)}: ${props.order['priceOffer']}`}
//                                 </Typography>
//                                 <ButtonComponent
//                                     label={intl.formatMessage(ordersPageMessages.acceptPriceOffer)}
//                                     onClick={() => {
//                                         contextValue.socket.emit('accept-price-offer', {
//                                             orderId: props.order['orderId'],
//                                             price: props.order['priceOffer']
//                                         })
//                                     }}
//                                 />
//                             </CenteredStack>                   
//                         )}
//                     </>
//                )}
//             {contextValue.permissionLevel === 3 && props.order['status'] === 6 && (
//                 <>
//                     {tasks.length === 0 && (
//                         <CenteredStack
//                             width="100%"
//                             height="40px"
//                             sx={{
//                                 mt: theme.spacing(4)
//                             }}
//                         >
//                             <ButtonComponent
//                                 label={intl.formatMessage(ordersPageMessages.defineTasks)}
//                                 onClick={() => setShowTaskModal(true)}
//                             />
//                         </CenteredStack>
//                     )}
//                     {tasks.length > 0 && (
//                         <Stack
//                             width="60%"
//                             margin="0 auto"
//                         >
//                             <TaskSummaryComponent
//                                 tasks={tasks}
//                                 showStatus
//                             />
//                             {tasks.every(task => task.isCompleted) && (
//                                 <ButtonComponent
//                                     label={intl.formatMessage(ordersPageMessages.completeProduction)}
//                                     onClick={() => {
//                                         contextValue.socket.emit('on-production-complete', {
//                                             orderId: props.order['orderId']
//                                         })
//                                         router.push('/orders')
//                                     }}
//                                 />
//                             )}
//                         </Stack>
//                     )}
//                 </>
//             )}
//             {contextValue.permissionLevel === 4 && props.order['status'] === 6 && (
//                 <>
//                     {tasks.length > 0 && (
//                         <Stack
//                             width="60%"
//                             margin="0 auto"
//                         >
//                             <TaskSummaryComponent
//                                 tasks={tasks}
//                             />
//                             <Stack
//                                 direction="row"
//                                 columnGap={theme.spacing(4)}
//                                 sx={{
//                                     width: '80%',
//                                     mx: 'auto',
//                                     mt: theme.spacing(4)
//                                 }}
//                             >
//                                 <ButtonComponent
//                                     label={intl.formatMessage(buttonMessages.goBack)}
//                                     onClick={() => router.push('/employee')}
//                                 />
//                                 <ButtonComponent
//                                     label={intl.formatMessage(ordersPageMessages.completeTask)}
//                                     disabled={tasks[0].isBlocked}
//                                     onClick={() => {
//                                         contextValue.socket.emit('on-task-completion', {
//                                             taskId: tasks[0].taskId,
//                                             orderId: props.order['orderId']
//                                         })
//                                     }}
//                                 />
//                             </Stack>
//                         </Stack>
//                     )}
//                 </>
//             )}
//             </Stack>
//             {contextValue.permissionLevel === 1 && props.order['type'] === 3 && (
//                 <PriceOfferModal
//                     open={showPriceOfferModal}
//                     onClose={() => setShowPriceOfferModal(false)}
//                     onSend={(data) => {
//                         console.log(data.price)
//                         contextValue.socket.emit('send-price-offer', {
//                             price: data.price,
//                             orderId: props.order['orderId']
//                         })
//                         router.push('/orders')
//                     }}
//                 />
//             )}
//             {contextValue.permissionLevel === 3 && (
//                 <CreateTasksModal
//                     open={showTaskModal}
//                     onClose={() => setShowTaskModal(false)}
//                 />
//             )}
//         </CenteredStack>
//     )
}

export default OrderPage
