const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();
var http = require('http').Server(app);
var io = require('socket.io', {})(http);
const util = require('util')
var fullData = require('./data')
var multer = require('multer');
var encuestasInfo = require('./encuestasR')
var fullDataGroups = require('./workGroup')

var contadorPersonas = 0;
var server = require('ws').Server;
var s = new server({
    port: 3001
})
var encuestaData = [];
var respuesta = []; // A, B, C, D

var actualImage;
var arrayImage = [];
var socketsID = [
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
];

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/uploads');
    },
    filename: function (req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp4|wav|mepg|avi|flv)$/)) {
            return callback(new Error('Only image files are allowed!'));
        }
        actualImage = Date.now() + file.originalname;
        arrayImage.push(actualImage)
        callback(null, actualImage)
    }
})

var upload = multer({
    storage: storage
}).fields([{
        name: 'filetoupload',
        maxCount: 1
    },
    {
        name: 'filetouploadpv2',
        maxCount: 1
    }
])

app.post('/imageUpload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            res.send({
                resp: 'invalidFile'
            });
            res.end();
        }
        if (req.files.filetoupload) {
            var archivo = req.files.filetoupload[0]
        } else if (req.files.filetouploadpv2) {
            var archivo = req.files.filetouploadpv2[0]
        }
        if (archivo) {
            var formatImg = /jpg|jpeg|png|gif/;
            var imagen = formatImg.test(archivo.mimetype);

            var formatVideo = /mp4|wav|mepg|avi|flv|3gp/;
            var video = formatVideo.test(archivo.mimetype);

            if (imagen) {
                res.send({
                    resp: 'image'
                });
            }
            if (video) {
                res.send({
                    resp: 'video'
                });
            }
        }
        res.end()
    })
})



s.on('connection', function (ws) {
    console.log("conectado en ws")
    ws.on('message', function (data, value) {

    })
})

app.use('/', express.static(path.resolve(__dirname, '../../public')));

app.post('/check', (req, res) => {
    if (JSON.stringify(fullData.profesor) === '{}' || JSON.stringify(fullData.profesor) == undefined || JSON.stringify(fullData.profesor.id) == 1) {
        res.json({
            'profesorServer': 'false'
        })
    } else {
        res.json({
            'profesorServer': 'true',
            'fil': fullData.profesor.fila,
            'col': fullData.profesor.columna
        })
    }
})

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../../public/Login/index.html'))
})

app.get('/chat', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../../public/Chat/index.html'))
})



