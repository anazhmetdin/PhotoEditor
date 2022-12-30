$('#save').click(function() {
    html2canvas($('#layers')[0], {
        scale: 5, // resolution
        ignoreElements: function(element) { // create canvas of all layers except image
            return element.tagName == 'IMG';
        },
        backgroundColor: null // transparent
    }).then(function (canvas) {

        // get image element
        const image = $('#preview-img')[0];

        // create canvas to draw the image with filters
        const newCanvas = document.createElement("CANVAS"); 
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;
        newCanvas.style.width = canvas.style.width;
        newCanvas.style.height = canvas.style.height;

        const ctx = newCanvas.getContext('2d');

        if (image.src != "") {
            // apply filters
            ctx.filter = image.style.filter;
            // transfer image
            ctx.drawImage(image, 0, 0, newCanvas.width, newCanvas.height);
            // reset filters
            ctx.filter = "none"; 
        }
        // transfer text and paintings
        ctx.drawImage(canvas, 0, 0);

        // create link to the new canvas and download it
        var dataURL = newCanvas.toDataURL("image/jpeg", 1.0);
        var a = document.createElement('a');
        a.href = dataURL;
        a.download = 'untitled.jpeg';
        a.click();
    });
})