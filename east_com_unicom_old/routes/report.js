var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('report_index', { title: '举报号码' });
});

router.get('/list',(req,res,next)=>{
	res.render('report_list',{title:'查看举报'})
})

module.exports = router;
