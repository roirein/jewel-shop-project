import ModalComponent from '../../../components/UI/ModalComponent'
import { useIntl } from 'react-intl'
import { buttonMessages, modelsPageMessages, ordersPageMessages  } from '../../../translations/i18n'
import { Stack, useTheme } from "@mui/system";
import ButtonComponent from '../../../components/UI/ButtonComponent';
import { useContext, useEffect, useState } from 'react';
import ModelCardComponent from './ModelCard';
import CenteredStack from '../../../components/UI/CenteredStack';
import CommentsForm from './CommentForm';
import { Typography } from '@mui/material';
import UpdateForm from './updateForm';
import UpdatePriceForm from './updatePriceForm';
import modelsApi from '../../../store/models/models-api';
import { useSelector } from 'react-redux';
import userApi from '../../../store/user/user-api';
import notifcationsApi from '../../../store/notifications/notification-api';


const ModelModalComponent = (props) => {

    const intl = useIntl();
    const theme = useTheme();

    const [model, setModel] = useState({});
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [status, setStatus] = useState(0)
    const user = useSelector((state) => userApi.getUser(state))

    const handleClose = () => {
        setStatus(0)
        props.onClose()
    }

    useEffect(() => {
        if (props.open && props.modelNumber) {
            modelsApi.loadModel(props.modelNumber).then((result) => {
                setModel(result.model)
                notifcationsApi.readNotification(props.modelNumber, 'model')
            })
        }
    }, [props.open, props.modelNumber])

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
        await modelsApi.updateModel(formData, props.modelNumber);
        handleClose()
    }

    const onUpdatePrice = async (data) => {
        await modelsApi.updateModelPrice(data, model.modelNumber)
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
                image={model.imageUrl}
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
                {user.permissionLevel === 1 && (
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
                                        onSubmit={async (data) => {
                                            await modelsApi.sendComment(data, props.modelNumber)
                                            handleClose()
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
                        {model.comment && (
                            <Stack
                                width="100%"
                                sx={{
                                    direction: theme.direction
                                }}
                                rowGap={theme.spacing(3)}
                            >
                                <Typography>
                                    {`${intl.formatMessage(ordersPageMessages.comments)}: ${model.comment}`}
                                </Typography>
                                {user.permissionLevel === 2 && (
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
                            {`${intl.formatMessage(modelsPageMessages.materials)}: ${model.materials}`}
                        </Typography>
                        <Typography>
                            {`${intl.formatMessage(modelsPageMessages.priceWithMaterials)}: ${model.priceWithMaterials}`}
                        </Typography>
                        <Typography>
                            {`${intl.formatMessage(modelsPageMessages.priceWithoutMaterials)}: ${model.priceWithoutMaterials}`}
                        </Typography>
                    </Stack>
                )}
            </CenteredStack>
        </ModalComponent>
    )
}

export default ModelModalComponent