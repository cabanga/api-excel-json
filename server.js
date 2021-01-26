var express = require('express')
var app = express()
var port = process.env.port || 8080


var loadingController = require('./src/app/Controller/LoadingController')


app.use('/create-invoices', [loadingController.store])

app.listen( port, function() {
    var datetime = new Date()
    var message = `Server ITGest up on Port: ${port} Started at : ${datetime}`
    console.log(message)
})

/*
async function initLoading() {
    let href = 'http://localhost:8080/create-invoices'
    await fetch(href)
}

setInterval(initLoading, 5000)
*/