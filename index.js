import express from 'express';
//__dirname for esm 
// import path from 'path';
// import {fileURLToPath} from 'url';
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

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

await mongoose.connect('mongodb://localhost:27017/todolistdb');

// connection for docker image
// await mongoose.connect('mongodb://db:27017/todolistdb');

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

//done
app.get("/about", (req,res) => {
  res.render("pages/about");
});

//done
app.get("/", async (req,res) => {
  try {
    const items = await Item.find();
    res.render("pages/index", {title: getDate(), todolist: items ? items : [], action: "/"});
  } catch (error) {
    console.log(error);
  }
});

//done
app.get("/:customList", async (req, res) => {
  try {
    const listName = req.params.customList;
    const getList = await List.findOne({name: listName});
    const newlist = new List({
      name: listName,
      items: []
    });
    getList ? null : (await newlist.save());
    res.render("pages/index", {
      title: getList ? getList.name : newlist.name, 
      todolist: getList ? getList.items : newlist.items
    });
  } catch (error) {
    console.log(error);
  }
});

//done
app.post("/", async (req, res) => {
  try {
    const listName = req.body.button;
    const itemToAdd = req.body.task;
    const getList = await List.findOne({name: listName});
    const newItem = new Item({task: itemToAdd});
    getList ? getList.items.push(newItem) : null;
    await (getList ? getList.save() : newItem.save());
    res.redirect(getList ? "/" + listName : "/");
  } catch (error) {
    console.error(error);
  }
});

// done
app.post("/updateStatus", async (req, res) => {
  try{
    const listName = req.body.listName;
    const updateTask = req.body.updateTask;
    const done = req.body.done;
    if(listName === getDate()){
      let theItem = await Item.findOne({_id: updateTask});
      theItem.done = done ? 1 : 0;
      await theItem.save();
      res.redirect("/");
    } else {
      let theList = await List.findOne({name: listName});
      let theItem = theList.items.id(updateTask);
      theItem.done = done ? 1 : 0;
      await theList.save();
      res.redirect("/" + req.body.listName);
    }
  } catch (error) {
    console.error(error);
  }
});

// done
app.post("/deleteItem", async (req, res) => {
  try {
    const listName = req.body.listNameDel;
    const deleteTask = req.body.deleteTask;
    const result = listName === getDate() ? null : await List.findOne({name: listName});
    listName === getDate() ? await Item.deleteOne({_id: deleteTask}) : result.items.id(deleteTask).remove();
    await (result ? result.save() : null);
    res.redirect(result ? "/" + listName : "/");
  } catch (error) {
    console.error(error);
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Server is running on port 3000"));