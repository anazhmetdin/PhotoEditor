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

        console.log(flipX)
        console.log(flipY)

        if (image.src != "") {
            // apply filters
            ctx.filter = image.style.filter;

            // Translate canvas from center
            ctx.translate(newCanvas.width/2, newCanvas.height/2);

            // Rotate 
            if(rotate !== 0){
                ctx.rotate(rotate * Math.PI /180)
            }
            // Flip Filters
            ctx.scale(flipY,flipX);
            // transfer image
            ctx.drawImage(image, -newCanvas.width/2, -newCanvas.height/2, newCanvas.width, newCanvas.height);

            // reset filters
            ctx.filter = "none"; 
        }
        
        


        // transfer text and paintings
        ctx.drawImage(canvas, -canvas.width/2, -canvas.height/2);

        // create link to the new canvas and download it
        var dataURL = newCanvas.toDataURL("image/jpeg", 1.0);
        var a = document.createElement('a');
        a.href = dataURL;
        a.download = 'untitled.jpeg';
        a.click();
    });
})