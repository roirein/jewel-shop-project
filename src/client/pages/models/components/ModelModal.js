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
import CenteredStack from '../../../components/UI/CenteredStack';

const ModelModalComponent = (props) => {

    const intl = useIntl();
    const theme = useTheme();
    const contextValue = useContext(AppContext);

    const [model, setModel] = useState({});
    const [imageUrl, setImageUrl] = useState('');

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
            <CenteredStack
                columnGap={theme.spacing(4)}
                direction="row"
                width="60%"
                sx={{
                    m: '0 auto',
                    pt: theme.spacing(4),
                    flexDirection: 'row-reverse'
                }}
            >
                {(model.status === 1 || model.status === 2) && (
                    <>
                        <ButtonComponent
                            label={intl.formatMessage(buttonMessages.approve)}
                            onClick={() => {
                                contextValue.socket.emit('model-response', {
                                    status: 3,
                                    modelNumber: model.modelNumber
                                })
                                props.onClose()
                            }}
                        />
                        <ButtonComponent
                            label={intl.formatMessage(buttonMessages.reject)}
                        />
                    </>
                )}
                {model.status === 3 && (
                    <ButtonComponent
                        label={intl.formatMessage(modelsPageMessages.updatePrice)}
                    />
                )}
            </CenteredStack>
        </ModalComponent>
    )
}

export default ModelModalComponent