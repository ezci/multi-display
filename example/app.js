const express = require('express')
var bodyParser = require("body-parser")
var path = require('path')
const app = express()
const vncs = {}
var Vnc = require("../api/api.js").create
const port = 3000

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname + 'public/index.html'))
})

function getJson(vnc){
    return {"id":vnc.displayId, "port":vnc.port, "dsize":vnc.dsize, "url":vnc.url}
}

app.get('/list', (req, res) =>{
    res.send({
        "list":Object.keys(vncs).map(displayId=>getJson(vncs[displayId])),
        "dsize":process.env.DEFAULT_SIZE
    })
})

app.post('/create', (req, res) =>{
    let vnc = new Vnc({"dsize":req.body.dsize})
    vncs[vnc.displayId] = vnc
    res.send(getJson(vnc))
})

app.post('/run', (req, res) =>{
    var vnc = vncs[req.body.id]
    vnc.run(req.body.command)
    res.send("ok")
})


app.post('/kill', (req, res) =>{

    var vnc = vncs[req.body.id]
    vnc.kill()
    res.send("ok")
})

app.listen(port, () => console.log(`app listening at http://localhost:${port}`))