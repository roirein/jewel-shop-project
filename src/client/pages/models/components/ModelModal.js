import ModalComponent from '../../../components/UI/ModalComponent'
import { useIntl } from 'react-intl'
import { buttonMessages, modelsPageMessages, ordersPageMessages  } from '../../../translations/i18n'
import { Stack, useTheme } from "@mui/system";
import ButtonComponent from '../../../components/UI/ButtonComponent';
import axios from 'axios';
import { getAuthorizationHeader } from '../../../utils/utils';
import { useContext, useEffect, useState } from 'react';
import AppContext from '../../../context/AppContext';
import ModelCardComponent from './ModelCard';
import CenteredStack from '../../../components/UI/CenteredStack';
import CommentsForm from './CommentForm';
import { Typography } from '@mui/material';
import UpdateForm from './updateForm';
import UpdatePriceForm from './updatePriceForm';
import {sendHttpRequest} from '../../../utils/requests'
import { MODELS_ROUTES } from '../../../utils/server-routes';


const ModelModalComponent = (props) => {

    const intl = useIntl();
    const theme = useTheme();
    const contextValue = useContext(AppContext);

    const [model, setModel] = useState({});
    const [comments, setComments] = useState();
    const [priceData, setPriceData] = useState({});
    const [imageUrl, setImageUrl] = useState('');
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showUpdatePriceForm, setShowUpdatePriceForm] = useState(false)
    const [status, setStatus] = useState(0)

    const handleClose = (toFecthModels) => {
        setComments('')
        props.onClose(toFecthModels)
    }

    useEffect(() => {
        if(props.modelNumber && props.open) {
            sendHttpRequest(MODELS_ROUTES.GET_MODEL(props.modelNumber), 'GET', null, {
                Authorization: `Bearer ${contextValue.token}`
            }).then((response) => {
                setModel(response.data.model)
                if (response.data.model.status === -1 ) {
                    sendHttpRequest(MODELS_ROUTES.COMMENTS(props.modelNumber), 'GET', null, {
                        Authorization: `Bearer ${contextValue.token}`
                    }).then((res) => setComments(res.data.comment))
                }
                if (response.data.model.status === 2) {
                    sendHttpRequest(MODELS_ROUTES.PRICE(props.modelNumber), 'GET', null, {
                        Authorization: `Bearer ${contextValue.token}`
                    }).then((res) => setPriceData(res.data.price))
                }
            })
        }
    }, [props.modelNumber])

    useEffect(() => {
        if (model.modelNumber) {
            sendHttpRequest(MODELS_ROUTES.IMAGE(model.image), 'GET', null, {
                Authorization: `Bearer ${contextValue.token}`
            }, 'blob').then((res) => {
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
                    onClick={() => {
                        handleClose(false)
                    }}
                />
            </Stack>
        )
    }

    const onUpdateModel = async (data) => {
        const formData = new FormData()
        formData.append('title', data.title)
        formData.append('description', data.description),
        formData.append('model', data.model)
        const response = await sendHttpRequest(MODELS_ROUTES.UPDATE(props.modelNumber), 'PUT', formData, {
            Authorization: `Bearer ${contextValue.token}`
        })
        if (response.status === 200) {
            contextValue.socket.emit('model-update', {
                modelNumber: props.modelNumber,
            })
            handleClose(true)
        }
    }

    const onUpdatePrice = async (data) => {
        contextValue.socket.emit('model-approve', {
            modelNumber: model.modelNumber,
            status: 2,
            materials: data.materials,
            priceWithMaterials: data.priceWithMaterials,
            priceWithoutMaterials: data.priceWithoutMaterials
        })
        handleClose(true)
    }

    return (
        <ModalComponent
            open={props.open}
            onClose={() => props.onClose(false)}
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
                {contextValue.permissionLevel === 1 && (
                    <>
                        {(model.status === 0 || model.status === 1)  &&  (
                            <>
                                {status === 0 && (
                                    <>
                                        <ButtonComponent
                                            label={intl.formatMessage(buttonMessages.approve)}
                                            onClick={() => {
                                                setStatus(1)
                                            }}
                                        />
                                        <ButtonComponent
                                            label={intl.formatMessage(buttonMessages.reject)}
                                            onClick={() => setStatus(-1)}
                                        />
                                    </>
                                )}
                                {status === -1 && (
                                    <CommentsForm
                                        onCancel={() => setStatus(0)}
                                        onSubmit={(data) => {
                                            contextValue.socket.emit('model-reject', {
                                                status: -1,
                                                modelNumber: model.modelNumber,
                                                comments: data.comments
                                            })
                                            handleClose(true)
                                        }}
                                    />
                                )}
                                {status === 1 && (
                                    <UpdatePriceForm
                                        onCancel={() => setStatus(0)}
                                        onSubmit={(data) => {
                                            onUpdatePrice(data)
                                        }}
                                    />
                                )}
                            </>
                        )}
                    </>
                )}
                {model.status === -1 && (
                    <>
                        {comments && (
                            <Stack
                                width="100%"
                                sx={{
                                    direction: theme.direction
                                }}
                                rowGap={theme.spacing(3)}
                            >
                                <Typography>
                                    {`${intl.formatMessage(ordersPageMessages.comments)}: ${comments}`}
                                </Typography>
                                {contextValue.permissionLevel === 2 && (
                                    <>
                                        {!showUpdateForm && (
                                            <ButtonComponent
                                                onClick={() => setShowUpdateForm(true)}
                                                label={intl.formatMessage(buttonMessages.update)}
                                            />
                                        )}
                                        {showUpdateForm && (
                                            <UpdateForm
                                                onCancel={() => setShowUpdateForm(false)}
                                                onSubmit={(data) => onUpdateModel(data)}
                                            />
                                        )}
                                    </>
                                )}
                            </Stack>   
                        )}
                    </>
                )}
                {model.status === 2 && (
                    <Stack
                        width="100%"
                        rowGap={theme.spacing(3)}
                        sx={{
                            direction: theme.direction
                        }}
                    >
                        <Typography>
                            {`${intl.formatMessage(modelsPageMessages.materials)}: ${priceData.materials}`}
                        </Typography>
                        <Typography>
                            {`${intl.formatMessage(modelsPageMessages.priceWithMaterials)}: ${priceData.priceWithMaterials}`}
                        </Typography>
                        <Typography>
                            {`${intl.formatMessage(modelsPageMessages.priceWithoutMaterials)}: ${priceData.priceWithoutMaterials}`}
                        </Typography>
                    </Stack>
                )}
            </CenteredStack>
        </ModalComponent>
    )
}

export default ModelModalComponent