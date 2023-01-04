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
  task : {type: String, required: true},
  done : {type: Number, default: 0}
});
const Item = mongoose.model("Item", itemsSchema);

const listSchema = new mongoose.Schema({
  name: {type: String, required : true},
  items: [itemsSchema]
});
const List = mongoose.model("List", listSchema);
const item1 = new Item({task: "Do stuff"});
//item1.save();
let items = [];
console.log(items);
//let items = [{task: "Do stuff", done: 1},{task: "eat stuff", done: 0},{task: "break stuff", done: 0}];
let workList = [];

//done
app.get("/about", (req,res) => {
  res.render("pages/about");
});

//done
app.get("/", async (req,res) => {
  // console.log(getDay());
  console.log("GET");
  items = await Item.find();
  console.log(items);
  console.log("render index");
  res.render("pages/index", {title: getDate(), todolist: items, action: "/"});
});

//done
app.get("/:customList", async (req, res) => {
  console.log(req.params.customList);
  const getList = await List.findOne({name: req.params.customList});
  if(getList){
    console.log(getList.items);
    // show existing list (getList)
    res.render("pages/index", {title: getList.name, todolist: getList.items});
  } else {
    try{
      //create a new list
      const item1 = new Item({task: "Do stuff"});
      console.log("line 75");
      const newlist = new List({
        name: req.params.customList,
        items: [item1]
      });
      console.log("line 77");
      await newlist.save();
      console.log("line 79");
      res.render("pages/index", {title: newlist.name, todolist: newlist.items});
    } catch (err){
      console.log(err);    
    }
  }
});

//done
app.post("/", async (req, res) => {
  console.log(req.body);
  const listToUpdate = req.body.button;
  const itemToAdd = req.body.task;
  const getList = await List.findOne({name: listToUpdate});
  if(getList){
    console.log(getList);
    console.log(itemToAdd);
    const newItem = new Item({task: itemToAdd});
    getList.items.push(newItem);
    console.log(getList);
    await getList.save();
    res.redirect("/" + listToUpdate);
  } else {
    console.log("This is the root list");
    const newItem = new Item({task: itemToAdd});
    await newItem.save();
    res.redirect("/");
  }
});

// done
app.post("/updateStatus", async (req, res) => {
  console.log("we posted to update?");
  console.log("----body----");
  console.log(req.body);
  if(req.body.listName == getDate()){
    console.log("ROOT list");
    let theItem = await Item.findOne({task: req.body.updateTask});
    console.log(theItem);
    if(req.body.done){
      console.log("item is done");
      theItem.done = 1;
    } else {
      console.log("item NOT done");
      theItem.done = 0;
    }
    await theItem.save();
    res.redirect("/");
  } else {
    console.log("NOT ROOT LIST");
    let theList = await List.findOne({name: req.body.listName});
    for(let x = 0; x < theList.items.length; x++){
      console.log(theList.items[x]);
      if(theList.items[x].task == req.body.updateTask){
        if(req.body.done){
          console.log("item is done");
          theList.items[x].done = 1;
        } else {
          console.log("item NOT done");
          theList.items[x].done = 0;
        }
        console.log(theList.items[x]);
        await theList.save();
        res.redirect("/" + req.body.listName);
      } else {
        console.log("NO ITEM FOUND?");
      }
    }
  }
});

// done
app.post("/deleteItem", async (req, res) => {
  console.log("we posted to delete?");
  console.log(req.body);
  if(req.body.listNameDel === getDate()){
    console.log("ROOT list");
    const result = await Item.deleteOne({_id: req.body.deleteTask});
    res.redirect("/");
  } else {
    console.log("NOT ROOT LIST");
    const result = await List.findOne({name: req.body.listNameDel});
    result.items.id(req.body.deleteTask).remove();
    await result.save();
    res.redirect("/" + req.body.listNameDel);
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Server is running on port 3000"));