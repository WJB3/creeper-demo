
var iconv = require('iconv-lite');
const xlsx = require('node-xlsx')//xlsx 库
const fs = require('fs') //文件读写库

var biz_content = "��֤��Ϊ��";
var gbkBytes = iconv.encode(biz_content,'gbk');

writeXls([gbkBytes])

function writeXls(datas) {
    let buffer = xlsx.build([
        {
            name: 'sheet1',
            data: datas
        }
    ]);
    fs.writeFileSync('./data3.xlsx', buffer, { 'flag': 'w' });//生成excel data是excel的名字
}