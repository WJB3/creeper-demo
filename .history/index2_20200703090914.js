
var iconv = require('iconv-lite');

var biz_content = "��֤��Ϊ��";
var gbkBytes = iconv.encode(biz_content,'gbk');

console.log(gbkBytes)