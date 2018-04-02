sock.addEventListener('open', function (event) {
    var workGroupData = {
        students: [

        ],
        lead: '',
        color: '',
        id: ''
    }

    if (datatoSend.rol == 'Profesor') {
        $('.iconGroup').css({
            'display': 'none'
        })
    }

    window.posicionDouble = function (event, fila, col, color) {
        console.log("el color es" + color)
        //modalOpen = true;
        //clearInterval(refreshInterval);
        //document.getElementById("tablem").rows[fila - 1].cells[col - 1].classList.remove('transitionBorder');
        if (color == '1') {
            Materialize.toast('Esta persona no tiene un grupo', 4000)
        } else {
            if (datatoSend.rol == "Profesor") {
                $('#modalPg2').data('colorModal', color)
                $('#modalPg2').modal('open');
                $('.cardChatPg2').html(htmlGroupPrivado[fila - 1][col - 1])
                $('#BandejaPg2').scrollTop($('#BandejaPg2')[0].scrollHeight - $('#BandejaPg2')[0].clientHeight);
            } else {
                if (sessionStorage.getItem('myColor') == color) {
                    $('#modalPg2').data('colorModal', color)
                    $('#modalPg2').modal('open');
                    $('.cardChatPg2').html(htmlGroupPrivado[fila - 1][col - 1])
                    $('#BandejaPg2').scrollTop($('#BandejaPg2')[0].scrollHeight - $('#BandejaPg2')[0].clientHeight);
                } else {
                    Materialize.toast('Esta persona no pertenece a tu grupo', 4000)
                }
            }

        }


    }

    window.posicionGroup = function (fila, col) {
        if ((datatoSend.fila == fila) && (datatoSend.columna == col)) {
            Materialize.toast('No puedes seleccionarte a ti mismo', 4000)
        } else {
            if (document.getElementById("tableGr").rows[fila - 1].cells[col - 1].hasChildNodes()) {
                var tagTd2 = document.getElementById("tableGr").rows[fila - 1].cells[col - 1].childNodes;
                var style2 = window.getComputedStyle(tagTd2[2], null).getPropertyValue("border");
                if (style2.split(' ')[0] == `2px`) {
                    Materialize.toast('Este estudiante ya tiene un grupo', 4000)
                } else {
                    document.getElementById("tableGr").rows[fila - 1].cells[col - 1].classList.toggle('boxGroupSelected');
                }
            }
        }
    }

    $('#nextStep').click(function () {
        if ($('.tableWorkGroup').find('.boxGroupSelected').length > 0) {
            $('.tableWorkGroup').find('td').each(function () {
                if ($(this).hasClass('boxGroupSelected')) {
                    var filaTestG = $(this).attr("data-filaTest")
                    var colTestG = $(this).attr("data-colTest")
                    var objSelected = {
                        fila: filaTestG - 1,
                        columna: colTestG - 1
                    }
                    workGroupData.students.push(objSelected);
                    workGroupData.lead = datatoSend;
                }
            });
            var htmlPicker = $('.testModal').html();
            $('.testModal').remove();
            $('#modalGrupoTrabajo').html(htmlPicker);
            $('.color-picker').css({
                display: 'block'
            });
            $('.testModal').css({
                display: 'block'
            })
            $('#nextStep').css({
                'display': 'none'
            })
        } else {
            Materialize.toast('Debes seleccionar al menos un compañero', 3000)
        }
    })

    var swt = 0;
    $(document).on('click', '.color-picker div', function () {
        var choosenColor = $(this).data("col");
        $('.sendColorButton').css({
            'backgroundColor': choosenColor
        })
        workGroupData.color = choosenColor;
        swt = 1;
    })

    $(document).on('click', '.sendColorButton', function () {
        if (swt == 0) {
            Materialize.toast('Debes seleccionar un color', 3000)
        } else {
            $('#modalGrupoTrabajo').modal('close')
            Materialize.toast('Grupo creado exitosamente', 3000)
            socket.emit('sendGroupData', workGroupData)
            sock.send('message', datatoSend)
            updateTableGroup();
            Materialize.toast('Para mandar un mensaje grupal, dar Ctrl+Click sobre la persona', 10000)
            Materialize.toast('Para mandar un mensaje privado, dar Click sobre la persona', 10000)
        }
    })

    $(document).on('click', '.iconGroup', function () {
        updateTableGroup();
    })


    socket.on('dataAllGroups', function (data) {
        data.forEach(function (element) {
            var actualColor = element.color;
            if (element.lead != '') {
                document.getElementById("tablem").rows[element.lead.fila - 1].cells[element.lead.columna - 1].dataset.colorTemp = actualColor;
                var nodeDOML = document.getElementById("tablem").rows[element.lead.fila - 1].cells[element.lead.columna - 1].childNodes
                nodeDOML[2].style.border = `2px solid ${actualColor}`;
                nodeDOML[4].style.border = `2px solid ${actualColor}`;
                nodeDOML[4].dataset.colorTemp = actualColor;
                var colorTest = document.getElementById("tablem").rows[element.lead.fila - 1].cells[element.lead.columna - 1].getAttribute("data-color-temp")
                var beforeFunction = document.getElementById("tablem").rows[element.lead.fila - 1].cells[element.lead.columna - 1].getAttribute('onclick')
                var totalBefore = beforeFunction.split(',');
                totalBefore[totalBefore.length - 1] = '';
                totalBefore[totalBefore.length - 1] = `'${colorTest}')`
                document.getElementById("tablem").rows[element.lead.fila - 1].cells[element.lead.columna - 1].setAttribute('onclick', `${totalBefore.join(',')}`)
            }
            element.students.forEach(function (student) {
                if (student != '') {
                    document.getElementById("tablem").rows[student.fila].cells[student.columna].dataset.colorTemp = actualColor;
                    var nodeDOM = document.getElementById("tablem").rows[student.fila].cells[student.columna].childNodes
                    nodeDOM[2].style.border = `2px solid ${actualColor}`;
                    nodeDOM[4].style.border = `2px solid ${actualColor}`;
                    nodeDOM[4].dataset.colorTemp = actualColor;
                    var colorTest = document.getElementById("tablem").rows[student.fila].cells[student.columna].getAttribute("data-color-temp")
                    var beforeFunction = document.getElementById("tablem").rows[student.fila].cells[student.columna].getAttribute('onclick')
                    var totalBefore = beforeFunction.split(',');
                    totalBefore[totalBefore.length - 1] = '';
                    totalBefore[totalBefore.length - 1] = `'${colorTest}')`
                    document.getElementById("tablem").rows[student.fila].cells[student.columna].setAttribute('onclick', `${totalBefore.join(',')}`)
                }
            })
        })
        var myColor = document.getElementById("tablem").rows[datatoSend.fila - 1].cells[datatoSend.columna - 1].dataset.colorTemp;
        sessionStorage.setItem('myColor', myColor);

        var tagTd = document.getElementById("tablem").rows[datatoSend.fila - 1].cells[datatoSend.columna - 1].childNodes;
        var style = window.getComputedStyle(tagTd[2], null).getPropertyValue("border");
        if (style.split(' ')[0] == `2px`) {
            $(' .iconGroup').css({
                display: 'none'
            })
        }
        updateTableGroup();

        $('#tablem').find('td').each(function () {
            console.log("entro")
            var attrC = $(this).attr("data-color-temp")
            console.log(attrC)
            if (typeof attrC !== typeof undefined && attrC !== false) {
                var colorDelete = colorsPick.indexOf(attrC)
                colorsPick.splice(colorDelete, 1);
                console.log("entro")
            }
        });
        console.log(pk)
        window.pk = new Piklor(".color-picker", colorsPick, {
            open: ".sendColorButton"
        }), wrapperEl = pk.getElm(".picker-wrapper");

    })

});