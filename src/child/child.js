
const greeting = (name) => process.stdout.write(`Hello, ${name}`)


process.stdin.on('data', greeting(process.argv[2]));