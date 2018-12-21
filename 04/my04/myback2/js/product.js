$(function(){
    currentPage = 1;
    pageSize = 3;
    picArr = [];
    render();
    function render() {
        $.ajax({
            type: "get",
            url: "/product/queryProductDetailList",
            data: {
                page : currentPage,
                pageSize: pageSize,
            },
            dataType: "json",
            success: function(info) {
                console.log(info);
                var htmlStr = template("productTpl",info);
                $('tbody').html( htmlStr );
                $("#pagintor").bootstrapPaginator({
                    bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
                    // 这里是info.page，不是currentPage，
                    // 因为返回回来的新页数更准确
                    currentPage: info.page,//当前页
                    totalPages: Math.ceil(info.total/info.size),//总页数
                    size:"small",//设置控件的大小，mini, small, normal,large
                    onPageClicked:function(event, originalEvent, type,page){
                      //为按钮绑定点击事件 page:当前点击的按钮值
                      currentPage = page;
                      render();
                    }
                  });
            }
        })
    }

    // 单击按钮
    $('#addBtn').click(function() {
        $('#addModal').modal("show");
        // 下拉框渲染
        $.ajax({
            type: "get",
            dataType: "json",
            url: "/category/querySecondCategoryPaging",
            data: {
                page: 1,
                pageSize: 100
            },
            success: function( info ) {
             console.log(info);
             var htmlStr = template("dropdownTpl",info);
             $('.dropdown-menu').html(htmlStr);
            }
        })
    });

    // 下拉框添加点击事件
    $('.dropdown-menu').on("click","a",function() {
        var txt = $(this).text();
        $('#dropdownText').text( txt );

        var id = $(this).data("id");
        $('[name = "brandId"]').val(id);

        $('#form').data("bootstrapValidator").updateStatus("brandId","VALId");

    });

    // 文件上传初始化
    $('#fileupload').fileupload({
        dataType: 'json',
        done: function(e,data){
            console.log(data);
            var picObj = data.result;
            picArr.unshift(picObj);
            var picUrl = picObj.picAddr;
            $('#imgBox').prepend('<img src="'+picUrl+'" style="width: 100px" alt="">')
            if( picArr.length > 3) {
                picArr.pop();
                $('#imgBox img:last-of-type').remove();
            }
            if(picArr.length === 3){
                $('#form').data("bootstrapValidator").updateStatus("picStatus","VALID");

            }
            console.log(picArr);
            console.log(555);
            
        }
    });

  // 5. 表单校验插件初始化
  $('#form').bootstrapValidator({
    // 配置排除项, 对隐藏域也进行校验
    excluded: [],

    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',         // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    // 配置校验规则
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      // 商品库存必须是非零开头的数字
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          // 正则校验
          // \d 表示 0-9 的数字
          // *  表示出现 0 次 或者 多次
          // +  表示出现 1 次 或者 多次
          // ?  表示出现 0 次 或者 1次
          // {n} 表示出现 n 次
          // {n,m} 出现n次到m次
          regexp: {
            regexp: /^[1-9]\d*$/,     // 1   11    121
            message: '商品库存必须是非零开头的数字'
          }
        }
      },

      // 尺码: 要求必须是 xx-xx 的格式, xx为两位数字
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          // 正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '尺码要求必须是 xx-xx 的格式, xx为两位数字'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品现价"
          }
        }
      },

      // 标记图片是否上传满 3 张
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传 3 张图片"
          }
        }
      }
    }
  });


  // 6. 注册表单校验成功事件, 阻止默认的提交, 通过ajax提交
  $('#form').on("success.form.bv", function( e ) {

    e.preventDefault();  // 阻止默认的提交

    // JSON.parse(JSON字符串)   作用: 将json字符串转换成复杂数据类型
    // JSON.stringify(obj/arr)  作用: 将复杂数据类型转换成 json字符串

    var paramsStr = $('#form').serialize(); // 获取了所有的表单数据
    // 还需要拼接上图片数据
    // paramsStr += "&key=value"
    paramsStr += "&picArr=" + JSON.stringify( picArr );

    // 通过ajax提交
    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: paramsStr,
      dataType: "json",
      success: function( info ) {
        if ( info.success ) {
          // 添加成功, 关闭模态框, 重新渲染第一页
          $('#addModal').modal("hide");
          currentPage = 1;
          render();

          // 重置表单内容和状态
          $('#form').data("bootstrapValidator").resetForm( true );

          // 下拉按钮文本 和 图片不是表单元素, 需要手动重置
          $('#dropdownText').text("请选择二级分类");
          $('#imgBox img').remove();
          picArr = [];
        }
      }
    })

  })




})