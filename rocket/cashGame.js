const { Game1006 } = require("./Game1006");
const { Base } = require("./Base");
const crypto = require('crypto');
const MathUtils = require('./MathUtils.js');
const msgDecoder = require("./msgDecoder.js");
let Client = require('./client.js');
const { userMgr } = require("./user.js");

class CashGame {
	clients = [];
	clientsOfUid = {};

	betClients = [];

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

	history = [];

	init() {

		msgDecoder.registerDecoder(Game1006.Cmd.NotifyFlyInfo, Game1006.NotifyFlyInfo);
		msgDecoder.registerDecoder(Game1006.Cmd.NotifyCutDown, Game1006.NotifyCutDown);
		msgDecoder.registerDecoder(Game1006.Cmd.NotifyPrepare, Game1006.NotifyPrepare);
		msgDecoder.registerDecoder(Game1006.Cmd.NotifyStart, Game1006.NotifyStart);
		msgDecoder.registerDecoder(Game1006.Cmd.NotifyBet, Game1006.NotifyBet);
		msgDecoder.registerDecoder(Game1006.Cmd.NotifyCancelBet, Game1006.NotifyCancelBet);


		msgDecoder.registerDecoder(Game1006.Cmd.enterRoomResp, Game1006.enterRoomResp);
		msgDecoder.registerDecoder(Game1006.Cmd.CashOutReq, Game1006.CashOutReq);
		msgDecoder.registerDecoder(Game1006.Cmd.CashOutResp, Game1006.CashOutResp);
		msgDecoder.registerDecoder(Game1006.Cmd.BetReq, Game1006.BetReq);
		msgDecoder.registerDecoder(Game1006.Cmd.BetResp, Game1006.BetResp);
		msgDecoder.registerDecoder(Game1006.Cmd.CancelBetReq, Game1006.CancelBetReq);
		msgDecoder.registerDecoder(Game1006.Cmd.CancelBetResp, Game1006.CancelBetResp);
		msgDecoder.registerDecoder(Game1006.Cmd.GetBetHistoryReq, Game1006.GetBetHistoryReq);
		msgDecoder.registerDecoder(Game1006.Cmd.GetBetHistoryResp, Game1006.GetBetHistoryResp);

		this.prepare();
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
				this.reqCancelBet(client, seq, data);
				break;
			case Game1006.Cmd.GetBetHistoryReq:
				this.reqGetBetHistory(client, seq, data);
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
		response.player = [];
		response.betUsers = this.betClients;
		response.cashOutUsers = this.cashOutUsers;
		response.history = this.history

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
			data: Game1006.Game1006Info.encode(response).finish(),
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

	getCashOutClient(userId, index) {
		for (let i = 0; i < this.cashOutUsers.length; ++i) {
			let client = this.cashOutUsers[i];
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
		let autoCashOutMultiplier = msg.autoCashOutMultiplier;
		let code = Base.Code.Success;
		if (this.status !== Game1006.Game1006Status.Game1006StatusCutdown) {
			console.log('不在下注阶段');
			code = Game1006.Game1006Code.Game1006CodeNotInBet;
			this.responseBet(client, seq, code);
			return;
		}
		let userId = client.getUserId();
		let bets = this.getBetClient(userId, index);
		if (bets) {
			console.log('已经下注了');
			code = Game1006.Game1006Code.Game1006CodeAlreadyBet;
			this.responseBet(client, seq, code);
			return;
		}

		if (betCoin <= 0 || betCoin > 10000 * 100) {
			console.log('下注金额不合法 betCoin：', betCoin);
			code = Game1006.Game1006Code.Game1006CodeBetCoinInvalid;
			this.responseBet(client, seq, code);
			return;
		}

		let betClient = {
			userId: client.getUserId(),
			betIndex: index,
			betCoin: betCoin,
			autoCashOutMultiplier: autoCashOutMultiplier,
			isCashOut: false
		};
		this.betClients.push(betClient);

		this.responseBet(client, seq, code);


		this.notifyBet([
			{
				userId: client.getUserId(),
				betIndex: index,
				betCoin: betCoin,
			}
		]);
	}

	responseCancelBet(client, seq, code, errMsg = '') {
		let response = Game1006.CancelBetResp.create({
			code: code,
			errMsg: errMsg,
		});
		let encodeBuf = Game1006.CancelBetResp.encode(response).finish();
		if (!encodeBuf) {
			console.log('消息编码失败', cmd, data);
			return;
		}
		let dataBuf = msgDecoder.encode(Game1006.Cmd.CancelBetResp, response);
		if (dataBuf) {
			client.send(dataBuf, Game1006.Cmd.CancelBetResp, seq, code);
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
		let betCoins = this.getBetClient(userId, index);
		if (!betCoins) {
			console.log('没有下注');
			code = Game1006.Game1006Code.Game1006CodeNotBet;
			this.responseCancelBet(client, seq, code);
			return;
		}

		if (this.status !== Game1006.Game1006Status.Game1006StatusCutdown) {
			console.log('不在下注阶段');
			code = Game1006.Game1006Code.Game1006CodeNotInBet;
			this.responseCancelBet(client, seq, code);
			return;
		}
		this.removeBetClient(userId, index);
		console.log(`取消下注 userId:${userId}, index:${index}`);
		this.responseCancelBet(client, seq, code);

		this.notifyCancelBet([
			{
				userId: client.getUserId(),
				betIndex: index,
			}
		]);
	}

	responseCashOut(client, seq, code, errMsg = '', index = 1, winCoin = 0, multiplier = 0) {
		let response = Game1006.CashOutResp.create({
			code: code,
			errMsg: errMsg,
			betIndex: index,
			multiplier: multiplier,
			winCoin: winCoin,
		});

		let dataBuf = msgDecoder.encode(Game1006.Cmd.CashOutResp, response);
		if (dataBuf) {
			client.send(dataBuf, Game1006.Cmd.CashOutResp, seq);
		}
	}

	reqCashOut(client, seq, data) {
		let msg = msgDecoder.decode(Game1006.Cmd.CashOutReq, data);
		let code = Base.Code.Success;
		if (!msg) {
			console.log('消息解码失败', Game1006.Cmd.CashOutReq);
			code = Base.Code.InnerError;
			this.responseCashOut(client, seq, code);
			return;
		}
		let index = msg.betIndex;
		let userId = client.getUserId();
		let betClient = this.getBetClient(userId, index);
		if (!betClient) {
			console.log('没有下注');
			code = Game1006.Game1006Code.Game1006CodeNotBet;
			this.responseCashOut(client, seq, code);
			return;
		}

		if (this.status !== Game1006.Game1006Status.Game1006StatusFly) {
			console.log('不在飞行阶段');
			code = Game1006.Game1006Code.Game1006CodeNotInFly;
			this.responseCashOut(client, seq, code);
			return;
		}

		if (betClient.isCashOut) {
			console.log('已经下车了');
			code = Game1006.Game1006Code.Game1006CodeAlreadyCashOut;
			this.responseCashOut(client, seq, code);
			return;
		}

		let betCoin = betClient.betCoin;
		let winCoin = betCoin * this.multiplier;
		winCoin = parseFloat(MathUtils.div(winCoin, 100));
		let cashOutUser = {
			userId: userId,
			betIndex: index,
			multiplier: this.multiplier,
			winCoin: winCoin,
		}
		this.cashOutUsers.push(cashOutUser);
		this.curMultiplierUsers.push(cashOutUser);
		betClient.isCashOut = true;

		let history = {
			userId: userId,
			betCoin: betCoin,
			winCoin: winCoin,
			multiplier: this.multiplier,
			times: Math.floor(Date.now() / 1000),
		}

		let user = userMgr.getUser(userId);
		if (user) {
			user.insertHistory(history);
		} else {
			console.log('历史记录添加失败，用户不存在');
		}

		this.responseCashOut(client, seq, code, "", index, winCoin, this.multiplier);
	}

	responseGetBetHistory(client, seq, code, errMsg = '', history) {
		let response = Game1006.GetBetHistoryResp.create({
			code: code,
			errMsg: errMsg,
			userBetHistory: history,
		});
		let dataBuf = msgDecoder.encode(Game1006.Cmd.GetBetHistoryResp, response);
		if (dataBuf) {
			client.send(dataBuf, Game1006.Cmd.GetBetHistoryResp, seq);
		}
	}

	reqGetBetHistory(client, seq, data) {
		let msg = msgDecoder.decode(Game1006.Cmd.GetBetHistoryReq, data);
		let userId = msg.userId;
		let user = userMgr.getUser(userId);
		if (!user) {
			console.log('用户不存在');
			code = Base.Code.InnerError;
			this.responseBet(client, seq, code);
			return;
		}

		let history = user.getHistory();
		let code = Base.Code.Success;
		this.responseGetBetHistory(client, seq, code, "", history);
	}

	notifyBet(bets) {
		let response = Game1006.NotifyBet.create();
		response.betUsers = bets;

		let dataBuf = msgDecoder.encode(Game1006.Cmd.NotifyBet, response);
		if (dataBuf) {
			this.clients.forEach(client => {
				client.send(dataBuf, Game1006.Cmd.NotifyBet)
			});
		}
	}

	notifyCancelBet(bets) {
		let response = Game1006.NotifyCancelBet.create();
		response.cancelUsers = bets;

		let dataBuf = msgDecoder.encode(Game1006.Cmd.NotifyCancelBet, response);
		if (dataBuf) {
			this.clients.forEach(client => {
				client.send(dataBuf, Game1006.Cmd.NotifyCancelBet)
			});
		}
	}

	notifyPrepare() {
		let response = Game1006.NotifyPrepare.create();
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
		response.cashOutUsers = this.curMultiplierUsers;
		response.isExplode = isExplode;
		this.curMultiplierUsers = [];

		let databuf = msgDecoder.encode(Game1006.Cmd.NotifyFlyInfo, response);
		if (databuf) {
			let info = msgDecoder.decode(Game1006.Cmd.NotifyFlyInfo, databuf);
			// console.log('推送飞行信息', info);
			this.clients.forEach(client => {
				client.send(databuf, Game1006.Cmd.NotifyFlyInfo)
			});
		}
	}

	prepare() {
		console.log('准备阶段');
		this.betClients = [];
		this.cashOutUsers = [];
		this.curMultiplierUsers = [];
		this.status = Game1006.Game1006Status.Game1006StatusPrepare;
		this.notifyPrepare();
		setTimeout(() => {
			this.cutDown();
		}, 1000);
	}

	addRobot(id) {
		let client = new Client();
		client.userId = id.toString();
		client.isLogin = true;
		let msg = msgDecoder.encode(Game1006.Cmd.BetReq, { betIndex: 0, betCoin: 100 });
		this.reqBet(client, 0, msg);
	}

	cutDown() {
		console.log('倒计时阶段');
		this.status = Game1006.Game1006Status.Game1006StatusCutdown;
		let times = 5;
		this.startTime = Math.floor(Date.now() / 1000) + times;
		this.notifyCutDown(times, this.startTime);

		let startId = MathUtils.random(10000000, 99999999, true)
		let robotCount = MathUtils.random(1, 30);
		for (let i = 0; i < robotCount; ++i) {
			this.addRobot(startId);
			startId++;
		}

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
		if (mul <= 1.01) {
			mul = 1.01;
		}
		if (mul > 100) {
			mul = 100;
		}
		// 保留两位小数
		mul = parseFloat((mul).toFixed(2)) * 100;
		this.resultMultiplier = mul

		// this.resultMultiplier = 50 * 100;
		this.multiplier = 100;
		this.step = 2;

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
		this.multiplier += (this.step + MathUtils.random(1, Math.max(1, this.step / 10), true));

		console.log('当前倍率', this.multiplier);

		if (this.multiplier >= 50 * 100) {
			this.step = 40
		} else if (this.multiplier >= 20 * 100) {
			this.step = 20
		} else if (this.multiplier >= 10 * 100) {
			this.step = 10;
		} else if (this.multiplier >= 5 * 100) {
			this.step = 5
		} else if (this.multiplier >= 2 * 100) {
			this.step = 2
		}

		let busted = false;
		if (this.multiplier >= this.resultMultiplier) {
			this.multiplier = this.resultMultiplier;
			busted = true;
		}

		for (let i = 0; i < this.betClients.length; i++) {
			let betClient = this.betClients[i];
			let autoCashOutMultiplier = betClient.autoCashOutMultiplier;
			// 自动下车逻辑: 下车倍数介于当前倍率和上一个倍率之间，且下车倍数小于等于结果倍率
			if (autoCashOutMultiplier && autoCashOutMultiplier >= this.preMultiplier && autoCashOutMultiplier <= this.multiplier && autoCashOutMultiplier <= this.resultMultiplier && !betClient.isCashOut) {
				let winCoin = betClient.betCoin * autoCashOutMultiplier;
				winCoin = parseFloat(MathUtils.div(winCoin, 100));
				let cashOutUser = {
					userId: betClient.userId,
					betIndex: betClient.betIndex,
					multiplier: autoCashOutMultiplier,
					winCoin: winCoin,
				}
				betClient.isCashOut = true;
				this.curMultiplierUsers.push(cashOutUser);
				this.cashOutUsers.push(cashOutUser);

				let history = {
					userId: betClient.userId,
					betCoin: betClient.betCoin,
					multiplier: autoCashOutMultiplier,
					winCoin: winCoin,
					times: Math.floor(Date.now() / 1000),
				}

				let user = userMgr.getUser(betClient.userId);
				if (user) {
					user.insertHistory(history);
				}
			}
		}

		if (busted) {
			clearInterval(this.addMultiplierTimeId);
			this.busted();
		} else {
			this.notifyFly(false);
		}
	}

	busted() {
		console.log('爆炸了');
		this.notifyFly(true);
		console.log('结算阶段');
		this.status = Game1006.Game1006Status.Game1006StatusSettle;

		this.history.unshift({
			roundHash: this.roundHash,
			multiplier: this.resultMultiplier
		})

		let betUsers = this.betClients;
		for (let i = 0; i < betUsers.length; i++) {
			let betUser = this.betClients[i];
			let cashOutUser = this.getCashOutClient(betUser.userId, betUser.betIndex);
			if (!cashOutUser) {
				let history = {
					userId: betUser.userId,
					betCoin: betUser.betCoin,
					multiplier: 0,
					winCoin: 0,
					times: Math.floor(Date.now() / 1000),
				}

				let user = userMgr.getUser(betUser.userId);
				if (user) {
					user.insertHistory(history);
				}
			}
		}

		setTimeout(() => {
			this.prepare();
		}, 5000);
	}
}

module.exports = CashGame;