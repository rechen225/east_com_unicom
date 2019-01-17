var express = require('express');
var router = express.Router();
let wechat=require('../server/wechat')

/* GET users listing. */
router.get('/', function(req, res, next) {
	let tel=req.cookies['t']
	let openid=req.cookies['openid']
	let code=req.query.code
	if(req.query.testbs){
		console.log('测试环节')
		let body={ 
			subscribe: 1,
			openid: 'oy84s1FY0bf1k0gk2bEBbWuAbpqM',
			nickname: 'ᕕ(ᐛ)ᕗ变身!',
			sex: 1,
			language: 'zh_CN',
			city: '杭州',
			province: '浙江',
			country: '中国',
			headimgurl:'http://thirdwx.qlogo.cn/mmopen/NEl9F4zicH2MZ48FpmBee0DPJFRvwOl53KNKZoaIztyO4US5KyWfibt5RczRApZPs5h3eQ634FfPvWqhcmEqZLPlqeZ5o6bFpm/132',
			subscribe_time: 1538120290,
			remark: '',
			groupid: 0,
			tagid_list: [],
			subscribe_scene: 'ADD_SCENE_SEARCH',
			qr_scene: 0,
			qr_scene_str: '' 
		}
		let tel_times=new Date(new Date().setDate(new Date().getDate()+30))
		res.cookie('openid',body.openid,{expires:tel_times,httpOnly:true})
		res.render('user_index',{title:'我的信息',tel:tel,wechat:body})
		return
		}


	if(!openid && !code){
		res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxed14cc095edc34e0&redirect_uri=http%3a%2f%2ffsr.calltrace.cn%2fusers%2f&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect')
		return
		
	}else if(!openid){
		wechat.get_web_token(code,(body)=>{
			let tel_times=new Date(new Date().setDate(new Date().getDate()+30))
			res.cookie('openid',body.openid,{expires:tel_times,httpOnly:true})
			console.log(body)
			res.render('user_index',{title:'我的信息',tel:tel,wechat:body})
		})
		
	}else{
		wechat.get_user(openid,(body)=>{
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
