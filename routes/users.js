var express = require('express');
var router = express.Router();
let wechat=require('../server/wechat')
let wechat_web=require('../server/wechat_web')
let config=require('../config.json')

/* GET users listing. */
router.get('/', function(req, res, next) {
	let tel=req.cookies['t']
	let openid=req.cookies['openid']
	let code=req.query.code
	console.log('???');
	if(req.query.testbs){
		let body={ 
			subscribe: 1,
			openid: 'oa6gdwF1-uXeqrSr0LU1MA-5HxJ0',
			nickname: 'ᕕ(ᐛ)ᕗ变身!',
			sex: 1,
			language: 'zh_CN',
			city: '杭州',
			province: '浙江',
			country: '中国',
			headimgurl: 'http://thirdwx.qlogo.cn/mmopen/LoEqBhgzXSPrP7pHrGor5anZRcBP0mlX0WYGFMqCacNsicQESibw6LcA06icGsFuep8CM8TD4TslA0oPfguOL83xb91bicQPw3Uz/132',
			subscribe_time: 1547442154,
			remark: '',
			groupid: 0,
			tagid_list: [],
			subscribe_scene: 'ADD_SCENE_PROFILE_CARD',
			qr_scene: 0,
			qr_scene_str: '' 
		}
		res.render('user_index',{title:'我的信息',tel:tel,wechat:body})
		return
	}

	//let url=encodeURIComponent('http://managecalls.bjunicom.com.cn')

	url=encodeURIComponent('http://'+config.url)

	if(!openid && !code){
		res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.app}&redirect_uri='+url+'%2fusers%2f&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect')
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
