const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();
var http = require('http').Server(app);
var io = require('socket.io',{})(http);
const util = require('util')
var fullData = require('./data')
var encuestasInfo = require('./encuestasR')
var contadorPersonas = 0;
var server = require('ws').Server;
var s = new server({port:3001})
var encuestaData = '';
var respuesta = [0,0,0,0];

s.on('connection',function(ws){
    ws.on('message',function(data,value){

    })
})

app.use('/',express.static(path.resolve(__dirname, '../../public')));

app.post('/check',(req,res)=>{
    if(JSON.stringify(fullData.profesor) === '{}' || JSON.stringify(fullData.profesor) == undefined || JSON.stringify(fullData.profesor.id) == 1){
        res.json({'profesorServer':'false'})
    }else{
        res.json({'profesorServer':'true','fil':fullData.profesor.fila,'col':fullData.profesor.columna})
    }
})

app.get('/',(req,res)=>{
    res.sendFile(path.resolve(__dirname + '/../../public/Login/index.html'))
})

app.get('/chat',(req,res)=>{
    res.sendFile(path.resolve(__dirname + '/../../public/Chat/index.html'))
})


io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('loginProfesor', function(data){
        data.id = socket.id;
        fullData.profesor = data;
        //console.log(util.inspect(fullData, false, null))
        socket.emit('sendMatrixSize',fullData.profesor.fila,fullData.profesor.columna);
        io.sockets.emit('generalMatrix',fullData);
        io.sockets.emit('checkLabel',fullData);
        io.sockets.emit('isConnected',fullData.profesor);
        var objeto = {'profesorServer':'true','fil':fullData.profesor.fila,'col':fullData.profesor.columna};
        io.sockets.emit('profesorLogeado', objeto)
    });

    socket.on('sillasOcupadas',function(){
        io.sockets.emit('checkLabel',fullData);
    });

    socket.on('loginEstudiante', function(data){
        data.id = socket.id;
        fullData.estudiante[contadorPersonas] = data;
        //console.log(util.inspect(fullData, false, null))
        socket.emit('sendMatrixSize',fullData.profesor.fila,fullData.profesor.columna);
        io.sockets.emit('generalMatrix',fullData);
        io.sockets.emit('checkLabel',fullData);
        io.sockets.emit('newEncuesta',encuestaData);
        io.sockets.emit('isConnected',fullData.estudiante[contadorPersonas]);
        io.sockets.emit('checkButton',encuestasInfo);
        contadorPersonas++;
    });

    socket.on('ProfesorTyping',function(data){
        io.sockets.emit('ProfesorTypingAll',data);
    })

    socket.on('ProfesorisNotTyping',function(data){
        io.sockets.emit('ProfesorisNotTypingAll',data);
    })

    socket.on('EstudianteTyping',function(data){
        io.sockets.emit('EstudianteTypingAll',data);
    })

    socket.on('EstudianteisNotTyping',function(data){
        io.sockets.emit('EstudianteisNotTypingAll',data);
    })

    socket.on('newMessage',function(data,value){
        //console.log("llego un mensaje")
        io.sockets.emit('newMessage',data,value);
    })

    socket.on('sendEncuesta',function(data){
        encuestaData = data;
        io.sockets.emit('newEncuesta',encuestaData);
    })

    socket.on('sendEncuestaResponse',function(response,person,option){
        encuestasInfo.encuestas.push({
            person:person,
            response : response,
            option: option
        })
        
        respuesta[encuestasInfo.encuestas[encuestasInfo.encuestas.length-1].option]++;
        io.sockets.emit('newResponseEncuesta',encuestasInfo.encuestas,respuesta);
    })

    socket.on('forceDisconnect', function(){
        console.log("llego")
        socket.disconnect();
    });

    socket.on('disconnect', function(){
        console.log("Al comienzo"+util.inspect(fullData, false, null))
        if(fullData.profesor.id == socket.id){

            io.sockets.emit('disconnectAllSockets');
            io.sockets.emit('disconnectProf', fullData);
            contadorPersonas = 0;
            fullData = {
                "profesor" : {
                    "id" : 1
                },
                "estudiante" : []
            }
            
        }else{

           for (var key in fullData.estudiante) {
                if (fullData.estudiante[key].id == socket.id){
                    io.sockets.emit('isDisconnected',fullData.estudiante[key]);
                    delete fullData.estudiante[key];
                    contadorPersonas--;
                } 
            }
            fullData.estudiante = fullData.estudiante.filter(function(x) {
                return (x !== (undefined || 'a' || ''));
            });
        }
        
        //console.log(util.inspect(fullData, false, null))
        io.sockets.emit('generalMatrix',fullData);
        console.log("un usuario se ha desconectado")
        //console.log("Al final"+util.inspect(fullData, false, null))
    });

});


http.listen(port,()=>{
    console.log('Corriendo en el puerto 3000')
})