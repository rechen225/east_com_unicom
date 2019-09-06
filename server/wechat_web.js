let request=require('request')
request=request.defaults({jar: true})
const config=require('../config.json')


const secret=config.ser;
const appid=config.app;
const {t1,t2,t3}=config; //08-28增加t3，原t2标题绑定成功不合适

function get_token(callback){
	let url=`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`
	get(url,(body)=>{
		if(body.errcode){

		}else{
			console.log(typeof body)
			console.log(body.access_token)
			callback(body.access_token)
		}
	})

}

function get_web_token(code,callback){
	let url=`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`
	console.log(url)
	get(url,(body)=>{
		console.log(body)
		if(body.errcode){
			//callback(body.errcode)
		}else{
			get_user(body.openid,(body2)=>{
				callback(body2)
			})
			//callback(null,body.openid)
		}
	})
}

function get_user(openid,callback){
	get_token((token)=>{
		let url=`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${token}&openid=${openid}&lang=zh_CN`
		get(url,(body)=>{
			console.log(body)
			if(body.errcode){

			}else{
				callback(body)
			}
		})

	})
}

function set_menu(callback){

		let backOrigin='http://'+config.url
		let menu= {
		     "button":[
		      {
		           "name":"拦截设置",
		           "sub_button":[
		           	{    
		               "type":"view",
		               "name":"拦截种类设置",
		               "url":backOrigin+"/setting/type"
		            },
		            {
		               "type":"view",
		               "name":"黑名单设置",
		               "url":backOrigin+"/setting/roster?type=-1"
		            },
		            {
		            	"type":"view",
		            	"name":"白名单设置",
		            	"url":backOrigin+"/setting/roster?type=1"
		            }
		            ]
		       },
		       {
		       		"name":"拦截记录",
		       		"type":"view",
		       		"url":backOrigin+"/users/note"
		       		// "sub_button":[
			       	// 	{
			       	// 		"type":"view",
			       	// 		"name":"个人中心",
			       	// 		"url":backOrigin+"/users/"	
			       	// 	},
			       	// 	{
			       	// 		"type":"view",
			       	// 		"name":"注册账号",
			       	// 		"url":backOrigin+"/register"
			       	// 	}
		       		// ]
		       },
		       {
		       	"name":"发现更多",
		       	"sub_button":[
			       	{
			       		"type":"click",
			       		"name":"业务介绍",
			       		"key":"about_us"
			       	},
			       	{
			       		"type":"click",
			       		"name":"常见问题",
			       		"key":"not"
			       	},
			       	{
			       		"type":"view",
			       		"name":"个人中心",
			       		"url":backOrigin+"/users/"	
			       	}
		       	]
		       }]
		 }
		 console.log(JSON.stringify(menu))

	get_token((token)=>{
		let url=`https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${token}`
		
		//  let menu={
		//  	"button":[
		//  	{"name":"拦截种类","sub_button":[
		//  		{"type":"view","name":"拦截种类","url":"http://210.56.209.61/setting/type"},
		//  		{"type":"view","name":"拦截号码","url":"http://210.56.209.61/setting/type"},
		//  		]
		//  	}
		//  ]
		// }
		
		post(url,menu,(body)=>{
			callback(body)
		}) 
	})
}


function notice(data,callback){
	//let openid='oy84s1FY0bf1k0gk2bEBbWuAbpqM'
	/* {{first.DATA}}
来电日期：{{keyword1.DATA}}
来电号码：{{keyword2.DATA}}
拦截原因：{{keyword3.DATA}}
{{remark.DATA}} */
	let openid=data.openid
	get_token((token)=>{
		let url=`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`
		let date=new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()+' '+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()
		let obj={
			"touser":openid,
			"template_id":t1,
			"url":'http://'+config.url+'/users/note',
			"topcolor":"#FF0000",
			"data":{
				first:{value:'您好，已为您拦截一次骚扰电话',color:'#333'},
				keyword1:{value:data.date,color:'#333'},
				keyword2:{value:data.number,color:'#E30'},
				keyword3:{value:data.content,color:'#E30'}, 
				//keyword3:{value:'骚扰电话',color:'#E30'}, 
				remark:{value:'',color:'#333'}
			}
		}
		post(url,obj,(body)=>{
			callback(body)
		})
	})

	/*
		{{first.DATA}}
		来电日期：{{keyword1.DATA}}
		来电号码：{{keyword2.DATA}}
		拦截原因：{{keyword3.DATA}}
		{{remark.DATA}}
	*/

}

function boss_note(data,callback){
	let openid=data.openid
	get_token((token)=>{

		let url=`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`
		let date=new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()+' '+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()
		//开户成功 改为  业务开通成功
		let typeStr='业务开通成功，感谢您的支持';
		switch(data.typestr){
			case 2:
				//'开户失败-人工处理中（cbss）'
				typeStr='您的号码暂时无法开通此业务，感谢您的支持'
				break;
			case 3:
				//typeStr='业务开通失败，人工处理中（系统异常）'
				typeStr='您的号码暂时无法开通此业务，感谢您的支持'
				break;
			case 4:
				typeStr='您的号码已取消此业务'
				break;
			case 5:
				typeStr='您的号码暂时无法取消此业务，请联系人工客服'
				break;
			case 6:
				typeStr='您的号码暂时无法取消此业务，请联系人工客服'
				break;
		}

		let obj={
			/* "touser":openid,
			"template_id":t2,
			"url":data.url,
			"topcolor":"#FF0000",
			"data":{
				first:{value:typeStr,color:'#ee8761'},
				type:{value:'防骚扰服务订阅',color:'#333'},
				keyword1:{value:data.number,color:'#E30'},
				keyword2:{value:data.date,color:'#333'},
				//keyword3:{value:'无',color:'#333'},
				remark:{value:'感谢您的使用',color:'#333'} */

			// 08-28 新模版消息，用于告知业务下发情况
			/* 
			{{first.DATA}}
				受理号码：{{keyword1.DATA}}
				业务名称：{{keyword2.DATA}}
				受理时间：{{keyword3.DATA}}
			{{remark.DATA}}*/
			"touser":openid,
			"template_id":t3,
			"url":'http://'+config.url+'/setting/type',
			//"url":data.url,
			"topcolor":"#FF0000",
			"data":{
				first:{value:typeStr,color:'#E30'},
				keyword1:{value:data.number,color:'#333'},
				keyword2:{value:'防骚扰服务订阅',color:'#E333'},
				keyword3:{value:data.date,color:'#E333'},
				remark:{value:'',color:'#333'}
			}
		}
		post(url,obj,(body)=>{
			callback(body)
		})
	})
}


module.exports={
	set_menu:set_menu,
	get_web_token:get_web_token,
	get_user:get_user,
	send_notice:notice,
	boss_note:boss_note
}


function get(url,callback){
	request(url,(err,res,body)=>{
		console.log(body)
		if (!err && res.statusCode == 200) {
	        callback(JSON.parse(body))
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