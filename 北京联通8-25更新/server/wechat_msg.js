exports.event=(key,openid,mpid,callback)=>{
	console.log('判断事件:'+key+"---------"+openid+'============='+mpid);
	let xml='';
	switch(key){
		case 'subscribe':
			xml=`<xml>
			<ToUserName><![CDATA[${openid}]]></ToUserName>
			<FromUserName><![CDATA[${mpid}]]></FromUserName>
			<CreateTime>${parseInt(new Date().valueOf() / 1000)}</CreateTime>
			<MsgType><![CDATA[text]]></MsgType>
			<Content><![CDATA[欢迎关注联通来电管家微信公众平台。联通来电管家是中国联通提供的免费业务，采用云端拦截技术，为用户提供专业的免打扰服务，致力于替用户解决各类骚扰电话带来的困扰。]]></Content>
			</xml>`

			callback(xml)
			break
		case 'not':
			xml=`<xml>
			<ToUserName><![CDATA[${openid}]]></ToUserName>
			<FromUserName><![CDATA[${mpid}]]></FromUserName>
			<CreateTime>${parseInt(new Date().valueOf() / 1000)}</CreateTime>
			<MsgType><![CDATA[text]]></MsgType>
			<Content><![CDATA[暂未开通]]></Content>
			</xml>
			`
			console.log('xml:'+xml);
			callback(xml)
			break
		case 'about_us':
			xml=`<xml>
			<ToUserName><![CDATA[${openid}]]></ToUserName>
			<FromUserName><![CDATA[${mpid}]]></FromUserName>
			<CreateTime>${parseInt(new Date().valueOf() / 1000)}</CreateTime>
			<MsgType><![CDATA[news]]></MsgType>
			<ArticleCount>1</ArticleCount>
			<Articles><item><Title><![CDATA[用最有效的方式对付骚扰电话]]></Title>
			<Description><![CDATA[]]></Description><PicUrl>
			<![CDATA[http://mmbiz.qpic.cn/mmbiz_jpg/uyGgVjIGHW5hiaDiavteKgxJx3wpzxK88znnQkwSDtVyYU53ZvOnL5PkwnDfmiaEY8uFRJ765PqzH0KUwgRLjc6wQ/0?wx_fmt=jpeg]]></PicUrl>
			<Url><![CDATA[https://mp.weixin.qq.com/s/QiK32Wt4sJk8mYGru5bXfg]]></Url>
			</item></Articles></xml>

			`
			callback(xml)
			break
		case 'hyxx':
			xml=`<xml>
			<ToUserName><![CDATA[${openid}]]></ToUserName>
			<FromUserName><![CDATA[${mpid}]]></FromUserName>
			<CreateTime>${parseInt(new Date().valueOf() / 1000)}</CreateTime>
			<MsgType><![CDATA[news]]></MsgType>
			<ArticleCount>1</ArticleCount>
			<Articles><item><Title><![CDATA[对比各大APP防骚扰功能]]></Title>
			<Description><![CDATA[]]></Description><PicUrl>
			<![CDATA[http://mmbiz.qpic.cn/mmbiz_jpg/uyGgVjIGHW5hiaDiavteKgxJx3wpzxK88zftOname24nnLgepKhMdeDOUBuGzH4pj33kyVzEiaribpwE2ZB6Uic6t5w/0?wx_fmt=jpeg]]></PicUrl>
			<Url><![CDATA[https://mp.weixin.qq.com/s?__biz=MzU1OTcwNjMxNQ==&mid=2247483677&idx=3&sn=e700ebe3e2ad98c54f4eebd795634671&chksm=fc1278b9cb65f1af49cef46d6cfe446e814df993ac6618f40714d8faf80decfc24eff984aadf&token=240602704&lang=zh_CN#rd]]></Url>
			</item></Articles></xml>

			`
			callback(xml)
			break
		case 'news':
			xml=`<xml>
			<ToUserName><![CDATA[${openid}]]></ToUserName>
			<FromUserName><![CDATA[${mpid}]]></FromUserName>
			<CreateTime>${parseInt(new Date().valueOf() / 1000)}</CreateTime>
			<MsgType><![CDATA[news]]></MsgType>
			<ArticleCount>1</ArticleCount>
			<Articles><item><Title><![CDATA[十一期间“95”开头骚扰电话猛增]]></Title>
			<Description><![CDATA[]]></Description><PicUrl>
			<![CDATA[http://mmbiz.qpic.cn/mmbiz_jpg/uyGgVjIGHW5hiaDiavteKgxJx3wpzxK88zqn6DuchrAm6SZkhvEmOku0icwnUmlqTLNTdGfUswpLBWbO4J5fkt3Lg/0?wx_fmt=jpeg]]></PicUrl>
			<Url><![CDATA[https://mp.weixin.qq.com/s?__biz=MzU1OTcwNjMxNQ==&mid=2247483677&idx=2&sn=dbaf948d1fc62e0cb4d93ab83fcbe013&chksm=fc1278b9cb65f1afd35a7332bc2a046250dab62c9c96100d69db6d01356ad84d29a8d855ae8f&token=240602704&lang=zh_CN#rd]]></Url>
			</item></Articles></xml>

			`
			callback(xml)
			break
	}
}