var vapp=new Vue({
	el:'#note',
	data:{
		is_add:false,
		is_notice:false,
		noticeid:'',
		note_list:[],
		add_type:-1,
		wait:false,
		add_obj:{
			type:1,
			tel1:'',
			tel2:'',
			tel3:'',
			tel4:'',
			remark:''
		}
	},
	methods:{
		add_roster:function(){
			var scope=this

			var form={
					isWished:this.add_type==1?1:0,
					type:1,
					content:'',
					wantPushNotification:this.add_type==1?0:1
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

			if(!this.valid(form.content)){
				vapp_layer.alert('电话号码不正确')
				return
			}

			axios.post('/api/set_setting_type',{form:[form]}).then(function(res){
				// scope.roster_list.unshift({
				// 	content:form.content,
				// 	id:res.data.result.result,
				// 	createTime:scope.getDateStr(new Date)
				// });

				scope.add_obj={
					type:1,
					tel1:'',
					tel2:'',
					tel3:'',
					tel4:'',
					remark:''
				}
				scope.is_add=false;
				//if(res.data.success){
				vapp_layer.alert('已加入'+(scope.add_type==1?'白名单':'黑名单'))
				// }else{
				// 	vapp_layer.alert("")
				// }

			})
			

		},
		move_roster:function(obj,type){
			//add_obj=
			this.add_type=type
			this.add_obj={
				type:1,
				tel1:'',
				tel2:'',
				tel3:'',
				tel4:'',
				remark:''
			}
			if(obj.interceptNumber.indexOf('-')>-1){
				this.add_obj.type=1;
				this.add_obj.tel1=obj.interceptNumber.split('-')[0];
				this.add_obj.tel2=obj.interceptNumber.split('-')[1];
			}else if(obj.interceptNumber.length==11 && obj.interceptNumber[0]=='1'){
				this.add_obj.type=2;
				this.add_obj.tel3=obj.interceptNumber;
			}else {
				this.add_obj.type=3;
				this.add_obj.tel4=obj.interceptNumber;
			}
			//this.add_obj.remark=obj.tag;
			this.is_add=true;

		},
		select_notice:function(){
			var scope=this
			axios.get('/api/get_notice').then(function(res){
				if(res.data.success){
					if(res.data.result.result){
						scope.noticeid=res.data.result.result.id
						scope.is_notice=true
					}else{
						scope.is_notice=false
					}
				}
				scope.get_note()
			})
		},
		open_notice:function(){
			var scope=this
			if(this.wait){
				vapp_layer.alert_min("请不要频繁操作")
				return
			}
			this.wait=true
			this.is_notice=!this.is_notice
			var id=''
			if(this.noticeid && !this.is_notice)
				id=this.noticeid

			axios.post('/api/set_notice?id='+id).then(function(res){
				scope.wait=false
				if(res.data.success){
					if(res.data.result.result){
						scope.noticeid=res.data.result.result
					}
				}
			})
		},
		get_note:function(){
			var url='/api/note_list'
			var scope=this
			axios.get(url).then(function(res){
				if(res.data.success)
					scope.note_list=res.data.result.result

			})
		},
		valid:function(tel){
			let isok=false
			let err=''

			if(this.add_obj.type==2 && tel.match(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/)){
				isok=true
			}else{
			}

			if(this.add_obj.type==1 && tel.match(/^0\d{2,3}-\d{7,8}$/)){
				isok=true
			}else{

			}

			return isok

		}
		// add_roster:function(){
		// 	var scope=this

		// 	var form={
		// 			isWished:roster_type==1?1:0,
		// 			type:roster_type==1?5:1,
		// 			content:'',
		// 			wantPushNotification:roster_type==1?0:1
		// 	}

		// 	switch(this.add_obj.type){
		// 		case 1:
		// 			form.content=this.add_obj.tel1+'-'+this.add_obj.tel2;
		// 			break;
		// 		case 2:
		// 			form.content=this.add_obj.tel3;
		// 			break;
		// 		case 3:
		// 			form.content=this.add_obj.tel4;
		// 			break;
		// 	}

		// 	if(!this.valid(form.content)){
		// 		vapp_layer.alert('电话号码不正确')
		// 		return
		// 	}

		// 	axios.post('/api/set_setting_type',{form:[form]}).then(function(res){
		// 		scope.roster_list.unshift({
		// 			content:form.content,
		// 			id:res.data.result.result,
		// 			createTime:scope.getDateStr(new Date)
		// 		});

		// 		scope.add_obj={
		// 			type:1,
		// 			tel1:'',
		// 			tel2:'',
		// 			tel3:'',
		// 			tel4:'',
		// 			remark:''
		// 		}
		// 		scope.is_add=false;
		// 		vapp_layer.alert('已加入'+(roster_type==1?'白名单':'黑名单'))
		// 	})
		// }
	},
	mounted:function(){
		//this.note_list=[];
		
		this.select_notice()
	}
})