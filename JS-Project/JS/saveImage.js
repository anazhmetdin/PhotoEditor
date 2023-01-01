$('#save').click(function() {

    var tempTransform = layers[0].style.transform;
    layers[0].style.transform = '';

    html2canvas(layers[0], {
        scale: 5, // resolution
        // ignoreElements: function(element) { // create canvas of all layers except image
        //     return element.tagName !== 'IMG';
        // },
        backgroundColor: null // transparent
    }).then(function (canvas) {

        // if(rotate % 360 == 0) {
        //     var dataURL = canvas.toDataURL("image/jpeg", 1.0);
        //     var a = document.createElement('a');
        //     a.href = dataURL;
        //     a.download = 'untitled.jpeg';
        //     a.click();
        //     return;
        // }
        // create intermediate canvas
        var rotCanvas = document.createElement("canvas");

        // get image element
        const image = $('#preview-img')[0];
    
        // swap width and height
        rotCanvas.width = canvas.height;
        rotCanvas.height = canvas.width;
    
        // get context
        var rctx = rotCanvas.getContext("2d");
    
        // translate to center (rotation pivot)
        rctx.translate(rotCanvas.width * 0.5, rotCanvas.height * 0.5);
    
        // rotate -90° (CCW)
        rctx.rotate(Math.PI * rotate / 180);

        rctx.filter = image.style.filter;
        
        rctx.scale(flipX, flipY);
    
        // draw image offset so center of image is on top of pivot
        rctx.drawImage(canvas, -canvas.width * 0.5, -canvas.height * 0.5);
        
        // create link to the new canvas and download it
        var dataURL = rotCanvas.toDataURL("image/jpeg", 1.0);
        var a = document.createElement('a');
        a.href = dataURL;
        a.download = 'untitled.jpeg';
        a.click();

        layers[0].style.transform = tempTransform;
        // get image element
        // const image = $('#preview-img')[0];

        // // create canvas to draw the image with filters
        // const newCanvas = document.createElement("CANVAS"); 
        // newCanvas.width = 5*Number.parseInt($('#layers')[0].style.width);
        // newCanvas.height = 5*Number.parseInt($('#layers')[0].style.height);
        // newCanvas.style.width = $('#layers')[0].style.width;
        // newCanvas.style.height = $('#layers')[0].style.height;

        // var width = Number.parseInt(newCanvas.style.width);
        // var height = Number.parseInt(newCanvas.style.height);

        // const ctx = newCanvas.getContext('2d');

        // // apply filters
        // ctx.filter = image.style.filter;

        // // Translate canvas from center
        // ctx.translate( canvas.width/2,  canvas.height/2);

        // ctx.rotate(rotate * Math.PI /180);
        // // Flip Filters
        // //ctx.scale(flipY,flipX);
        // // transfer image
        // console.log(image, image.style.width, width)
        // ctx.drawImage(image, - canvas.width/2, - canvas.height/2,  canvas.width,  canvas.height);
        // ctx.translate(- canvas.width/2, - canvas.height/2);

        // ctx.rotate(-rotate * Math.PI /180);

        // // reset filters
        // ctx.filter = "none"; 

        // document.body.appendChild(newCanvas);
        
        // ctx.translate(newCanvas.width/2, newCanvas.height/2);
        // ctx.rotate(rotate * Math.PI /180);
        // ctx.scale(flipY,flipX);

        // // transfer text and paintings
        // ctx.drawImage(canvas, -canvas.width/2, -canvas.height/2);

        // // create link to the new canvas and download it
        // var dataURL = canvas.toDataURL("image/jpeg", 1.0);
        // var a = document.createElement('a');
        // a.href = dataURL;
        // a.download = 'untitled.jpeg';
        // a.click();
    });
})