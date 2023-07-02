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

const ModelModalComponent = (props) => {

    const intl = useIntl();
    const theme = useTheme();
    const contextValue = useContext(AppContext);

    const [model, setModel] = useState({});
    const [comments, setComments] = useState();
    const [priceData, setPriceData] = useState({});
    const [imageUrl, setImageUrl] = useState('');
    const [showCommentsForm, setShowCommentsForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showUpdatePriceForm, setShowUpdatePriceForm] = useState(false)

    const handleClose = () => {
        setShowCommentsForm(false)
        setShowUpdateForm(false)
        setShowUpdatePriceForm(false)
        setComments('')
    }

    useEffect(() => {
        if(props.modelNumber) {
            axios.get(`http://localhost:3002/model/model/${props.modelNumber}`, {
                headers: {
                    Authorization: getAuthorizationHeader(contextValue.token)
                }
            }).then((resp) => {
                setModel(resp.data.model)
                if (resp.data.model.status === 0) {
                    axios.get(`http://localhost:3002/model/comments/${props.modelNumber}`, {
                        headers: {
                            Authorization: getAuthorizationHeader(contextValue.token)
                        }
                    }).then((response) => {
                        setComments(response.data.comment)
                    })
                }
                if (resp.data.model.status === 4) {
                    axios.get(`http://localhost:3002/model/price/${props.modelNumber}`, {
                        headers: {
                            Authorization: getAuthorizationHeader(contextValue.token)
                        }
                    }).then((response) => {
                        setPriceData(response.data.price)
                    })
                }

            })
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
                    onClick={() => {
                        handleClose()
                        props.onClose()
                    }}
                />
            </Stack>
        )
    }

    const onUpdateModel = async (data) => {
        const formData = new FormData()
        formData.append('title', data.title)
        formData.append('description', data.description),
        formData.append('model', data.model[0])
        axios.put(`http://localhost:3002/model/model/${model.modelNumber}`, formData, {
            headers: {
                Authorization: getAuthorizationHeader(contextValue.token)
            }
        }).then((response) => {
            if (response.status === 200) {
                props.onClose(model.modelNumber, 2)
            }
        })
    }

    const onUpdatePrice = async (data) => {
        axios.post(`http://localhost:3002/model/price/${model.modelNumber}`, {
            materials: data.materials,
            priceWithMaterials: data.priceWithMaterials,
            priceWithoutMaterials: data.priceWithoutMaterials
        }, {
            headers: {
                Authorization: getAuthorizationHeader(contextValue.token)
            }  
        }).then((response) => {
            if (response.status === 201) {
                props.onClose(model.modelNumber, 4)
            }
        })
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
                {contextValue.permissionLevel === 1 && (
                    <>
                        {(model.status === 1 || model.status === 2)  &&  (
                            <>
                                {!showCommentsForm && (
                                    <>
                                        <ButtonComponent
                                            label={intl.formatMessage(buttonMessages.approve)}
                                            onClick={() => {
                                                contextValue.socket.emit('model-response', {
                                                    status: 3,
                                                    modelNumber: model.modelNumber
                                                })
                                                handleClose()
                                                props.onClose(model.modelNumber, 3)
                                            }}
                                        />
                                        <ButtonComponent
                                            label={intl.formatMessage(buttonMessages.reject)}
                                            onClick={() => setShowCommentsForm(true)}
                                        />
                                    </>
                                )}
                                {showCommentsForm && (
                                    <CommentsForm
                                        onCancel={() => setShowCommentsForm(false)}
                                        onSubmit={(data) => {
                                            contextValue.socket.emit('model-response', {
                                                status: 0,
                                                modelNumber: model.modelNumber,
                                                comments: data.comments
                                            })
                                            handleClose()
                                            props.onClose(model.modelNumber, 0)
                                        }}
                                    />
                                )}
                            </>
                        )}
                        {model.status === 3 && (
                            <>
                                {!showUpdatePriceForm && (
                                    <ButtonComponent
                                        label={intl.formatMessage(modelsPageMessages.updatePrice)}
                                        onClick={() => setShowUpdatePriceForm(true)}
                                    />
                                )}
                                {showUpdatePriceForm && (
                                    <UpdatePriceForm
                                        onCancel={() => setShowUpdatePriceForm(false)}
                                        onSubmit={(data) => {
                                            handleClose()
                                            onUpdatePrice(data)
                                        }}
                                    />
                                )}
                            </>
                        )}
                    </>
                )}
                {model.status === 0 && (
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
                                                onSubmit={(data) => {
                                                    setShowUpdateForm(false)
                                                    onUpdateModel(data)
                                                }}
                                            />
                                        )}
                                    </>
                                )}
                            </Stack>   
                        )}
                    </>
                )}
                {model.status === 4 && (
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