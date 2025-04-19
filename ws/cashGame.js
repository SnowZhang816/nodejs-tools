const { Game1006 } = require("./Game1006");
const { Base } = require("./Base");
const crypto = require('crypto');
const MathUtils = require('./MathUtils.js');
const msgDecoder = require("./msgDecoder.js");

// 定义游戏状态枚举
const GameStatus = {
	PREPARE: 0,   	// 准备阶段
	CUTDOWN: 1,   	// 倒计时阶段
	WAIT_START: 2,  	// 等待开始阶段
	Fly: 2,     	// 飞行阶段
	SETTLE: 3,    	// 结算阶段
};

class CashGame {
	clients = [];
	clientsOfUid = {};

	betClients = [];
	betClientsOfUid = {};

	status = Game1006.Game1006Status.Game1006StatusPrepare;

	roundHash = "";
	preMultiplier = 100;
	multiplier = 100;
	resultMultiplier = 1;
	step = 1;

	startTime = 0;

	cashOutUsers = [];
	curMultiplierUsers = [];

	addMultiplierTimeId = null;

	init() {

		msgDecoder.registerDecoder(Game1006.Cmd.NotifyFlyInfo, Game1006.NotifyFlyInfo);
		msgDecoder.registerDecoder(Game1006.Cmd.NotifyCutDown, Game1006.NotifyCutDown);
		msgDecoder.registerDecoder(Game1006.Cmd.NotifyPrepare, Game1006.NotifyPrepare);
		msgDecoder.registerDecoder(Game1006.Cmd.NotifyStart, Game1006.NotifyStart);
		msgDecoder.registerDecoder(Game1006.Cmd.NotifyBet, Game1006.NotifyBet);
		msgDecoder.registerDecoder(Game1006.Cmd.enterRoomResp, Game1006.enterRoomResp);


		msgDecoder.registerDecoder(Game1006.Cmd.CashOutReq, Game1006.CashOutReq);
		msgDecoder.registerDecoder(Game1006.Cmd.CashOutResp, Game1006.CashOutResp);
		msgDecoder.registerDecoder(Game1006.Cmd.BetReq, Game1006.BetReq);
		msgDecoder.registerDecoder(Game1006.Cmd.BetResp, Game1006.BetResp);
		msgDecoder.registerDecoder(Game1006.Cmd.CancelBetReq, Game1006.CancelBetReq);
		msgDecoder.registerDecoder(Game1006.Cmd.CancelBetResp, Game1006.CancelBetResp);

		this.start();
	}

	addClient(client) {
		this.clients.push(client);
		this.clientsOfUid[client.getUserId()] = client;
		console.log(`玩家-${client.getUserId()}-join`);
	}

	removeClient(client) {
		this.clients = this.clients.filter(c => c !== client);
		if (this.clientsOfUid[client.getUserId()]) {
			delete this.clientsOfUid[client.getUserId()];
		}
		console.log(`玩家-${client.getUserId()}-leave`);
	}

	onMessage(client, cmd, seq, data) {
		switch (cmd) {
			case Base.Cmd.EnterGameReq:
				this.reqEnterRoom(client, seq, data);
				break;
			case Game1006.Cmd.BetReq:
				this.reqBet(client, seq, data);
				break;
			case Game1006.Cmd.CashOutReq:
				this.reqCashOut(client, seq, data);
				break;
			case Game1006.Cmd.CancelBetReq:
				this.reqBetCancel(client, seq, data);
				break;
			default:
				console.log(`未知消息-${cmd}`);
				break;
		}
	}

