//all html elements

export let GAME = {
    X_CLASS : undefined, // value for male 
    Y_CLASS : undefined, //value for female
    turn : undefined,
    roomJoinCount:0,
    indicator:0,
    restart:0,
    playerJoinCount:0,
    joiningDetails:document.querySelector('.room-container'),
    roomJoinBtn:document.querySelector('#room-join'),
    userName:document.querySelector('#user-name'),
    roomId:document.querySelector('#room-id'),
    imageSection:document.querySelectorAll('.img'),
    selectedAvatar:document.querySelectorAll('.pic'),
    blockElements: document.querySelectorAll('[data-cell]'),
    boardElement:document.querySelector('.board'),
    boardContainer:document.querySelector('.container'),
    startBtn:document.getElementById('start-btn'),
    startingPage:document.querySelector('.starting-page'),
    winElement: document.querySelector(".winner-msg"),
    drawElement: document.querySelector(".draw-msg"),
    loseElement: document.querySelector(".lose-msg"),
    winnerImg : document.querySelector(".winner-msg .winner"),
    restartBtn: document.querySelector('#restartBtn'),
    retryBtn: document.querySelector('#retryBtn'),
    drawBtn:document.querySelector('#drawBtn')
}