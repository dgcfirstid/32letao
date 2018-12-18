$(function(){
    var currentPage = 1;
    var pageSize = 5;
    render();
    function render() {
        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function( info ) {
                console.log(info);
                var htmlStr = template("secondTpl",info);
                $('tbody').html(htmlStr);
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: info.page,
                    totalPages: Math.ceil( info.total / info.size ), // 总页数
                    // 添加点击事件
                    onPageClicked: function( a, b, c, page ) {
                      // 更新当前页
                      currentPage = page;
                      // 重新渲染
                      render();
                    }
                  })
            }
        })
    }

    $('#addBtn').click(function(){
        // 显示模态框
        $('#addModal').modal("show");
        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            data: {
                // 这里这所以写1和100是为了一次性拿去所有数据
                page: 1,
                pageSize: 100
            },
            dataType: "json",
            success: function(info) {
                console.log(info);
                var htmlStr = template("dropdownTpl",info);
                $('.dropdown-menu').html(htmlStr);
            }
        })
    });

    // 给下拉列表注册点击事件
    $('.dropdown-menu').on("click","a",function(){
        var txt = $(this).text();
        $('#dropdownText').text(txt);
    })


    // 别忘了引入js文件，否则这段代码不执行
    $('#fileupload').fileupload({
        dataType: "json",
        done: function(e,data) {
            console.log(data);
            var result = data.result;
            var picUrl = result.picAddr;
            console.log(picUrl);
            
            $('#imgBox img').attr("src",picUrl);
        }
    })

})