var express = require('express');
var router = express.Router();
var crypto = require('crypto')
let wechat=require(('../server/wechat'))
let wechat_web=require('../server/wechat_web')
let wechat_msg=require('../server/wechat_msg')
let east_api=require('../server/east_api')
let config=require('../config.json')

/* GET home page. */
router.get(['/index','/'], function(req, res, next) {
  res.render('unicom', { title: '防骚扰平台' });
});

router.get('/register',(req,res,next)=>{
	
	let wechat_code=req.query.code
	console.log('微信code:'+wechat_code)
	if(req.query.testbs){
		let tel_times=new Date(new Date().setDate(new Date().getDate()+30))
		res.cookie('openid','onSTs5k94NmzIsd1BxCLaS8kdO9M',{expires:tel_times,httpOnly:true})
		if(req.query.url){
			east_api.wxlogin('onSTs5k94NmzIsd1BxCLaS8kdO9M',res,(success)=>{
				if(success){
					res.redirect(req.query.url)
				}else{
					res.render('register',{title:'用户绑定',url:req.query.url})
				}
			})
			return
		}
		res.render('register',{title:'用户绑定',url:req.query.url})
		return
	}

	// if(req.query.unicom){
	// 	let tel_times=new Date(new Date().setDate(new Date().getDate()+30))
	// 	res.cookie('openid','test123',{expires:tel_times,httpOnly:true})
	// 	res.cookie('unicom_test','1',{expires:tel_times,httpOnly:true})
	// 	if(req.query.url){
	// 		east_api.wxlogin('test123',req,(success)=>{
	// 			if(success){
	// 				res.redirect(req.query.url)
	// 			}else{
	// 				res.render('register',{title:'用户绑定',url:req.query.url})
	// 			}
	// 		})
	// 		return
	// 	}
	// 	res.render('register',{title:'用户绑定',url:req.query.url})
	// 	return;
	// }

	if(!wechat_code){
		if(!req.query.url){
			req.query.url="newuser"
		}
		//let url=encodeURIComponent('http://fsr.calltrace.cn/register?url='+req.query.url)
		//let url=encodeURIComponent('http://managecalls.bjunicom.com.cn/register?url='+req.query.url)
		let url=encodeURIComponent('http://'+config.url+'/register?url='+req.query.url);
		//http%3a%2f%2ffsr.calltrace.cn%2fusers%2f
		//北京联通：wx30ea4459f5e78bef
		//信通院：wxed14cc095edc34e0
		res.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.app}&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`)
		return
	}else{
		wechat_web.get_web_token(wechat_code,(body)=>{
			console.log("开始注册");
			let tel_times=new Date(new Date().setDate(new Date().getDate()+30))
			res.cookie('openid',body.openid,{expires:tel_times,httpOnly:true})
			if(req.query.url && req.query.url!="newuser"){
				east_api.wxlogin(body.openid,res,(success)=>{
					if(success){
						res.redirect(req.query.url)
					}else{
						res.render('register',{title:'用户绑定',url:req.query.url})
					}
				})
				return
			}
			res.render('register',{title:'用户绑定',url:'/users/'})
		})
		//res.render('register',{title:'用户绑定',url:req.query.url})
	}
})

router.get('/unicom',(req,res,next)=>{
	res.render('unicom',{})
})

router.get('/build',(req,res,next)=>{
	res.render('build',{})
})

router.get('/about',(req,res,next)=>{
	res.render('about',{})
})

router.get('/wechat',(req,res,next)=>{
	console.log('接受到事件');
	var token="eastcom_hm";
	var signature = req.query.signature;
	var timestamp = req.query.timestamp;
	var echostr   = req.query.echostr;
	var nonce     = req.query.nonce;
	if(check(timestamp,nonce,signature,token)){
		res.send(echostr)
	}else{
		res.send('not wechat')
	}
})

router.post('/wechat',(req,res,next)=>{
	//res.writeHead(200, {'Content-Type':'application/xml'});
	let data=req.body.xml;
	console.log('接收微信事件')
	//data={"xml":{"tousername":"gh_534b2ab41536","fromusername":"onSTs5k94NmzIsd1BxCLaS8kdO9M","createtime":"1566741843","msgtype":"event","event":"CLICK","eventkey":"not"}}
	//data=data.xml;
	console.log(data);
	console.log('query：')
	console.log(req.query);
	//wechat?signature=0c1855ca935b45bcf5f07035f31d8a8ff8f7f086&timestamp=1539338118&nonce=1469025155&openid=oy84s1FY0bf1k0gk2bEBbWuAbpqM
	var token="eastcom_hm";
	var signature = req.query.signature;
	var timestamp = req.query.timestamp;
	var echostr   = req.query.echostr;
	var nonce     = req.query.nonce;
	let openid    = req.query.openid;
	console.log('类型'+data.msgtype);
	if(data.msgtype=='text'){
		let xml=`<xml>
		<ToUserName><![CDATA[${openid}]]></ToUserName>
		<FromUserName><![CDATA[${data.tousername}]]></FromUserName>
		<CreateTime>${parseInt(new Date().valueOf() / 1000)}</CreateTime>
		<MsgType><![CDATA[text]]></MsgType>
		<Content><![CDATA[你好]]></Content>
		</xml>`
		res.end(xml);
		return;
	}else if(data.msgtype=='event'){
		console.log('事件机制处理'+(data.eventkey?data.eventkey:data.event))
		console.log(wechat_msg.event);
		wechat_msg.event((data.eventkey?data.eventkey:data.event),openid,data.tousername,(xml)=>{			
			console.log(xml)
			res.end(xml);
		})
		return;
	}else{
		res.end(`<xml></xml>`);
	}


})

router.post('/test_notice',(req,res,next)=>{
	console.log(req.body.pwd)
	console.log(req.body.pwd=='hm_zxw_unicom')
	if(req.body.pwd=="hm_zxw_eastcom"){
		wechat_web.send_notice({
			openid:'oa6gdwF1-uXeqrSr0LU1MA-5HxJ0',
			number:'13221040450',
			date:new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()+' '+new Date().getHours()+':'+new Date().getMinutes(),
			content:'房产推销',
			remark:'点击查看详情',
			url:'http://fsr.calltrace.cn/users/note'
		},(body)=>{
			res.json(body)
		})
	}else if(req.body.pwd=='hm_zxw_unicom'){
		wechat_web.boss_note({
			openid:'oa6gdwF1-uXeqrSr0LU1MA-5HxJ0',
			number:'13221040450',
			date:new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()+' '+new Date().getHours()+':'+new Date().getMinutes(),
			content:'房产推销',
			remark:'点击查看详情',
			url:''
		},(body)=>{
			res.json(body)
		})
	}else{
		res.json({success:false})
	}
})




router.post('/wechat_menu',(req,res,next)=>{
	console.log(req.body.pwd)
	if(req.body.pwd=='hm_zxw_eastcom'){
		wechat_web.set_menu((body)=>{
			res.json(body)
		})
	}else{
		res.json({success:false})
	}
})

 
function check(timestamp,nonce,signature,token){
	var currSign,tmp;
	tmp = [token,timestamp,nonce].sort().join("");
	currSign = crypto.createHash("sha1").update(tmp).digest("hex");
	return (currSign === signature);  
}

module.exports = router;
