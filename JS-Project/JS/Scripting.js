$(function(){
    $(".drawing-board,.image-board,.text-board").hide();

    $("#btnDraw").click(function(){
        $(".image-board,.text-board").hide();
        $(".drawing-board").show("fast");
    })

    $("#btnEdit").click(function(){
        $(".drawing-board,.text-board").hide();
        $(".image-board").show("fast");
    })

    $("#btnText").click(function(){
        $(".drawing-board,.image-board").hide();
        $(".text-board").show("fast");
    })

})