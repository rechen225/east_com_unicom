var vapp=new Vue({
	el:'#roster',
	data:{
		is_add:false,
		roster_list:[],
		type:roster_type,
		add_obj:{
			type:1,
			tel1:'',
			tel2:'',
			tel3:'',
			tel4:'',
		}
	},
	methods:{
		get_roster_list:function(){
			var isWished=false
			var type=1
			if(roster_type==1){
				type=1
				isWished=true
			}
			var scope=this
			axios.get('/api/get_setting_type?isWished='+isWished+'&type='+type).then(function(res){
				if(res.data.success)
					scope.roster_list=res.data.result.result
			})

		},
		add_roster:function(){
			var scope=this

			var form={
					isWished:roster_type==1?1:0,
					type:1,
					content:'',
					wantPushNotification:roster_type==1?0:1
			}

			switch(this.add_obj.type){
				case 1:
					form.content=this.add_obj.tel1+'-'+this.add_obj.tel2;
					break;
				case 2:
					form.content=this.add_obj.tel3;
					break;
				case 3:
					form.content=this.add_obj.tel4;
					break;
			}

			if(!this.valid(form.content) && this.add_obj.type!=3){
				vapp_layer.alert_min('电话号码不正确')
				return
			}

			for(var i=0;i<this.roster_list.length;i++){
				if(this.roster_list[i].content==form.content){
					vapp_layer.alert_min("已存在的号码")
					return
				}
			}

			axios.post('/api/set_setting_type',{form:[form]}).then(function(res){
				if(!res.data.success){
					vapp_layer.alert_min("操作失败")
					return
				}
				var data=res.data.result.result;
				if(data.length<=0){
					vapp_layer.alert_min("操作失败")
					return
				}

				scope.roster_list.unshift({
					content:form.content,
					id:data[0].id,
					createTime:data[0].createTime
				});

				scope.add_obj={
					type:1,
					tel1:'',
					tel2:'',
					tel3:'',
					tel4:'',
					remark:''
				}
				scope.is_add=false;
				vapp_layer.alert_min('已加入'+(roster_type==1?'白名单':'黑名单'))
			})
			

		},
		delete_confirm:function(obj){
			var scope=this;
			vapp_layer.confirm('确定要删除'+obj.content+'吗?',obj,function(_obj){
				axios.post('/api/del_setting_type?id='+obj.id).then(function(res){
					scope.roster_list.splice(scope.roster_list.indexOf(obj),1)
					vapp_layer.alert_min('删除成功')
				})
			})
		},
		getDateStr:function(date){
			var d=new Date().getFullYear()+'-';
			if(new Date().getMonth()<9)
				d+='0'
			d+=(new Date().getMonth()+1)+'-';

			if(new Date().getDate()<9)
				d+='0'
			d+=(new Date().getDate())+' '

			if(new Date().getHours()<9)
				d+='0'
			d+=(new Date().getHours())+':'

			if(new Date().getMinutes()<9)
				d+='0'
			d+=(new Date().getMinutes())+':'

			if(new Date().getSeconds()<9)
				d+='0'
			d+=(new Date().getSeconds()+1)
			return d;
			
		},
		valid:function(tel){
			let isok=false
			let err=''

			if(tel.match(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/)){
				isok=true
			}else{
			}

			if(tel.match(/^0\d{2,3}-\d{7,8}$/)){
				isok=true
			}else{

			}

			return isok

		}


	},
	mounted:function(){
		this.get_roster_list();
	}
})