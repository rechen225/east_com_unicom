var vapp=new Vue({
	el:'#datetime',
	data:{
		type:1,
		week:'12345',
		start:'00:00',
		end:'23:59',
		week_list:["日","一","二","三","四","五","六"]
	},
	methods:{
		change_week:function(index){
			var new_week='';
			for(var i=0;i<this.week_list.length;i++){
				if(this.week.indexOf(i)>-1 && i!=index){
					new_week+=''+i;
				}else if(this.week.indexOf(i)==-1 && i==index){
					new_week+=''+i;
				}
			}
			this.week=new_week;
		},
		update_date:function(){
			localStorage.date=JSON.stringify({type:this.type,week:this.week,start:this.start,end:this.end});
			vapp_layer.alert("修改成功");
		}
	},
	mounted:function(){
		if(!localStorage.date){
			localStorage.date=JSON.stringify({type:1,week:'12345',start:'00:00',end:'23:59'})
		}
		var obj=JSON.parse(localStorage.date);
			this.type=obj.type;
			this.week=obj.week;
			this.start=obj.start;
			this.end=obj.end;
	}
})