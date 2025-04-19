

class MsgDecoder {
	/** 协议配置列表 */
	_decodeMap = {}

	init() {
		this.registerDecoder(Base.Cmd.LoginReq, Base.LoginReq);
		this.registerDecoder(Base.Cmd.LoginResp, Base.LoginResp);
		this.registerDecoder(Base.Cmd.EnterGameReq, Base.EnterGameReq);
		this.registerDecoder(Base.Cmd.EnterGameResp, Base.EnterGameResp);
	}

	registerDecoder(reqCmd, cls) {
		this._decodeMap[reqCmd] = cls;
	}

	unregisterDecoder(reqCmd) {
		this._decodeMap[reqCmd] = null;
	}

	encode(reqCmd, data) {
		let className = this._decodeMap[reqCmd];
		let reqData;
		if (!className) {
			console.log(`retCmd:${reqCmd} 未配置encode方法`);
		} else {
			reqData = className.encode(data).finish();
		}
		return reqData;
	}

	decode(retCmd, protoMsgBuffer) {
		let ackObj;
		let className = this._decodeMap[retCmd];
		if (!className) {
			console.log(`retCmd:${retCmd} 配置decode方法`);
		} else {
			ackObj = className.decode(protoMsgBuffer);
		}
		return ackObj;
	}
}

let msgDecoder = new MsgDecoder();
msgDecoder.init();
module.exports = msgDecoder;