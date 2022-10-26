const errorHandlerWrapper = (callback, response,  request ) => {
    return () => {
        try {
            callback(response, request)
        } catch (e) {
            response.status = 500;
            response.end(JSON.stringify(`Hmmm.Something is wrong - ${e.message} `))
        }
    }
}

module.exports = {errorHandlerWrapper}