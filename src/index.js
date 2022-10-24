const { spawn } = require('node:child_process');
const { resolve } = require('node:path');
const name = process.env.NAME;

const pathToChild = resolve(__dirname, 'child/child.js')

const cp = spawn('node', [pathToChild, name.toString()]);

cp.stdout.on('data', (data) => {
    console.log(data.toString())
})