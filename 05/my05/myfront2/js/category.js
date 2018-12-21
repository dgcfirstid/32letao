


$(function () {
    // 发送请求，获取一级分类
    $.ajax({
        type: "get",
        dataType: "json",
        url: "/category/queryTopCategory",
        success: function (data) {
            console.log(data);
            var htmlStr = template("leftTpl", data);
            $('.lt_category_left ul').html(htmlStr);
            renderById(data.rows[0].id);
        }
    })

    // 一级分类切换效果，并且二级分类联动
     $('.lt_category_left ul').on("click", "a", function () {
        console.log(123);

        $('.lt_category_left ul a').removeClass('current');
        $(this).addClass("current");
        var id = $(this).data("id");
        renderById(id);
    })
 
    // 发送请求，根据一级分类获取二级分类
    function renderById(id) {
        $.ajax({
            type: "get",
            url: "/category/querySecondCategory",
            // 这里的id要一对象里的键值对的形式传送
            data: { id: id },
            dataType: "json",
            success: function (data) {
                console.log(data);
                var htmlStr = template('rightTpl', data);
                $('.lt_category_right ul').html(htmlStr);
            }
        })
    }


})