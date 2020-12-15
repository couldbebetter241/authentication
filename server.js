const express = require('express');
const errOutput = require('http-errors');
const authRoute = require('./routes/authRoute');
require('./helpers/init_mongo');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use('/auth', authRoute);

app.use(async (req, res, next) => {
    next(errOutput.NotFound());
})

app.use((err, req, res, next) => {
    res.status(err.status || 500).send({
        status: err.status || 500,
        msg: err.message
    })
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));