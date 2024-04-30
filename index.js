require('dotenv').config()

if (process.env.DEBUG) {
    console.log(process.env);
}

const nodeRed = require('node-red/red');