	responseEnterRoom(client, seq, code, errMsg) {
		let response = Game1006.Game1006Info.create();
		response.code = code;
		response.errMsg = errMsg;
		response.gameStatus = this.status;
		response.playerCount = this.clients.length;
		response.betUsers = this.betClients;
		response.cashOutUsers = this.cashOutUsers;

		if (this.status === Game1006.Game1006Status.Game1006StatusCutdown) {
			response.startTime = this.startTime;
			response.cutDown = this.startTime - Math.floor(Date.now() / 1000);
		}
		if (this.status >= Game1006.Game1006Status.Game1006StatusWaitStart) {
			response.roundHash = this.roundHash;
		}
		if (this.status === Game1006.Game1006Status.Game1006StatusFly) {
			response.multiplier = this.multiplier;
		}

		let data = Base.EnterGameResp.create({
			code: code,
			errMsg: errMsg,
			userId: client.getUserId(),
			gameId: client.gameId,
			bytes: Game1006.Game1006Info.encode(response).finish(),
		});

		let dataBuf = msgDecoder.encode(Base.Cmd.EnterGameResp, data);
		if (dataBuf) {
			client.send(dataBuf, Base.Cmd.EnterGameResp, seq);
		}
	}

	reqEnterRoom(client, seq, data) {
		this.addClient(client);

		this.responseEnterRoom(client, seq, Base.Code.Success);
	}

	responseBet(client, seq, code, errMsg = '') {
		let response = Game1006.BetResp.create({
			code: code,
			errMsg: errMsg,
		});
		let dataBuf = msgDecoder.encode(Game1006.Cmd.BetResp, response);
		if (dataBuf) {
			client.send(dataBuf, Game1006.Cmd.BetResp, seq);
		}
	}

	getBetClient(userId, index) {
		for (let i = 0; i < this.betClients.length; ++i) {
			let client = this.betClients[i];
			if (client.userId === userId && client.betIndex === index) {
				return client;
			}
		}
	}

	removeBetClient(userId, index) {
		for (let i = 0; i < this.betClients.length; ++i) {
			if (this.betClients[i].userId === userId && this.betClients[i].betIndex === index) {
				this.betClients.splice(i, 1);
				break;
			}
		}
	}

	reqBet(client, seq, data) {
		let msg = msgDecoder.decode(Game1006.Cmd.BetReq, data);
		if (!msg) {
			console.log('消息解码失败', Game1006.Cmd.BetReq);
			code = Base.Code.InnerError;
			this.responseBet(client, seq, code);
			return;
		}
		let index = msg.betIndex;
		let betCoin = msg.betCoin;
		let code = Base.Code.Success;
		if (this.status !== Game1006.Game1006Status.Game1006StatusCutdown) {
			console.log('不在下注阶段');
			code = Game1006.Code.Game1006CodeNotInBet;
			this.responseBet(client, seq, code);
			return;
		}
		let userId = client.getUserId();
		let bets = this.getBetClient(userId, index);
		if (bets) {
			console.log('已经下注了');
			code = Game1006.Code.Game1006CodeAlreadyBet;
			this.responseBet(client, seq, code);
			return;
		}

		if (betCoin <= 0 || betCoin > 10000) {
			console.log('下注金额不合法');
			code = Game1006.Code.Game1006CodeBetCoinInvalid;
			this.responseBet(client, seq, code);
			return;
		}

		let betClient = {
			userId: client.getUserId(),
			betIndex: index,
			betCoin: betCoin,
		}
		this.betClients.push(betClient);

		this.responseBet(client, seq, code);
	}

	responseCancelBet(client, seq, code, errMsg = '') {
		let response = Game1006.CancelBetResp.create({
			code: code,
			errMsg: errMsg,
		});
		response.status.code = code;
		let encodeBuf = Game1006.CancelBetResp.encode(response).finish();
		if (!encodeBuf) {
			console.log('消息编码失败', cmd, data);
			return;
		}
		let dataBuf = msgDecoder.encode(Base.Cmd.CancelBetResp, response);
		if (dataBuf) {
			client.send(dataBuf, Base.Cmd.CancelBetResp, seq, code);
		}
	}

