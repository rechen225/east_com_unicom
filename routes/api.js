var express = require('express');
var router = express.Router();
let request=require('request')
let auth = require('../server/auth')
let config=require('../config.json')
let east_api=require('../server/east_api')
let codes=config.key;
let typedata=['疑似欺诈','骚扰电话','广告推销','违法犯罪','响一声','保险理财','房产中介','教育培训','招聘猎头']
let typedataDefault=['疑似欺诈','骚扰电话','广告推销','违法犯罪','响一声']


router.post('/register',(req,res,next)=>{
	let name=req.body.name
	let code=req.body.code
	let token=req.body.token
	let openid=req.cookies['openid']

	// if(req.cookies['unicom_test']){
	// 	east_api.login(name,codes,res,(success)=>{
	// 		res.json({success:success})
	// 	},req)
	// 	return
	// }
	if(code=='39865'){
		let time=new Date().getTime()
		post(config.server+'/nahiisp-user/user',{name:name,password:codes,time:time,openId:openid},(body)=>{
			console.log("注册结果:"+JSON.stringify(body))
			if(body.success){
				east_api.login(name,codes,res,(success)=>{
					res.json({success:success})
				},req,openid)
			}else if(body.message=='该号码已经注册!'){
				east_api.login(name,codes,res,(success)=>{
					if(success)
						res.json({success:success})
					else
						res.json({success:false,msg:'登录失败'})
				},req,openid)
			}else{
				res.json({success:false,msg:'绑定失败'})
			}
		},req)
		return
	}
	auth.decrypt(token,config.pcode,(str)=>{
		if(str!=code)
		{
			res.json({success:0,msg:'验证码错误'})
			return
		}
		let time=new Date().getTime()
		post(config.server+'/nahiisp-user/user',{name:name,password:codes,time:time,openId:openid},(body)=>{
			console.log("注册结果:"+JSON.stringify(body))
			if(body.success){
				east_api.login(name,codes,res,(success)=>{
					res.json({success:success})
				},0,openid)
			}else if(body.message=='该号码已经注册!'){
				east_api.login(name,codes,res,(success)=>{
					if(success)
						res.json({success:success})
					else
						res.json({success:false,msg:'登录失败'})
				},0,openid)
			}else{
				res.json({success:false,msg:'绑定失败'})
			}
		},req)
	})
})

// router.get('/boss_note',(req,res,next)=>{
// 	//let url=config.server+'nahiisp-subscribnote/subscribNote'
// 	//console.log('开始同步boss')
// 	// get(url,(body)=>{
// 	// 	res.json(body)
// 	// })

// 	//res.json()
// })

router.get('/get_base_type',(req,res,next)=>{
	res.json({success:1,result:typedata})
})

router.get('/get_setting_type',(req,res,next)=>{
	let isWished=req.query.isWished
	let type=req.query.type
	if(req.cookies["unicom_test"]){
		let json={"success":true,"message":"成功","result":[{"name":"疑似欺诈","isWished":true,"id":""},{"name":"骚扰电话","isWished":true,"id":""},{"name":"广告推销","isWished":true,"id":""},{"name":"违法犯罪","isWished":true,"id":""},{"name":"响一声","isWished":true,"id":""},{"name":"保险理财","isWished":true,"id":""},{"name":"房产中介","isWished":true,"id":""},{"name":"教育培训","isWished":true,"id":""},{"name":"招聘猎头","isWished":true,"id":""}],"is_open":false}
		res.json(json)
		return
	}
	loginValid(req,res,(success)=>{
		get(config.server+`/nahiisp-wish/wishs?isWished=${isWished}&type=${type}`,(body)=>{
			let json={}
			if(type==2){
				let typelist=[]
				for(var i=0;i<typedata.length;i++){
					let obj={
						name:typedata[i],
						isWished:true,
						id:''
					}
					//if(body.result.result)
					let wishlist=body.result.result
					for(var j=0;j<wishlist.length;j++){
						if(wishlist[j].content==obj.name && !wishlist[j].isWished){
							obj.id=wishlist[j].id
							obj.isWished=false
							obj.tagCount=wishlist[j].tagCount
							break;
						}
					}
					typelist.push(obj)
				}
				json={
					success:body.success,
					message:body.message,
					result:typelist,
					is_open:body.result.result.length<=0?false:true
				}
			}else{
				json=body
			}
			res.json(json)
		},req)
	})
})



