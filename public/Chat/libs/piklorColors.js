window.addEventListener("load", function () {

    window.colorsPick = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];

    $('#tablem').find('td').each(function () {
        var attrC = $(this).attr("data-color-temp")
        if (typeof attrC !== typeof undefined && attrC !== false) {
            var colorDelete = colorsPick.indexOf(attrC)
            colorsPick.splice(colorDelete, 1);
        }
    });


    window.pk = new Piklor(".color-picker", colorsPick, {
        open: ".sendColorButton"
    }), wrapperEl = pk.getElm(".picker-wrapper");


    pk.colorChosen(function (col) {
        wrapperEl.style.backgroundColor = col;
    });

});