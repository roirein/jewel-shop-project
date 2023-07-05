import { Stack, Typography, useTheme } from "@mui/material"
import ButtonComponent from "../../../../../components/UI/ButtonComponent"
import { useIntl } from "react-intl"
import ModelCard from '../../../../models/components/ModelCard'
import { useState, useEffect, useContext } from "react"
import AppContext from "../../../../../context/AppContext"
import { modelsPageMessages, ordersPageMessages } from "../../../../../translations/i18n"
import axios from "axios"
import { getAuthorizationHeader } from "../../../../../utils/utils"

export const ModelComponent = (props) => {

    const theme = useTheme();
    const intl = useIntl()
    const contextValue = useContext(AppContext)
    const [imageURL, setImageURL] = useState();
    const [selectedPrice, setSelectedPrice] = useState()

    useEffect(() => {
        if (props.image) {
            axios.get(`http://localhost:3002/model/image/${props.image}`, {
                headers: {
                    Authorization: getAuthorizationHeader(contextValue.token)
                },
                responseType: 'blob'
            }).then((res) => {
                const image = URL.createObjectURL(res.data);
                setImageURL(image)
            })
        }
    }, [props.image])

    return (
        <Stack
            sx={{
                p: theme.spacing(4),
                direction: theme.direction,
                border: `${props.selected ? theme.spacing(1) : theme.spacing(0)} solid black `

            }}
            width="100%"
            rowGap={theme.spacing(3)}
            onClick={() => {
                props.onClick(props.modelNumber)
            }}
        >
            <ModelCard
                title={props.title}
                description={props.description}
                image={imageURL}
            />
            {!props.price && (
                <>
                    <Typography>
                        {`${intl.formatMessage(modelsPageMessages.materials)}: ${props.materials}`}
                    </Typography>
                    <Stack
                        sx={{
                            border: selectedPrice === props.priceWith && props.selected  ? `${theme.spacing(2)} solid black` : 'none'
                        }}
                    >
                        <ButtonComponent
                            label={intl.formatMessage(ordersPageMessages.priceWith, {price: props.priceWith})}
                            onClick={() => {
                                setSelectedPrice(props.priceWith)
                                props.onClickPrice(props.priceWith)
                            }}
                            disabled={!props.selected}
                        />
                    </Stack>
                    <Stack
                        sx={{
                            border: selectedPrice === props.priceWithout && props.selected ? `${theme.spacing(2)} solid black` : 'none'
                        }}
                    >
                        <ButtonComponent
                            label={intl.formatMessage(ordersPageMessages.priceWithout, {price: props.priceWithout})}
                            onClick={() => {
                                setSelectedPrice(props.priceWithout)
                                props.onClickPrice(props.priceWithout)
                            }}
                            disabled={!props.selected}
                        />
                    </Stack>
                </>
            )}
        </Stack>
    )
}

export default ModelComponent