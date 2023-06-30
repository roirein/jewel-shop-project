import ModalComponent from '../../../components/UI/ModalComponent'
import { useIntl } from 'react-intl'
import { buttonMessages, modelsPageMessages  } from '../../../translations/i18n'
import { Stack, useTheme } from "@mui/system";
import ButtonComponent from '../../../components/UI/ButtonComponent';
import axios from 'axios';
import { getAuthorizationHeader } from '../../../utils/utils';
import { useContext, useEffect, useState } from 'react';
import AppContext from '../../../context/AppContext';
import ModelCardComponent from './ModelCard';

const ModelModalComponent = (props) => {

    const intl = useIntl();
    const theme = useTheme();
    const contextValue = useContext(AppContext);

    const [model, setModel] = useState({});
    const [imageUrl, setImageUrl] = useState('')

    useEffect(() => {
        if(props.modelNumber) {
            axios.get(`http://localhost:3002/model/model/${props.modelNumber}`, {
                headers: {
                    Authorization: getAuthorizationHeader(contextValue.token)
                }
            }).then((resp) => setModel(resp.data.model))
        }
    }, [props.modelNumber])

    useEffect(() => {
        if (model.modelNumber) {
            axios.get(`http://localhost:3002/model/image/${model.image}`, {
                headers: {
                    Authorization: getAuthorizationHeader(contextValue.token)
                },
                responseType: 'blob'
            }).then((res) => {
                const image = URL.createObjectURL(res.data);
                setImageUrl(image)
            })
        }
    }, [model])

    const getModalActions = () => {
        return (
            <Stack
                width="12.5%"
            >
                <ButtonComponent
                    label={intl.formatMessage(buttonMessages.close)}
                    onClick={() => props.onClose()}
                />
            </Stack>
        )
    }

    return (
        <ModalComponent
            open={props.open}
            onClose={() => props.onClose()}
            title={intl.formatMessage(modelsPageMessages.numberOfModel, {number: model.modelNumber})}
            width="sm"
            actions={getModalActions()}
        >
            <ModelCardComponent
                title={model.title}
                description={model.description}
                image={imageUrl}
            />
        </ModalComponent>
    )
}

export default ModelModalComponent