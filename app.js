'use strict'

const Koa = require('koa')
const moment = require('moment')
const app = new Koa()
const http = require('http').createServer(app.callback())
const io = require('socket.io')(http)
const staticServe = require('koa-static')

var chatlog = new Map()
var userNum = 0

app.use(staticServe(__dirname + '/public'))

io.on('connection', (socket) => {
    console.log('a user connected ' + moment().format('lll'));
    ++userNum;
    for (let [time,massage] of chatlog) {
        socket.emit('chat message',massage)
    }
    socket.emit('chat massage','-----以上为历史消息-----')
    io.emit('chat message', '新加入一位用户，当前人数：' + userNum)

    socket.on('disconnect', () => {
        console.log('a user disconnected' + moment().format('lll'))
        --userNum
        io.emit('chat message', '一位用户退出了，当前人数：' + userNum)
    })

    socket.on('chat message', (msg) => {
        chatlog.set(new Date().getTime().toString(),msg)
        io.emit('chat message', msg)
    })
})

http.listen(3000)
console.log(`listening on 3000`);