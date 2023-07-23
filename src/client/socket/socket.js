import {io} from 'socket.io-client';

let socket = null;

export const initSocket = (userId) => {
    console.log(userId)
    socket = io(process.env.SERVER_URL)
    socket.emit('login', {
        userId
    })
    console.log('connected')
}

export const getSocket = () => {
    console.log(socket, 1)
    return socket
}