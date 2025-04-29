const Base = require("./Base")
const msgDecoder = require("./msgDecoder")

class GameMgr {
	clients = []

	gameHandlers = {}

	constructor() {
	}

	setGameHandler(gameId, handler) {
		this.gameHandlers[gameId] = handler;
	}

	clientClosed(client) {
		let gameId = client.gameId;
		if (gameId) {
			let handler = this.gameHandlers[gameId];
			if (handler) {
				handler.removeClient(client);
			}
		}
	}

	onMessage(client, cmd, seq, data) {
		let gameId = client.gameId;
		let handler = this.gameHandlers[gameId];
		if (handler) {
			handler.onMessage(client, cmd, seq, data);
		} else {
			if (cmd == Base.Cmd.EnterGameReq) {
				let buf = msgDecoder.encode(Base.Cmd.EnterGameResp, {
					code: Base.Code.GameNotExit,
					errMsg: '游戏不存在',
					userId: this.userId,
					gameId: this.gameId,
				})
				client.send(buf, Base.Cmd.EnterGameResp, seq);
				console.log("game not exit");
			}
		}
	}
}

let gameMgr = new GameMgr()
module.exports = gameMgr;