var socket = io();

$(document).ready(()=>{
    $('.loginBox').show();
    $('.chatBox').hide();
    $('#frmLogin').submit((e)=> {
        e.preventDefault();
        let txtUsername = $('#txtUsername').val();
        socket.emit('client-login', txtUsername); 
        $('#txtUsername').val(''); 
    });

    $('#frmMessage').submit((e)=> {
        e.preventDefault();
        let txtMessage = $('#txtMessage').val();
        socket.emit('client-send-messsage', {message: txtMessage, username: $('#username').text()}); 
        $('#txtMessage').val(''); 
    });

    $('#logout').click(()=> {
        $('.loginBox').show();
        $('.chatBox').hide();
    })
    socket.on('server-send-login-success', (username)=> {
        $('.loginBox').hide();
        $('.chatBox').show();
        $('#username').text(username);
    });
    
    socket.on('server-send-login-fail', ()=> {
        $('.alert').show();
    });
    
    socket.on('server-send-new-message', (data)=> { 
         let divMessage = $('#username').text() == data.username ? 
        `<div class="msg mechat clearfix"><strong>${data.message}</div>`
         : 
         `<div class="msg youchat clearfix"><strong>${data.username}</strong>: ${data.message}</div>`
         $('.messageContent').append(divMessage);
        $('.messageContent').animate({scrollTop:$(this).height()}, 'fast');
    });
});