const express = require("express");
var http = require("http");
const app = express();
const port = process.env.PORT || 5000;
var server = http.createServer(app);
var io = require("socket.io")(server);

//middleware
app.use(express.json());
var clients = {};
const routes = require("./routes");
app.use("/routes",routes);
app.use("/uploads", express.static("uploads"));

io.on("connection",(socket)=>{
    console.log("Connected");
    console.log(socket.id, "has joined");
    socket.on("signin", (id)=> {
        console.log(id);
        clients[id]=socket;
        console.log(clients);
    });
    socket.on("message",(msg)=>{
        console.log(msg);
        targetID = msg.targetID;
        if(clients[targetID]){
            clients[targetID].emit("message",msg);
            console.log(`Message sent to ${targetID}`);
        }
        else{
            console.log(`Message not sent to ${targetID}`);
        }
    });
});

app.get("/", (req, res) => {
    res.send("Welcome to Connecta Server!");
  });
  

app.route("/check").get((req,res)=>{
    return res.json("Your App is working Fine.")
});

server.listen(port, "0.0.0.0", ()=>{
    console.log("Server Started");
});