import axios from 'axios'
import customersSlice from './customer-slice'
import store from '../index'
import { customersSelectore, requestsSelector } from './customer-selector'
import userApi from '../user/user-api'


const customerRoute = `${process.env.SERVER_URL}/customer`
const state = store.getState()

const loadCustomers = async () => {
    const token = userApi.getUserToken(store.getState())
    console.log(token, state)
    const response = await axios.get(`${customerRoute}/customers`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    
    if (response.status === 200) {
        store.dispatch(customersSlice.actions.loadCustomers({customers: response.data.customers}))
        return response.data.customers
    }
}


const retrieveCustomer = async () => {
    const customersState = customersSelectore(store.getState())
    console.log(customersState)
    if (customersState.length === 0) {
        const customers = await loadCustomers();
        return customers
    } else {
        return customersState
    }
}

const loadRequests = async () => {
    const token = userApi.getUserToken(store.getState())
    const response = await axios.get(`${customerRoute}/requests`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (response.status === 200) {
        store.dispatch(customersSlice.actions.loadRequests({requests: response.data.requests}))
        return response.data.requests
    }
}

const retrieveRequests = async () => {
    const requestsState = requestsSelector(store.getState())
    if (requestsSelector.length === 0) {
        const requests = await loadRequests();
        return requests
    } else {
        return requestsState
    }
}

const loadCustomer = async (customerId) => {
    const token = userApi.getUserToken(store.getState())
    const response = await axios.get(`${customerRoute}/customer/${customerId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (response.status === 200) {
        return response.data.customer
    }
}

const getRequestStatus = async (customerId) => {
    const requestsState = requestsSelector(state);
    let requests
    if (requestsSelector.length === 0) {
        requests = await loadRequests();
    } else {
        requests = requestsState
    }
    const request = requests.find((req) => req.customerId === customerId)
    return request.status

}


const customersApi = {
    loadCustomers,
    retrieveCustomer,
    loadRequests,
    retrieveRequests,
    loadCustomer,
    getRequestStatus
}

export default customersApi