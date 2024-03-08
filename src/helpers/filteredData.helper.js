exports.fieldsToSend = (data,fields) => {
    const filteredData = {};
    fields.forEach(field => {
        if (data[field] !== undefined) {
            filteredData[field] = data[field];
        }
    });
    return filteredData;
}