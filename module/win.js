//winning logic
export const WINNING_COMBINATIONS = [
    [0, 1, 2], // horizontal
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // vertical
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonal check
    [2, 4, 6]
];


export function checkWin(blockElements,currentClass){
    let winMatch=[];
    WINNING_COMBINATIONS.some((combination)=>{
        console.log(combination);
        winMatch.push(combination.every((index)=>{
            return blockElements[index].classList.contains(currentClass);
        }))
    })
    console.log(winMatch);
    return winMatch || null;
}