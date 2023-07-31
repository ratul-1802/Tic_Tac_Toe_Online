const socket = io();
import { profile, setHoverEffect,markCell,endGame,isDraw } from "./module/helper.js";
import { GAME } from "./module/variables.js";
import { checkWin,WINNING_COMBINATIONS } from "./module/win.js";
//import { players } from "./server.js";

//game button
GAME.startBtn.addEventListener('click', startGameTrigger);
GAME.restartBtn.addEventListener("click", startGame);
GAME.drawBtn.addEventListener("click", startGame);

profile(socket);
//console.log(players);
//start the game
function startGameTrigger(){
    if(GAME.indicator>1){
        startGame();
    }
}

function startGame(){
    GAME.turn=false;
    //setHoverEffect();
    GAME.playerJoinCount++; // count of players having started the game
    socket.emit('gameJoined',GAME.playerJoinCount);
    if(GAME.playerJoinCount==1){
        const div = document.createElement("div");
        div.classList.add('message');
        div.innerHTML = 'Wait for your opponent';
        GAME.boardContainer.prepend(div);
        //socket.emit('whoseTurn',GAME.turn);
    }
    if(GAME.playerJoinCount==2){
        socket.emit('whoseTurn',GAME.turn);
        //socket.emit('swapTurn',GAME.turn);
    }
    //find out click events on each block or cell
    GAME.blockElements.forEach((cell)=>{
        //deleting previous records before restarting the game
        if(GAME.restart===1){
            cell.classList.remove(GAME.X_CLASS);
            cell.classList.remove(GAME.Y_CLASS);
            cell.classList.remove("green");
            cell.classList.remove("blue");
            cell.classList.remove("win");
        }
        
        cell.addEventListener('click',clickHandler,{once:true})
    })

    GAME.startingPage.classList.add('hide');
    GAME.winElement.classList.remove("show");
    GAME.drawElement.classList.remove("show");
    GAME.winnerImg.children.length ? GAME.winnerImg.removeChild(GAME.winner) : null; 
}

//action to be taken after click
function clickHandler(e){
    //console.log('working');
    let cell = e.target;
    let currentClass=GAME.X_CLASS;
    let backgrnd_color='green';
    if(GAME.turn){
        currentClass=GAME.Y_CLASS;
        backgrnd_color='blue';
        //console.log('inside blue');
    }
    //const currentClass = GAME.turn ? GAME.Y_CLASS : GAME.X_CLASS;
    let id=cell.getAttribute('id');
    // console.log(currentClass);
    let cellDetails={
        cell:cell,
        id:id,
        currentClass:currentClass,
        backgrnd_color:backgrnd_color
    }
    //console.log(cellDetails);
    markCell(cellDetails);
    // console.log(GAME.turn);
    socket.emit('markCell',cellDetails);
    //check winner
    let flag = checkWin( GAME.blockElements,currentClass).filter((win, index) => {
        if (win){
            //console.log(win);
         // add green background to the winner 
            WINNING_COMBINATIONS[index].map(i => {
            GAME.blockElements[i].classList.add('win');
         })

         // set the winner
        GAME.winner = GAME.blockElements[WINNING_COMBINATIONS[index][0]].cloneNode(true);
        console.log(GAME.winner);
        return win !== false;

        }
    })

    //  check for win or draw
    if (flag.length){
        endGame(false, GAME.winElement, GAME.drawElement);
        GAME.winnerImg.append(GAME.winner);
        socket.emit('outcome',false);
    }
    else if(isDraw(flag)){
       endGame(true, GAME.winElement, GAME.drawElement);
       socket.emit('outcome',true);
    }
    
    //GAME.turn=!GAME.turn;
    socket.emit('swapTurn',GAME.turn,currentClass);//swap turns after each move
    //console.log(GAME.turn);
    //setHoverEffect();
}

//broadcast operations

socket.on('markCell', (cellDetails) => {
    //console.log(cellDetails);
    // console.log(GAME.turn);
    //setHoverEffect();
    GAME.blockElements.forEach((cell)=>{
        if(cellDetails.id===cell.getAttribute('id'))
            cellDetails.cell=cell;
    })
    markCell(cellDetails);
})

socket.on('profileSelection',(indicator,X_CLASS,Y_CLASS)=>{
    GAME.indicator=indicator;
    GAME.X_CLASS=X_CLASS;
    GAME.Y_CLASS=Y_CLASS;
});

socket.on('gameJoined',(playerJoinCount,cls,trn)=>{
    GAME.playerJoinCount=playerJoinCount;
    //console.log(cls);
    //console.log('working');
    if(!trn)
        setHoverEffect(cls);
})

// socket.on('waitForOpponent',(msg)=>{
//     const div = document.createElement("div");
//     div.classList.add('message');
//     div.innerHTML = msg;
//     GAME.boardContainer.prepend(div);
// });

socket.on('actionOn2ndJoining',(msg,flag)=>{
    if(flag){
        const div = document.createElement("div");
        div.classList.add('message');
        div.innerHTML = msg;
        GAME.boardContainer.prepend(div);
    }
    else{
        document.querySelector('.message').innerHTML = msg;
        //console.log(msg);
    }
    
    //GAME.boardContainer.removeChild(GAME.boardContainer.firstElementChild);
});

socket.on('actionOnTurnChange',(msg,turn,cls,flag)=>{
    document.querySelector('.message').innerHTML = msg;
    GAME.turn=turn;
    if(GAME.X_CLASS==cls){
        setHoverEffect(GAME.Y_CLASS);
    }
    else{
        setHoverEffect(GAME.X_CLASS);
    }
    if(flag){
        //console.log(GAME.blockElements.classList);
        GAME.boardElement.classList.add('cursor-not-allowed');
        GAME.blockElements.forEach((element)=>{
            element.classList.add('disable-cursor');
        });
    }
    else{
        GAME.boardElement.classList.remove('cursor-not-allowed');
        GAME.blockElements.forEach((element)=>{
            element.classList.remove('disable-cursor');
        });
    }
});

socket.on('outcome',(msg)=>{
    console.log(msg);
});