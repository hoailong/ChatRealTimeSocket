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
        socket.emit('client-send-messsage',txtMessage); 
        $('#txtMessage').val(''); 
    });

    $('#logout').click(()=> {
        $('.loginBox').show();
        $('.chatBox').hide();
        socket.emit('user-logout');
    })
    socket.on('server-send-login-success', (username)=> {
        $('.loginBox').hide();
        $('.chatBox').show();
        $('#username').text(username);
    });
    
    socket.on('server-send-login-fail', ()=> {
        $('.alert').show();
    });

    socket.on('server-send-list-useronline', data => {
        $('.list-users-online').html('');
        $('#users-online').text(data.length);
        data.forEach(user => {
            $('.list-users-online').append(`<li>${user}</li>`);
        });
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