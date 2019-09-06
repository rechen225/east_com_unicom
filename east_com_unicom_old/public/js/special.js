var vapp=new Vue({
	el:'#special',
	data:{
		special_list:[
		]
	},
	methods:{
		get_special:function(){
			var scope=this;
			axios.get('/api/get_setting_special').then(function(res){
				scope.special_list=res.data.data;
				scope.show_type();
			})
		},
		change_type:function(obj){
			Vue.set(obj,'isopen',!obj.isopen);
			var types={};
			if(localStorage.speciallist){
				types=JSON.parse(localStorage.speciallist);
			}
			types[obj.name]=obj.isopen?'1':'0';
			localStorage.speciallist=JSON.stringify(types);
		},
		show_type:function(){
			var types={};
			if(localStorage.speciallist){
				types=JSON.parse(localStorage.speciallist);
			}
			for(var i=0;i<this.special_list.length;i++){
				var key=this.special_list[i].name;
				if(types[key]=='1'){
					Vue.set(this.special_list[i],'isopen',true);
				}else{
					Vue.set(this.special_list[i],'isopen',false);
				}
			}
		}
	},
	mounted:function(){
		this.get_special();
	}
})