require("dotenv").config();
const { createServer } = require('http');
const { app } = require('./src/app');
const mongoose = require('mongoose');
const server = createServer(app);
require('./src/helpers/initRedis');

const port = parseInt(process.env.PORT);
const uri = process.env.URI;
mongoose.connect(uri).
    catch(err => {
        console.log(err);
    });

mongoose.connection.on('connected', () => {
    console.log("Database connected");
    server.listen(port, (req, res) => {
        console.log(`server is running on ${port}`);
    });
});

mongoose.connection.on('disconnected', () => {
    console.log('Database disconnected')
})