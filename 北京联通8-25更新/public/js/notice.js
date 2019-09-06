var vapp=new Vue({
	el:'#notice',
	data:{
		type:1
	},
	methods:{
		change_notice:function(){
			localStorage.notice=this.type;
			vapp_layer.alert("修改成功");
		}
	},
	mounted:function(){
		if(!localStorage.notice){
			localStorage.notice=1;
		}
		this.type=localStorage.notice;
	}
})