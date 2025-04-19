// server.js
const WebSocket = require('ws');
let Client = require('./client.js');
let CashGame = require('./cashGame.js');
const gameMgr = require('./gameMgr.js');

// 创建WebSocket服务器实例，监听在9090端口
const wss = new WebSocket.Server({ port: 9090 });
console.log('WebSocket server is running on ws://localhost:9090');

let cashGame = new CashGame();
cashGame.init();

wss.on('connection', (ws) => {
	console.log('Client connected');
	ws.binaryType = 'arraybuffer';
	let client = new Client(ws);
	gameMgr.setGameHandler(1006, cashGame);
});




