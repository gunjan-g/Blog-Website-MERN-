const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

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
        res.redirect("/");
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

app.get("/contact", function(req, res){
  //render contact.ejs view with about content as constant
  res.render("contact", {contactContent: contactContent});
});

app.listen(8000, function() {
  console.log("Server started on port 8000");
});