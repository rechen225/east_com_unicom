var vapp=new Vue({
	el:'#register',
	data:{
		post_time:0,
		tel:'',
		code:'',
		token:'',
		isagreen:false
	},
	methods:{
		post_code:function(){
			if(!this.tel.match(/^(1[3-9][0-9])\d{8}$/)){
				vapp_layer.alert_min('手机号码格式不正确')
				return
			}
			vapp_layer.alert_min('验证码已发送');
			this.post_time=60;
			var scope=this;
			axios.post('/api/send_sms',{number:this.tel}).then(function(res){
				if(res.data.success)
					scope.token=res.data.token;
				else{
					vapp_layer.alert_min(res.data.msg)
					scope.post_time=0;
				}
			})
			var total_code=setInterval(function(){
				if(scope.post_time>0)
					scope.post_time--;
				if(scope.post_time<=0){
					clearInterval(total_code);
				}
			},1000)
		},
		register:function(){
			if(!this.isagreen){
				vapp_layer.alert_min("请先同意服务条款")
				return
			}
			if(!this.tel){
				vapp_layer.alert_min('请填写手机号码');
				return;
			}
			// if(!this.pwd){
			// 	vapp_layer.alert('请填写密码');
			// 	return;
			// }
			var scope=this;
			axios.post('/api/register',{
				name:scope.tel,
				code:scope.code,
				token:scope.token
			}).then(function(res){
				if(res.data.success){
					//vapp_layer.alert_min('绑定成功');
					//2019-08-27 修改注册成功时弹出消息文字描述。  
					vapp_layer.alert_min('注册成功，业务将在24小时内开通！');
					localStorage.switch_type=''
					setTimeout(function(){
						if(!next_url || next_url=='undefined'){
							location.href='/users/'
						}else{
							location.href=next_url?next_url:''
						}
					},1500)
				}else{
					vapp_layer.alert_min(res.data.msg)
				}
			})
		}
	},
	mounted:function(){
		
	}
})