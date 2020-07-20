const express = require('express');
const app = express();


app.get("/", (req, res)=>{
    res.send('hello world')
})

const PORT = 1000;


app.listen(1000, ()=>{
    console.log(`Server listening on port: ${PORT}`)
})
