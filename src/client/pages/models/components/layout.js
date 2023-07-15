import { Stack, Button, Typography, useTheme, Tabs, Tab} from "@mui/material"
import { Add } from "@mui/icons-material"
import { useContext, useState } from "react"
import AppContext from "../../../context/AppContext"
import { useIntl } from "react-intl"
import { modelsPageMessages, ordersPageMessages } from "../../../translations/i18n"
import CenteredStack from "../../../components/UI/CenteredStack"
import { useRouter } from "next/router"
import { DESIGN_MANGER_MODELS_PAGE_TABS, MANAGER_ORDERS_PAGE_TABS } from "../../../const/TabDefinitions"
import Link from "next/link"
import CreateModelModal from '../components/CreateModelModal'
import TableComponent from "../../../components/UI/TableComponent"

const PageLayoutComponent = (props) => {

    const intl = useIntl();
    const theme = useTheme();
    const contextValue = useContext(AppContext)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [originalData, setOriginalData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [selectedModel, setSelectedModel] = useState({});
    const [selectedTab, setSelectedTab] = useState(0)
    const router = useRouter();

    
    const fetchModels = async () => {
        const response = await sendHttpRequest(MODELS_ROUTES.GET_MODELS_METADATA, 'GET', null, {
            Authorization: `Bearer ${contextValue.token}`
        })
        return response.data.models
    }

    const handleCloseModal = (toFetchModels) => {
        setShowCreateModal(false)
        if (toFetchModels) {
            fetchModels().then(models => setOriginalData(models))
        }
    }

    const onSelectRow = (rowId) => {
        if (rowId) {
            const user = originalData?.find((mod) => mod.modelNumber === rowId)
            setSelectedModel(user)
        } else {
            setSelectedModel({})
        }
    }

    useEffect(() => {
        if (contextValue.token) {
            fetchModels().then((models) => setOriginalData(models))
        }
    }, [contextValue.token])

    useEffect(() => {
        const data = [];
        originalData?.forEach((dataElement) => {
            data.push(
                {
                    rowId: dataElement.modelNumber,
                    rowContent: [dataElement.modelNumber, ITEM_ENUMS[dataElement.item], dataElement.setting, dataElement.sideStoneSize, dataElement.mainStoneSize, MODEL_STATUS_ENUM[dataElement.status]]
                });
        })
        setTableData(data)
    }, [originalData])

    return (
        <Stack
            width="100%"
            sx={{
                mt: theme.spacing(4),
                direction: theme.direction
            }}
        >
            {contextValue.permissionLevel === 2 && (
                <Tabs
                    value={router.pathname}
                    indicatorColor="transparent"
                    sx={{
                        direction: theme.direction,
                        pr: theme.spacing(4)
                    }}
                >
                    {DESIGN_MANGER_MODELS_PAGE_TABS.map((tab, index) => (
                        <Tab
                            key={index}
                            label={tab.label}
                            value={selectedTab}
                            onChange={(event, newValue) => setSelectedTab(newValue)}
                            sx={{
                                border: router.pathname === tab.route ? `${theme.spacing(1)} solid ${theme.palette.primary.main}` : 'none'
                            }}
                        />
                    ))}
                </Tabs>
            )}
            {(contextValue.permissionLevel === 2) && (
                <Stack
                    sx={{
                        pr: theme.spacing(4),
                        mt: theme.spacing(3)
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
                {selectedTab === 0 && (
                    <TableComponent
                        columns={MODELS_TABL_COLUMNS}
                        data={tableData}
                        showMore
                        onClickShowMore={(rowId) => {
                            setSelectedModel(rowId)
                            setShowModelModal(true)
                        }}
                        selectedRowId={selectedModel?.id}
                        onSelectRow={(rowId) => onSelectRow(rowId)}
                    />
                )}
            </CenteredStack>
            <CreateModelModal
                open={showCreateModal}
                //modelData={selectedRowData}
                onAddNewModel={(model) => onAddNewModel(model)}
            />
            <CreateModelModal
                open={showCreateModal}
                onClose={(toFetchModels) => handleCloseModal(toFetchModels)}
            />
        </Stack>
    )
}

export default PageLayoutComponent