var vapp=new Vue({
	el:'#mode',
	data:{
		type:1
	},
	methods:{
		change_mode:function(){
			localStorage.mode=this.type;
			vapp_layer.alert("修改成功");
		}
	},
	mounted:function(){
		if(!localStorage.mode){
			localStorage.mode=1;
		}
		this.type=localStorage.mode;
	}
})