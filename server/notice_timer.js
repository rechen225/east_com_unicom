let request=require('request')
let config=require('../config.json')
let postTime=new Date()
let wechat_web=require('./wechat_web')

function boss_timer(){
	console.log('正在检查订阅状况')
	let url=config.server+'/nahiisp-subscribnote/subscribNote'
	get(url,(body)=>{
		//console.log(JSON.stringify(body))
		reget()
		let msgTime={}
		let openid_list=[]
		for(var i=0;i<body.result.result.length;i++){
			let obj=body.result.result[i]
			if(openid_list.indexOf(obj.openId)==-1){
				openid_list.push(obj.openId)
				msgTime[obj.openId]=obj
				msgTime[obj.openId].time=0
			}else{
				msgTime[obj.openId].time++
			}
			//postTime=new Date(obj.createTime)
		}

		if(openid_list.length>0){
			for(var i=0;i<openid_list.length;i++){
				let obj=msgTime[openid_list[i]]
				let data={
					openid:openid_list[i],
					url:'',
					typestr:obj.type,
					date:obj.createTime,
					number:obj.number,
					//content:obj.type==0?'黑名单':obj.tag,
					remark:'感谢'
				}
				//console.log(data)
				wechat_web.boss_note(data,(body)=>{
					
				})
			}
		}else{

		}

	})

	function reget(){
		setTimeout(()=>{
			boss_timer()
		},60000)
	}
}

function timer(){

	let url=config.server+`/intercept-notice/interceptNotice`
	//console.log(url)
	get(url,(body)=>{
		reget()
		let msgTime={}
		let openid_list=[]
		if(body.result.result)
			for(var i=0;i<body.result.result.length;i++){
				let obj=body.result.result[i]
				if(openid_list.indexOf(obj.openId)==-1){
					openid_list.push(obj.openId)
					msgTime[obj.openId]=obj
					msgTime[obj.openId].time=0
				}else{
					msgTime[obj.openId].time++
				}
				postTime=new Date(obj.createTime)
			}
		//console.log(openid_list.length)

		//console.log('当前未发送通知:'+openid_list.length)
		
		if(openid_list.length>0){
			for(var i=0;i<openid_list.length;i++){
				let obj=msgTime[openid_list[i]]
				//08-30 增加对type类型分类
				/* type Integer 必须  0- 黑名单 
					1- Tag（标记种类）
					2- 正则表达式
					tag String 非必须  当type为1时不能为空，填写标记种类
					regex String 非必须  当type为2时不能为空，填写拦截的正则表达式 */
				let interceptType = '骚扰电话'
				if(obj.type == 0){
					interceptType = '黑名单'
				}
				if(obj.type == 1){
					interceptType = obj.tag
				}
				if(obj.type == 2){
					interceptType = obj.regex
				}
				let data={
					openid:openid_list[i],
					url:config.notice+'/users/note',
					date:obj.interceptTime,
					number:obj.interceptNumber,
					content:interceptType,
					remark:'点击查看详情'
				}
				//console.log(data)
				wechat_web.send_notice(data,(body)=>{

				})
			}
		}else{

		}
		

		function reget(){
			//console.log("重新载入")
			setTimeout(()=>{
				//console.log('发送完毕')
				timer()
			},60000)
		}

		
	})
}

exports.timer=timer
exports.boss_timer=boss_timer

function get(url,callback,errcallback){
	console.log(url);
	request(url,(err,res,body)=>{
		//console.log(body)
		if (!err && res.statusCode == 200) {
			if(body[0]=='{')
	        	callback(JSON.parse(body));
	        else
	        	callback({success:0,msg:'接口数据异常'});
	    }else{
	    		console.log('[ '+url+' ]接口调用失败')
	    	if(errcallback){
	    		errcallback(err)
	    	}
	    }
	})
}


function post(url,req,callback,data_type){
	let config={
	    url: url,
	    method: "POST",
	    json: true,
	    headers: {
	        "content-type": data_type!='form'?'application/json':"application/x-www-form-urlencoded",
	    }
	}
	if(data_type!='form')
		config.body=req
	else
		config.form=req
	console.log(config)
	request(config, function(err, res, body) {
		console.log(err)
		console.log(res.statusCode)
		console.log(body)
	    if (!err && res.statusCode == 200) {
	        callback(body)
	    }
	});
}