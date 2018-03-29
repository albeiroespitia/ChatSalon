sock.addEventListener('open',function(event){

    if(datatoSend.rol == 'Profesor'){
        $('.iconGroup').css({'display':'none'})
    }

    window.posicionGroup = function (fila, col){
        if((datatoSend.fila == fila) && (datatoSend.columna == col)){
            Materialize.toast('No puedes seleccionarte a ti mismo', 4000)
        }else{
            if(document.getElementById("tableGr").rows[fila-1].cells[col-1].hasChildNodes()){
                document.getElementById("tableGr").rows[fila-1].cells[col-1].classList.toggle('boxGroupSelected');
            }

        }
        
    }

    $('#nextStep').click(function(){
        
    })

//    updateTableGroup();

});