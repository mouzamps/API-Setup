//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

///////////////////////////////////Requests Targetting all Articles////////////////////////

app.route("/articles")

.get(function(req, res){
  Article.find(function(err, foundArticles){
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})

.post(function(req,res){
  console.log(req.body.title);
  console.log(req.body.content);
const newArticle = new Article({
  title:req.body.title,
  content:req.body.content
})
newArticle.save(function(err){
  if(!err){
    res.send("succesfully added an article")
  }else{
    res.send(err);
  }
});
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("succesfully deleted all articles.");
    }else{
      res.send(err);
    }
  });
});

app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.findOne({title: req.params.articleTitle},function(err,foundarticle){
    if (foundarticle){
      res.send(foundarticle);
    }else{
      res.send("No Articles found matching");
    }
  });
})
.put(function(req,res){
  Article.updateMany(
    {title:req.params.articleTitle},
    {title:req.body.title, content:req.body.content},
    {overwrite:true},
    function(err){
      if(!err){
        res.send("succesfully upadted");
      }
    }
  );
})
.patch(function(req,res){
  Article.updateMany(
    {title:req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("succesfully updated patch");
      }else{
        res.send(err);
      }
    }
  );
})
.delete(function(req,res){
  Article.deleteOne(
    {title:req.params.articleTitle},
    function(err){
      if(!err){
        res.send("successfully deleted inside route");
      }else{
        res.send(err);
      }
    }
  );
});



app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
  