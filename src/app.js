const express = require('express');
const next = require('next');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path')
require('dotenv').config();
const sequelize = require('./server/database/connection');
const { createNewUser, createNewEmployee } = require('./server/utils/user');

const userRoute = require('./server/routes/users');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev, dir: path.join(__dirname, 'client')});
const handle = nextApp.getRequestHandler();
const port = process.env.PORT

// sequelize.sync({force: true}).then(() => {
//     createNewUser('Roi', 'Rein', 'roirein@gmail.com', 'Roi@6431368', '0547224004', 1).then((user) => {
//         createNewEmployee(user.userId, false)
//     })
// })

nextApp.prepare().then(() => {
    const app = express();
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

    app.listen(port, () => {
        console.log(`server is up and running on port ${port}`)
    })
})