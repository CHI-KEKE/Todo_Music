const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");
require("dotenv").config();

// const items = ["Birthday Card", "Pick up my Mom"];
// const workitems = [];

//mongodb connection
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//ToDoItems mongo
const ToDoSchema = new mongoose.Schema({
    name:String
})

const ToDo = mongoose.model("ToDo",ToDoSchema)

const ToDo1 = new ToDo({
    name:'Go to Taichung'
})

const ToDo2 = new ToDo({
    name:'Rent a bike'
})

const ToDo3 = new ToDo({
    name:'Coding til night'
})

let defaultToDos = [ToDo1,ToDo2,ToDo3]

//ListName mongo
const ListSchema = new mongoose.Schema({
    name:String,
    items:[ToDoSchema]
})  

const List = mongoose.model("List",ListSchema)




app.set("view engine", "ejs");


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))





app.get("/",function(req,res){

      ToDo.find()
        .then((founditems) => {
          if (founditems.length === 0) {
            ToDo.insertMany(defaultToDos)
              .then((result) => {
                console.log("Successfully inserted!!!", result);
                res.redirect("/");
              })
              .catch((err) => {
                console.log(err);
                res.redirect("/");
              });
          } else {
            res.render("list", { ListName: "Today", newListItems: founditems });
          }

        })
        .catch((err) => {
          console.log(err);
        });
});


app.get("/:sub",function(req,res){
    const subpagemain = req.params.sub
    const subpage = _.capitalize(subpagemain);
    List.findOne({ name: subpage })
      .then((foundlist) => {
        console.log("Already Exist!", foundlist);
        res.render("list.ejs", {
          ListName: foundlist.name,
          newListItems: foundlist.items,
        });
      })
      .catch((err) => {
        console.log("Not exist, you can use it",err);
        const list = new List({
            name: subpage,
            items: defaultToDos,
        });
        list.save();
        res.render("list.ejs", {
          ListName: list.name,
          newListItems: list.items,
        });
      });

})


app.post("/",function(req,res){
    const New = req.body.newItem
    const list = req.body.list
    const NewToDo =  new ToDo({
        name: New,
    });
    if (list === "Today"){
        NewToDo.save();
        res.redirect("/")
    }else{
        List.findOne({ name: list })
          .then((foundlist) => {
            foundlist.items.push(NewToDo)
            foundlist.save()
            setTimeout(function(){res.redirect(`/${list}`)},1000);              
          })
          .catch((err) => {
            console.log(err);
          });
    }

});



app.post("/works",function(req,res){
    const workitem = req.body.data1;
    workitems.push(workitem);
    res.redirect("/works");
});

app.post("/delete",function(req,res){
    console.log("Successfully sent post request!!")
    const CheckedID = req.body.checkbox;
    const Listname = req.body.listname;
    if(Listname === "Today"){
        ToDo.findByIdAndRemove({ _id: CheckedID })
        .then(() => {
            console.log("Successfully Delete this shit in root route!");
        })
        .catch((err) => {
            console.log(err);
        });
        res.redirect("/");
    }
    else{
        List.findOneAndUpdate(
          { name: Listname },
          { $pull: { items: { _id: CheckedID } } }
        )
          .then((result) => {
            console.log(
              `Successfully Delete ${CheckedID} in ${Listname} route!`
            );
            res.redirect(`/${Listname}`);
          })
          .catch((err) => {
            console.log(err);
          });
            
    }

})



app.listen(3000,function(){
    console.log("on port 3000")
});




