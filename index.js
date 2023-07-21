
import { profile, setHoverEffect,markCell,endGame,isDraw } from "./module/helper.js";
import { GAME } from "./module/variables.js";
import { checkWin,WINNING_COMBINATIONS } from "./module/win.js";

//game button
GAME.startBtn.addEventListener('click',startGame);
GAME.restartBtn.addEventListener("click", startGame);
GAME.drawBtn.addEventListener("click", startGame);

profile();

//start the game
function startGame(){
    setHoverEffect();

    //find out click events on each block or cell
    GAME.blockElements.forEach((cell)=>{
        //deleting previous records before restarting the game
        cell.classList.remove(GAME.X_CLASS);
        cell.classList.remove(GAME.Y_CLASS);
        cell.classList.remove("green");
        cell.classList.remove("blue");
        cell.classList.remove("win");

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
    const cell = e.target;
    let currentClass=GAME.X_CLASS;
    let backgrnd_color='green';
    if(GAME.turn){
        currentClass=GAME.Y_CLASS;
        backgrnd_color='blue';
    }
    //const currentClass = GAME.turn ? GAME.Y_CLASS : GAME.X_CLASS;
    // console.log(cell);
    // console.log(currentClass);
    markCell(cell, currentClass,backgrnd_color);
    //check winner
    let flag = checkWin( GAME.blockElements,currentClass).filter((win, index) => {
        if (win){
         console.log(win);
         // add green background to the winner 
         WINNING_COMBINATIONS[index].map(i => {
             GAME.blockElements[i].classList.add('win');
         })

         // set the winner
        GAME.winner = GAME.blockElements[WINNING_COMBINATIONS[index][0]].cloneNode(true);
        return win !== false;

        }
    })

    //  check for win or draw
    if (flag.length){
        endGame(false, GAME.winElement, GAME.drawElement);
        GAME.winnerImg.append(GAME.winner);
    }
    else if(isDraw(flag)){
       endGame(true, GAME.winElement, GAME.drawElement);
    }
    
    GAME.turn=!GAME.turn;//swap turns after each move

    setHoverEffect();
}