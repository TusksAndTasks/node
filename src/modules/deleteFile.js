const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');


const deleteFile = (request, response, next) => {
    const fileName = url.parse(request.url).pathname.split('/')[2]
    const filePath = path.join(__dirname, '..', 'files', fileName);

    fs.unlink(filePath, (err) => {
        if (err) throw err;
        response.status(200).json(`File ${fileName} deleted`);
        next();
    })
}

module.exports = {deleteFile}