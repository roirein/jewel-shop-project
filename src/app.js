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

const userRoute = require('./server/routes/users');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev, dir: path.join(__dirname, 'client')});
const handle = nextApp.getRequestHandler();
const port = process.env.PORT

sequelize.sync({force: true}).then(() => {
    createNewUser('Roi', 'Rein', 'roirein@gmail.com', 'Roi@6431368', '0547224004', 1).then((user) => {
        createNewEmployee(user.userId, false)
    })
})

nextApp.prepare().then(() => {

    const app = express();
    const server = createServer(app)
    const io = socketio(server)

    initSocket(io)

    app.use(express.json())
    app.use(morgan('dev'));
    app.use(cors());

    app.use('/user', userRoute);

    app.use((err, req, res, next) => {
        console.log(err)
        res.status(err.status || 500).send(err.message)
    })

    app.all('*', (req, res) => {
        return handle(req, res)
    });

    server.listen(port, () => {
        console.log(`server is up and running on port ${port}`)
    })
})