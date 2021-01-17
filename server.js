var express = require('express')
var app = express()
var port = process.env.port || 8080


var loadingController = require('./src/app/Controller/LoadingController')


app.use('/loading-file', [loadingController.store])

app.listen( port, function() {
    var datetime = new Date()
    var message = `Server ITGest up on Port: ${port} Started at : ${datetime}`
    console.log(message)
})