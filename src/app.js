const express = require('express');
const app = express();
const { indexRouter } = require('./routes/index.route');
const { errorHandler, notFoundHandler, validationErrorHandler } = require('./middlewares/error.middleware');
const passport = require('passport');

const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const userYaml = YAML.load('user.yaml');
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(userYaml));

app.use(express.json());
app.use(indexRouter);
app.use(passport.initialize());
app.use(validationErrorHandler);
app.use(notFoundHandler)
app.use(errorHandler);

exports.app = app;