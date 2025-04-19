let { Base } = require("./Base.js");
let msgDecoder = require("./msgDecoder.js");
let gameMgr = require("./gameMgr.js");

class Client {
	userId = 0;
	isLogin = false;
	gameId = 0;

	constructor(ws) {
		this.ws = ws;

		this.ws.onmessage = this.onMessage.bind(this);
		this.ws.onclose = this.onClose.bind(this);


		this.cmdHandlers = {
			[Base.Cmd.Heart]: this.onHeartHandler.bind(this),
			[Base.Cmd.LoginReq]: this.onLoginHandler.bind(this),
			[Base.Cmd.EnterGameReq]: this.onEnterGameHandler.bind(this),
		};
	}

	setUerId(userId) {
		this.userId = userId;
	}

	getUserId() {
		return this.userId;
	}

	onMessage(msg) {
		console.log('收到客户端消息', msg);

		let data = msg.data;
		if (data instanceof ArrayBuffer) {
			// 解析消息头
			let buf = new Uint8Array(data);
			let message = Base.Message.decode(buf);
			let cmd = message.cmd;
			console.log('收到客户端消息头', message);

			let reqData = message.bytes;
			let handler = this.cmdHandlers[cmd];
			if (handler) {
				handler(reqData, cmd, message.seq);
			} else {
				gameMgr.onMessage(cmd, seq, reqData);
			}
		} else {
			console.log('收到客户端文本消息', data);
		}
	}

	onClose() {
		gameMgr.clientClosed(this);
	}

	onHeartHandler(data, cmd, seq) {
		this.send(null, Base.Cmd.Heart);
	}

	onLoginHandler(data, cmd, seq) {
		let loginReq = msgDecoder.decode(cmd, data);
		let userId = loginReq.userId;

		let code = Base.Code.Success;
		let errMsg = '';
		if (this.userId) {
			if (this.userId === userId) {
				code = Base.Code.AlreadyLogin;
				errMsg = '已经登录过了';
				console.log('已经登录过了', this.userId);
			} else {
				code = Base.Code.LoginFailed;
				errMsg = '登录失败';
				console.log('登录失败', this.userId);
			}
		} else {
			this.userId = userId;
			this.isLogin = true;
		}

		let response = Base.LoginResp.create({
			code: code,
			errMsg: errMsg,
		});
		let encodeBuf = msgDecoder.encode(Base.Cmd.LoginResp, response);
		if (!encodeBuf) {
			console.log('消息编码失败：', Base.Cmd.LoginRes);
			return;
		}

		this.send(encodeBuf, Base.Cmd.LoginResp, seq);
	}

	onEnterGameHandler(data, cmd, seq) {
		if (this.isLogin) {
			if (this.gameId) {
				let buf = msgDecoder.encode(Base.Cmd.EnterGameResp, {
					code: Base.Code.AlreadyInGame,
					errMsg: '已经在游戏中',
					userId: this.userId,
					gameId: this.gameId,
				})
				if (buf) {
					this.send(null, Base.Cmd.EnterGameResp, seq, Base.Code.AlreadyInGame);
				}
				return;
			}
			let req = msgDecoder.decode(Base.Cmd.EnterGameReq, data);
			this.gameId = req.gameId;
			gameMgr.onMessage(this, Base.Cmd.EnterGameReq, seq, data);
		} else {
			let buf = msgDecoder.encode(Base.Cmd.EnterGameResp, {
				code: Base.Code.NotLogin,
				errMsg: '未登录',
				userId: this.userId,
				gameId: this.gameId,
			})
			if (buf) {
				this.send(null, Base.Cmd.EnterGameResp, seq, Base.Code.NotLogin);
			}
		}
	}

	send(data, cmd, seq = 0) {
		let dataBuf = Base.Message.encode({
			seq: seq,
			cmd: cmd,
			bytes: data
		}).finish();
		let buf = new ArrayBuffer(dataBuf.length);
		let uint8Array = new Uint8Array(buf);
		// data数据填充到buf中
		uint8Array.set(dataBuf);
		// 向客户端发送消息
		this.ws.send(buf);
	}
}

module.exports = Client;