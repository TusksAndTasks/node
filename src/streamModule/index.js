const fs = require('node:fs')
const path = require('node:path')

const readStream = fs.createReadStream(path.resolve(__dirname, 'files', 'content.txt'), {highWaterMark: 2});

readStream.on('data', (data) => {
    readStream.pause()
    setTimeout(() => {
        console.log(data.toString());
        readStream.resume()
    }, 1000);
})

const { Duplex, PassThrough } = require('node:stream');
class DuplexCustom extends Duplex {
    constructor(options) {
        super(options);
    }

    _read(){
    }

    _write(chunk, encoding, callback){
        this.push(chunk);
    }
}

const duplex = new DuplexCustom({readableHighWaterMark: 4, writableHighWaterMark: 8});

const processWriteStream = fs.createWriteStream(path.resolve(__dirname, 'files', 'new.txt'), {highWaterMark: 8});

process.stdin.pipe(duplex).pipe(processWriteStream);


// let dataChunks = [];
//
//
// process.stdin.on('data', (chunk) => {
//     process.stdin.pause();
//
//
//
//
//
// } )
// const processWriteStream = fs.createWriteStream(path.resolve(__dirname, 'files', 'new.txt'), {highWaterMark: 8});
//
//
//
// process.stdin.pipe(processWriteStream);







