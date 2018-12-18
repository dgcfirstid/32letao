/**
 * Created by 54721 on 2018/12/15.
 */
// 测试进度条方法
//NProgress.start();  // 开启进度条
//
//setTimeout(function() {
//  // 结束进度条
//  NProgress.done();
//}, 2000);

/*
 * 需求: 在第一个ajax发送的时候, 开启进度条
 *       在全部的ajax回来的时候, 关闭进度条
 *
 * ajax全局事件
 *    .ajaxComplete()  当每个ajax完成时,调用     (不管成功还是失败)
 *    .ajaxSuccess()   当ajax返回成功时调用
 *    .ajaxError()     当ajax返回失败时调用
 *    .ajaxSend()      当ajax发送前调用
 *
 *    .ajaxStart()     当第一个ajax发送时调用
 *    .ajaxStop()      当全部的ajax请求完成时调用
 * */

//  进度条
$(document).ajaxStart(function() {
  NProgress.start();
});
$(document).ajaxStop(function() {
  setTimeout(function(){
    NProgress.done();
  },500)
});


// 等待页面dom结构的加载后执行


$(function(){
  // 二级导航条切换
  $('.lt_aside .category').click(function(){
    $('.lt_aside .child').stop().slideToggle();
  })
  // 左侧菜单切换效果
  $('.icon_left').click(function(){
    $('.lt_aside').toggleClass("hidemenu");
    $('.lt_topbar').toggleClass("hidemenu");
    $('.lt_main').toggleClass("hidemenu");
  })
  // 显示模态框
  $('.icon_right').click(function() {
    $('#logoutModal').modal("show");
  });

  // 退出功能
  $('#logoutBtn').click(function(){
    $.ajax({
      type: "get",
      url: "/employee/employeeLogout",
      dataType: "json",
      success: function( info ) {
        console.log( info );
        if ( info.success ) {
          location.href = "login.html";
        }
        
      }
    })
  })
})