	reqCancelBet(client, seq, data) {
		let msg = msgDecoder.decode(Game1006.Cmd.CancelBetReq, data);
		if (!msg) {
			console.log('消息解码失败', Game1006.Cmd.CancelBetReq);
			code = Base.Code.InnerError;
			this.responseCancelBet(client, seq, code);
			return;
		}
		let index = msg.betIndex;
		let code = Base.Code.Success;
		let userId = client.getUserId();
		let betCoins = this.getBetClient[userId, index];
		if (!betCoins) {
			console.log('没有下注');
			code = Game1006.Code.Game1006CodeNotBet;
			this.responseCancelBet(client, seq, code);
			return;
		}

		if (this.status !== Game1006.Game1006Status.Game1006StatusCutdown) {
			console.log('不在下注阶段');
			code = Game1006.Code.Game1006CodeNotInBet;
			this.responseCancelBet(client, seq, code);
			return;
		}
		this.removeBetClient(userId, index);
		console.log(`取消下注 userId:${userId}, index:${index}`);
		this.responseCancelBet(client, seq, code);
	}

	responseCashOut(client, seq, isWin, winCoin, code, errMsg = '') {
		let response = Game1006.CashOutResp.create({
			code: code,
			errMsg: errMsg,
			isWin: isWin,
			winCoin: winCoin,
		});

		let dataBuf = msgDecoder.encode(Game1006.Cmd.CashOutResp, response);
		if (dataBuf) {
			client.send(dataBuf, Game1006.Cmd.CashOutResp, seq);
		}
	}

	reqCashOut(client, seq, data) {
		let msg = msgDecoder.decode(Game1006.Cmd.CashOutReq, data);
		if (!msg) {
			console.log('消息解码失败', Game1006.Cmd.CashOutReq);
			code = Base.Code.InnerError;
			this.responseCashOut(client, seq, code);
			return;
		}
		let index = msg.betIndex;
		let code = Base.Code.Success;
		if (this.status !== Game1006.Game1006Status.Game1006StatusFly) {
			console.log('不在飞行阶段');
			this.responseCashOut(client, seq, code, false, 0);
			return;
		}

		let userId = client.getUserId();
		let betClient = this.getBetClient(userId, index);
		if (!betClient) {
			console.log('没有下注');
			code = Game1006.Code.Game1006CodeNotBet;
			this.responseCashOut(client, seq, code);
			return;
		}

		let betCoin = betClient.betCoin;
		let winCoin = betCoin * this.multiplier;
		let cashOutUser = {
			userId: userId,
			betIndex: index,
			multiplier: this.multiplier,
			winCoin: winCoin,
		}
		this.cashOutUsers.push(cashOutUser);
		this.curMultiplierUsers.push(cashOutUser);

		this.responseCashOut(client, seq, code, true, winCoin);
	}

	notifyBet(bets) {
		let response = Game1006.NotifyBet.create();
		response.betUsers = bets;
		let encodeBuf = Game1006.NotifyBet.encode(response).finish();
		if (!encodeBuf) {
			console.log('消息编码失败', cmd, data);
			return;
		}

		let dataBuf = msgDecoder.encode(Game1006.Cmd.NotifyBet, response);
		if (dataBuf) {
			this.clients.forEach(client => {
				client.send(dataBuf, Game1006.Cmd.NotifyBet)
			});
		}
	}

	notifyPrepare() {
		let response = Game1006.NotifyPrepare.create();
		let encodeBuf = Game1006.NotifyPrepare.encode(response).finish();
		if (!encodeBuf) {
			console.log('消息编码失败', cmd, data);
			return;
		}
		let dataBuf = msgDecoder.encode(Game1006.Cmd.NotifyPrepare, response);
		if (dataBuf) {
			this.clients.forEach(client => {
				client.send(dataBuf, Game1006.Cmd.NotifyPrepare)
			});
		}
	}

	notifyCutDown(times, startTime) {
		let response = Game1006.NotifyCutDown.create();
		response.cutDown = times;
		response.startTime = startTime

		let databuf = msgDecoder.encode(Game1006.Cmd.NotifyCutDown, response);
		if (databuf) {
			this.clients.forEach(client => {
				client.send(databuf, Game1006.Cmd.NotifyCutDown)
			});
		}
	}