io.on('connection', function (socket) {
    console.log('a user connected');


    socket.on('loginProfesor', function (data) {
        data.id = socket.id;
        fullData.profesor = data;
        //console.log(util.inspect(fullData, false, null))
        socket.emit('sendMatrixSize', fullData.profesor.fila, fullData.profesor.columna);
        io.sockets.emit('generalMatrix', fullData);
        io.sockets.emit('checkLabel', fullData);
        io.sockets.emit('isConnected', fullData.profesor);
        var objeto = {
            'profesorServer': 'true',
            'fil': fullData.profesor.fila,
            'col': fullData.profesor.columna
        };
        io.sockets.emit('profesorLogeado', objeto)
    });

    socket.on('sillasOcupadas', function () {
        io.sockets.emit('checkLabel', fullData);
    });

    socket.on('loginEstudiante', function (data) {
        data.id = socket.id;
        fullData.estudiante[contadorPersonas] = data;
        socketsID[data.fila - 1][data.columna - 1] = socket.id;
        //console.log(util.inspect(socketsID, false, null))
        socket.emit('sendMatrixSize', fullData.profesor.fila, fullData.profesor.columna);
        io.sockets.emit('generalMatrix', fullData);
        io.sockets.emit('checkLabel', fullData);
        io.sockets.emit('newEncuesta', encuestaData);
        io.sockets.emit('isConnected', fullData.estudiante[contadorPersonas]);
        io.sockets.emit('checkButton', encuestasInfo);
        if (fullDataGroups.groups.length > 0) {
            io.sockets.emit('dataAllGroups', fullDataGroups.groups);
        }
        contadorPersonas++;
    });

    socket.on('ProfesorTyping', function (data) {
        io.sockets.emit('ProfesorTypingAll', data);
    })

    socket.on('ProfesorisNotTyping', function (data) {
        io.sockets.emit('ProfesorisNotTypingAll', data);
    })

    socket.on('EstudianteTyping', function (data) {
        io.sockets.emit('EstudianteTypingAll', data);
    })

    socket.on('EstudianteisNotTyping', function (data) {
        io.sockets.emit('EstudianteisNotTypingAll', data);
    })

    // ------ >  Mensajes <----
    // Mensaje texto
    socket.on('newMessage', function (data, value) {

        io.sockets.emit('newMessage', data, value);
    })
    // Mensaje imagen
    socket.on('newMessageImage', function (data) {

        io.sockets.emit('newMessageImage', data, arrayImage[arrayImage.length - 1]);
    })
    // Mensaje Video
    socket.on('newMessageVideo', function (data) {

        io.sockets.emit('newMessageVideo', data, arrayImage[arrayImage.length - 1]);
    })

    socket.on('newMessagePrivate', function (data, value, fila, columna) {
        socket.to(socketsID[fila][columna]).emit('newMessagePrivate', data, value, data.fila - 1, data.columna - 1);
        socket.emit('newMessagePrivate', data, value, fila, columna);
    })

    socket.on('newMessageImagePrivate', function (data, fila, columna) {
        //console.log("llego un mensaje")
        socket.to(socketsID[fila][columna]).emit('newMessageImagePrivate', data, arrayImage[arrayImage.length - 1], data.fila - 1, data.columna - 1);
        socket.emit('newMessageImagePrivate', data, arrayImage[arrayImage.length - 1], fila, columna);
    })

    socket.on('newMessageVideoPrivate', function (data, fila, columna) {
        //console.log("llego un mensaje")
        socket.to(socketsID[fila][columna]).emit('newMessageVideoPrivate', data, arrayImage[arrayImage.length - 1], data.fila - 1, data.columna - 1);
        socket.emit('newMessageVideoPrivate', data, arrayImage[arrayImage.length - 1], fila, columna);
    })

    socket.on('newMessageGrupal', function (data, value, color) {
        var messagePosition= {
            p : []
        }

        fullDataGroups.groups.forEach(function (element) {
            if (element.color == color) {
                messagePosition.p.push({fila:element.lead.fila-1,columna:element.lead.columna-1});
                element.students.forEach(function (student,index) {
                    messagePosition.p.push({fila:student.fila,columna:student.columna});
                })
            }
        })

        fullDataGroups.groups.forEach(function (element) {
            if (element.color == color) {
                if (socket.id == element.id) {
                    socket.emit('newMessageGrupalRe', data, value, color, messagePosition.p);
                } else {
                    socket.to(element.id).emit('newMessageGrupalRe', data, value, color, messagePosition.p);
                }
                element.students.forEach(function (student) {
                    if (socket.id == socketsID[student.fila][student.columna]) {
                        socket.emit('newMessageGrupalRe', data, value, color, messagePosition.p);
                    } else {
                        socket.to(socketsID[student.fila][student.columna]).emit('newMessageGrupalRe', data, value, color, messagePosition.p);
                    }
                })
            }
        })
        //socket.to(socketsID[fila][columna]).emit('newMessageGrupal', data, value,color);
        socket.emit('newMessageGrupal', data, value, color);
    })

    socket.on('sendEncuesta', function (data) {
        encuestaData.push(data);
        respuesta.push([0, 0, 0, 0]);
        io.sockets.emit('newEncuesta', encuestaData);
    })

    socket.on('sendEncuestaResponse', function (idEncuesta, response, person, option) {
        encuestasInfo.encuestas.push({
            id: idEncuesta,
            person: person,
            response: response,
            option: option
        })
        var opcion = encuestasInfo.encuestas[encuestasInfo.encuestas.length - 1].option;
        respuesta[idEncuesta][opcion]++;
        //console.log(util.inspect(respuesta, false, null));
        io.sockets.emit('newResponseEncuesta', encuestasInfo.encuestas, respuesta);
    })

    socket.on('sendGroupData', function (data) {
        data.id = socketsID[data.lead.fila - 1][data.lead.columna - 1];
        data.students.forEach(function (element) {
            element.id = socketsID[element.fila][element.columna]
        })
        fullDataGroups.groups.push(data);
        //console.log(util.inspect(fullDataGroups.groups, false, null));
        io.sockets.emit('dataAllGroups', fullDataGroups.groups);
    })

    socket.on('forceDisconnect', function () {
        console.log("llego")
        socket.disconnect();
    });

    socket.on('disconnect', function () {
        console.log("Al comienzo" + util.inspect(fullData, false, null))
        if (fullData.profesor.id == socket.id) {

            io.sockets.emit('disconnectAllSockets');
            io.sockets.emit('disconnectProf', fullData);
            contadorPersonas = 0;
            fullData = {
                "profesor": {
                    "id": 1
                },
                "estudiante": []
            }
            socketsID = [
                [-1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1],
            ];

            fullDataGroups = {
                groups: []
            }

        } else {

            fullDataGroups.groups.forEach(function (element) {
                console.log(socket.id)
                if (element.id == socket.id) {
                    element.lead = ''
                    console.log("lider")
                } else {
                    element.students.forEach(function (student, index) {
                        console.log(student.fila)
                        console.log(student.columna)
                        console.log(util.inspect(socketsID, false, null))
                        if (socketsID[student.fila][student.columna] == socket.id) {
                            delete element.students[index];
                            console.log(util.inspect(element.students[index], false, null))
                            console.log("no lider")
                            element.students = element.students.filter(function (x) {
                                return (x !== (undefined || 'a' || ''));
                            });
                        }
                    })
                }
            })

            for (var key in fullData.estudiante) {
                if (fullData.estudiante[key].id == socket.id) {
                    io.sockets.emit('isDisconnected', fullData.estudiante[key]);
                    socketsID[fullData.estudiante[key].fila - 1][fullData.estudiante[key].columna - 1] = -1;
                    delete fullData.estudiante[key];
                    contadorPersonas--;
                    //console.log(util.inspect(fullDataGroups, false, null))
                }
            }



            console.log(util.inspect(fullDataGroups, false, null))

            fullData.estudiante = fullData.estudiante.filter(function (x) {
                return (x !== (undefined || 'a' || ''));
            });
        }

        //console.log(util.inspect(fullData, false, null))
        io.sockets.emit('generalMatrix', fullData);
        if (fullDataGroups.groups.length > 0) {
            io.sockets.emit('dataAllGroups', fullDataGroups.groups);
        }
        console.log("un usuario se ha desconectado")
        //console.log("Al final"+util.inspect(fullData, false, null))
    });

});


http.listen(port, () => {
    console.log('Corriendo en el puerto 3000')
})