let express = require('express')
let router = express.Router();
let fs = require("fs");
let method = require("../method/index.js");

router.get("/", (req,res) => {

  method.readWrod("./json/word.json",(data)=> {
    
     res.render('index',{
        data:JSON.parse(data)
    })
  })
})

router.post("/setWord", (req,res) => {
  method.addWrod("./json/word.json",req.body, (data) => {
    console.log(data);
  })
  res.redirect('/');
})

module.exports = router;