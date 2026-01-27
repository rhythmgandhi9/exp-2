const express =require('express');
const fs = require('fs');
const path = require('path');
const FILE ="todos.json";

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

function readfile(){
return new Promise((resolve,reject)=>{
fs.readFile(FILE,"utf-8",(err,data)=>{
    if(err){
        resolve([]);
        return;
    }
    else{
      try {
        return resolve(data.trim() ? JSON.parse(data) : []);
      } catch (parseErr) {
        return resolve([]);
      }
    }
})
})
}

async function listtodos(_req,res){
    let list = await readfile();
    res.json(list);
}

async function addtodo(req,res) {
    let val = req.body.todo;
    let list = await readfile();
    let demostr = {
        todo: val,
        status: "❌"
    }
    list.push(demostr);
    fs.writeFile(FILE,JSON.stringify(list,null,2),(err)=>{ /// null,2 is used for formatizing purpose (adding item , replacer(null) , spacing(2))
        if(err){
            console.log(err);
            res.json({message:"error occured"});
        }
        else{
        console.log("ADDED!!");
        res.json({message:"todo added successfully"});
        }
})
}

async function deltodo(req,res) {
    let val = req.body.todo;
    let list = await readfile();
    let index = list.findIndex((item)=> item.todo === val); //cant use indexOf here becz its used fr primitives like number,string for complexes like obj use findIndex which always takes func as arg
    if(index!=-1)
    list.splice(index,1);
    fs.writeFile(FILE,JSON.stringify(list,null,2),(err)=>{ /// null,2 is used for formatizing purpose (adding item , replacer(null) , spacing(2))
        if(err)
            console.log(err);
        else
        if(index == -1){
            console.log("not found todo u entered!!")
            res.json({message:"todo not found"});
        }else{
        console.log("DELETED!!");
        res.json({message:"todo deleted successfully"});
        }
})
}

async function marktodo(req,res) {
    let val = req.body.todo;
    let list = await readfile();
    let index = list.findIndex((item)=> item.todo === val);
    if (index === -1) {
        console.log("not found todo u entered!!");
        res.json({ message: "todo not found" });
        return;
    }
    list[index].status="✔️";
    fs.writeFile(FILE,JSON.stringify(list,null,2),(err)=>{
        if(err){
            console.log(err);
            res.json({message:"error occured"});
        }
        else{
        console.log("Marked!!");
            res.json({message:"todo marked successfully"});
    }
})
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/addtodo',addtodo);
app.delete('/deltodo',deltodo);
app.get('/listtodos',listtodos);
app.put('/marktodo',marktodo);


app.listen(3000,()=>{
    console.log("Server started at port 3000");
})