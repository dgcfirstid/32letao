$(function(){
  $('#form').bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      //校验用户名，对应name表单的name属性
      username: {
        validators: {
          //不能为空
          notEmpty: {
            message: '用户名不能为空'
          },
          //长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: '用户名长度必须在2-6之间'
          },
          callback: {
            message: "用户名不存在"
          }
        }
      },
      password: {
        validators: {
          //不能为空
          notEmpty: {
            message: '用户名不能为空'
          },
          //长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: '用户名长度必须在2-6之间'
          },
          // 注意，这个方法名不能随便写
          callback: {
            message: "密码错误"
          }
        } 
      }
    }

  });
// 表单校验成功事件
  $('#form').on("success.form.bv",function( e ){
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $('#form').serialize(),
      dataType: 'json',
      success: function(info){
        console.log(info);
        if(info.success){
          location.href = "index.html";
        }
        if( info.error === 1000 ) {
          $('#form').data("bootstrapValidator").updateStatus("username","INVALID","callback");
        }
        if ( info.error === 1001 ) {
          $('#form').data("bootstrapValidator").updateStatus("password","INVALID","callback")
        }
      }
    })
  })

  // 表单重置功能
  $('[type="reset"]').click(function(){
    $('#form').data("bootstrapValidator").resetForm();
  })
})