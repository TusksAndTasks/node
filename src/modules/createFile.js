const fs = require('node:fs');
const path = require('node:path')

const createFile = (response, request) => {

    let fullRequestData = '';

    request.on('data', (data) => {
        fullRequestData = fullRequestData ? fullRequestData + data : data;
    })

    request.on('end', () => {
       const parsedData = JSON.parse(fullRequestData);
       const filePath = path.join(__dirname, '..', 'files', `content.${parsedData.extension}`);
       const writeStream = fs.createWriteStream(filePath);
       writeStream.write(JSON.stringify(parsedData.data));
    } )

    response.status = 200;
    response.end(JSON.stringify(` Yor data written in file content`));
}

module.exports = {createFile};


// Вариант с пайпом не работает, так как нужно найти расширение. Трансформирующий поток работает с битными данными, так что особо не помогает. Сам пайп данных из реквеста в файл более чем возможен, но вот парсинг реквеста проблематичен. Оставляю здесь, чтобы потом вернуться и еще раз попробовать, я на этом пару часов уже убил.
//  let pathToNewFile;
//
//  const parser = new Transform({
//      transform(chunk) {
//          const parsedData = JSON.parse(chunk);
//          pathToNewFile = path.join(__dirname, '..', 'files', `contnet.${parsedData.extension}`);
//          this.push(parsedData.data)
//      },
//  })
//
//
// request.pipe(parser).pipe(fs.createWriteStream(pathToNewFile));