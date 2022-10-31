const express = require('express');

const { createFile } = require('./modules/createFile')
const { readFile } = require('./modules/readFile')
const { updateFile } = require('./modules/updateFile')
const { deleteFile } = require('./modules/deleteFile')
const { errorHandler } = require('./modules/errorHandler')

const app = express();
const PORT = 3000;

app.post('/create', createFile );
app.get(/read/, readFile);
app.patch('/update', updateFile);
app.delete(/delete/, deleteFile);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Running on 3000`));