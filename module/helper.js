// all working function
import { GAME } from "./variables.js";
export function profile(){
    GAME.selectedAvatar.forEach((img)=>{
        img.addEventListener('click',(e)=>{
            let data_id=e.target.dataset.id;
            deleteSelected(GAME.selectedAvatar);
            document.querySelector(`[data-id='${data_id}']`).classList.add('selected');
            //console.log(e.target.dataset.id);

            //adding class based on profile selection
            if (data_id == 'b2' || data_id == 'g2'){
                GAME.X_CLASS = "b2",
                GAME.Y_CLASS = "g2";
            }

            //decide turns
            GAME.turn = data_id == 'g1' || data_id == 'g2' ? true : false;
        })
    })
}
//remove selected avatar
function deleteSelected(selectedAvatar){
    [].forEach.call(selectedAvatar,(img)=>{
        img.classList.remove('selected');
    })
}
//set hover effect while playing
export function setHoverEffect(){
    //console.log(GAME.boardElement);
    //console.log(GAME.boardElement.classList);
    GAME.boardElement.classList.remove(GAME.X_CLASS);
    GAME.boardElement.classList.remove(GAME.Y_CLASS);
    if (GAME.turn){
        GAME.boardElement.classList.add(GAME.Y_CLASS);
    }else{
        GAME.boardElement.classList.add(GAME.X_CLASS);
    }
}

//mark the cell selected by player
export function markCell(cell,currentClass){
    //console.log(cell.classList);
    cell.classList.add(currentClass);
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