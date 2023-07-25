import axios from "axios";
import store from '..'
import userApi from '../user/user-api'
import modelsSlice from "./models-slice";
import { modelsSelector, selectModel } from "./models-selector";
import { getSocket } from "../../socket/socket";

const modelsRoute = `${process.env.SERVER_URL}/model`

const loadModels = async () => {
    const token = userApi.getUserToken(store.getState())
    const response = await axios.get(`${modelsRoute}/metadata`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (response.status === 200) {
        store.dispatch(modelsSlice.actions.loadModels({models: response.data.models}))
        return response.data.models
    }
}

const retriveModels = async () => {
    let models = selectModel(store.getState());
    if (models.length === 0) {
        models = await loadModels();
    }
    return models
}

const getModels = (state) => {
    return selectModel(state)
}

const addNewModel = async (data) => {
    try {
        const token = userApi.getUserToken(store.getState())
        const response = await axios.post(`${modelsRoute}/model`, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': `multipart/form-data`
            }
        })
        if (response.status === 201) {
            const {title, ...model} = response.data.model
            store.dispatch(modelsSlice.actions.addNewModel({model}))
            const socket = getSocket();
            socket.emit('new-model', {
                modelNumber: response.data.model.modelNumber,
                title: response.data.model.title
            })
        }
    } catch (e) {
        throw(e)
    }
}

const loadModel = async (modelNumber) => {
    const token = userApi.getUserToken(store.getState())
    console.log(token, 12)
    const modelResponse = await axios.get(`${modelsRoute}/model/${modelNumber}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const modelImageResponse = await axios.get(`${modelsRoute}/image/${modelResponse.data.model.image}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
    });
    const image = URL.createObjectURL(modelImageResponse.data);
    let priceData = {}
    if (modelResponse.data.model.status === 2) {
        const priceDataResponse = await axios.get(`${modelsRoute}/price/${modelNumber}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        priceData = {...priceDataResponse.data.priceData}
    }
    let comment = ''
    if (modelResponse.data.model.status === -1) {
        const commentsResponse = await axios.get(`${modelsRoute}/model/comments/${modelNumber}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        comment = commentsResponse.data.comment
    }
    return {
        model: {
            ...modelResponse.data.model,
            imageUrl: image,
            ...priceData,
            comment
        }
    }
}

const updateModelPrice = async(data, modelNumber) => {
    const token = userApi.getUserToken(store.getState())
    const response = await axios.post(`${modelsRoute}/price/${modelNumber}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    })

    if (response.status === 201) {
        const models = selectModel(store.getState())
        let model = models.find((mod) => mod.modelNumber === modelNumber);
        model = {
            ...model,
            status: 2
        }
        store.dispatch(modelsSlice.actions.updateModel({model}))
        const socket = getSocket();
        socket.emit('model-approve', {
            modelNumber
        })
    }
}

const sendComment = async (data, modelNumber) => {
    const token = userApi.getUserToken(store.getState())
    const response = await axios.post(`${modelsRoute}/model/comments/${modelNumber}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    })

    if (response.status === 201) {
        const models = selectModel(store.getState())
        let model = models.find((mod) => mod.modelNumber === modelNumber);
        model = {
            ...model,
            status: -1
        }
        store.dispatch(modelsSlice.actions.updateModel({model}))
        const socket = getSocket();
        socket.emit('model-reject', {
            modelNumber
        })
    }
}

const updateModel = async (data, modelNumber) => {
    const token = userApi.getUserToken(store.getState());
    const response = await axios.put(`${modelsRoute}/model/${modelNumber}`, data, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': `multipart/form-data`
        }
    })
    if (response.status === 200) {
        const models = selectModel(store.getState())
        let model = models.find((mod) => mod.modelNumber === modelNumber);
        model = {
            ...model,
            status: 1
        }
        store.dispatch(modelsSlice.actions.updateModel({model}))
        const socket = getSocket();
        socket.emit('model-update', {
            modelNumber
        })
    }
}

const loadModelImage = async (imagePath) => {
    const token = userApi.getUserToken(store.getState());
    const imageResponse = await axios.get(`${modelsRoute}/image/${imagePath}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
    });

    return URL.createObjectURL(imageResponse.data)
}

const loadModelsForOrder = async () => {
    const token = userApi.getUserToken(store.getState());
    const response = await axios.get(`${modelsRoute}/models`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const models = response.data.models
    const imagePromises = models.map((model) => loadModelImage(model.image));
    const images = await Promise.all(imagePromises);
    models.forEach((model, index) => {
        model.imageUrl = images[index];
    }); 

    return models
}

const modelsApi = {
    loadModels,
    retriveModels,
    getModels,
    addNewModel,
    loadModel,
    updateModelPrice,
    sendComment,
    updateModel,
    loadModelsForOrder,
}

export default modelsApi