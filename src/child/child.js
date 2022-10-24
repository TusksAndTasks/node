
const greeting = (name) => process.stdout.write(`Hello world ${name}`)


process.stdin.on('data', greeting(process.argv[2]));