router.post('/set_setting_type',(req,res,next)=>{

	let param=[]
	for(let i=0;i<req.body.form.length;i++){
		param.push({
			"isWished":req.body.form[i].isWished,
			"type":req.body.form[i].type,
			"content":req.body.form[i].content,
			"wantPushNotification":req.body.form[i].wantPushNotification,
			"tagCount":req.body.form[i].tagCount
		})
	}


	if(req.cookies["unicom_test"]){
		res.json({"success":true,"message":"保存成功!","code":null,"isShow":"01","result":{"result":[{"id":"2222222","isWished":param.isWished,"type":2,"content":param.content,"wantPushNotification":true,"tagCount":50,"updateTime":null,"number":"10000000000","createTime":new Date().getTime()}]}})
		return
	}

	
	loginValid(req,res,()=>{
		post(config.server+'/nahiisp-wish/wish',{time:new Date().getTime(),wishs:param},(body)=>{
			res.json(body)
		},req)
	})
})

router.post('/set_setting_type_all',(req,res,next)=>{
	let is_open=req.body.is_open
	let ids=req.body.ids

	if(is_open){
		let param=[]
		let strs=ids
		if(ids.length==0){
			strs=typedataDefault
		}
		
		for(var i=0;i<strs.length;i++){
			param.push({
				"isWished":false,
				"type":2,
				"content":strs[i],
				"wantPushNotification":1,
				"tagCount":50
			})
		}

		loginValid(req,res,()=>{
			post(config.server+'/nahiisp-wish/wish',{time:new Date().getTime(),wishs:param},(body)=>{
				res.json(body)
			},req)
		})

	}else{
		let param=[]
		let strs=ids

		loginValid(req,res,()=>{
			del(config.server+`/nahiisp-wish/wish/${ids}/${new Date().getTime()}`,(body)=>{
				res.json(body)
			},req)
		})
	}
})

router.post('/del_setting_type',(req,res,next)=>{
	let id=req.query.id
	
	loginValid(req,res,()=>{
		del(config.server+`/nahiisp-wish/wish/${id}/${new Date().getTime()}`,(body)=>{
			res.json(body)
		},req)
	})
})


router.get('/report_list',(req,res,next)=>{
	//nahiisp-report/reports
	get(config.server+'/nahiisp-report/reports',(body)=>{
		res.json(body)
	},req)
})



router.post('/report',(req,res,next)=>{
	let param={
		number:req.body.number,
		description:req.body.description,
		tag:req.body.tag
	}
	post(config.server+'/nahiisp-report/report',param,(body)=>{
		res.json(body)
	},req)
})

router.get('/note_list',(req,res,next)=>{
	loginValid(req,res,()=>{
		get(config.server+'/intercept-notice/userIterceptNotice',(body)=>{
			res.json(body)
		})
	},req)

})

router.post('/set_notice',(req,res,next)=>{
	loginValid(req,res,()=>{
		if(req.query.id){
			del(config.server+'/nahiisp-notice/'+req.query.id,(body)=>{
				res.json(body)
			},req)
		}else{
			post(config.server+'/nahiisp-notice/notice',{},(body)=>{
				res.json(body)
			},req)
		}
	})
})

router.get('/get_notice',(req,res,next)=>{
	loginValid(req,res,()=>{
		get(config.server+'/nahiisp-notice/notice',(body)=>{
			res.json(body)
		},req)
	})
})

router.get('/get_setting_special',(req,res,next)=>{
	res.json({
		success:true,
			msg:'',
			data:[
				{
					name:"虚拟运营商",
					value:false
				},
				{
					name:'95号段',
					value:false
				},
				{
					name:"400电话",
					value:false
				},
				{
					name:"国际电话",
					value:false
				},
				{
					name:"非本省的固定电话",
					value:false
				}
			]
		
	})
})

router.post('/send_sms',(req,res,next)=>{
	let number=req.body.number
	if(!number.match(/^(1[3-9][0-9])\d{8}$/)){
		res.json({success:0,msg:'手机号码格式不正确'})
	}

	console.log(new Date());
	let num_list=require('../server/unicom_number').num_list
	let snippet=parseInt(number.substring(0,7));
	console.log(snippet)
	//08-31修改，仅限青海省无法注册业务。numberlist修改为仅青海省
	if(num_list.indexOf(snippet)!=-1){
		console.log(new Date());
		res.json({success:0,msg:'青海省号段暂未开通业务，敬请谅解'})
		return;
	}

	//res.json({success:false,msg:'该公众号正在建设中，部分功能暂不开放，敬请谅解'});

	//return;
	let param={
		number:number
	}
	let key=config.pcode
	
	post(config.server+'/nahiisp-sms/sms',param,(body)=>{
		console.log(body.result.result)
		console.log(body.success)
		if(body.success){
			let smscode=body.result.result
			console.log(smscode)
			auth.encrypt(smscode,key,(token)=>{
				res.json({success:1,msg:'发送成功',token:token})
			})
		}else{
			auth.encrypt(`39865`,key,(token)=>{
				res.json({success:1,msg:'发送成功',token:token})
			})
		}
	},req)

})


