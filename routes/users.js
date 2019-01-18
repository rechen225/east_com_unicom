var express = require('express');
var router = express.Router();
let wechat=require('../server/wechat')
let wechat_web=require('../server/wechat')

/* GET users listing. */
router.get('/', function(req, res, next) {
	let tel=req.cookies['t']
	let openid=req.cookies['openid']
	let code=req.query.code

	if(!openid && !code){
		res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx30ea4459f5e78bef&redirect_uri=http%3a%2f%2ffsr.calltrace.cn%2fusers%2f&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect')
		return
		
	}else if(!openid){
		wechat_web.get_web_token(code,(body)=>{
			let tel_times=new Date(new Date().setDate(new Date().getDate()+30))
			res.cookie('openid',body.openid,{expires:tel_times,httpOnly:true})
			console.log(body)
			res.render('user_index',{title:'我的信息',tel:tel,wechat:body})
		})
		
	}else{
		wechat_web.get_user(openid,(body)=>{
			let tel_times=new Date(new Date().setDate(new Date().getDate()+30))
			res.cookie('openid',body.openid,{expires:tel_times,httpOnly:true})
			console.log(body)
			res.render('user_index',{title:'我的信息',tel:tel,wechat:body})
		})
	}
	
});

router.get('/note',(req,res,next)=>{
	res.render('user_note',{title:'拦截记录'})
})

module.exports = router;
