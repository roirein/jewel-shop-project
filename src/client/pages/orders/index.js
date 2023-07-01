import { Stack, Button, useTheme, Typography } from "@mui/material"
import { useIntl } from "react-intl"
import { Add } from "@mui/icons-material"
import { useState, useContext, useEffect } from "react"
import AppContext from '../../context/AppContext'
//import CreateModelModal from "./components/CreateModelModal"
import { modelsPageMessages, ordersPageMessages } from "../../translations/i18n"
import CreateOrderModal from "./components/NewOrderModal"
//import CenteredStack from '../../components/UI/CenteredStack'
//import TableComponent from '../../components/UI/TableComponent'
//import axios from "axios"
//import { ITEM_ENUMS, MODEL_STATUS_ENUM } from "../../const/Enums"
//import { getAuthorizationHeader, getUserToken } from "../../utils/utils"
//import { MODELS_TABL_COLUMNS } from "../../const/TablesColumns"
//import ModelModalComponent from "./components/ModelModal"


const OrdersPage = (props) => {

    const contextValue = useContext(AppContext);
    const intl = useIntl();
    const theme = useTheme();
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [originalData, setOriginalData] = useState(props.models)
    const [selectedModel, setSelectedModel] = useState(null);
    const [showModelModal, setShowModelModal] = useState(false)
    const [tableData, setTableData] = useState([]);

    
    // useEffect(() => {
    //     const data = [];
    //     originalData.forEach((dataElement) => {
    //         data.push(
    //             {
    //                 rowId: dataElement.modelNumber,
    //                 rowContent: [dataElement.modelNumber, ITEM_ENUMS[dataElement.item], dataElement.setting, dataElement.sideStoneSize, dataElement.mainStoneSize, MODEL_STATUS_ENUM[dataElement.status]]
    //             });
    //     })
    //     setTableData(data)
    // }, [originalData])

    // const onAddNewModel = (model) => {
    //     setOriginalData([...originalData, model])
    //     setShowCreateModal(false)
    // }

    // const onRespondMoal = (modelNumber, status) => {
    //     const models = [...originalData]
    //     const modelsIndex = models.findIndex((model) => model.modelNumber === modelNumber);
    //     newData.splice(modelsIndex, 1)
    //     models[modelsIndex].status = status,
    //     setOriginalData[models]
    // }

    return (
        <Stack
            width="100%"
            sx={{
                mt: theme.spacing(4),
                direction: theme.direction
            }}
        >
            {(contextValue.permissionLevel === 1 || contextValue.permissionLevel === 5) && (
                <Stack
                    sx={{
                        pr: theme.spacing(4)
                    }}
                >
                    <Button
                        variant="outlined"
                        sx={{
                            width: '10%',
                            border: `${theme.spacing(0)} solid ${theme.palette.primary.main}`
                        }}
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Add color={theme.palette.primary.main}/>
                        <Typography
                            variant="body2"
                            color={theme.palette.primary.main}
                        >
                            {intl.formatMessage(ordersPageMessages.createNewOrder)}
                        </Typography>
                    </Button>
                </Stack>
            )}
                {/* <CenteredStack
                    width="100%"
                    sx={{
                        mt: theme.spacing(3)
                    }}
                >
                    <TableComponent
                        columns={MODELS_TABL_COLUMNS}
                        data={tableData}
                        showMore
                        onClickShowMore={(rowId) => {
                            setSelectedModel(rowId)
                            setShowModelModal(true)
                        }}
                    />
                </CenteredStack>
            <ModelModalComponent
                open={showModelModal}
                modelNumber={selectedModel}
                onClose={() => {
                    setSelectedModel(null)
                    setShowModelModal(false)
                }}
            /> */}
            <CreateOrderModal
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </Stack>
    )
}

// export const getServerSideProps = async (context) => {
//     const token = getUserToken(context.req.headers.cookie)
//     const response = await axios.get('http://localhost:3002/model/metadata', {
//         headers: {
//             Authorization: getAuthorizationHeader(token)
//         }
//     })

//     return {
//         props: {
//           models: response.data.models
//         }
//     }
// }
 
export default OrdersPage;