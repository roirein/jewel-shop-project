import { Stack, Button, useTheme, Typography } from "@mui/material"
import { useIntl } from "react-intl"
import { Add } from "@mui/icons-material"
import { useState, useContext, useEffect } from "react"
import AppContext from '../../context/AppContext'
import CreateModelModal from "./components/CreateModelModal"
import { modelsPageMessages } from "../../translations/i18n"
import CenteredStack from '../../components/UI/CenteredStack'
import TableComponent from '../../components/UI/TableComponent'
import axios from "axios"
import { ITEM_ENUMS, MODEL_STATUS_ENUM } from "../../const/Enums"
import { getAuthorizationHeader, getUserToken } from "../../utils/utils"
import { MODELS_TABL_COLUMNS } from "../../const/TablesColumns"
import ModelModalComponent from "./components/ModelModal"


const ModelPage = (props) => {

    const contextValue = useContext(AppContext);
    const intl = useIntl();
    const theme = useTheme();
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [originalData, setOriginalData] = useState(props.models)
    const [selectedModel, setSelectedModel] = useState(null);
    const [showModelModal, setShowModelModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState({})
    const [tableData, setTableData] = useState([]);

    const getModelNumberColumnValue = (dataElement) => {
        if (!dataElement.modelNumber && contextValue.permissionLevel === 2) {
            return (
                <Button
                    variant="text"
                    color="primary"
                    sx={{
                        textDecoration: 'underline'
                    }}
                    onClick={() => {
                        setSelectedRowData(dataElement)
                        setShowCreateModal(true)
                    }}
                >
                    {intl.formatMessage(modelsPageMessages.addModel)}
                </Button>
            )
        } else {
            return dataElement.modelNumber
        }
    }

    
    useEffect(() => {
        const data = [];
        originalData.forEach((dataElement) => {
            data.push(
                {
                    rowId: dataElement.modelNumber,
                    rowContent: [getModelNumberColumnValue(dataElement), ITEM_ENUMS[dataElement.item], dataElement.setting, dataElement.sideStoneSize, dataElement.mainStoneSize, MODEL_STATUS_ENUM[dataElement.status]]
                });
        })
        setTableData(data)
    }, [originalData])

    const onAddNewModel = (model) => {
        const updatedData = [...originalData]
        const modelIndex = updatedData.findIndex((item) => item.id === model.id)
        if (modelIndex === -1) {
            setOriginalData([...updatedData, model])
        } else {
            updatedData[modelIndex] = model
            setOriginalData([...updatedData])
        }
        setShowCreateModal(false)
    }

    const onRespondModel = (modelNumber, status) => {
        const models = [...originalData]
        const modelsIndex = models.findIndex((model) => model.modelNumber === modelNumber);
        models[modelsIndex].status = status,
        setOriginalData(models)
    }

    return (
        <Stack
            width="100%"
            sx={{
                mt: theme.spacing(4),
                direction: theme.direction
            }}
        >
            {contextValue.permissionLevel === 2 && (
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
                            {intl.formatMessage(modelsPageMessages.createNewModel)}
                        </Typography>
                    </Button>
                </Stack>
            )}
                <CenteredStack
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
            <CreateModelModal
                open={showCreateModal}
                onClose={() => {
                    setSelectedRowData(null)
                    setShowCreateModal(false)
                }}
                modelData={selectedRowData}
                onAddNewModel={(model) => onAddNewModel(model)}
            />
            <ModelModalComponent
                open={showModelModal}
                modelNumber={selectedModel}
                onClose={(modelNumber, status) => {
                    setSelectedModel(null)
                    setShowModelModal(false)
                    if (status !== undefined) {
                        onRespondModel(modelNumber, status)
                    }
                }}
            />
        </Stack>
    )
}

export const getServerSideProps = async (context) => {
    const token = getUserToken(context.req.headers.cookie)
    const response = await axios.get('http://localhost:3002/model/metadata', {
        headers: {
            Authorization: getAuthorizationHeader(token)
        }
    })

    return {
        props: {
          models: response.data.models
        }
    }
}
 
export default ModelPage;