	notifyStart() {
		let response = Game1006.NotifyStart.create();
		response.roundHash = this.roundHash;

		let databuf = msgDecoder.encode(Game1006.Cmd.NotifyStart, response);
		if (databuf) {
			this.clients.forEach(client => {
				client.send(databuf, Game1006.Cmd.NotifyStart)
			});
		}
	}

	notifyFly(isExplode) {
		let response = Game1006.NotifyFlyInfo.create();
		response.multiplier = this.multiplier;
		response.cashOutUser = this.curMultiplierUsers;
		this.curMultiplierUsers = [];
		response.isExplode = isExplode;

		let databuf = msgDecoder.encode(Game1006.Cmd.NotifyFlyInfo, response);
		if (databuf) {
			let info = msgDecoder.decode(Game1006.Cmd.NotifyFlyInfo, databuf);
			console.log('推送飞行信息', info);
			this.clients.forEach(client => {
				client.send(databuf, Game1006.Cmd.NotifyFlyInfo)
			});
		}
	}

	prepare() {
		console.log('准备阶段');
		this.betClientsOfUid = {};
		this.cashOutUsers = [];
		this.curMultiplierUsers = [];
		this.status = Game1006.Game1006Status.Game1006StatusPrepare;
		this.notifyPrepare();
		setTimeout(() => {
			this.cutDown();
		}, 1000);
	}

	cutDown() {
		console.log('倒计时阶段');
		this.status = Game1006.Game1006Status.Game1006StatusCutdown;
		let times = 5;
		this.startTime = Math.floor(Date.now() / 1000) + times;
		this.notifyCutDown(times, this.startTime);
		setTimeout(() => {
			this.start();
		}, times * 1000);
	}

	start() {
		console.log('开始阶段');
		// 随机一个哈希值
		this.roundHash = crypto.randomBytes(16).toString('hex');
		// sha256(roundHash)
		const sha256Hash = crypto.createHash('sha256').update(this.roundHash).digest('hex');
		// 截取sha256Hash前4个字节，即前32位
		const sha256Hash32 = sha256Hash.slice(0, 8);
		// sha256Hash32解析为无符号整数
		const x = parseInt(sha256Hash32, 16);
		let mul = 4294967296 / (x + 1) * (1 - 0.07)
		// 保留两位小数
		mul = parseFloat((mul).toFixed(2)) * 100;
		this.resultMultiplier = mul


		this.multiplier = 100;

		console.log('结果倍率', this.resultMultiplier);
		console.log("哈希值", this.roundHash);

		this.status = Game1006.Game1006Status.Game1006StatusWaitStart;
		this.notifyStart();

		// 一秒之后，开始推送飞行信息
		setTimeout(() => {
			this.fly();
		}, 1000);
	}

	fly() {
		console.log('飞行阶段');
		this.status = Game1006.Game1006Status.Game1006StatusFly;
		this.addMultiplierTimeId = setInterval(() => {
			this.addMultiplier();
		}, 0.1 * 1000);
	}

	addMultiplier() {
		this.preMultiplier = this.multiplier;
		this.multiplier += this.step;

		console.log('当前倍率', this.multiplier);

		if (this.multiplier >= 200) {
			this.step = 2;
		} else if (this.multiplier >= 5 * 100) {
			this.step = 5;
		} else if (this.multiplier >= 10 * 100) {
			this.step = 10;
		} else if (this.multiplier >= 20 * 100) {
			this.step = 100;
		} else if (this.multiplier >= 50 * 100) {
			this.step = 200;
		}

		if (this.multiplier >= this.resultMultiplier) {
			clearInterval(this.addMultiplierTimeId);
			this.multiplier = this.resultMultiplier;
			this.busted();
		} else {
			this.notifyFly(false);
		}
	}

	busted() {
		console.log('爆炸了');
		this.notifyFly(true);
		console.log('结算阶段');
		this.status = GameStatus.SETTLE;
		setTimeout(() => {
			this.prepare();
		}, 1000);
	}
}

module.exports = CashGame;