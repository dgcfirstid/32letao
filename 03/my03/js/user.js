$(function(){
    var currentPage = 1;
    var pageSize = 5;
    var currentId;
    var isDelete;
    render();
    function render(){
        $.ajax({
            type: "get",
            url: "/user/queryUser",
            data: {
                // 第几页
                page: currentPage,
                // 数据数据条数
                pageSize: pageSize
            },
            dataType: "json",
            success: function(info){
                
                console.log(info);
                // 如果显示没有模板，记得到文件夹列看看有没有artTemplate文件
                var htmlStr = template('tpl',info);
                $('tbody').html(htmlStr);
                $('#paginator').bootstrapPaginator({
                    // 版本号
                    bootstrapMajorVersion: 3,
                    // 当前页
                    currrentPage: info.page,
                    // 总页数
                    totalPages: Math.ceil(info.total / info.size),
                    // 添加页码事件
                    onPageClicked: function(a,b,c,page){
                        console.log(page);
                        //更改当前页。
                        currentPage = page;
                        // 重新渲染
                        render();
                    }
                })
            }
        })
    }

    // 事件委托，显示模态框。
    $('tbody').on('click','.btn',function() {
        // 显示模态框
        $('#userModal').modal("show");
        // 注意这里的currentId不要写错了，否则会导致下面
        // 改用户状态的请求无法正常执行
        currentId = $(this).parent().data("id");
        // 获取当前按钮的状态
        isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
        
    });
    // 点击模态框中确定的按钮

    $('#submitBtn').click(function(){
        $.ajax({
            type: "post",
            url: "/user/updateUser",
            data: {
                id: currentId,
                isDelete: isDelete
            },
            dataType: "json",
            success: function(info) {
                console.log(123);
                
                console.log(info);
                if(info.success) {
                    $('#userModal').modal("hide");
                    render();
                }
            }
        })
    })
})