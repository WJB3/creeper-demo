
const xlsx = require('node-xlsx')//xlsx 库
const fs = require('fs') //文件读写库
const request = require("request-promise-native");//request请求库
const cheerio = require("cheerio"); 
let data = [] // 把这个数组写入excel   
// var formData = new FormData();
// formData.append("index",1);
// formData.append("size",17000);
request({
    url: "http://hspfootprint.honeywell.com.cn/honeywell/sales/product/list?index=1&size=16580",//你要请求的地址
    method: "post",//请求方法 post get 
    headers: {
        "content-type": "text/html",
        "Cookie": "JSESSIONID=A108C83A24C7780129AA7C534E5126C4"//如果携带了cookie
    },
}, async function (error, response, body) {
    
    if (!error && response.statusCode == 200) { 
        $ = cheerio.load(body, {
            withDomLvl1: true,
            normalizeWhitespace: false,
            xmlMode: false,
            decodeEntities: true
        });
        
        let title = ['SKU', '列表价','Product Group', 'Product Family','库存类型','Item Status','折扣',"PM","描述","最小采购数量","最小采购单位","最早生产日期","Shelf life days","保质期时间"]//设置表头
        data.push(title)  
        for (let i = 1; i <16580; i++) { 
            console.log(i)
            let arrInner = []
            let items = $(`table tr:eq(${i})`);
            let sku=items.children("td:eq(1)").text()
            arrInner.push(sku);
            arrInner.push(items.children("td:eq(2)").text());
            arrInner.push(items.children("td:eq(3)").text());
            arrInner.push(items.children("td:eq(4)").text());
            arrInner.push(items.children("td:eq(5)").text());
            arrInner.push(items.children("td:eq(6)").text()); 

            let itemid;
            
            try{
                itemid=items.children("td:eq(8)").children("a:eq(0)").attr("onclick").split("?id=")[1].split('")')[0];
            }catch(e){
                console.log(e)
                continue; 
            }
            

            await request({
                url: `http://hspfootprint.honeywell.com.cn/honeywell/sales/newsparule/skuprice?eid=E509865&bdorg=BD10&dataType=html&sku=${sku}`,//你要请求的地址
                method: "post",//请求方法 post get 
                headers: {
                    "content-type": "text/html",
                    "Cookie": "JSESSIONID=A108C83A24C7780129AA7C534E5126C4"//如果携带了cookie
                },  
            }, function (error, response, body) { 
                if(typeof body!=="string"){
                    arrInner.push("");
                    return ;
                }
                $$ = cheerio.load(body, {
                    withDomLvl1: true,
                    normalizeWhitespace: false,
                    xmlMode: false,
                    decodeEntities: true
                });

                let discount=$$(`.form-control:eq(1)`).text();
                arrInner.push(discount);

            }).catch(e => console.log("错误"));

            await request({
                url: `http://hspfootprint.honeywell.com.cn/honeywell/sales/product/view?id=${itemid}`,//你要请求的地址
                method: "post",//请求方法 post get 
                headers: {
                    "content-type": "text/html",
                    "Cookie": "JSESSIONID=A108C83A24C7780129AA7C534E5126C4"//如果携带了cookie
                },  
            }, function (error, response, body) { 
                if(typeof body!=="string"){
                    arrInner.push("");
                    return ;
                }
                $$$ = cheerio.load(body, {
                    withDomLvl1: true,
                    normalizeWhitespace: false,
                    xmlMode: false,
                    decodeEntities: true
                });
 
                let PM = $$$(`.form-group`).eq(3).children(".col-md-4").children("label").text().trim();
                let desc = $$$(`.form-group`).eq(4).children(".col-md-4").children("textarea").text().trim();
                let minnum = $$$(`.form-group`).eq(6).children(".col-md-4").children("label").text().trim();
                let minunit = $$$(`.form-group`).eq(7).children(".col-md-4").children("label").text().trim();
                let shengchan = $$$(`.form-group`).eq(9).children(".col-md-4").children("label").text().trim();
                let sd = $$$(`.form-group`).eq(10).children(".col-md-4").children("label").text().trim();
                let baozhiqi = $$$(`.form-group`).eq(11).children(".col-md-4").children("label").text().trim();
                
                arrInner.push(PM);
                arrInner.push(desc);
                arrInner.push(minnum);
                arrInner.push(minunit);
                arrInner.push(shengchan);
                arrInner.push(sd);
                arrInner.push(baozhiqi);

            }).catch(e => console.log("错误"));

            data.push(arrInner); 
        }

        writeXls(data);
    }
    
});

process.on('unhandledRejection', error => {

    console.error('unhandledRejection', error);

    process.exit(1) // To exit with a 'failure' code

});


// 写xlsx文件
function writeXls(datas) {
    console.log(datas)
    let buffer = xlsx.build([
        {
            name: 'sheet1',
            data: datas
        }
    ]);
    fs.writeFileSync('./dataindexdemo55.xlsx', buffer, { 'flag': 'w' });//生成excel data是excel的名字
}
