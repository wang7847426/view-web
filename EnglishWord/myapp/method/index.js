
const fs = require("fs");

/*
  添加 单词
*/  

const addWrod = (url, data, callback) => {
  if(data.zw == '' && data.yw == '') return console.log("数据为空") ;
  readWrod(url,(dataList)=>{
    console.log(dataList);
    var list = JSON.parse(dataList) , lock = true;
    for(var i = 0; i < list.length; i++){
      if(list[i].yw === data.yw) lock = false;
    }
    if(lock){
      data.sort = data.yw[0].toLocaleLowerCase();
      data.time = new Date().getTime();
      list.push(data);

      for(var a = 0; a < list.length; a++){
        for(var b = 0; b < a; b++){
          if(list[a].sort.charCodeAt() < list[b].sort.charCodeAt()){
            var temp = list[b];
            list[b] = list[a];
            list[a] = temp;
          }
        }
      }

      fs.writeFile(url, JSON.stringify(list),(err,value) => {
        callback(value)
      })
    }
  })
}

/*
  修改 单词
*/  
const reviseWrod = (data, callback) => {

}

/*
  阅读 单词
*/ 
const readWrod = (url, callback) => {
  fs.readFile(url,"utf-8", (err, data) => {
      if(err) return console.log(err);
      if(data == ''){
        fs.writeFile(url, JSON.stringify([]), (err)=>{
          if(err) return console.log(err);
        })
         callback('[]');
      }else{
        callback(data);
      }
  })
}

/*
  删除 单词
*/ 
const deleteWord = () => {
  
}

exports.readWrod = readWrod;
exports.addWrod = addWrod;