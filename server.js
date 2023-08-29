// const express=require('express');
// const app = express();
// const http = require('http').createServer(app);
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

const PORT = process.env.PORT || 3000;

let players=new Map();
//let obj={};

httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
    //console.log(__dirname);
})

//app.use(express.static('F:\\HCJ_projects\\Tic Tac Toe' + '/'))
app.use(express.static(__dirname + '/'))

app.get('/', (req, res) => {
    res.sendFile('F:\\HCJ_projects\\Tic Tac Toe' + '/index.html')
})

// Socket 
//const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...',socket.id);
    console.log('Connected...',socket.connected);
    //console.log(io.sockets.sockets.get(socket.id));
    console.log(io.engine.clientsCount);
    // if(io.engine.clientsCount<=2){
    //     players.set(socket.id,null);
    //     console.log(players);
    // }
    // players.forEach((value,key)=>{
    //     //const socketList =await io.fetchSockets();
    //     //console.log(socketList.includes(key));
    //     //console.log(socketList);
    //     let currentSocket=io.sockets.sockets.get(key);
    //     //console.log(key);
    //     if (currentSocket===undefined || !currentSocket.connected) { 
    //         players.delete(key);
            
    //     }
    //     //console.log(players);
    // })
    //console.log(players);  
    socket.on('joinRoom',async (id,name)=>{
        const sockets = await io.in(id).fetchSockets();
        if(sockets.length<2){
            let userInfo={
                class:undefined,
                turn:undefined,
                name:name,
                roomId:id
            };
            players.set(socket.id,userInfo)
            socket.join(id);
            console.log(sockets.length);
            if(sockets.length==0){
                socket.emit('joinRoom',true,false);
            }
            else{
                socket.emit('joinRoom',true,true);
                socket.to(players.get(socket.id).roomId).emit('permissionForSelection');
            }
        }
        else{
            socket.emit('joinRoom',false,false);
        }
        // socket.to(id).emit('joined',name);
        // socket.emit('joined','you');
    }) 
    socket.on('markCell', (cellDetails) => {
        //console.log(cellDetails);
        //socket.broadcast.emit('markCell',cellDetails);
        socket.to(players.get(socket.id).roomId).emit('markCell',cellDetails);
    })
    socket.on('profileSelection', (indicator,X_CLASS,Y_CLASS) => {
        //socket.broadcast.emit('profileSelection',indicator,X_CLASS,Y_CLASS);
        socket.to(players.get(socket.id).roomId).emit('profileSelection',indicator,X_CLASS,Y_CLASS);
        //socket.to("room1").emit(/* ... */);
        //console.log(socket.id);
        //if(io.engine.clientsCount<=2){}
        if(indicator===1){
            let userInfo={
                class:X_CLASS,
                turn:false,
                name:players.get(socket.id).name,
                roomId:players.get(socket.id).roomId
            };
            players.set(socket.id,userInfo);
            //socket.emit('waitForOpponent');
        }
        else{
            let userInfo={
                class:Y_CLASS,
                turn:true,
                name:players.get(socket.id).name,
                roomId:players.get(socket.id).roomId
            };
            players.set(socket.id,userInfo);
        }
        
        //console.log(players);
    })

    socket.on('gameJoined',(playerJoinCount)=>{
        let cls=players.get(socket.id).class;
        let trn=players.get(socket.id).turn;
        //console.log(typeof(cls));
        //io.sockets.emit('gameJoined',playerJoinCount,cls,trn);
        io.in(players.get(socket.id).roomId).emit('gameJoined',playerJoinCount,cls,trn);
        //console.log('working');
    })

    socket.on('whoseTurn',()=>{
        //console.log(players);
        players.forEach((value,key)=>{
            if(players.get(socket.id).roomId==value.roomId){
                if(socket.id!=key){
                    if(value.turn==false){
                        io.to(key).emit('actionOn2ndJoining','It is your turn',false,true);
                    }
                    else{
                        io.to(key).emit('actionOn2ndJoining','Wait for your turn',false,false);
                    }
                }
                else{
                    if(value.turn==false){
                        io.to(key).emit('actionOn2ndJoining','It is your turn',true,false);
                    }
                    else{
                        io.to(key).emit('actionOn2ndJoining','Wait for your turn',true,true);
                    }
                }
            }
            
        })
    })

    socket.on('swapTurn',(turn,cls)=>{
        //console.log(players);
        turn=!turn;
        players.forEach((value,key)=>{
            if(players.get(socket.id).roomId==value.roomId){
                //console.log(value,key);
                if(value.turn!==turn){
                    io.to(key).emit('actionOnTurnChange','Wait for your turn',turn,cls,true);
                }
                else{
                    io.to(key).emit('actionOnTurnChange','It is your turn',turn,cls,false);
                }
            }
        })
    })
    socket.on('outcome',(result)=>{
        if(result){
            //socket.broadcast.emit('outcome','Draw');
            socket.to(players.get(socket.id).roomId).emit('outcome',result);
        }
        else{
            //socket.broadcast.emit('outcome','You lose');
            socket.to(players.get(socket.id).roomId).emit('outcome',result);
        }
    });

    socket.on('disconnect',()=>{
        console.log(`user ${socket.id} disconnected`);
        try {
            if(players.get(socket.id)){
                socket.to(players.get(socket.id).roomId).emit('left',players.get(socket.id).name);
                players.delete(socket.id);
                console.log(players);
            }
            
        } catch (error) {
            console.log(error);
        }
        
    })

})
