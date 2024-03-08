const { Joi, ValidationError, validate } = require('express-validation');
const { getFailuerResponse } = require('../utils/response.util');
const createError = require("http-errors");

const errorHandler = (err, req, res, next) => {
  const { status = 500 } = err;
  const errorMessage = err.message || "Something went wrong.";
  res.status(status).json(getFailuerResponse(status, errorMessage));
};

const notFoundHandler = (req, res, next) => {
  return next(createError(404, "Resource Not Found!"));
};

const validationErrorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    const { status = 500 } = err;
    let errorMessage;
    for (let entity of ['query', 'body', 'params']) {
      if (err.details[entity]) {
        errorMessage = err.details[entity][0].message;
        break;
      }
    }
    return res.status(status).json(getFailuerResponse(status, errorMessage));
  }
  next(err)
}

module.exports = { errorHandler, notFoundHandler, validationErrorHandler };