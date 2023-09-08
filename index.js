const socket = io();
import { profile, setHoverEffect,markCell,endGame,isDraw } from "./module/helper.js";
import { GAME } from "./module/variables.js";
import { checkWin,WINNING_COMBINATIONS } from "./module/win.js";
//import { players } from "./server.js";

//game button
GAME.startBtn.addEventListener('click', startGameTrigger);
GAME.restartBtn.addEventListener("click", restartGameTrigger);
GAME.retryBtn.addEventListener("click", restartGameTrigger);
GAME.drawBtn.addEventListener("click", restartGameTrigger);

let name,id;

GAME.roomJoinBtn.addEventListener('click',(e)=>{
    name=GAME.userName.value;
    id=GAME.roomId.value;
    if(name!=='' && id!==''){
        socket.emit('joinRoom',id,name);
    }
})

profile(socket);
//console.log(players);
//start the game
function startGameTrigger(){
    if(GAME.indicator>0){
        startGame();
    }
}

function restartGameTrigger(){
    GAME.blockElements.forEach((cell)=>{
        //deleting previous records before restarting the game
            cell.classList.remove(GAME.X_CLASS);
            cell.classList.remove(GAME.Y_CLASS);
            cell.classList.remove("green");
            cell.classList.remove("blue");
            cell.classList.remove("win");
            cell.classList.remove("win");
            cell.classList.remove('disable-cursor');
    })
    const div=document.getElementsByClassName('message');
    //console.log(div);
    div[0].remove();
    startGame();
}

function startGame(){
    //console.log('restart clicked');
    GAME.turn=false;
    //setHoverEffect();
    GAME.playerJoinCount++;
    GAME.playerJoinCount=(GAME.playerJoinCount==3)?1:GAME.playerJoinCount; // count of players having started the game
    socket.emit('gameJoined',GAME.playerJoinCount);
    if(GAME.playerJoinCount==1){
        const div = document.createElement("div");
        div.classList.add('message');
        div.innerHTML = 'Wait for your opponent';
        GAME.boardContainer.prepend(div);

        GAME.boardElement.classList.add('cursor-not-allowed');//disable cursor until opponent joins
        GAME.blockElements.forEach((element)=>{
            element.classList.add('disable-cursor');
        });
        //socket.emit('whoseTurn',GAME.turn);
    }
    if(GAME.playerJoinCount==2){
        socket.emit('whoseTurn',GAME.turn);
        //socket.emit('swapTurn',GAME.turn);
    }
    //find out click events on each block or cell
    GAME.blockElements.forEach((cell)=>{
        //deleting previous records before restarting the game
        // if(GAME.restart===1){
        //     cell.classList.remove(GAME.X_CLASS);
        //     cell.classList.remove(GAME.Y_CLASS);
        //     cell.classList.remove("green");
        //     cell.classList.remove("blue");
        //     cell.classList.remove("win");
        //     cell.classList.remove("win");
        //     cell.classList.remove('disable-cursor');
        // }
        
        cell.addEventListener('click',clickHandler,{once:true})
    })

    GAME.startingPage.classList.add('hide');
    GAME.winElement.classList.remove("show");
    GAME.drawElement.classList.remove("show");
    //console.log(GAME.loseElement);
    GAME.loseElement.classList.remove("show");
    //console.log(GAME.loseElement);
    //console.log(GAME.loseElement.classList.remove("show"));
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
        //console.log(GAME.winner);
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

socket.on('joinRoom',(allowJoin,allowSelection)=>{
    if(allowJoin){
        GAME.joiningDetails.classList.toggle('hide');
        GAME.startingPage.classList.toggle('hide');
        if(!allowSelection){
            const div = document.createElement("div");
            div.classList.add('message');
            div.innerHTML = 'Wait for your opponent';
            GAME.startingPage.prepend(div);
            GAME.imageSection.forEach((element)=>{
                element.classList.add('cursor-not-allowed');
            })
            // console.log(GAME.imageSection);
            // console.log(GAME.selectedAvatar);
            GAME.selectedAvatar.forEach((element)=>{
                element.classList.add('disable-cursor');
            });
        }
    }
    else{
        //room is full logic
    }
})

socket.on('permissionForSelection',()=>{
    GAME.startingPage.removeChild(GAME.startingPage.firstElementChild);
    GAME.imageSection.forEach((element)=>{
        element.classList.remove('cursor-not-allowed');
    })
    // console.log(GAME.imageSection);
    // console.log(GAME.selectedAvatar);
    GAME.selectedAvatar.forEach((element)=>{
        element.classList.remove('disable-cursor');
    });
});

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
    if(indicator==1){
        document.querySelector(`[data-id='${X_CLASS}']`).classList.add('disable-cursor');
    }
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

socket.on('actionOn2ndJoining',(msg,flag1,flag2)=>{
    //console.log('working');
    if(flag1){
        const div = document.createElement("div");
        div.classList.add('message');
        div.innerHTML = msg;
        GAME.boardContainer.prepend(div);
        if(flag2){
            GAME.boardElement.classList.add('cursor-not-allowed');
            GAME.blockElements.forEach((element)=>{
                element.classList.add('disable-cursor');
            });
        }
    }
    else{
        document.querySelector('.message').innerHTML = msg;
        //console.log(msg);
        if(flag2){
            GAME.boardElement.classList.remove('cursor-not-allowed');
            GAME.blockElements.forEach((element)=>{
                element.classList.remove('disable-cursor');
            });
        }
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
            if(!(element.classList.contains('b1') || element.classList.contains('g2') || element.classList.contains('g1') || element.classList.contains('b2')))
                element.classList.remove('disable-cursor');
        });
    }
});

socket.on('outcome',(result)=>{
    if(result){
        endGame(result, GAME.winElement, GAME.drawElement);
    }
    else{
        endGame(result, GAME.loseElement, GAME.drawElement);
    }
    //console.log(result);
});