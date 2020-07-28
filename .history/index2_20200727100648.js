var xlsx = require('node-xlsx');
var fs = require('fs');
var sheets = xlsx.parse('./test.xlsx');

var arr = [];
//sheets是一个数组，数组中的每一项对应test.xlsx这个文件里的多个表格，如sheets[0]对应test.xlsx里的“测试参数”这个表格，sheets[1]对应Sheet2这个表格
sheets.filter((item,index)=>index<10).forEach(function(sheet){
    var newSheetsArr = [];
    //sheet是一个json对象，格式为{name:"测试参数",data:[]},我们想要的数据就存储在data里
    for(var i=3; i<sheet["data"].length; i++){ //excel文件里的表格一般有标题所以不一定从0开始
        var row=sheet['data'][i];
        if(row && row.length > 0){
            newSheetsArr.push({
                编号: row[5] && row[5].replace(/\s/g,''), //部分文本尾部可能会有空格，要去除
                id: row[2], //row[2]对应表格里C这列
                testid: row[3],
                tid: row[4],
                testvalue: row[0], //row[0]对应表格里A这列
            });
        }
    }
   arr.push(newSheetsArr);
});　 

console.log(arr);