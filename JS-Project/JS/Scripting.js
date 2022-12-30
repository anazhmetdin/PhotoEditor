var currentSection = 0;

$(function(){
    var canvas = $('canvas');
    $(".drawing-board,.image-board,.text-board").hide();
    $('input[name=menu]').prop('checked',false)

    $("#btnDraw").click(function(){
        currentSection = 1;
        $(".image-board,.text-board").hide();
        $(".drawing-board").show();
    })

    $("#btnEdit").click(function(){
        currentSection = 2;
        $(".drawing-board,.text-board").hide();
        $(".image-board").show();
    })

    $("#btnText").click(function(){
        currentSection = 3;
        $(".drawing-board,.image-board").hide();
        $(".text-board").show();
    })
    $("#newConvas_btn").click(function(){
        $("form").show();
        $(".container").css({"pointer-events":"none"});
        $( ".container" ).addClass( "opactiy_body" );
    })
    $("#create_btn").click(function(){
        $("form").hide();
        
        $(".container").css({"pointer-events":""});
        $( ".container" ).removeClass( "opactiy_body" )
        
        
        // canvas.css("background-color", "red");
        let cal_width = parseInt($("#width_").val());
        let cal_height = parseInt($("#height_").val());
        
        
        if(cal_width > 1100 )
        {
            cal_width = 1100;
            console.log("dskdnasdas")
        }
        console.log(canvas);
        // const context = canvas[0].getContext('2d');
        // context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.css('width',cal_width);
        // $("#preview-img")[0].
        $("#preview-img").attr("src","../images/white.PNG");
        $("#preview-img").css("height",`${cal_height}`).css("width",`${cal_width}`);

        canvas.css('height', cal_height);
        layers.css('width',cal_width);
        layers.css('height', cal_height);

    })

})