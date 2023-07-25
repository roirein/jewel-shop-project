import axios from "axios"
import { useEffect, useState, useContext } from "react"
import { getAuthorizationHeader } from "../../../../../utils/utils"
import AppContext from "../../../../../context/AppContext"
import ModelComponent from "./ModelComponent"
import { useFormContext } from "react-hook-form"
import { Stack, useTheme } from "@mui/material"
import { sendHttpRequest } from "../../../../../utils/requests"
import { MODELS_ROUTES } from "../../../../../utils/server-routes"
import ModelCardComponent from "../../../../models/components/ModelCard"
import CenteredStack from "../../../../../components/UI/CenteredStack"
import ButtonComponent from "../../../../../components/UI/ButtonComponent"
import { useIntl } from "react-intl"
import { modelsPageMessages } from "../../../../../translations/i18n"
import modelsApi from "../../../../../store/models/models-api"

const ModelsList = (props) => {

    const theme = useTheme()
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null) 
    const [displayedModels, setDisplayedModels] = useState([])
    const [price, setPrice] = useState({});
    const {setValue} = useFormContext();
    const intl = useIntl();

    useEffect(() => {
        modelsApi.loadModelsForOrder().then((modelsResponse) => setModels(modelsResponse))
    }, [])


    const onChooseModel = (model) => {
        setSelectedModel(model)
        setValue('modelNumber', model.modelNumber)
        setValue('price', {})
    }

    const onChoosePrice = (price) => {
        setPrice({modelNumber: selectedModel?.modelNumber, price})
        setValue('price', price)
    }

    useEffect(() => {
        const modelsToShow = models?.filter(model => model.item === Number(props.item))
        setDisplayedModels(modelsToShow)
        setValue('modelNumber', '')
        setValue('price', null)
    }, [props.item])

    return (
        <Stack
            width="100%"
        >
            <Stack
                width="100%"
                direction="row"
                columnGap={theme.spacing(3)}
            >
                {displayedModels?.map((model) => (
                    <Stack
                        key={model.modelNumber}
                        onClick={() => onChooseModel(model)}
                        sx={{
                            border: selectedModel?.modelNumber === model.modelNumber ? `${theme.spacing(0)} solid ${theme.palette.primary.main}` : 'none'
                        }}
                        width="33%"
                    >
                        <ModelCardComponent
                            title={model.title}
                            description={model.description}
                            image={model.imageUrl}
                        />
                    </Stack>
                ))}
            </Stack>
            {selectedModel && (
                <CenteredStack
                    sx={{
                        margin: '0 auto'
                    }}
                    width="50%"
                    direction="row"
                    columnGap={theme.spacing(4)}
                >
                    <ButtonComponent
                        label={`${intl.formatMessage(modelsPageMessages.priceWithMaterials)}: ${selectedModel?.priceWithMaterials}`}
                        onClick={() => onChoosePrice(selectedModel?.priceWithMaterials)}
                        disabled={price.modelNumber === selectedModel?.modelNumber && price.price === selectedModel?.priceWithMaterials}
                    />
                    <ButtonComponent
                        label={`${intl.formatMessage(modelsPageMessages.priceWithoutMaterials)}: ${selectedModel?.priceWithoutMaterials}`}
                        onClick={() => onChoosePrice(selectedModel?.priceWithoutMaterials)}
                        disabled={price.modelNumber === selectedModel?.modelNumber && price.price === selectedModel?.priceWithoutMaterials}
                    />
                </CenteredStack>
            )}
        </Stack>
    )
}

export default ModelsList