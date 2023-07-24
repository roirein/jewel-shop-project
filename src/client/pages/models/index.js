import { Stack, Button, Typography, useTheme, Tabs, Tab} from "@mui/material"
import { Add } from "@mui/icons-material"
import { useContext, useState, useEffect } from "react"
import AppContext from '../../context/AppContext'
import { useIntl } from "react-intl"
import { buttonMessages, modelsPageMessages, ordersPageMessages } from "../../translations/i18n"
import CenteredStack from "../../components/UI/CenteredStack"
import { useRouter } from "next/router"
import { DESIGN_MANGER_MODELS_PAGE_TABS, MANAGER_ORDERS_PAGE_TABS } from "../../const/TabDefinitions"
import CreateModelModal from './components/CreateModelModal'
import TableComponent from "../../components/UI/TableComponent"
import { MODELS_TABL_BY_STATUS_COLUMNS, MODELS_TABL_COLUMNS } from "../../const/TablesColumns"
import { sendHttpRequest } from "../../utils/requests"
import { MODELS_ROUTES } from "../../utils/server-routes"
import { ITEM_ENUMS, MODEL_STATUS_ENUM } from "../../const/Enums"
import ModelModalComponent from "./components/ModelModal"
import { useSelector } from "react-redux"
import modelsApi from "../../store/models/models-api"
import userApi from "../../store/user/user-api"
import TemplateContext from "../../context/template-context"

const ModelsPage = () => {

    const intl = useIntl();
    const theme = useTheme();
    const contextValue = useContext(TemplateContext)
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [originalData, setOriginalData] = useState([]);
    const [displayesModels, setDisaplyesModels] = useState([])
    const [tableData, setTableData] = useState([]);
    const [selectedModel, setSelectedModel] = useState({});
    const [selectedTab, setSelectedTab] = useState(0)
    const [filter, setFilter] = useState(3)
    const router = useRouter();
    const models = useSelector((state) => modelsApi.getModels(state));
    const user = useSelector((state) => userApi.getUser(state))


    const tableFilters = [
        {
            name: 'status',
            label: intl.formatMessage(modelsPageMessages.status),
            options: {
                ...MODEL_STATUS_ENUM,
                [3]: intl.formatMessage(buttonMessages.showAll)
            }
        }
    ]

    useEffect(() => {
        if (user.token) {
            modelsApi.retriveModels()
        }
    }, [user])

    useEffect(() => {
        setOriginalData(models)
    }, [models])


    const handleCloseModal = () => {
        setShowCreateModal(false)
    }

    const onSelectRow = (rowId) => {
        if (rowId) {
            const model = originalData?.find((mod) => mod.modelNumber === rowId)
            setSelectedModel(model)
        } else {
            setSelectedModel({})
        }
    }

    const setRowData = (dataElement) => {
        if (selectedTab === 0) {
            return [dataElement.modelNumber, ITEM_ENUMS[dataElement.item], dataElement.setting, dataElement.sideStoneSize, dataElement.mainStoneSize, MODEL_STATUS_ENUM[dataElement.status]]
        } else {
            return [dataElement.modelNumber, ITEM_ENUMS[dataElement.item], dataElement.setting, dataElement.sideStoneSize, dataElement.mainStoneSize]
        }
    }

    useEffect(() => {
        const data = [];
        displayesModels?.forEach((dataElement) => {
            data.push(
                {
                    rowId: dataElement.modelNumber,
                    rowContent: setRowData(dataElement)
                });
        })
        setTableData(data)
    }, [displayesModels])

    useEffect(() => {
        let modelsToShow
        switch(selectedTab) {
            case 0: 
                modelsToShow = [...originalData]
                break;
            case 1:
                modelsToShow = originalData.filter(model => model.status !== 2)
                break;
            case 2: 
                modelsToShow = originalData.filter(model => model.status === 2)
                break
            default:
                modelsToShow = []
        }

        setDisaplyesModels(modelsToShow)
    }, [selectedTab, originalData])

    useEffect(() => {
        if (filter === 3) {
            setDisaplyesModels(originalData)
        } else {
            const filteredModels = originalData.filter((model) => {
                return model.status === filter
            })
            setDisaplyesModels(filteredModels)
        }
    }, [filter, originalData])

    return (
        <Stack
            width="100%"
            sx={{
                mt: theme.spacing(4),
                direction: theme.direction
            }}
        >
            {user && user.permissionLevel === 2 && (
                <Tabs
                    value={router.pathname}
                    indicatorColor="transparent"
                    sx={{
                        direction: theme.direction,
                        pr: theme.spacing(4)
                    }}
                    onChange={(event, newValue) => {
                        setSelectedTab(newValue)
                        setFilter(3)
                    }}
                >
                    {DESIGN_MANGER_MODELS_PAGE_TABS.map((tab, index) => (
                        <Tab
                            key={index}
                            label={tab.label}
                            value={index}
                            sx={{
                                border: index === selectedTab ? `${theme.spacing(1)} solid ${theme.palette.primary.main}` : 'none'
                            }}
                        />
                    ))}
                </Tabs>
            )}
            {(user && user.permissionLevel === 2 ) && (
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
                {tableData.length > 0 && (
                    <>
                        {user.permissionLevel === 2 && (
                            <TableComponent
                                columns={selectedTab === 0 ? MODELS_TABL_COLUMNS : MODELS_TABL_BY_STATUS_COLUMNS}
                                data={tableData}
                                showMore
                                onClickShowMore={(rowId) => {
                                    contextValue.onOpenModelModal(rowId)
                                }}
                                selectedRowId={selectedModel?.id}
                                onSelectRow={(rowId) => onSelectRow(rowId)}
                                tableFilters={selectedTab === 0 ? tableFilters : null}
                                onFilterChange={(filterValue) => setFilter(Number(filterValue))}
                                
                            />
                        )}
                        {user.permissionLevel === 1 && (
                            <TableComponent
                                columns={MODELS_TABL_COLUMNS}
                                data={tableData}
                                showMore
                                onClickShowMore={(rowId) => {
                                    contextValue.onOpenModelModal(rowId)
                                }}
                                selectedRowId={selectedModel?.id}
                                onSelectRow={(rowId) => onSelectRow(rowId)}
                                tableFilters={selectedTab === 0 ? tableFilters : null}
                                onFilterChange={(filterValue) => setFilter(Number(filterValue))}
                            />
                        )}        
                    </>
                )}
            </CenteredStack>
            <CreateModelModal
                open={showCreateModal}
                onClose={() => handleCloseModal()}
            />
        </Stack>
    )
}

export default ModelsPage