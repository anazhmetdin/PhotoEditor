var rotate = 0,
    flipX = 1,
    flipY = 1;
var Brightness = 100,
    Saturation = 100,
    Inversion = 0,
    Grayscale = 0,
    Contrast = 100,
    sepia = 0;

//When the slide bar move update  Filters
var applyFilter = function () {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipY}, ${flipX})`;

    canvas.style.transform = `rotate(${rotate}deg) scale(${flipY}, ${flipX})`;

    previewImg.style.filter = `brightness(${Brightness}%) saturate(${Saturation}%) invert(${Inversion}%) 
                                grayscale(${Grayscale}%) sepia(${sepia}%) contrast(${Contrast}%)`;
};

input_file = $(".file-input")[0];
previewImg = $("#preview-img")[0];
layers = $("#layers ");
layer = $("#layers")[0]
//canvas = $('canvas');
choose_img = $(".choose-img");
filter_options = $(".filter button");
filter_name = $(".filter-info .name");
filter_value = $(".filter-info .value");
rotate_options = $(".rotate button");
filter_slider = $(".slider input");

var loadimage = function () {
    // reset layers width to load image with the new max size possible
    layers.css({ width: "fit-content", height: "fit-content" });

    var file = input_file.files[0]; // getting user selected file
    if (!file) return; // return if user hasn't selected file
    previewImg.src = URL.createObjectURL(file); // passing file url as preview img src

    // observe image size change -> image is loaded, then styled
    const imageResizeObserver = new ResizeObserver(function () {
        // update parent size
        layers.css("width", previewImg.width);
        layers.css("height", previewImg.height);

        // set width and height of canvas with an image when it loaded
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    });
    
    previewImg.addEventListener("load", function () {
        document.querySelector(".container").classList.remove("disable");
        // apply observer after image is loaded -> wait for css to be applied
        imageResizeObserver.observe(previewImg);
    });
};

for (var i = 0; i < filter_options.length; i++) {
    filter_options[i].addEventListener("click", function () {
        //When any button click make it active
        filter_options.removeClass("active");
        this.classList.add("active");
        filter_name.text(this.innerText);

        if (this.id === "Brightness") {
            filter_value.text(`${Brightness}%`);
            filter_slider.val(Brightness);
        } else if (this.id === "Saturation") {
            filter_value.text(`${Saturation}%`);
            filter_slider.val(Saturation);
        } else if (this.id === "Inversion") {
            filter_value.text(`${Inversion}%`);
            filter_slider.val(Inversion);
        } else if (this.id === "sepia") {
            filter_value.text(`${sepia}%`);
            filter_slider.val(sepia);
        } else if (this.id === "Contrast") {
            filter_value.text(`${Contrast}%`);
            filter_slider.val(Contrast);
        } else {
            filter_value.text(`${Grayscale}%`);
            filter_slider.val(Grayscale);
        }
    });
}

let updateFilter = function () {
    filter_value.text(`${filter_slider.val()}%`);

    var selected_filter = document.querySelector(".filter  .active");

    if (selected_filter.id == "Brightness") {
        Brightness = filter_slider.val();
    } else if (selected_filter.id == "Saturation") {
        Saturation = filter_slider.val();
    } else if (selected_filter.id == "Inversion") {
        Inversion = filter_slider.val();
    } else if (selected_filter.id == "Contrast") {
        Contrast = filter_slider.val();
    } else if (selected_filter.id == "sepia") {
        sepia = filter_slider.val();
    } else {
        Grayscale = filter_slider.val();
    }
    applyFilter();
};


//Rotate and flip Imaage
$(".rotate .options button").each(function (idx, elem) {
    elem.addEventListener("click", function () {
        console.log(elem)
        if (elem.id == "left") rotate -= 90;
        else if (elem.id == "right") rotate += 90;
        else if (elem.id == "horizontal") flipX = flipX === 1 ? -1 : 1;
        else flipY = flipY === 1 ? -1 : 1;


        // $("#layers").css('width', '300px');
        // $("#layers").css('height', 'fit-content');
        applyFilter();
    });
});

//Reset All Filters to normal
$(".Controls .reset-filters").on("click", function () {
    (rotate = 0), (flipX = 1), (flipY = 1);
    (Brightness = 100),
        (Saturation = 100),
        (Inversion = 0),
        (Grayscale = 0),
        (Contrast = 100),
        (sepia = 0);
    applyFilter();
});

filter_slider[0].addEventListener("input", updateFilter);
input_file.addEventListener("change", loadimage);
choose_img.click(function () {
    input_file.click();
});
