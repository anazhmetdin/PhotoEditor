$('#save').click(function() {
    html2canvas($('#layers')[0], {
        scale: 5
    }).then(function (canvas) {
        var dataURL = canvas.toDataURL("image/jpeg", 1.0);
        var a = document.createElement('a');
        a.href = dataURL;
        a.download = 'untitled.jpeg';
        a.click();
    });
})