var crypto = require('crypto');
 
 /*
 1 var secret='pass';//密钥
 2 
 3 //加密
 4 router.post("/encrypt",function(req,res){
 5     var str=req.body.str;//明文
 6     var cipher = crypto.createCipher('aes192', secret);
 7     var enc = cipher.update(str, 'utf8', 'hex');//编码方式从utf-8转为hex;
 8     enc += cipher.final('hex');//编码方式从转为hex;
 9     res.send(enc);
10 });
11 //解密
12 router.post("/decrypt",function(req,res){
13     var str=req.body.str;//明文
14     var decipher = crypto.createDecipher('aes192', secret);
15     var dec = decipher.update(str, 'hex', 'utf8');//编码方式从hex转为utf-8;
16     dec += decipher.final('utf8');//编码方式从utf-8;
17     res.send(dec);
18 });
*/

exports.encrypt=(str,key,callback)=>{
    let cipher = crypto.createCipher('aes192', key)
    let enc=cipher.update(str,'utf8','hex')
    enc+=cipher.final('hex')
    if(callback){
        callback(enc)
    }
}

exports.decrypt=(str,key,callback)=>{
    let decipher=crypto.createDecipher('aes192',key)
    let dec=decipher.update(str,'hex','utf-8')
    dec+=decipher.final('utf8')
    if(callback){
        callback(dec)
    }
}