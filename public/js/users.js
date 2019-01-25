var vapp=new Vue({
	el:'#users',
	data:{
		show_index:-1,
		user_tel:'',
		is_open:false,
		wait:false,
		id:''
	},
	methods:{
		change_func_index:function(index){
			if(this.show_index==index)
				this.show_index=-1;
			else
				this.show_index=index;
		},
		open_func:function(){
			var scope=this
			if(this.wait){
				vapp_layer.alert_min("请不要频繁操作")
				return
			}else{
				this.is_open=!this.is_open;
				this.wait=true
				axios.post('/api/subscribe_set',{id:scope.id,isopen:scope.is_open}).then(function(res){
					setTimeout(function(){
						scope.wait=false	
					},1000)
					
					if(res.data.result.result){
						scope.id=res.data.result.result
					}else{
						scope.id=''
					}
				})
			}
			//localStorage.is_open=this.is_open?1:0;
		},
		select_func:function(){
			var scope=this
			axios.get('/api/subscribe').then(function(res){
				if(res.data.result.result){
					scope.id=res.data.result.result.id
					scope.is_open=true
				}else{
					scope.is_open=false
				}
			})
		}
	},
	mounted:function(){
		this.user_tel=localStorage.user;
		this.is_open=localStorage.is_open=='1'?true:false;
		this.select_func()
	}
})