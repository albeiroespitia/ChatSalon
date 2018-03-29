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

    window.posicionGroup = function (fila, col) {
        if ((datatoSend.fila == fila) && (datatoSend.columna == col)) {
            Materialize.toast('No puedes seleccionarte a ti mismo', 4000)
        } else {
            if (document.getElementById("tableGr").rows[fila - 1].cells[col - 1].hasChildNodes()) {
                document.getElementById("tableGr").rows[fila - 1].cells[col - 1].classList.toggle('boxGroupSelected');
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
        $('.sendColorButton').css({'backgroundColor':choosenColor})
        workGroupData.color = choosenColor;
        swt = 1;
    })

    $(document).on('click', '.sendColorButton', function () {
        if(swt == 0){
            Materialize.toast('Debes seleccionar un color', 3000)
        }else{
            $('#modalGrupoTrabajo').modal('close')
            Materialize.toast('Grupo creado exitosamente', 3000)
            socket.emit('sendGroupData',workGroupData)
            sock.send('message',datatoSend)                
        }
    })

    socket.on('dataAllGroups',function(data){
        data.forEach(function(element){
            console.log(element)
            var actualColor = element.color;
            if(element.lead != ''){
                var nodeDOML = document.getElementById("tablem").rows[element.lead.fila-1].cells[element.lead.columna-1].childNodes
                console.log(nodeDOML)
                nodeDOML[2].style.border = `2px solid ${actualColor}`;
                nodeDOML[4].style.border = `2px solid ${actualColor}`;
                nodeDOML[4].dataset.colorTemp = actualColor;
            }
            element.students.forEach(function(student){
                if(student != ''){
                    var nodeDOM = document.getElementById("tablem").rows[student.fila].cells[student.columna].childNodes
                    console.log(nodeDOM);
                    nodeDOM[2].style.border = `2px solid ${actualColor}`;
                    nodeDOM[4].style.border = `2px solid ${actualColor}`;
                    nodeDOM[4].dataset.colorTemp = actualColor;
                }
            })
        })
    })

});