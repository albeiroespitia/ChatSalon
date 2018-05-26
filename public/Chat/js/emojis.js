function MostrarEmoji(link, nombre) {
    floating({
        content: `<div class="chip cardEmoji">
        <img src="${link}">
        ${nombre}
        </div>`,
        number: 1,
        repeat: 1,
        duration: 7,

    });
}

$(document).on('click', '#emojiLike', function (event) {
    socket.emit("MostrarEmoji", datatoSend.nombre, "Chat/emojis/like.gif")
})
$(document).on('click', '#emojiRisa', function (event) {
    socket.emit("MostrarEmoji", datatoSend.nombre, "Chat/emojis/risa.gif")
})
$(document).on('click', '#emojiAngry', function (event) {
    socket.emit("MostrarEmoji", datatoSend.nombre, "Chat/emojis/angry.gif")
})
$(document).on('click', '#emojiLlorar', function (event) {
    socket.emit("MostrarEmoji", datatoSend.nombre, "Chat/emojis/llorar.gif")
})
socket.on('MostrarEmoji', function (nombre, link) {
    MostrarEmoji(link, nombre);
})