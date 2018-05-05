var blobURL;
const recordAudio = () => new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
    });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];
    mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
    });
    const start = () => mediaRecorder.start();
    const stop = () => new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            const play = () => audio.play();
            resolve({
                audioBlob,
                audioUrl,
                play
            });
        });
        mediaRecorder.stop();
    });
    resolve({
        start,
        stop
    });
});
function grabar(){
const sleep = time => new Promise(resolve => setTimeout(resolve, time));
(async () => {
    const recorder = await recordAudio();
  
    recorder.start();
    await sleep(3000);
    const audio = await recorder.stop();
    blobURL = audio.audioUrl;
    console.log(audio.audioUrl);
    console.log("ASHASHSH")
    audio.play();
    var reproductor = document.getElementById('audioo');
    reproductor.src = audio.audioUrl;
    socket.emit('newNotaVoz',blobURL);

})();
}

/*
// Guardar en el servidor 
var file = {};
var xhr = new XMLHttpRequest();
xhr.open('GET', blobURL, true);
xhr.responseType = 'blob';
xhr.onload = function(e) {
    if (this.status == 200) {
        file.file = this.response;
        file.name = "whatever_filename.mp3";
        file.size = getYourBlobSize();
        file.type = "audio/mpeg";
        uploadAudioBlobs(file);
    }
}; */
xhr.send();