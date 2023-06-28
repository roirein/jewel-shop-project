const User = require("../../models/users/user");

let ioInstance = null;

const users = {}

const initSocket = (io) => {

    ioInstance = io

    ioInstance.on('connection', (socket) => {
        socket.on('login', (data) => {
            console.log(data)
            users[data.userId] = socket.id
        })
    })


}

const sendNewCustomerNotification = async (customerName) => {
    const manager = await User.findOne({
        where: {
            permissionLevel: 1
        }
    })
    const socketId = users[manager.dataValues.userId]
    if (socketId) {
        console.log('1')
        ioInstance.to(socketId).emit('newCustomer', {
            name: customerName
        })
    }
}

module.exports = {
    initSocket,
    sendNewCustomerNotification
}