import axios from "axios"
import { useEffect, useState, useContext } from "react"
import { getAuthorizationHeader } from "../../../../../utils/utils"
import AppContext from "../../../../../context/AppContext"
import ModelComponent from "./ModelComponent"
import { useFormContext } from "react-hook-form"
import { Stack, useTheme } from "@mui/material"

const ModelsList = (props) => {

    const theme = useTheme()
    const [models, setModels] = useState([]);
    const [selectedModel, setSelctedModel] = useState(-1) 
    const [displayedModels, setDisplayedModels] = useState([])
    const contextValue = useContext(AppContext)
    const {setValue} = useFormContext();

    useEffect(() => {
        axios.get('http://localhost:3002/model/models', {
            headers: {
                Authorization: getAuthorizationHeader(contextValue.token)
            }
        }).then((res) => {
            setModels(res.data.models)
        })
    },[])

    useEffect(() => {
        const modelsToShow = models.filter(model => model.item === Number(props.item))
        setDisplayedModels(modelsToShow)
        setValue('modelNumber', '')
        setValue('price', null)
    }, [props.item])

    return (
        <Stack
            width="100%"
            direction="row"
            columnGap={theme.spacing(4)}
        >
            {displayedModels.map((model) => (
                <ModelComponent
                    key={model.modelNumber}
                    modelNumber={model.modelNumber}
                    title={model.title}
                    description={model.description}
                    image={model.image}
                    materials={model.materials}
                    priceWith={model.priceWithMaterials}
                    priceWithout={model.priceWithoutMaterials}
                    selected={selectedModel === Number(model.modelNumber)}
                    onClick={(modelNumber) => {
                        setSelctedModel(Number(modelNumber))
                        setValue('modelNumber', model.modelNumber)
                    }}
                    onClickPrice={(price) => {
                        setValue('price', price)
                    }}

                />
            ))}
        </Stack>
    )
}

export default ModelsList