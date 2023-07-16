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
import { ORDERS_ROUTES } from "../../../utils/server-routes"
import { sendHttpRequest } from "../../../utils/requests"

const OrderPage = () => {

    const intl = useIntl();
    const theme = useTheme();
    const router = useRouter();
    const contextValue = useContext(AppContext);

    const [order, setOrder] = useState()
    const [imageUrl, setImageUrl] = useState()
    const [orderSummary, setOrderSummary] = useState()

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
            </Stack>
            <Stack
                direction="row"
                sx={{
                    mt: theme.spacing(3)
                }}
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
            </Stack>
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
