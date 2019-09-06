var __width = document.documentElement.clientWidth;
var __height = document.documentElement.clientHeight;

var __size = __width / 375;
var __remheight=__height*(__size/100);
console.log(__remheight)
document.querySelector('html').style.fontSize = __size*100 + 'px';

window.onresize=function(){
	__width = document.documentElement.clientWidth;
	__height = document.documentElement.clientHeight;

	__size = __width / 375;
	document.querySelector('html').style.fontSize = __size*100 + 'px';
}