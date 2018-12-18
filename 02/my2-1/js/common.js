$(document).ajaxStart(function() {
  NProgress.start();
});
$(document).ajaxStop(function(){
  // 模拟网络延迟
  setTimeout(function(){
    NProgress.done();
  },500)
});
$(function(){
  $('.category').on('click',function(){
    console.log('a');
    $('.children').stop().slideToggle();
  })
  $('.icon_left').on('click',function(){
    console.log('b');
    // 通过改变padding-left的值来实现。padding-left可以为负值
    // 换类名用toggleClass，换显示与隐藏用slideToggle，别搞混了
    $('.le_nav').stop().toggleClass('hidenmenu');
    $('.le_main').stop().toggleClass('hidenmenu');
    $('.le_main .top_icon').stop().toggleClass('hidenmenu');
  })


  $('.icon_right').on('click', function () {
    $('.modal').modal("show")
  })

  $('#logoutBtn').click(function(){
    $.ajax({
      type: "get",
      url: "/employee/employeeLogout",
      dataType: "json",
      success: function(info) {
        console.log(info);
        if(info.success){
          location.href = "login.html";
        }
      }
    })
  })
})

