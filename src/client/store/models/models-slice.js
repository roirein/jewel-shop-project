import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    models: []
}

const modelsSlice = createSlice({
    name: 'models',
    initialState,
    reducers: {
        loadModels(state, action) {
            state.models = action.payload.models
        },
        addNewModel(state, action) {
            state.models = [...state.models, action.payload.model]
        },
        updateModel(state, action) {
            const models = [...state.models];
            const modelIndex = models.findIndex((mod) => mod.modelNumber === action.payload.model.modelNumber)
            models[modelIndex] = action.payload.model
            state.models = [...models]
        }
    }
})

export default modelsSlice