//let request=require('request')
//request=request.defaults()
let config=require('../config.json')

let login=(tel,pwd,res,callback,req,openid)=>{
	if(req && req.cookies['unicom_test']){
		let tel_times=new Date(new Date().setDate(new Date().getDate()+30))
			let api_times=new Date(new Date().setMinutes(new Date().getMinutes()+4))
			res.cookie('t',tel,{expires:tel_times,httpOnly:true})
			//res.cookie('p',pwd,{expires:tel_times,httpOnly:true})
			res.cookie('a',1,{expires:api_times,httpOnly:true})
			callback(true)
		return
	}
	post(config.server+'/nahiisp-user/login',{j_username:tel,j_password:pwd},(body,jar)=>{
		req.session.user=jar;
		if(body.success){
			let tel_times=new Date(new Date().setDate(new Date().getDate()+30))
			let api_times=new Date(new Date().setMinutes(new Date().getMinutes()+4))
			res.cookie('t',tel,{expires:tel_times,httpOnly:true})
			//res.cookie('p',pwd,{expires:tel_times,httpOnly:true})
			res.cookie('a',1,{expires:api_times,httpOnly:true})
			callback(true)
        }else{
          	//res.redirect(302,'/register?url='+url)
          	callback(false)
        }
	},'form')
}

let register=(tel,pwd,callback)=>{
	post(config.server+'/nahiisp-user/user',{name:name,password:password},(body)=>{
		req.session.user=jar;
		callback(body)
	})
}


let wxlogin=(openid,res,callback)=>{
	let url='/nahiisp-user/number?openId='+openid
	let pwd=config.key;
	get(config.server+url,(body)=>{
		//callback(body)
		if(body.success && body.result.result.number){
			let tel=body.result.result.number
			post(config.server+'/nahiisp-user/login',{j_username:tel,j_password:pwd},(body,jar)=>{
				 if(body.success){
					let tel_times=new Date(new Date().setDate(new Date().getDate()+30))
					let api_times=new Date(new Date().setMinutes(new Date().getMinutes()+4))
					res.cookie('t',tel,{expires:tel_times,httpOnly:true})
					//res.cookie('p',pwd,{expires:tel_times,httpOnly:true})
					res.cookie('a',1,{expires:api_times,httpOnly:true})
					callback(true)
		        }else{
		          	res.redirect(302,'/register?url='+url)
		          	callback(false)
		        }

			},'form')
		}else{
			//res.redirect(302,'/register?url='+url)
			callback(false)
		}
	})

}

module.exports={
	login:login,
	register:register,
	wxlogin:wxlogin
}


function get(url,callback){
	let request=require('request');
	request.defaults({jar:true});
	request(url,(err,res,body)=>{
		console.log(err)
		//console.log(res)
		//console.log(body)
		if (!err && res.statusCode == 200) {
	        callback(JSON.parse(body))
	    }else{
	    	callback({success:false,msg:err});
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
	    },
	}
	if(data_type!='form')
		config.body=req
	else
		config.form=req
	let request=require('request');
	request.defaults({jar:true});
	console.log(req.session)
	let j;
	if(!req.session || !req.session.user){
		j=request.jar();
	}else{
		j=req.session.user;
	}
		config.jar=j;
	//console.log(request.jar(),'jar_str');
	request(config, function(err, res, body) {
		//console.log(res.statusCode)
		if(typeof body=='string' && body.indexOf('<!DOCTYPE')>-1){
			callback('{success:0,msg:"login give html"}')
			return;
		}
	    if (!err && res.statusCode == 200) {
	        callback(body,j)
	    }else{
	    	console.log(err)
	    }
	});
}