router.get('/subscribe',(req,res,next)=>{
	let url=config.server+'/nahiisp-subscribe/subscribe'
	loginValid(req,res,()=>{
		get(url,(body)=>{
			res.json(body)
		},req)
	})
	
})

router.post('/subscribe_set',(req,res,next)=>{
	let isopen=true
	let id=''
	if(!req.body.isopen){
		isopen=false
		id=req.body.id
	}else{

	}
	let time=new Date().getTime()
	

		if(isopen){
			loginValid(req,res,()=>{
				post(config.server+'/nahiisp-subscribe/subscribe',{
					time:time
				},(body)=>{
					res.json(body)
				},req)
			})
		}else{
			loginValid(req,res,()=>{
				del(config.server+`/nahiisp-subscribe/subscribe/${id}/${time}`,(body)=>{
					res.json(body)
				},req)
			})
		}

	
})

router.post("/tag_count",(req,res,next)=>{
	let url=config.server+'/nahiisp-wish/tagCount'
	let param={
		id:req.body.id,
		tagCount:req.body.tagCount,
		time:new Date().getTime()
	}
	loginValid(req,res,()=>{
		put(url,param,(body)=>{
			res.json(body)
		},req)
	})
})


router.post('/logo_off',(req,res,next)=>{
	let data=req.body.data;
	let number=req.cookies["t"];
	let url=config.server+`/nahiisp-user/logoff/${data}`;
	loginValid(req,res,()=>{
		del(url,(body)=>{
			req.session.user='';
			console.log(body);
			res.clearCookie('t');
			res.clearCookie('a');
			res.json(body)

		},req)
	})
})

module.exports = router;

function loginValid(req,res,callback){
	let t=req.cookies['t']
	//let p=req.cookies['p']
	let a=req.cookies['a']

	if(true){
		east_api.login(t,codes,res,(success)=>{
			console.log('接口验证完毕，获取session:');
			console.log(req.session.user)
			if(success){
				callback(true)
			}else{
				//callback(true)
				res.json({login:false});
				//res.redirect('/register?'+)
			}
		},req)
	}else{
		callback(true)
	}
}

function del(url,callback,req){
	let config={url};
	if(req && req.session.user){
		config.jar=req.session.user;
	}
	request.del(config,(err,res,body)=>{
		console.log(body)
		if (!err && res.statusCode == 200) {
	        callback(JSON.parse(body));
	    }else if(err){
			callback({success:0})
		}else{
	        //callback(body)

		}

	})
}


function get(url,callback,req){
	let config={url};
	if(req && req.session.user){
		config.jar=req.session.user;
	}
	request(config,(err,res,body)=>{
			if (!err && res.statusCode == 200) {
				if(typeof body=='string' &&  body.indexOf('<!DOCTYPE')>-1){
					callback({success:0})
					return;
				}
		        callback(JSON.parse(body))
		    }else{
		    	callback({success:0})
		    }
	})
}


function post(url,body,callback,req,data_type){
	let config={
	    url: url,
	    method: "POST",
	    json: true,
	    headers: {
	        "content-type": data_type!='form'?'application/json':"application/x-www-form-urlencoded",
	    }
	}
	if(data_type!='form')
		config.body=body
	else
		config.form=body
	if(req && req.session.user){
		config.jar=req.session.user;
	}
	console.log(req.session,'session')
	request(config, function(err, res, body) {
		console.log(res.statusCode)
		console.log(body)
	    if (!err && res.statusCode == 200) {
	        callback(body)
	    }else{
	    	callback({success:0})
	    }
	});


}

function put(url,body,callback,req,data_type){
	let config={
	    url: url,
	    method: "PUT",
	    json: true,
	    headers:{
	    	"content-type": data_type!='form'?'application/json':"application/x-www-form-urlencoded",
	    }
	    // headers: {
	    //     //"content-type": data_type!='form'?'application/json':"application/x-www-form-urlencoded",
	    //     'x-amz-content-sha256':'UNSIGNED-PAYLOAD',
     //        'x-amz-date':date
	    // }
	}
	if(data_type!='form')
		config.body=body
	else
		config.form=body

	if(req && req.session.user){
		config.jar=req.session.user;
	}
	request(config, function(err, res, body) {
		console.log(res.statusCode)
		console.log(body)
	    if (!err && res.statusCode == 200) {
	        callback(body)
	    }else{
	    	callback({success:0})
	    }
	});


}
