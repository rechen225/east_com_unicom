var vapp=new Vue({
	el:'#list',
	data:{
		list:[],
	},
	methods:{
		get_report_list:function(){
			var scope=this
			axios.get('/api/report_list').then(function(res){
				scope.list=res.data.result.result
			})
		}
	},
	mounted:function(){
		this.get_report_list()
	}
})