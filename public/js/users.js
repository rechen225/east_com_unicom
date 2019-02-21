var vapp=new Vue({
	el:'#users',
	data:{
		show_index:-1,
		user_tel:'',
		is_open:false,
		is_open_wait:0,
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
			if(localStorage.open_wait && this.is_open_wait){
				return
			}
			if(this.wait){
				vapp_layer.alert_min("请不要频繁操作")
				return
			}else{
				if(this.is_open){
					vapp_layer.confirm('关闭服务后，您的所用功能将被停用，并且在24小时后才能再次开启，确定要取消吗',{},function(){
						scope.is_open=!scope.is_open;
						scope.wait=true
						axios.post('/api/subscribe_set',{id:scope.id,isopen:scope.is_open}).then(function(res){
							setTimeout(function(){
								scope.wait=false	
							},1000)
							
							if(res.data.result.result){
								scope.id=res.data.result.result
							}else{
								scope.id=''
								if(!scope.is_open){
									var outDate=new Date().getTime()+(3600*1000*24);
									localStorage.open_wait=outDate;
									scope.start_total_time();
								}
							}
						})
					},function(){

					},true)
					return
				}
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
					scope.start_total_time();
				}
			})
		},
		start_total_time:function(){
			var scope=this
			if(localStorage.open_wait){
				var over=parseInt(localStorage.open_wait)
				var timer=setInterval(function(){
					timeTotal();
				},1000)
				timeTotal();
				function timeTotal(){
					var now=new Date().getTime();
					if(now<over){
						scope.is_open_wait=over-now;
					}else{
						//console.log("qnm");
						localStorage.open_wait='';
						scope.is_open_wait=0;
						clearInterval(timeTotal);
					}
				}
			}
		},
		get_time_str:function(){
			var scope=this
			if(scope.is_open_wait==0){
				return "";
			}
			var hour=parseInt(scope.is_open_wait/3600000);
			var min=parseInt((scope.is_open_wait-hour*3600000)/60000);
			var str="";
			if(hour>0){
				str+=hour+"小时"
			}
			if(min>0){
				str+=min+"分钟"
			}
			return str+"后可重新开启";

		}
	},
	mounted:function(){
		this.user_tel=localStorage.user;
		this.is_open=localStorage.is_open=='1'?true:false;
		this.select_func()
	}
})