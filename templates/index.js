module.exports = function($)
{
	// 面包屑
	var $layout = jQuery(this).parents(".oclayout").eq(0) ;

	$layout.find("ul.breadcrumb li").removeClass('active') ;
	$layout.find(".breadcrumb-item-blog")
		.html('')
		.hide() ;
	$layout.find(".breadcrumb-item-index")
		.addClass('active') ;


	// 分页
	// 将分页的效果改为子控制器视图切换
	$('.pagination>li').each(function(){

	}) ;

}