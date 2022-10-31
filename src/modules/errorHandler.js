const errorHandler = ( error, req, res, next ) => {
    console.log(231231321);
    if (res.headersSent) {
        return next(error)
    }
    res.status(500).json(`Hmmm.Something is wrong - ${error.message} `);
}

module.exports = {errorHandler}