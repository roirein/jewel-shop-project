const express = require('express');
const {createServer} = require('http');
const socketio = require('socket.io')
const next = require('next');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path')
require('dotenv').config();
const sequelize = require('./server/database/connection');
const {initSocket} = require('./server/services/sockets/socket');
const { createNewUser, createNewEmployee } = require('./server/utils/user');
const ModelPrice =  require('./server/models/models/modelPrice')
const userRoute = require('./server/routes/users');
const customerRoute = require('./server/routes/customers');
const employeeRoute = require('./server/routes/employees');
const modelRoute = require('./server/routes/models');
const orderRoute = require('./server/routes/orders')

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev, dir: path.join(__dirname, 'client')});
const handle = nextApp.getRequestHandler();
const port = process.env.PORT

// sequelize.sync({force: true}).then(() => {
//     createNewUser('Roi', 'Rein', 'roirein@gmail.com', 'Roi@6431368', '0547224004', 1).then((user) => {
//         createNewEmployee(user.userId, false, 1)
//     })
//     createNewUser('Itay', 'Rein', 'roirein28@gmail.com', 'Rein@6431368', '0549949976', 2).then((user) => {
//         createNewEmployee(user.userId, false, 2)
//     })
// })

nextApp.prepare().then(() => {

    const app = express();
    const server = createServer(app)
    const io = socketio(server)

    initSocket(io)

    app.use(express.json())
    app.use(morgan('dev'));
    app.use(cors());

    app.use('/user', userRoute);
    app.use('/customer', customerRoute)
    app.use('/employee', employeeRoute)
    app.use('/model', modelRoute)
    app.use('/order', orderRoute)

    app.use((err, req, res, next) => {
        console.log(err.status)
        res.status(err.status || 500).send(err.message)
    })

    app.all('*', (req, res) => {
        return handle(req, res)
    });

    server.listen(port, () => {
        console.log(`server is up and running on port ${port}`)
    })
})