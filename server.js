const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const epxhbs = require('express-handlebars');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const home = require('./routers/home');

const handlebars = epxhbs.create({
    defaultLayout: __dirname + '/views/layouts/main',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials/'
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//router
app.use(home);

var users = [];
var usersOnilne = [];

io.on('connection', (socket)=> {
    console.log('1 nguoi vua truy cap!', socket.id);
    socket.on('client-login', (username)=> {
        // console.log(username);
        if (users.includes(username)) { //username already exits
            socket.emit('server-send-login-fail');
        } else { //login success
            socket.username = username;
            users.push(username);
            socket.emit('server-send-login-success', username);
            io.sockets.emit('server-send-list-useronline', users);
        }
    });
    socket.on('client-send-messsage', message => {
        io.sockets.emit('server-send-new-message', {message : message, username : socket.username});
    });
    socket.on('user-logout', ()=> {
        users.splice(users.indexOf(socket.username));
        socket.broadcast.emit('server-send-list-useronline', users);
    }); 
    socket.on('disconnect', ()=> {
        users.splice(users.indexOf(socket.username));
        socket.broadcast.emit('server-send-list-useronline', users);
        console.log('1 nguoi vua thoat!');
    });
});

server.listen(process.env.PORT || 6900, ()=> {
    console.log('Server dang hoat dong tai cong',6900);
});
