//all html elements

export let GAME = {
    X_CLASS : 'b1', // value for male 
    Y_CLASS : 'g1', //value for female
    turn : undefined,
    selectedAvatar:document.querySelectorAll('.pic'),
    blockElements: document.querySelectorAll('[data-cell]'),
    boardElement:document.querySelector('.board'),
    startBtn:document.getElementById('start-btn'),
    startingPage:document.querySelector('.starting-page'),
    winElement: document.querySelector(".winner-msg"),
    drawElement: document.querySelector(".draw-msg"),
    winnerImg : document.querySelector(".winner-msg .winner"),
    restartBtn: document.querySelector('#restartBtn'),
    drawBtn:document.querySelector('#drawBtn')
}