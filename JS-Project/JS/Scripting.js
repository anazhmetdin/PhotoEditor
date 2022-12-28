var currentSection = 0;

$(function(){
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

})