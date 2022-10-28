const { spawn } = require('node:child_process');
const { resolve } = require('node:path');

const pathToRes = resolve(__dirname, 'servers/resServer.js')
const pathToReq = resolve(__dirname, 'servers/reqServer.js')

let resCp = spawn('node', [pathToRes]);
let reqCp = spawn('node', [pathToReq])

resCp.stdout.on('data', (data) => {
    console.log(data.toString())
})

reqCp.stdout.on('data', (data) => {
    console.log(data.toString())
})