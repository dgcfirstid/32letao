/**
 * Created by 54721 on 2018/12/17.
 */

$(function() {
  // 1. 发送ajax请求, 通过模板引擎渲染
  var currentPage = 1; // 当前页
  var pageSize = 5; // 每页多少条

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
        console.log( info )
        var htmlStr = template( "secondTpl", info );
        $('tbody').html( htmlStr );

        // 进行分页初始化
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


  // 2. 点击添加分类按钮, 显示模态框
  $('#addBtn').click(function() {
    $('#addModal').modal("show");

    // 显示模态框, 就立刻发送ajax请求, 请求一级分类的全部数据, 渲染下拉列表
    // 通过 page: 1, pageSize: 100, 获取数据, 模拟获取全部数据的接口
    $.ajax({
      type: "get",
      url : "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function( info ) {
        console.log( info );
        var htmlStr = template("dropdownTpl", info);
        $('.dropdown-menu').html( htmlStr );
      }
    })
  });



  // 3. 给下拉列表的 a 注册点击事件, 让下拉列表可选 (通过事件委托注册)
  $('.dropdown-menu').on("click", "a", function() {
    // 获取a的文本
    var txt = $(this).text();

    // 设置给按钮
    $('#dropdownText').text( txt );

    // 不清楚这个data方法是哪个插件里的，有哪些功能
    var id = $(this).data("id");
    //通过打印发现是在jquery.min.js里的
    // console.log($(this).data);
    // console.log($(this));
    // console.log(id);
    $('[name = "categoryId"]').val(id);
    
    // 更新表单域的校验状态
    // 如果不更新，如果一开始填错了，后来改对了，但是表单校验插件还是不会允许提交的
    $('#form').data("bootstrapValidator").updateStatus("categoryId","VALID")

  });


  // 4. 调用fileupload方法完成文件上传初始化
  $('#fileupload').fileupload({
    dataType:"json",
    // e 事件对象, data 数据
    // 文件上传完成时, 响应回来时调用 (类似于success)
    done: function (e, data) {
      console.log( data );
      var result = data.result; // 后台返回的对象
      var picUrl = result.picAddr; // 图片路径

      // 设置给 img src
      $('#imgBox img').attr("src", picUrl);

      $('[name = "brandLogo"]').val(picUrl);

      $('#form').data("bootstrapValidator").updateStatus("brandLogo","VALID")
    }
  });

  // 表单校验插件
  // 如果校验不成功的话，提交按钮会隐藏
  $('#form').bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],
  
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',   //校验成功
      invalid: 'glyphicon glyphicon-remove', //校验失败
      validating: 'glyphicon glyphicon-refresh' //校验中
    },
  
    //3. 指定校验字段
    fields: {
      //校验用户名，对应name表单的name属性
      categoryId: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请选择一级分类'
          }
        }
      },
      brandName: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入二级分类名称'
          }
        }
      },
      brandLogo: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请选择图片'
          }
        }
      }
    }
  });


  // 阻止默认提交，用ajax提交
  $('form').on("success.form.bv",function(e){
    e.preventDefault();
    // 发送ajax
    $.ajax({
      url: "/category/addSecondCategory",
      type: "post",
      data: $('#form').serialize(),
      dataType: "json",
      success: function( info ) {
        console.log(info);
        if( info.success ) {
          $('#addModal').modal("hide");
          currentPage = 1;
          render();

          $('#form').data('bootstrapValidator').resetForm(true);

          $('#dropdownText').text("请选择一级分类");
          $('#imgBox img').attr("src", "./images/none.png")
        }
      }
    })
  })

})