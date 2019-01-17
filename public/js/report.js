var vapp=new Vue({
	el:'#report',
	data:{
		tel:'',
		type:"疑似诈骗",
		type_list:['疑似诈骗',"疑似骚扰","金融理财","广告推销","其他类型"],
		else_type:'',
		remark:""
	},
	methods:{
		add_report:function(){
			if(!this.valid()){
				vapp_layer.alert('电话号码不正确')
				return
			}
			var form={
				number:this.tel,
				tag:this.type!='其他类型'?this.type:this.else_type,
				description:this.remark
			}
			axios.post('/api/report',form).then(function(res){
				vapp_layer.alert('您的举报已经提交')
			})

			
		},
		valid:function(){
			let isok=false
			let err=''

			if(this.tel.match(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/)){
				isok=true
			}else{
			}

			if(this.tel.match(/^0\d{2,3}-\d{7,8}$/)){
				isok=true
			}else{

			}

			return isok

		}
	}
})