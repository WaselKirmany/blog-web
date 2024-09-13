//Syntax
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "social",
  password: "wasel2509",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


let posts=[];
let postId;

async function getPosts(){
    const result = await db.query("SELECT * FROM posts order by id ASC");
    posts = result.rows;
    return posts;
}

//Homepage
app.get("/",async(req,res)=>{
    const postList=await getPosts();
    res.render("index.ejs", {
        posts:postList
    })
});

//Create Page
app.get("/create",(req,res)=>{
    res.render("create.ejs");
});

//Homepage after Submission
app.post("/submit",async(req,res)=>{
    await db.query(
        "INSERT INTO posts (title,user_id,tarea) VALUES ($1,$2,$3)",
        [req.body["title"],req.body["id"],req.body["textarea"]]);
        res.redirect("/create");

});

app.post("/delete",async(req,res)=>{
    postId=req.body.delete;
    await db.query("DELETE FROM posts WHERE id=$1",[postId]);
    console.log(req.body.delete);
    res.redirect("/");
});

app.post("/edit",async(req,res)=>{
    postId=req.body.edit;
    res.render("edit.ejs");
});

app.post("/edit1",async(req,res)=>{
    await db.query(
        "UPDATE posts SET title=$1, user_id=$2, tarea=$3 WHERE id=$4",
        [req.body["title"],req.body["id"],req.body["textarea"],postId]);
        res.redirect("/");
})

//contact page
app.get("/contact",(req,res)=>{
    res.render("contact.ejs");
});

//about page
app.get("/about",(req,res)=>{
    res.render("about.ejs");
});
//host
app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});