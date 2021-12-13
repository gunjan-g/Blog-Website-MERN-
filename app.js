const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Save the moments that matter! Pen down your ideas! We store your thoughts for free!";
const aboutContent = "Whether you’re looking for a tool to record your daily emotions and activities in a reflective journal, keep track of milestones in a food diary or pregnancy journal, or even record your dreams in a dream journal, we have got you covered. We give you the tools you need to focus on the ideas you want to preserve, rather than the process of writing itself.";

const app = express();

app.set('view engine', 'ejs');        //setting the view engine as ejs

app.use(bodyParser.urlencoded());
app.use(express.static("public"));    //use public folder as static

//connecting to database blogDB
mongoose.connect("mongodb://localhost/blogDB");

//creating schema for posts namely title and content
const postSchema = {
  title: String,
  content: String
};

//create collection Post using schema postSchema
const Post = mongoose.model("Post", postSchema);

//rendering home page
app.get("/", function(req, res){
  res.render("index");
});

app.get("/home", function(req, res){
  //find all posts and posts are given at result
  Post.find({}, function(err, posts){
    //render home.ejs view with starting content as constant defined above and posts from database
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

//if we want to compose posts
app.get("/compose", function(req, res){
  //render compose view
  res.render("compose");
});

//when post is made from compose
app.post("/compose", function(req, res){
  //make a new post and save it to database
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  //if there is no error in saving posts, then redirect to home
  post.save(function(err){
    if (!err){
        res.redirect("/home");
    }
  });
});

//postId is a variable that is taken from address
app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;
  
//find in db where id = requestedPostId and then display that post
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  //render about.ejs view with about content as constant
  res.render("about", {aboutContent: aboutContent});
});

app.listen(8000, function() {
  console.log("Server started on port 8000");
});