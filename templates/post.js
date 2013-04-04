var Step = require("step") ;

module.exports = function($)
{
	var $view = jQuery(this) ;

	// 编辑表单
	initEditForm() ;


	var blogEditor = null ;

	function initEditForm()
	{
		// 编辑、删除、保存 按钮事件
		$(".btnSave").click( function(){
			save() ;
		}) ;

		// 初始化文本编辑器
		initContentEditor(function(err,editor){
			if(err)
			{
				throw err ;
				return ;
			}

			blogEditor = editor ;
		})
	}

	function initContentEditor(callback)
	{
		Step(
			function loadScripts()
			{
				var group = this.group() ;

				$oc.shipper.require("ocxBootstrapWysihtml5/public/wysihtml5-0.3.0.js",group()) ;
				$oc.shipper.require("ocxBootstrapWysihtml5/public/bootstrap-wysihtml5.js",group()) ;
			}

			, function done(err)
			{
				$oc.shipper.module("ocxBootstrapWysihtml5/public/wysihtml5-0.3.0.js") ;
				$oc.shipper.module("ocxBootstrapWysihtml5/public/bootstrap-wysihtml5.js") ;

				// 创建 textarea
				var editor = $('.txtContent')
								.attr('id', 'txtContent_'+jQuery('.txtContent').length )
								.wysihtml5() ;

				callback && callback(null,{
					content: function()
					{
						return editor.val() ;
					}
				}) ;
			}
		)
	}

	function save()
	{
		if(!blogEditor)
		{
			throw new Error("找不到博客编辑器") ;
		}

		var data = {
			title: $('.iptTitle').val()
			, content: blogEditor.content()
			, id: $('input[name=id]').val()
		}

		console.log(data) ;

		$oc.director.requestController('ocxBlog/lib/post:save',data,function(err,nut,$rootview){

			nut.msgqueue.popup() ;

			if( nut.model.saved )
			{
				$oc.director.requestController('ocxBlog/blog',{id:nut.model.blogid}) ;
			}
		})	;

	}

}

module.exports.onSwitchOut = function($)
{

}