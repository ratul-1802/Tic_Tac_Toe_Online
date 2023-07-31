//all html elements

export let GAME = {
    X_CLASS : undefined, // value for male 
    Y_CLASS : undefined, //value for female
    turn : undefined,
    indicator:0,
    restart:0,
    playerJoinCount:0,
    selectedAvatar:document.querySelectorAll('.pic'),
    blockElements: document.querySelectorAll('[data-cell]'),
    boardElement:document.querySelector('.board'),
    boardContainer:document.querySelector('.container'),
    startBtn:document.getElementById('start-btn'),
    startingPage:document.querySelector('.starting-page'),
    winElement: document.querySelector(".winner-msg"),
    drawElement: document.querySelector(".draw-msg"),
    winnerImg : document.querySelector(".winner-msg .winner"),
    restartBtn: document.querySelector('#restartBtn'),
    drawBtn:document.querySelector('#drawBtn')
}