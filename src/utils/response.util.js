exports.getSuccessResponse = (message, data = null) => {
    const response = {
        status: "success",
        message
    }
    if (data) response.data = data;
    return response;
}

exports.getFailuerResponse = (statusCode, message) => {
    return {
        status: "error",
        error: {
            message,
            statusCode,
        },
    };
};
