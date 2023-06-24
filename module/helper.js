// all working function
import { GAME } from "./variables.js";
export function profile(){
    GAME.selectedAvatar.forEach((img)=>{
        img.addEventListener('click',(e)=>{
            let data_id=e.target.dataset.id;
            if(GAME.indicator==0){
                deleteSelected(GAME.selectedAvatar);
                //console.log('working');
            }
            if(GAME.indicator==0)
                document.querySelector(`[data-id='${data_id}']`).classList.add('selected_1');
            else if(GAME.indicator==1)
                document.querySelector(`[data-id='${data_id}']`).classList.add('selected_2');
            //console.log(e.target.dataset.id);

            //adding class based on profile selection
            if(GAME.indicator==0){//selecting first avatar
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
            else{//selecting second avatar
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
            if(GAME.indicator==0)
                GAME.turn = false;
            GAME.indicator=(GAME.indicator+1)%2;
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
export function setHoverEffect(){
    //console.log(GAME.boardElement);
    //console.log(GAME.boardElement.classList);
    GAME.boardElement.classList.remove(GAME.X_CLASS,'green');
    GAME.boardElement.classList.remove(GAME.Y_CLASS,'blue');
    if (GAME.turn){
        GAME.boardElement.classList.add(GAME.Y_CLASS,'blue');
    }else{
        GAME.boardElement.classList.add(GAME.X_CLASS,'green');
    }
}

//mark the cell selected by player
export function markCell(cell,currentClass,backgrnd_color){
    //console.log(cell.classList);
    cell.classList.add(currentClass,backgrnd_color);
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
}

//actions taken in case of draw
export function isDraw(flag){
    if (flag.length) return;
    return [...GAME.blockElements].every(cell => {
        return cell.classList.contains(GAME.X_CLASS) ||
        cell.classList.contains(GAME.Y_CLASS)
    })
}