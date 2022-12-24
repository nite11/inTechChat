/*
 * Import packages
 */

const utter =require('./utter.json');
const reply =require('./reply.json');


const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server, {
    perMessageDeflate :false,
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

const Fuse = require('fuse.js') //https://www.geeksforgeeks.org/fuzzy-search-in-javascript/
                                // for approximate string matching

let conversation=[];          //to save conversation history
//conversation[0]=["jarvis","Welcome to Hotel Snow Palace. I am Jarvis. How can I help you?"];

let checkIn=false; //to check whether the user has entered the checkin date
let date1="";
let date2="";
let storeAnswer="";

server.listen(process.env.PORT || 5000, function () {
    console.log("server started at port 5000");
});

app.use(express.static('public'));

io.on("connection", (socket) => {
    console.log(`connect ${socket.id}`);
    //console.log(conversation);
    conversation=[];
    //console.log(conversation);
    //console.log(checkIn);
    checkIn=false;
    
    //console.log(checkIn);

    socket.on("disconnect", (reason) => {
        console.log(`disconnect ${socket.id} due to ${reason}`);
        
    });

    socket.on("question", (data) => {
        console.log("recieved question: "+data)
        conversation[0]=["jarvis","Welcome to Hotel Snow Palace. I am Jarvis. How can I help you?"];
        // place your bot-code here !!!

        conversation.push(["user",data]);

      //  const utter=[];
      //  utter[0]=["goodbye","bye","see you"];
      //  utter[1]=["thank you","thanks"];

       // const reply=[];
        //reply["thank you"]="You're welcome";
       // reply["goodbye"]="Bye, take care";

        const options = {
            includeScore: true,  //shows the score of how close the entered data is to an utterance            
            minMatchCharLength: 3
        }

        intent=[]
        //console.log(intent)
        intent[0]=["",1]

        for (let i=0;i<utter.inputText.length;i++){
            const fuse = new Fuse(utter.inputText[i],options)
            const result = fuse.search(data)

        console.log(result)
        if(result.length>0 && result[0].score<0.7 && result[0].score<intent[intent.length-1][1]){
            intent.push([result[0].item,result[0].score])
            //console.log(intent)

        }}
        //score has to be less than .50
        

        
        answer="Sorry, I do not understand what you mean." //fallback answer

        for (let i=0;i<utter.inputText.length;i++)
        {
            for (let j=0;j<utter.inputText[i].length;j++){

                if(intent[intent.length-1][0]===utter.inputText[i][j]){
                    for (let k=0;k<reply.outputText.length;k++){
                        if(reply.outputText[k][0]===utter.inputText[i][0]){
                            answer=reply.outputText[k][1];
                            if(utter.inputText[i][0]==="yes"){
                                answer=storeAnswer;
                                if(answer===""){answer="Sorry, I do not understand what you mean."}
                                storeAnswer="";
                            }
                            if(utter.inputText[i][0]==="date" && checkIn){
                                date2=data;
                                answer="Okay. I can book a room for you from "+date1+" to "+date2+". If you want me to do the booking, enter 'Sure'.";
                            }
                            if(utter.inputText[i][0]==="date" && !checkIn)
                            {   date1=data;
                                checkIn=true;
                                answer+=date1+". And when do you want to checkout? (mmm-dd)";}
                    }}}
            }
        }
        
        if (intent[intent.length-1][1]>.4 && intent[intent.length-1][1]<.7){
            storeAnswer=answer;
            answer="Do you mean '"+ intent[intent.length-1][0]+ "'? Enter 'Yes' if this is correct. If not, please rephrase and enter.";
            

        }
        
        conversation.push(["jarvis",answer]);
        //code end
        //answer = "I am dumb, i cannot answer to \"" + data + "\" yet";
        socket.emit("answer", answer);
        //console.log(conversation)
    });
});
