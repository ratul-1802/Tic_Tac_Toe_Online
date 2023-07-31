// all working function
import { GAME } from "./variables.js";
export function profile(socket){
    GAME.selectedAvatar.forEach((img)=>{
        img.addEventListener('click',(e)=>{
            let data_id=e.target.dataset.id;
            if(GAME.indicator==0){
                deleteSelected(GAME.selectedAvatar);
                //console.log('working');
            }
            if(GAME.indicator==0){
                document.querySelector(`[data-id='${data_id}']`).classList.add('selected_1');
                //console.log(GAME.selectedAvatar);
                GAME.selectedAvatar.forEach((element)=>{
                    element.classList.add('disable-cursor');
                });
            }
            else if(GAME.indicator==1){
                document.querySelector(`[data-id='${data_id}']`).classList.add('selected_2');
                GAME.selectedAvatar.forEach((element)=>{
                    element.classList.add('disable-cursor');
                });
            }
            
            //console.log(e.target.dataset.id);

            //adding class based on profile selection
            if(GAME.indicator==0){        //selecting first avatar
                switch (data_id) {
                    case 'b2':
                        GAME.X_CLASS = "b2";
                      break;
                    case'b1':
                        GAME.X_CLASS = "b1";
                        break;
                    case 'g2':
                        GAME.X_CLASS = "g2";
                        break;
                    case'g1':
                        GAME.X_CLASS = "g1";
                        break;
                  }
            }
            else{                             //selecting second avatar
                switch (data_id) {
                    case 'b2':
                        GAME.Y_CLASS = "b2";
                      break;
                    case'b1':
                        GAME.Y_CLASS = "b1";
                        break;
                    case 'g2':
                        GAME.Y_CLASS = "g2";
                        break;
                    case'g1':
                        GAME.Y_CLASS = "g1";
                        break;
                  }
            }
            

            // if (data_id == 'b2' || data_id == 'g2'){
            //     GAME.X_CLASS = "b2",
            //     GAME.Y_CLASS = "g2";
            // }

            //decide turns
            GAME.indicator++;
            // if(GAME.indicator==0)
            //     GAME.turn = false;
            // GAME.indicator=(GAME.indicator+1)%2;
            socket.emit('profileSelection',GAME.indicator,GAME.X_CLASS,GAME.Y_CLASS);
            // const div = document.createElement("div");
            // div.classList.add('message');
            // div.innerHTML = "Wait for your opponent";
            // GAME.boardContainer.prepend(div);
            //console.log(GAME.indicator);
        })
    })
}
//remove selected avatar
function deleteSelected(selectedAvatar){
    [].forEach.call(selectedAvatar,(img)=>{
        img.classList.remove('selected_1');
        img.classList.remove('selected_2');
    })
}
//set hover effect while playing
export function setHoverEffect(cls){
    //console.log(GAME.boardElement);
    //console.log(GAME.boardElement.classList);
    GAME.boardElement.classList.remove(GAME.X_CLASS,'green');
    GAME.boardElement.classList.remove(GAME.Y_CLASS,'blue');
    // console.log(GAME.X_CLASS);
    // console.log(GAME.Y_CLASS);
    //console.log(cls);
    if (GAME.turn){
        GAME.boardElement.classList.add(cls,'blue');
    }else{
        GAME.boardElement.classList.add(cls,'green');
    }
}

//mark the cell selected by player
export function markCell(cellDetails){
    //console.log(typeof(cellDetails.cell));
    //console.log(GAME.turn);
    cellDetails.cell.classList.add(cellDetails.currentClass,cellDetails.backgrnd_color);
}

// export function swapTurns(turn){
//     return turn =! turn;
// }

//game ending page
export function endGame(draw, winEl, drawEl){
    if (!draw){
        winEl.classList.add("show");
    }else{
        drawEl.classList.add("show");
    }
    GAME.restart=1;
}

//actions taken in case of draw
export function isDraw(flag){
    if (flag.length) return;
    return [...GAME.blockElements].every(cell => {
        return cell.classList.contains(GAME.X_CLASS) ||
        cell.classList.contains(GAME.Y_CLASS)
    })
}