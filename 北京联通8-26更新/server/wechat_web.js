let request=require('request')
request=request.defaults({jar: true})
const config=require('../config.json')


const secret=config.ser;
const appid=config.app;
const {t1,t2}=config;

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
		           "name":"接听意愿",
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
	let openid=data.openid
	get_token((token)=>{
		let url=`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`
		let date=new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()+' '+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()
		let obj={
			"touser":openid,
			"template_id":t1,
			"url":data.url,
			"topcolor":"#FF0000",
			"data":{
				first:{value:'骚扰电话拦截',color:'#333'},
				keyword1:{value:data.date,color:'#333'},
				keyword2:{value:'骚扰电话拦截',color:'#E30'},
				keyword3:{value:data.content+" "+data.number,color:'#E30'},
				remark:{value:data.remark,color:'#333'}
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
		let typeStr='开户成功';
		switch(data.tyepstr){
			case 2:
				tyepStr='开户失败-人工处理中'
				break;
			case 3:
				typeStr='开户失败-人工处理中'
				break;
			case 4:
				typeStr='销户成功'
				break;
			case 5:
				typeStr='销户失败-人工处理中'
				break;
			case 6:
				typeStr='销户失败-人工处理中'
				break;
		}

		let obj={
			"touser":openid,
			"template_id":t2,
			"url":data.url,
			"topcolor":"#FF0000",
			"data":{
				first:{value:typeStr,color:'#333'},
				type:{value:'防骚扰服务订阅',color:'#333'},
				keyword2:{value:date,color:'#333'},
				keyword1:{value:data.number,color:'#E30'},
				keyword3:{value:'无',color:'#333'},
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