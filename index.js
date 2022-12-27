import express from 'express';
//__dirname for esm 
import path from 'path';
import {fileURLToPath} from 'url';
// since getDate is exported as default we can't use a named export import {functionName} from "./date.js";
import {getDate, getDay} from "./date.js";

const app = express();
// instead of body-parser
app.use(express.urlencoded({extended: true})); 
app.use(express.json());

app.set('view engine', 'ejs');
app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let items = ["Do stuff","eat stuff","break stuff"];
let workList = [];

app.get("/", (req,res) => {
  console.log(getDay());
  res.render("pages/index", {title: getDate(), todolist: items, action: "/"});
});

app.get("/work", (req,res) => {
  res.render("pages/index", {title: "Work List", todolist: workList, action: "/work"});
});

app.get("/about", (req,res) => {
  res.render("pages/about");
});

app.post("/", (req, res) => {
  console.log(req.body);
  if(req.body.button == "Work List"){
    if (req.body.task.trim() !== ""){
      workList.push(req.body.task);
    }
    res.redirect("/work");
  }
  else{
    if (req.body.task.trim() !== ""){
      items.push(req.body.task);
    }
    res.redirect("/");
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Server is running on port 3000"));