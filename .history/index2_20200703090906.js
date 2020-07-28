
var iconv = require('iconv-lite');

var biz_content = "欢迎关注！";
var gbkBytes = iconv.encode(biz_content,'gbk');

console.log(gbkBytes)