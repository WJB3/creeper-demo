var xlsx = require('node-xlsx');
const request = require("request-promise-native");//request请求库
var fs = require('fs');
var sheets = xlsx.parse('./test.xlsx');

var arr = [];
//sheets是一个数组，数组中的每一项对应test.xlsx这个文件里的多个表格，如sheets[0]对应test.xlsx里的“测试参数”这个表格，sheets[1]对应Sheet2这个表格
sheets.forEach(function (sheet) {
    var newSheetsArr = [];
    //sheet是一个json对象，格式为{name:"测试参数",data:[]},我们想要的数据就存储在data里
    //let length=sheet['data'].length
    let length = 500
    for (var i = 3; i < length; i++) { //excel文件里的表格一般有标题所以不一定从0开始
        console.log(i-2)
        var row = sheet['data'][i];
        if (row && row.length > 0) {

            if (row[3] && row[3] !== "链接") {
                 
                request({
                    url: row[3],//你要请求的地址
                    method: "get",//请求方法 post get 
                    followAllRedirects: false
                }, async function (error, response, body) {
                    if (!error) {
                        let url = response && response.request && response.request.uri && response.request.uri.href;
                        
                        function  test(ms，token){
                            let _request=request.get(`https://b2b.baidu.com/inquiry/clueajax?ajax=1&wise=1&web=1&token=${token}`).then(response=>response).catch(err=>err)
                            
                            return new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    try{
                                        resolve(_request)
                                    }catch{
                                        reject([])
                                    } 
                                }, ms);
                            })
                        }
            
                        let info = await test(0.1).catch(err=>{
                            console.log('请求失败');
                        }); 

                        if (url && url !== "链接") {
                            let token = url.split("token=")[1];

                            if (response.statusCode === 200) {
                                request({
                                    url: ` https://b2b.baidu.com/inquiry/clueajax?ajax=1&wise=1&web=1&token=${token}`,
                                    method: "get",//请求方法 post get 
                                }, async function (error, response, body) {
                                    let contact = JSON.parse(body).data.contact;
                                    let phone = JSON.parse(body).data.phone;
                                    newSheetsArr.push({
                                        "时间": row[0],
                                        "编号": row[1], //部分文本尾部可能会有空格，要去除
                                        "产品": row[2], //row[2]对应表格里C这列
                                        "链接": row[3],
                                        "姓名": contact,
                                        "联系电话": phone
                                    });
                                })
                            }
                        }
                    }

                })
            }


        }
    }
   
    arr.push(newSheetsArr);

});

process.on('unhandledRejection', error => {

    // console.error('unhandledRejection', error);

    // process.exit(1) // To exit with a 'failure' code

});
