const mongoose = require('mongoose');
require('dotenv').config();

const dbURI = process.env.MONGODB;

mongoose
    .connect(
        dbURI, 
        {
            dbName: process.env.DB_NAME,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
    .then(() => {
        console.log("Mongo connected successfully!")})
    .catch(err => {
        console.log(err.message);
    })

mongoose.connection.on('connected', () => {
    console.log("Mongoose connected!");
})

mongoose.connection.on('error', (error) => {
    console.log(error.message);
})

mongoose.connection.on('disconnected', () => {
    console.log("Mongoose disconnected!");
})

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
})