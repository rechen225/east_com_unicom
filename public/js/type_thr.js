var vapp=new Vue({
	el:'#type_thr',
	data:{
		type_list:[],
		istouch:false,
		touch_obj:{},
		wait:false,
	},
	methods:{
		// get_type:function(){
		// 	var scope=this;
		// 	// if(localStorage.thr){
		// 	// 	this.type_list=JSON.parse(localStorage.thr)
		// 	// }else{
		// 	axios.get('/api/get_base_type').then(function(res){
		// 		if(res.data.success){
		// 			var type_list=res.data.result;
		// 			for(var i=0;i<type_list.length;i++){
		// 				scope.type_list.push({name:type_list[i],value:10})
		// 			}
		// 		}

		// 	})
			
		// },
		get_type:function(){
			var scope=this;
			axios.get('/api/get_setting_type?isWished=0&type=2').then(function(res){
				if(res.data.success){
					scope.type_list=res.data.result;
					//scope.show_type()
					//scope.is_open=res.data.is_open
				}

			})
		},
		touchstart:function(str,event,obj){
			console.log(event)
			this.touch_obj={
				obj:obj,
				start_x:event.touches[0].clientX,
				move_x:0,
			}
			this.istouch=true
		},
		touchmove:function(str,event,obj){
			if(!this.istouch){
				return
			}
			var now_x=event.changedTouches[0].clientX
			var move_x=now_x-this.touch_obj.start_x
			obj.tagCount+=move_x
			if(obj.tagCount>200)
			{
				obj.tagCount=200
			}

			if(obj.tagCount<0)
			{
				obj.tagCount=0
			}
			obj.tagCount=parseInt(obj.tagCount)
			this.touch_obj.start_x=now_x
		},
		touchend:function(str,event){
			var scope=this
			if(this.istouch){
				//localStorage.thr=JSON.stringify(this.type_list)
				scope.istouch=false
				let obj=scope.touch_obj.obj
				scope.touch_obj={}
				axios.post('/api/tag_count',{id:obj.id,tagCount:obj.tagCount}).then(function(res){
				})
			}
		},
		changeend:function(obj){
			if(obj.tagCount>200)
			{
				obj.tagCount=200
			}

			if(obj.tagCount<0)
			{
				obj.tagCount=0
			}
			axios.post('/api/tag_count',{id:obj.id,tagCount:obj.tagCount}).then(function(res){
			})
		}
	},
	mounted:function(){
		this.get_type()
	}
})