import express from 'express';
//__dirname for esm 
import path from 'path';
import {fileURLToPath} from 'url';
// since getDate is exported as default we can't use a named export import {functionName} from "./date.js";
import {getDate, getDay} from "./date.js";
import mongoose from 'mongoose';
mongoose.set('strictQuery', true);

const app = express();
// instead of body-parser
app.use(express.urlencoded({extended: true})); 
app.use(express.json());

app.set('view engine', 'ejs');
app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await mongoose.connect('mongodb://localhost:27017/todolistdb');
const itemsSchema = new mongoose.Schema({
  task : {type: String, unique: true, dropDups: true, required : true},
  done : {type: Number, default: 0}
});
const Item = mongoose.model("Item", itemsSchema);
//const item1 = new Item({task: "Do stuff"});
//item1.save();
const items = await Item.find();
console.log(items);
//let items = [{task: "Do stuff", done: 1},{task: "eat stuff", done: 0},{task: "break stuff", done: 0}];
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
      const newItem = new Item({task: req.body.task});
      newItem.save();
      items.push(newItem);
    }
    res.redirect("/");
  }
});

app.post("/updateStatus", (req, res) => {
  console.log("we posted?");
  console.log(req.body);
  for(let x = 0; x < items.length; x++){
    if (items[x].task == req.body.task){
      let theItem = items[x];
      theItem.done = req.body.done;
      theItem.save();
    }
  }
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => console.log("Server is running on port 3000"));