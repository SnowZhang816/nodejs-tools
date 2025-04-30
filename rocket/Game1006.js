var $protobuf = require("./protobuf");


(global).Game1006 = (function ($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

    // Exported root namespace
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

    $root.Game1006 = (function () {

        /**
         * Namespace Game1006.
         * @exports Game1006
         * @namespace
         */
        var Game1006 = $root.Game1006 || {};

        /**
         * Cmd enum.
         * @name Game1006.Cmd
         * @enum {string}
         * @property {number} BetReq=1006001 客户端请求 *
         * @property {number} BetResp=1006002 BetResp value
         * @property {number} CancelBetReq=1006003 CancelBetReq value
         * @property {number} CancelBetResp=1006004 CancelBetResp value
         * @property {number} CashOutReq=1006005 CashOutReq value
         * @property {number} CashOutResp=1006006 CashOutResp value
         * @property {number} GetBetHistoryReq=1006007 GetBetHistoryReq value
         * @property {number} GetBetHistoryResp=1006008 GetBetHistoryResp value
         * @property {number} NotifyFlyInfo=1006101 服务器通知 *
         * @property {number} NotifyPrepare=1006102 NotifyPrepare value
         * @property {number} NotifyCutDown=1006103 NotifyCutDown value
         * @property {number} NotifyStart=1006104 NotifyStart value
         * @property {number} NotifyBet=1006105 NotifyBet value
         * @property {number} NotifyCancelBet=1006106 NotifyCancelBet value
         */
        Game1006.Cmd = (function () {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[1006001] = "BetReq"] = 1006001;
            values[valuesById[1006002] = "BetResp"] = 1006002;
            values[valuesById[1006003] = "CancelBetReq"] = 1006003;
            values[valuesById[1006004] = "CancelBetResp"] = 1006004;
            values[valuesById[1006005] = "CashOutReq"] = 1006005;
            values[valuesById[1006006] = "CashOutResp"] = 1006006;
            values[valuesById[1006007] = "GetBetHistoryReq"] = 1006007;
            values[valuesById[1006008] = "GetBetHistoryResp"] = 1006008;
            values[valuesById[1006101] = "NotifyFlyInfo"] = 1006101;
            values[valuesById[1006102] = "NotifyPrepare"] = 1006102;
            values[valuesById[1006103] = "NotifyCutDown"] = 1006103;
            values[valuesById[1006104] = "NotifyStart"] = 1006104;
            values[valuesById[1006105] = "NotifyBet"] = 1006105;
            values[valuesById[1006106] = "NotifyCancelBet"] = 1006106;
            return values;
        })();

        /**
         * Game1006Code enum.
         * @name Game1006.Game1006Code
         * @enum {string}
         * @property {number} Game1006CodeAlreadyBet=10001 Game1006CodeAlreadyBet value
         * @property {number} Game1006CodeBetFailed=10002 Game1006CodeBetFailed value
         * @property {number} Game1006CodeNotInBet=10003 Game1006CodeNotInBet value
         * @property {number} Game1006CodeBetCoinInvalid=10004 Game1006CodeBetCoinInvalid value
         * @property {number} Game1006CodeNotInCancel=10005 Game1006CodeNotInCancel value
         * @property {number} Game1006CodeNotInFly=10006 Game1006CodeNotInFly value
         * @property {number} Game1006CodeNotInCashOut=10007 Game1006CodeNotInCashOut value
         * @property {number} Game1006CodeNotBet=10008 Game1006CodeNotBet value
         * @property {number} Game1006CodeUserBetInfoError=10009 Game1006CodeUserBetInfoError value
         * @property {number} Game1006CodeAlreadyCashOut=10010 Game1006CodeAlreadyCashOut value
         */
        Game1006.Game1006Code = (function () {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[10001] = "Game1006CodeAlreadyBet"] = 10001;
            values[valuesById[10002] = "Game1006CodeBetFailed"] = 10002;
            values[valuesById[10003] = "Game1006CodeNotInBet"] = 10003;
            values[valuesById[10004] = "Game1006CodeBetCoinInvalid"] = 10004;
            values[valuesById[10005] = "Game1006CodeNotInCancel"] = 10005;
            values[valuesById[10006] = "Game1006CodeNotInFly"] = 10006;
            values[valuesById[10007] = "Game1006CodeNotInCashOut"] = 10007;
            values[valuesById[10008] = "Game1006CodeNotBet"] = 10008;
            values[valuesById[10009] = "Game1006CodeUserBetInfoError"] = 10009;
            values[valuesById[10010] = "Game1006CodeAlreadyCashOut"] = 10010;
            return values;
        })();

        /**
         * Game1006Status enum.
         * @name Game1006.Game1006Status
         * @enum {string}
         * @property {number} Game1006StatusPrepare=0 Game1006StatusPrepare value
         * @property {number} Game1006StatusCutdown=1 Game1006StatusCutdown value
         * @property {number} Game1006StatusWaitStart=2 Game1006StatusWaitStart value
         * @property {number} Game1006StatusFly=3 Game1006StatusFly value
         * @property {number} Game1006StatusSettle=4 Game1006StatusSettle value
         */
        Game1006.Game1006Status = (function () {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "Game1006StatusPrepare"] = 0;
            values[valuesById[1] = "Game1006StatusCutdown"] = 1;
            values[valuesById[2] = "Game1006StatusWaitStart"] = 2;
            values[valuesById[3] = "Game1006StatusFly"] = 3;
            values[valuesById[4] = "Game1006StatusSettle"] = 4;
            return values;
        })();

        Game1006.History = (function () {

            /**
             * Properties of a History.
             * @memberof Game1006
             * @interface IHistory
             * @property {string} roundHash History roundHash
             * @property {number} multiplier History multiplier
             */

            /**
             * Constructs a new History.
             * @memberof Game1006
             * @classdesc Represents a History.
             * @implements IHistory
             * @constructor
             * @param {Game1006.IHistory=} [p] Properties to set
             */
            function History(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * History roundHash.
             * @member {string} roundHash
             * @memberof Game1006.History
             * @instance
             */
            History.prototype.roundHash = "";

            /**
             * History multiplier.
             * @member {number} multiplier
             * @memberof Game1006.History
             * @instance
             */
            History.prototype.multiplier = 0;

            /**
             * Creates a new History instance using the specified properties.
             * @function create
             * @memberof Game1006.History
             * @static
             * @param {Game1006.IHistory=} [properties] Properties to set
             * @returns {Game1006.History} History instance
             */
            History.create = function create(properties) {
                return new History(properties);
            };

            /**
             * Encodes the specified History message. Does not implicitly {@link Game1006.History.verify|verify} messages.
             * @function encode
             * @memberof Game1006.History
             * @static
             * @param {Game1006.IHistory} m History message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            History.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                w.uint32(10).string(m.roundHash);
                w.uint32(16).int32(m.multiplier);
                return w;
            };

            /**
             * Decodes a History message from the specified reader or buffer.
             * @function decode
             * @memberof Game1006.History
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Game1006.History} History
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            History.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Game1006.History();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                        case 1:
                            m.roundHash = r.string();
                            break;
                        case 2:
                            m.multiplier = r.int32();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                if (!m.hasOwnProperty("roundHash"))
                    throw $util.ProtocolError("missing required 'roundHash'", { instance: m });
                if (!m.hasOwnProperty("multiplier"))
                    throw $util.ProtocolError("missing required 'multiplier'", { instance: m });
                return m;
            };

            return History;
        })();

        Game1006.Game1006Info = (function () {

            /**
             * Properties of a Game1006Info.
             * @memberof Game1006
             * @interface IGame1006Info
             * @property {Game1006.Game1006Status} gameStatus Game1006Info gameStatus
             * @property {number} playerCount Game1006Info playerCount
             * @property {Array.<Game1006.IBetUser>|null} [betUsers] Game1006Info betUsers
             * @property {Array.<Game1006.ICashOutUser>|null} [cashOutUsers] Game1006Info cashOutUsers
             * @property {number} cutDown Game1006Info cutDown
             * @property {number} startTime Game1006Info startTime
             * @property {string} roundHash Game1006Info roundHash
             * @property {number} multiplier Game1006Info multiplier
             * @property {Array.<Game1006.IHistory>|null} [history] Game1006Info history
             */

            /**
             * Constructs a new Game1006Info.
             * @memberof Game1006
             * @classdesc Represents a Game1006Info.
             * @implements IGame1006Info
             * @constructor
             * @param {Game1006.IGame1006Info=} [p] Properties to set
             */
            function Game1006Info(p) {
                this.betUsers = [];
                this.cashOutUsers = [];
                this.history = [];
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * Game1006Info gameStatus.
             * @member {Game1006.Game1006Status} gameStatus
             * @memberof Game1006.Game1006Info
             * @instance
             */
            Game1006Info.prototype.gameStatus = 0;

            /**
             * Game1006Info playerCount.
             * @member {number} playerCount
             * @memberof Game1006.Game1006Info
             * @instance
             */
            Game1006Info.prototype.playerCount = 0;

            /**
             * Game1006Info betUsers.
             * @member {Array.<Game1006.IBetUser>} betUsers
             * @memberof Game1006.Game1006Info
             * @instance
             */
            Game1006Info.prototype.betUsers = $util.emptyArray;

            /**
             * Game1006Info cashOutUsers.
             * @member {Array.<Game1006.ICashOutUser>} cashOutUsers
             * @memberof Game1006.Game1006Info
             * @instance
             */
            Game1006Info.prototype.cashOutUsers = $util.emptyArray;

            /**
             * Game1006Info cutDown.
             * @member {number} cutDown
             * @memberof Game1006.Game1006Info
             * @instance
             */
            Game1006Info.prototype.cutDown = 0;

            /**
             * Game1006Info startTime.
             * @member {number} startTime
             * @memberof Game1006.Game1006Info
             * @instance
             */
            Game1006Info.prototype.startTime = 0;

            /**
             * Game1006Info roundHash.
             * @member {string} roundHash
             * @memberof Game1006.Game1006Info
             * @instance
             */
            Game1006Info.prototype.roundHash = "";

            /**
             * Game1006Info multiplier.
             * @member {number} multiplier
             * @memberof Game1006.Game1006Info
             * @instance
             */
            Game1006Info.prototype.multiplier = 0;

            /**
             * Game1006Info history.
             * @member {Array.<Game1006.IHistory>} history
             * @memberof Game1006.Game1006Info
             * @instance
             */
            Game1006Info.prototype.history = $util.emptyArray;

            /**
             * Creates a new Game1006Info instance using the specified properties.
             * @function create
             * @memberof Game1006.Game1006Info
             * @static
             * @param {Game1006.IGame1006Info=} [properties] Properties to set
             * @returns {Game1006.Game1006Info} Game1006Info instance
             */
            Game1006Info.create = function create(properties) {
                return new Game1006Info(properties);
            };

            /**
             * Encodes the specified Game1006Info message. Does not implicitly {@link Game1006.Game1006Info.verify|verify} messages.
             * @function encode
             * @memberof Game1006.Game1006Info
             * @static
             * @param {Game1006.IGame1006Info} m Game1006Info message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Game1006Info.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                w.uint32(8).int32(m.gameStatus);
                w.uint32(16).int32(m.playerCount);
                if (m.betUsers != null && m.betUsers.length) {
                    for (var i = 0; i < m.betUsers.length; ++i)
                        $root.Game1006.BetUser.encode(m.betUsers[i], w.uint32(26).fork()).ldelim();
                }
                if (m.cashOutUsers != null && m.cashOutUsers.length) {
                    for (var i = 0; i < m.cashOutUsers.length; ++i)
                        $root.Game1006.CashOutUser.encode(m.cashOutUsers[i], w.uint32(34).fork()).ldelim();
                }
                w.uint32(40).int32(m.cutDown);
                w.uint32(48).int32(m.startTime);
                w.uint32(58).string(m.roundHash);
                w.uint32(64).int32(m.multiplier);
                if (m.history != null && m.history.length) {
                    for (var i = 0; i < m.history.length; ++i)
                        $root.Game1006.History.encode(m.history[i], w.uint32(74).fork()).ldelim();
                }
                return w;
            };

            /**
             * Decodes a Game1006Info message from the specified reader or buffer.
             * @function decode
             * @memberof Game1006.Game1006Info
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Game1006.Game1006Info} Game1006Info
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Game1006Info.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Game1006.Game1006Info();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                        case 1:
                            m.gameStatus = r.int32();
                            break;
                        case 2:
                            m.playerCount = r.int32();
                            break;
                        case 3:
                            if (!(m.betUsers && m.betUsers.length))
                                m.betUsers = [];
                            m.betUsers.push($root.Game1006.BetUser.decode(r, r.uint32()));
                            break;
                        case 4:
                            if (!(m.cashOutUsers && m.cashOutUsers.length))
                                m.cashOutUsers = [];
                            m.cashOutUsers.push($root.Game1006.CashOutUser.decode(r, r.uint32()));
                            break;
                        case 5:
                            m.cutDown = r.int32();
                            break;
                        case 6:
                            m.startTime = r.int32();
                            break;
                        case 7:
                            m.roundHash = r.string();
                            break;
                        case 8:
                            m.multiplier = r.int32();
                            break;
                        case 9:
                            if (!(m.history && m.history.length))
                                m.history = [];
                            m.history.push($root.Game1006.History.decode(r, r.uint32()));
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                if (!m.hasOwnProperty("gameStatus"))
                    throw $util.ProtocolError("missing required 'gameStatus'", { instance: m });
                if (!m.hasOwnProperty("playerCount"))
                    throw $util.ProtocolError("missing required 'playerCount'", { instance: m });
                if (!m.hasOwnProperty("cutDown"))
                    throw $util.ProtocolError("missing required 'cutDown'", { instance: m });
                if (!m.hasOwnProperty("startTime"))
                    throw $util.ProtocolError("missing required 'startTime'", { instance: m });
                if (!m.hasOwnProperty("roundHash"))
                    throw $util.ProtocolError("missing required 'roundHash'", { instance: m });
                if (!m.hasOwnProperty("multiplier"))
                    throw $util.ProtocolError("missing required 'multiplier'", { instance: m });
                return m;
            };

            return Game1006Info;
        })();

        Game1006.UserBetHistory = (function () {

            /**
             * Properties of a UserBetHistory.
             * @memberof Game1006
             * @interface IUserBetHistory
             * @property {string} userId UserBetHistory userId
             * @property {number|Long} betCoin UserBetHistory betCoin
             * @property {number} multiplier UserBetHistory multiplier
             * @property {number|Long} winCoin UserBetHistory winCoin
             * @property {number|Long} times UserBetHistory times
             */

            /**
             * Constructs a new UserBetHistory.
             * @memberof Game1006
             * @classdesc Represents a UserBetHistory.
             * @implements IUserBetHistory
             * @constructor
             * @param {Game1006.IUserBetHistory=} [p] Properties to set
             */
            function UserBetHistory(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * UserBetHistory userId.
             * @member {string} userId
             * @memberof Game1006.UserBetHistory
             * @instance
             */
            UserBetHistory.prototype.userId = "";

            /**
             * UserBetHistory betCoin.
             * @member {number|Long} betCoin
             * @memberof Game1006.UserBetHistory
             * @instance
             */
            UserBetHistory.prototype.betCoin = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

            /**
             * UserBetHistory multiplier.
             * @member {number} multiplier
             * @memberof Game1006.UserBetHistory
             * @instance
             */
            UserBetHistory.prototype.multiplier = 0;

            /**
             * UserBetHistory winCoin.
             * @member {number|Long} winCoin
             * @memberof Game1006.UserBetHistory
             * @instance
             */
            UserBetHistory.prototype.winCoin = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

            /**
             * UserBetHistory times.
             * @member {number|Long} times
             * @memberof Game1006.UserBetHistory
             * @instance
             */
            UserBetHistory.prototype.times = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

            /**
             * Creates a new UserBetHistory instance using the specified properties.
             * @function create
             * @memberof Game1006.UserBetHistory
             * @static
             * @param {Game1006.IUserBetHistory=} [properties] Properties to set
             * @returns {Game1006.UserBetHistory} UserBetHistory instance
             */
            UserBetHistory.create = function create(properties) {
                return new UserBetHistory(properties);
            };

            /**
             * Encodes the specified UserBetHistory message. Does not implicitly {@link Game1006.UserBetHistory.verify|verify} messages.
             * @function encode
             * @memberof Game1006.UserBetHistory
             * @static
             * @param {Game1006.IUserBetHistory} m UserBetHistory message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UserBetHistory.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                w.uint32(10).string(m.userId);
                w.uint32(16).int64(m.betCoin);
                w.uint32(24).int32(m.multiplier);
                w.uint32(32).int64(m.winCoin);
                w.uint32(40).int64(m.times);
                return w;
            };

            /**
             * Decodes a UserBetHistory message from the specified reader or buffer.
             * @function decode
             * @memberof Game1006.UserBetHistory
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Game1006.UserBetHistory} UserBetHistory
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UserBetHistory.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Game1006.UserBetHistory();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                        case 1:
                            m.userId = r.string();
                            break;
                        case 2:
                            m.betCoin = r.int64();
                            break;
                        case 3:
                            m.multiplier = r.int32();
                            break;
                        case 4:
                            m.winCoin = r.int64();
                            break;
                        case 5:
                            m.times = r.int64();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                if (!m.hasOwnProperty("userId"))
                    throw $util.ProtocolError("missing required 'userId'", { instance: m });
                if (!m.hasOwnProperty("betCoin"))
                    throw $util.ProtocolError("missing required 'betCoin'", { instance: m });
                if (!m.hasOwnProperty("multiplier"))
                    throw $util.ProtocolError("missing required 'multiplier'", { instance: m });
                if (!m.hasOwnProperty("winCoin"))
                    throw $util.ProtocolError("missing required 'winCoin'", { instance: m });
                if (!m.hasOwnProperty("times"))
                    throw $util.ProtocolError("missing required 'times'", { instance: m });
                return m;
            };

            return UserBetHistory;
        })();

        Game1006.BetReq = (function () {

            /**
             * Properties of a BetReq.
             * @memberof Game1006
             * @interface IBetReq
             * @property {number|Long} betCoin BetReq betCoin
             * @property {number} betIndex BetReq betIndex
             * @property {number} autoCashOutMultiplier BetReq autoCashOutMultiplier
             */

            /**
             * Constructs a new BetReq.
             * @memberof Game1006
             * @classdesc Represents a BetReq.
             * @implements IBetReq
             * @constructor
             * @param {Game1006.IBetReq=} [p] Properties to set
             */
            function BetReq(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * BetReq betCoin.
             * @member {number|Long} betCoin
             * @memberof Game1006.BetReq
             * @instance
             */
            BetReq.prototype.betCoin = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

            /**
             * BetReq betIndex.
             * @member {number} betIndex
             * @memberof Game1006.BetReq
             * @instance
             */
            BetReq.prototype.betIndex = 0;

            /**
             * BetReq autoCashOutMultiplier.
             * @member {number} autoCashOutMultiplier
             * @memberof Game1006.BetReq
             * @instance
             */
            BetReq.prototype.autoCashOutMultiplier = 0;

            /**
             * Creates a new BetReq instance using the specified properties.
             * @function create
             * @memberof Game1006.BetReq
             * @static
             * @param {Game1006.IBetReq=} [properties] Properties to set
             * @returns {Game1006.BetReq} BetReq instance
             */
            BetReq.create = function create(properties) {
                return new BetReq(properties);
            };

            /**
             * Encodes the specified BetReq message. Does not implicitly {@link Game1006.BetReq.verify|verify} messages.
             * @function encode
             * @memberof Game1006.BetReq
             * @static
             * @param {Game1006.IBetReq} m BetReq message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BetReq.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                w.uint32(8).int64(m.betCoin);
                w.uint32(16).int32(m.betIndex);
                w.uint32(24).int32(m.autoCashOutMultiplier);
                return w;
            };

            /**
             * Decodes a BetReq message from the specified reader or buffer.
             * @function decode
             * @memberof Game1006.BetReq
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Game1006.BetReq} BetReq
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BetReq.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Game1006.BetReq();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                        case 1:
                            m.betCoin = r.int64();
                            break;
                        case 2:
                            m.betIndex = r.int32();
                            break;
                        case 3:
                            m.autoCashOutMultiplier = r.int32();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                if (!m.hasOwnProperty("betCoin"))
                    throw $util.ProtocolError("missing required 'betCoin'", { instance: m });
                if (!m.hasOwnProperty("betIndex"))
                    throw $util.ProtocolError("missing required 'betIndex'", { instance: m });
                if (!m.hasOwnProperty("autoCashOutMultiplier"))
                    throw $util.ProtocolError("missing required 'autoCashOutMultiplier'", { instance: m });
                return m;
            };

            return BetReq;
        })();

        Game1006.BetResp = (function () {

            /**
             * Properties of a BetResp.
             * @memberof Game1006
             * @interface IBetResp
             * @property {Base.Code|null} [code] BetResp code
             * @property {string|null} [msg] BetResp msg
             */

            /**
             * Constructs a new BetResp.
             * @memberof Game1006
             * @classdesc Represents a BetResp.
             * @implements IBetResp
             * @constructor
             * @param {Game1006.IBetResp=} [p] Properties to set
             */
            function BetResp(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * BetResp code.
             * @member {Base.Code} code
             * @memberof Game1006.BetResp
             * @instance
             */
            BetResp.prototype.code = 0;

            /**
             * BetResp msg.
             * @member {string} msg
             * @memberof Game1006.BetResp
             * @instance
             */
            BetResp.prototype.msg = "";

            /**
             * Creates a new BetResp instance using the specified properties.
             * @function create
             * @memberof Game1006.BetResp
             * @static
             * @param {Game1006.IBetResp=} [properties] Properties to set
             * @returns {Game1006.BetResp} BetResp instance
             */
            BetResp.create = function create(properties) {
                return new BetResp(properties);
            };

            /**
             * Encodes the specified BetResp message. Does not implicitly {@link Game1006.BetResp.verify|verify} messages.
             * @function encode
             * @memberof Game1006.BetResp
             * @static
             * @param {Game1006.IBetResp} m BetResp message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BetResp.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                if (m.code != null && Object.hasOwnProperty.call(m, "code"))
                    w.uint32(8).int32(m.code);
                if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                    w.uint32(18).string(m.msg);
                return w;
            };

            /**
             * Decodes a BetResp message from the specified reader or buffer.
             * @function decode
             * @memberof Game1006.BetResp
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Game1006.BetResp} BetResp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BetResp.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Game1006.BetResp();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                        case 1:
                            m.code = r.int32();
                            break;
                        case 2:
                            m.msg = r.string();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                return m;
            };

            return BetResp;
        })();

        Game1006.CancelBetReq = (function () {

            /**
             * Properties of a CancelBetReq.
             * @memberof Game1006
             * @interface ICancelBetReq
             * @property {number} betIndex CancelBetReq betIndex
             */

            /**
             * Constructs a new CancelBetReq.
             * @memberof Game1006
             * @classdesc Represents a CancelBetReq.
             * @implements ICancelBetReq
             * @constructor
             * @param {Game1006.ICancelBetReq=} [p] Properties to set
             */
            function CancelBetReq(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * CancelBetReq betIndex.
             * @member {number} betIndex
             * @memberof Game1006.CancelBetReq
             * @instance
             */
            CancelBetReq.prototype.betIndex = 0;

            /**
             * Creates a new CancelBetReq instance using the specified properties.
             * @function create
             * @memberof Game1006.CancelBetReq
             * @static
             * @param {Game1006.ICancelBetReq=} [properties] Properties to set
             * @returns {Game1006.CancelBetReq} CancelBetReq instance
             */
            CancelBetReq.create = function create(properties) {
                return new CancelBetReq(properties);
            };

            /**
             * Encodes the specified CancelBetReq message. Does not implicitly {@link Game1006.CancelBetReq.verify|verify} messages.
             * @function encode
             * @memberof Game1006.CancelBetReq
             * @static
             * @param {Game1006.ICancelBetReq} m CancelBetReq message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CancelBetReq.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                w.uint32(8).int32(m.betIndex);
                return w;
            };

            /**
             * Decodes a CancelBetReq message from the specified reader or buffer.
             * @function decode
             * @memberof Game1006.CancelBetReq
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Game1006.CancelBetReq} CancelBetReq
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CancelBetReq.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Game1006.CancelBetReq();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                        case 1:
                            m.betIndex = r.int32();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                if (!m.hasOwnProperty("betIndex"))
                    throw $util.ProtocolError("missing required 'betIndex'", { instance: m });
                return m;
            };

            return CancelBetReq;
        })();

        Game1006.CancelBetResp = (function () {

            /**
             * Properties of a CancelBetResp.
             * @memberof Game1006
             * @interface ICancelBetResp
             * @property {Base.Code|null} [code] CancelBetResp code
             * @property {string|null} [msg] CancelBetResp msg
             */

            /**
             * Constructs a new CancelBetResp.
             * @memberof Game1006
             * @classdesc Represents a CancelBetResp.
             * @implements ICancelBetResp
             * @constructor
             * @param {Game1006.ICancelBetResp=} [p] Properties to set
             */
            function CancelBetResp(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * CancelBetResp code.
             * @member {Base.Code} code
             * @memberof Game1006.CancelBetResp
             * @instance
             */
            CancelBetResp.prototype.code = 0;

            /**
             * CancelBetResp msg.
             * @member {string} msg
             * @memberof Game1006.CancelBetResp
             * @instance
             */
            CancelBetResp.prototype.msg = "";

            /**
             * Creates a new CancelBetResp instance using the specified properties.
             * @function create
             * @memberof Game1006.CancelBetResp
             * @static
             * @param {Game1006.ICancelBetResp=} [properties] Properties to set
             * @returns {Game1006.CancelBetResp} CancelBetResp instance
             */
            CancelBetResp.create = function create(properties) {
                return new CancelBetResp(properties);
            };

            /**
             * Encodes the specified CancelBetResp message. Does not implicitly {@link Game1006.CancelBetResp.verify|verify} messages.
             * @function encode
             * @memberof Game1006.CancelBetResp
             * @static
             * @param {Game1006.ICancelBetResp} m CancelBetResp message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CancelBetResp.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                if (m.code != null && Object.hasOwnProperty.call(m, "code"))
                    w.uint32(8).int32(m.code);
                if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                    w.uint32(18).string(m.msg);
                return w;
            };

            /**
             * Decodes a CancelBetResp message from the specified reader or buffer.
             * @function decode
             * @memberof Game1006.CancelBetResp
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Game1006.CancelBetResp} CancelBetResp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CancelBetResp.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Game1006.CancelBetResp();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                        case 1:
                            m.code = r.int32();
                            break;
                        case 2:
                            m.msg = r.string();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                return m;
            };

            return CancelBetResp;
        })();

        Game1006.CashOutReq = (function () {

            /**
             * Properties of a CashOutReq.
             * @memberof Game1006
             * @interface ICashOutReq
             * @property {number} betIndex CashOutReq betIndex
             */

            /**
             * Constructs a new CashOutReq.
             * @memberof Game1006
             * @classdesc Represents a CashOutReq.
             * @implements ICashOutReq
             * @constructor
             * @param {Game1006.ICashOutReq=} [p] Properties to set
             */
            function CashOutReq(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * CashOutReq betIndex.
             * @member {number} betIndex
             * @memberof Game1006.CashOutReq
             * @instance
             */
            CashOutReq.prototype.betIndex = 0;

            /**
             * Creates a new CashOutReq instance using the specified properties.
             * @function create
             * @memberof Game1006.CashOutReq
             * @static
             * @param {Game1006.ICashOutReq=} [properties] Properties to set
             * @returns {Game1006.CashOutReq} CashOutReq instance
             */
            CashOutReq.create = function create(properties) {
                return new CashOutReq(properties);
            };

            /**
             * Encodes the specified CashOutReq message. Does not implicitly {@link Game1006.CashOutReq.verify|verify} messages.
             * @function encode
             * @memberof Game1006.CashOutReq
             * @static
             * @param {Game1006.ICashOutReq} m CashOutReq message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CashOutReq.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                w.uint32(8).int32(m.betIndex);
                return w;
            };

            /**
             * Decodes a CashOutReq message from the specified reader or buffer.
             * @function decode
             * @memberof Game1006.CashOutReq
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Game1006.CashOutReq} CashOutReq
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CashOutReq.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Game1006.CashOutReq();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                        case 1:
                            m.betIndex = r.int32();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                if (!m.hasOwnProperty("betIndex"))
                    throw $util.ProtocolError("missing required 'betIndex'", { instance: m });
                return m;
            };

            return CashOutReq;
        })();

        Game1006.CashOutResp = (function () {

            /**
             * Properties of a CashOutResp.
             * @memberof Game1006
             * @interface ICashOutResp
             * @property {Base.Code|null} [code] CashOutResp code
             * @property {string|null} [msg] CashOutResp msg
             * @property {number} betIndex CashOutResp betIndex
             * @property {Array.<number>|null} [multiplier] CashOutResp multiplier
             * @property {number|Long} winCoin CashOutResp winCoin
             */

            /**
             * Constructs a new CashOutResp.
             * @memberof Game1006
             * @classdesc Represents a CashOutResp.
             * @implements ICashOutResp
             * @constructor
             * @param {Game1006.ICashOutResp=} [p] Properties to set
             */
            function CashOutResp(p) {
                this.multiplier = [];
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * CashOutResp code.
             * @member {Base.Code} code
             * @memberof Game1006.CashOutResp
             * @instance
             */
            CashOutResp.prototype.code = 0;

            /**
             * CashOutResp msg.
             * @member {string} msg
             * @memberof Game1006.CashOutResp
             * @instance
             */
            CashOutResp.prototype.msg = "";

            /**
             * CashOutResp betIndex.
             * @member {number} betIndex
             * @memberof Game1006.CashOutResp
             * @instance
             */
            CashOutResp.prototype.betIndex = 0;

            /**
             * CashOutResp multiplier.
             * @member {Array.<number>} multiplier
             * @memberof Game1006.CashOutResp
             * @instance
             */
            CashOutResp.prototype.multiplier = $util.emptyArray;

            /**
             * CashOutResp winCoin.
             * @member {number|Long} winCoin
             * @memberof Game1006.CashOutResp
             * @instance
             */
            CashOutResp.prototype.winCoin = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

            /**
             * Creates a new CashOutResp instance using the specified properties.
             * @function create
             * @memberof Game1006.CashOutResp
             * @static
             * @param {Game1006.ICashOutResp=} [properties] Properties to set
             * @returns {Game1006.CashOutResp} CashOutResp instance
             */
            CashOutResp.create = function create(properties) {
                return new CashOutResp(properties);
            };

            /**
             * Encodes the specified CashOutResp message. Does not implicitly {@link Game1006.CashOutResp.verify|verify} messages.
             * @function encode
             * @memberof Game1006.CashOutResp
             * @static
             * @param {Game1006.ICashOutResp} m CashOutResp message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CashOutResp.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                if (m.code != null && Object.hasOwnProperty.call(m, "code"))
                    w.uint32(8).int32(m.code);
                if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                    w.uint32(18).string(m.msg);
                w.uint32(24).int32(m.betIndex);
                if (m.multiplier != null && m.multiplier.length) {
                    for (var i = 0; i < m.multiplier.length; ++i)
                        w.uint32(32).int32(m.multiplier[i]);
                }
                w.uint32(40).int64(m.winCoin);
                return w;
            };

            /**
             * Decodes a CashOutResp message from the specified reader or buffer.
             * @function decode
             * @memberof Game1006.CashOutResp
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Game1006.CashOutResp} CashOutResp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CashOutResp.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Game1006.CashOutResp();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                        case 1:
                            m.code = r.int32();
                            break;
                        case 2:
                            m.msg = r.string();
                            break;
                        case 3:
                            m.betIndex = r.int32();
                            break;
                        case 4:
                            if (!(m.multiplier && m.multiplier.length))
                                m.multiplier = [];
                            if ((t & 7) === 2) {
                                var c2 = r.uint32() + r.pos;
                                while (r.pos < c2)
                                    m.multiplier.push(r.int32());
                            } else
                                m.multiplier.push(r.int32());
                            break;
                        case 5:
                            m.winCoin = r.int64();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                if (!m.hasOwnProperty("betIndex"))
                    throw $util.ProtocolError("missing required 'betIndex'", { instance: m });
                if (!m.hasOwnProperty("winCoin"))
                    throw $util.ProtocolError("missing required 'winCoin'", { instance: m });
                return m;
            };

            return CashOutResp;
        })();

        Game1006.GetBetHistoryReq = (function () {

            /**
             * Properties of a GetBetHistoryReq.
             * @memberof Game1006
             * @interface IGetBetHistoryReq
             * @property {string} userId GetBetHistoryReq userId
             */

            /**
             * Constructs a new GetBetHistoryReq.
             * @memberof Game1006
             * @classdesc Represents a GetBetHistoryReq.
             * @implements IGetBetHistoryReq
             * @constructor
             * @param {Game1006.IGetBetHistoryReq=} [p] Properties to set
             */
            function GetBetHistoryReq(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * GetBetHistoryReq userId.
             * @member {string} userId
             * @memberof Game1006.GetBetHistoryReq
             * @instance
             */
            GetBetHistoryReq.prototype.userId = "";

            /**
             * Creates a new GetBetHistoryReq instance using the specified properties.
             * @function create
             * @memberof Game1006.GetBetHistoryReq
             * @static
             * @param {Game1006.IGetBetHistoryReq=} [properties] Properties to set
             * @returns {Game1006.GetBetHistoryReq} GetBetHistoryReq instance
             */
            GetBetHistoryReq.create = function create(properties) {
                return new GetBetHistoryReq(properties);
            };

            /**
             * Encodes the specified GetBetHistoryReq message. Does not implicitly {@link Game1006.GetBetHistoryReq.verify|verify} messages.
             * @function encode
             * @memberof Game1006.GetBetHistoryReq
             * @static
             * @param {Game1006.IGetBetHistoryReq} m GetBetHistoryReq message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetBetHistoryReq.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                w.uint32(10).string(m.userId);
                return w;
            };

            /**
             * Decodes a GetBetHistoryReq message from the specified reader or buffer.
             * @function decode
             * @memberof Game1006.GetBetHistoryReq
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Game1006.GetBetHistoryReq} GetBetHistoryReq
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetBetHistoryReq.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Game1006.GetBetHistoryReq();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                        case 1:
                            m.userId = r.string();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                if (!m.hasOwnProperty("userId"))
                    throw $util.ProtocolError("missing required 'userId'", { instance: m });
                return m;
            };

            return GetBetHistoryReq;
        })();

        Game1006.GetBetHistoryResp = (function () {

            /**
             * Properties of a GetBetHistoryResp.
             * @memberof Game1006
             * @interface IGetBetHistoryResp
             * @property {Base.Code|null} [code] GetBetHistoryResp code
             * @property {string|null} [msg] GetBetHistoryResp msg
             * @property {Array.<Game1006.IUserBetHistory>|null} [userBetHistory] GetBetHistoryResp userBetHistory
             */

            /**
             * Constructs a new GetBetHistoryResp.
             * @memberof Game1006
             * @classdesc Represents a GetBetHistoryResp.
             * @implements IGetBetHistoryResp
             * @constructor
             * @param {Game1006.IGetBetHistoryResp=} [p] Properties to set
             */
            function GetBetHistoryResp(p) {
                this.userBetHistory = [];
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * GetBetHistoryResp code.
             * @member {Base.Code} code
             * @memberof Game1006.GetBetHistoryResp
             * @instance
             */
            GetBetHistoryResp.prototype.code = 0;

            /**
             * GetBetHistoryResp msg.
             * @member {string} msg
             * @memberof Game1006.GetBetHistoryResp
             * @instance
             */
            GetBetHistoryResp.prototype.msg = "";

            /**
             * GetBetHistoryResp userBetHistory.
             * @member {Array.<Game1006.IUserBetHistory>} userBetHistory
             * @memberof Game1006.GetBetHistoryResp
             * @instance
             */
            GetBetHistoryResp.prototype.userBetHistory = $util.emptyArray;

            /**
             * Creates a new GetBetHistoryResp instance using the specified properties.
             * @function create
             * @memberof Game1006.GetBetHistoryResp
             * @static
             * @param {Game1006.IGetBetHistoryResp=} [properties] Properties to set
             * @returns {Game1006.GetBetHistoryResp} GetBetHistoryResp instance
             */
            GetBetHistoryResp.create = function create(properties) {
                return new GetBetHistoryResp(properties);
            };

            /**
             * Encodes the specified GetBetHistoryResp message. Does not implicitly {@link Game1006.GetBetHistoryResp.verify|verify} messages.
             * @function encode
             * @memberof Game1006.GetBetHistoryResp
             * @static
             * @param {Game1006.IGetBetHistoryResp} m GetBetHistoryResp message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetBetHistoryResp.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                if (m.code != null && Object.hasOwnProperty.call(m, "code"))
                    w.uint32(8).int32(m.code);
                if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                    w.uint32(18).string(m.msg);
                if (m.userBetHistory != null && m.userBetHistory.length) {
                    for (var i = 0; i < m.userBetHistory.length; ++i)
                        $root.Game1006.UserBetHistory.encode(m.userBetHistory[i], w.uint32(26).fork()).ldelim();
                }
                return w;
            };

            /**
             * Decodes a GetBetHistoryResp message from the specified reader or buffer.
             * @function decode
             * @memberof Game1006.GetBetHistoryResp
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Game1006.GetBetHistoryResp} GetBetHistoryResp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetBetHistoryResp.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Game1006.GetBetHistoryResp();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                        case 1:
                            m.code = r.int32();
                            break;
                        case 2:
                            m.msg = r.string();
                            break;
                        case 3:
                            if (!(m.userBetHistory && m.userBetHistory.length))
                                m.userBetHistory = [];
                            m.userBetHistory.push($root.Game1006.UserBetHistory.decode(r, r.uint32()));
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                return m;
            };

            return GetBetHistoryResp;
        })();

        Game1006.BetUser = (function () {

            /**
             * Properties of a BetUser.
             * @memberof Game1006
             * @interface IBetUser
             * @property {string} userId BetUser userId
             * @property {number} betIndex BetUser betIndex
             * @property {number|Long} betCoin BetUser betCoin
             */

            /**
             * Constructs a new BetUser.
             * @memberof Game1006
             * @classdesc Represents a BetUser.
             * @implements IBetUser
             * @constructor
             * @param {Game1006.IBetUser=} [p] Properties to set
             */
            function BetUser(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * BetUser userId.
             * @member {string} userId
             * @memberof Game1006.BetUser
             * @instance
             */
            BetUser.prototype.userId = "";

            /**
             * BetUser betIndex.
             * @member {number} betIndex
             * @memberof Game1006.BetUser
             * @instance
             */
            BetUser.prototype.betIndex = 0;

            /**
             * BetUser betCoin.
             * @member {number|Long} betCoin
             * @memberof Game1006.BetUser
             * @instance
             */
            BetUser.prototype.betCoin = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

            /**
             * Creates a new BetUser instance using the specified properties.
             * @function create
             * @memberof Game1006.BetUser
             * @static
             * @param {Game1006.IBetUser=} [properties] Properties to set
             * @returns {Game1006.BetUser} BetUser instance
             */
            BetUser.create = function create(properties) {
                return new BetUser(properties);
            };

            /**
             * Encodes the specified BetUser message. Does not implicitly {@link Game1006.BetUser.verify|verify} messages.
             * @function encode
             * @memberof Game1006.BetUser
             * @static
             * @param {Game1006.IBetUser} m BetUser message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BetUser.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                w.uint32(10).string(m.userId);
                w.uint32(16).int32(m.betIndex);
                w.uint32(24).int64(m.betCoin);
                return w;
            };

            /**
             * Decodes a BetUser message from the specified reader or buffer.
             * @function decode
             * @memberof Game1006.BetUser
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Game1006.BetUser} BetUser
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BetUser.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Game1006.BetUser();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                        case 1:
                            m.userId = r.string();
                            break;
                        case 2:
                            m.betIndex = r.int32();
                            break;
                        case 3:
                            m.betCoin = r.int64();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                if (!m.hasOwnProperty("userId"))
                    throw $util.ProtocolError("missing required 'userId'", { instance: m });
                if (!m.hasOwnProperty("betIndex"))
                    throw $util.ProtocolError("missing required 'betIndex'", { instance: m });
                if (!m.hasOwnProperty("betCoin"))
                    throw $util.ProtocolError("missing required 'betCoin'", { instance: m });
                return m;
            };

            return BetUser;
        })();

        Game1006.CancelBetUser = (function () {

            /**
             * Properties of a CancelBetUser.
             * @memberof Game1006
             * @interface ICancelBetUser
             * @property {string} userId CancelBetUser userId
             * @property {number} betIndex CancelBetUser betIndex
             */

            /**
             * Constructs a new CancelBetUser.
             * @memberof Game1006
             * @classdesc Represents a CancelBetUser.
             * @implements ICancelBetUser
             * @constructor
             * @param {Game1006.ICancelBetUser=} [p] Properties to set
             */
            function CancelBetUser(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * CancelBetUser userId.
             * @member {string} userId
             * @memberof Game1006.CancelBetUser
             * @instance
             */
            CancelBetUser.prototype.userId = "";

            /**
             * CancelBetUser betIndex.
             * @member {number} betIndex
             * @memberof Game1006.CancelBetUser
             * @instance
             */
            CancelBetUser.prototype.betIndex = 0;

            /**
             * Creates a new CancelBetUser instance using the specified properties.
             * @function create
             * @memberof Game1006.CancelBetUser
             * @static
             * @param {Game1006.ICancelBetUser=} [properties] Properties to set
             * @returns {Game1006.CancelBetUser} CancelBetUser instance
             */
            CancelBetUser.create = function create(properties) {
                return new CancelBetUser(properties);
            };

            /**
             * Encodes the specified CancelBetUser message. Does not implicitly {@link Game1006.CancelBetUser.verify|verify} messages.
             * @function encode
             * @memberof Game1006.CancelBetUser
             * @static
             * @param {Game1006.ICancelBetUser} m CancelBetUser message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CancelBetUser.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                w.uint32(10).string(m.userId);
                w.uint32(16).int32(m.betIndex);
                return w;
            };

            /**
             * Decodes a CancelBetUser message from the specified reader or buffer.
             * @function decode
             * @memberof Game1006.CancelBetUser
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Game1006.CancelBetUser} CancelBetUser
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CancelBetUser.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Game1006.CancelBetUser();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                        case 1:
                            m.userId = r.string();
                            break;
                        case 2:
                            m.betIndex = r.int32();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                if (!m.hasOwnProperty("userId"))
                    throw $util.ProtocolError("missing required 'userId'", { instance: m });
                if (!m.hasOwnProperty("betIndex"))
                    throw $util.ProtocolError("missing required 'betIndex'", { instance: m });
                return m;
            };

            return CancelBetUser;
        })();

        Game1006.CashOutUser = (function () {

            /**
             * Properties of a CashOutUser.
             * @memberof Game1006
             * @interface ICashOutUser
             * @property {string} userId CashOutUser userId
             * @property {number} betIndex CashOutUser betIndex
             * @property {number|null} [multiplier] CashOutUser multiplier
             * @property {number|Long|null} [winCoin] CashOutUser winCoin
             */

            /**
             * Constructs a new CashOutUser.
             * @memberof Game1006
             * @classdesc Represents a CashOutUser.
             * @implements ICashOutUser
             * @constructor
             * @param {Game1006.ICashOutUser=} [p] Properties to set
             */
            function CashOutUser(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * CashOutUser userId.
             * @member {string} userId
             * @memberof Game1006.CashOutUser
             * @instance
             */
            CashOutUser.prototype.userId = "";

            /**
             * CashOutUser betIndex.
             * @member {number} betIndex
             * @memberof Game1006.CashOutUser
             * @instance
             */
            CashOutUser.prototype.betIndex = 0;

            /**
             * CashOutUser multiplier.
             * @member {number} multiplier
             * @memberof Game1006.CashOutUser
             * @instance
             */
            CashOutUser.prototype.multiplier = 0;

            /**
             * CashOutUser winCoin.
             * @member {number|Long} winCoin
             * @memberof Game1006.CashOutUser
             * @instance
             */
            CashOutUser.prototype.winCoin = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

            /**
             * Creates a new CashOutUser instance using the specified properties.
             * @function create
             * @memberof Game1006.CashOutUser
             * @static
             * @param {Game1006.ICashOutUser=} [properties] Properties to set
             * @returns {Game1006.CashOutUser} CashOutUser instance
             */
            CashOutUser.create = function create(properties) {
                return new CashOutUser(properties);
            };

            /**
             * Encodes the specified CashOutUser message. Does not implicitly {@link Game1006.CashOutUser.verify|verify} messages.
             * @function encode
             * @memberof Game1006.CashOutUser
             * @static
             * @param {Game1006.ICashOutUser} m CashOutUser message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CashOutUser.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                w.uint32(10).string(m.userId);
                w.uint32(16).int32(m.betIndex);
                if (m.multiplier != null && Object.hasOwnProperty.call(m, "multiplier"))
                    w.uint32(24).int32(m.multiplier);
                if (m.winCoin != null && Object.hasOwnProperty.call(m, "winCoin"))
                    w.uint32(32).int64(m.winCoin);
                return w;
            };

            /**
             * Decodes a CashOutUser message from the specified reader or buffer.
             * @function decode
             * @memberof Game1006.CashOutUser
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Game1006.CashOutUser} CashOutUser
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CashOutUser.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Game1006.CashOutUser();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                        case 1:
                            m.userId = r.string();
                            break;
                        case 2:
                            m.betIndex = r.int32();
                            break;
                        case 3:
                            m.multiplier = r.int32();
                            break;
                        case 4:
                            m.winCoin = r.int64();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                if (!m.hasOwnProperty("userId"))
                    throw $util.ProtocolError("missing required 'userId'", { instance: m });
                if (!m.hasOwnProperty("betIndex"))
                    throw $util.ProtocolError("missing required 'betIndex'", { instance: m });
                return m;
            };

            return CashOutUser;
        })();

        Game1006.NotifyBet = (function () {

            /**
             * Properties of a NotifyBet.
             * @memberof Game1006
             * @interface INotifyBet
             * @property {Array.<Game1006.IBetUser>|null} [betUsers] NotifyBet betUsers
             */

            /**
             * Constructs a new NotifyBet.
             * @memberof Game1006
             * @classdesc Represents a NotifyBet.
             * @implements INotifyBet
             * @constructor
             * @param {Game1006.INotifyBet=} [p] Properties to set
             */
            function NotifyBet(p) {
                this.betUsers = [];
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * NotifyBet betUsers.
             * @member {Array.<Game1006.IBetUser>} betUsers
             * @memberof Game1006.NotifyBet
             * @instance
             */
            NotifyBet.prototype.betUsers = $util.emptyArray;

            /**
             * Creates a new NotifyBet instance using the specified properties.
             * @function create
             * @memberof Game1006.NotifyBet
             * @static
             * @param {Game1006.INotifyBet=} [properties] Properties to set
             * @returns {Game1006.NotifyBet} NotifyBet instance
             */
            NotifyBet.create = function create(properties) {
                return new NotifyBet(properties);
            };

            /**
             * Encodes the specified NotifyBet message. Does not implicitly {@link Game1006.NotifyBet.verify|verify} messages.
             * @function encode
             * @memberof Game1006.NotifyBet
             * @static
             * @param {Game1006.INotifyBet} m NotifyBet message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NotifyBet.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                if (m.betUsers != null && m.betUsers.length) {
                    for (var i = 0; i < m.betUsers.length; ++i)
                        $root.Game1006.BetUser.encode(m.betUsers[i], w.uint32(10).fork()).ldelim();
                }
                return w;
            };

            /**
             * Decodes a NotifyBet message from the specified reader or buffer.
             * @function decode
             * @memberof Game1006.NotifyBet
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Game1006.NotifyBet} NotifyBet
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NotifyBet.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Game1006.NotifyBet();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                        case 1:
                            if (!(m.betUsers && m.betUsers.length))
                                m.betUsers = [];
                            m.betUsers.push($root.Game1006.BetUser.decode(r, r.uint32()));
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                return m;
            };

            return NotifyBet;
        })();

        Game1006.NotifyCancelBet = (function () {

            /**
             * Properties of a NotifyCancelBet.
             * @memberof Game1006
             * @interface INotifyCancelBet
             * @property {Array.<Game1006.ICancelBetUser>|null} [cancelUsers] NotifyCancelBet cancelUsers
             */

            /**
             * Constructs a new NotifyCancelBet.
             * @memberof Game1006
             * @classdesc Represents a NotifyCancelBet.
             * @implements INotifyCancelBet
             * @constructor
             * @param {Game1006.INotifyCancelBet=} [p] Properties to set
             */
            function NotifyCancelBet(p) {
                this.cancelUsers = [];
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * NotifyCancelBet cancelUsers.
             * @member {Array.<Game1006.ICancelBetUser>} cancelUsers
             * @memberof Game1006.NotifyCancelBet
             * @instance
             */
            NotifyCancelBet.prototype.cancelUsers = $util.emptyArray;

            /**
             * Creates a new NotifyCancelBet instance using the specified properties.
             * @function create
             * @memberof Game1006.NotifyCancelBet
             * @static
             * @param {Game1006.INotifyCancelBet=} [properties] Properties to set
             * @returns {Game1006.NotifyCancelBet} NotifyCancelBet instance
             */
            NotifyCancelBet.create = function create(properties) {
                return new NotifyCancelBet(properties);
            };

            /**
             * Encodes the specified NotifyCancelBet message. Does not implicitly {@link Game1006.NotifyCancelBet.verify|verify} messages.
             * @function encode
             * @memberof Game1006.NotifyCancelBet
             * @static
             * @param {Game1006.INotifyCancelBet} m NotifyCancelBet message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NotifyCancelBet.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                if (m.cancelUsers != null && m.cancelUsers.length) {
                    for (var i = 0; i < m.cancelUsers.length; ++i)
                        $root.Game1006.CancelBetUser.encode(m.cancelUsers[i], w.uint32(10).fork()).ldelim();
                }
                return w;
            };

            /**
             * Decodes a NotifyCancelBet message from the specified reader or buffer.
             * @function decode
             * @memberof Game1006.NotifyCancelBet
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Game1006.NotifyCancelBet} NotifyCancelBet
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NotifyCancelBet.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Game1006.NotifyCancelBet();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                        case 1:
                            if (!(m.cancelUsers && m.cancelUsers.length))
                                m.cancelUsers = [];
                            m.cancelUsers.push($root.Game1006.CancelBetUser.decode(r, r.uint32()));
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                return m;
            };

            return NotifyCancelBet;
        })();

        Game1006.NotifyPrepare = (function () {

            /**
             * Properties of a NotifyPrepare.
             * @memberof Game1006
             * @interface INotifyPrepare
             * @property {number|null} [prepare] NotifyPrepare prepare
             */

            /**
             * Constructs a new NotifyPrepare.
             * @memberof Game1006
             * @classdesc Represents a NotifyPrepare.
             * @implements INotifyPrepare
             * @constructor
             * @param {Game1006.INotifyPrepare=} [p] Properties to set
             */
            function NotifyPrepare(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * NotifyPrepare prepare.
             * @member {number} prepare
             * @memberof Game1006.NotifyPrepare
             * @instance
             */
            NotifyPrepare.prototype.prepare = 0;

            /**
             * Creates a new NotifyPrepare instance using the specified properties.
             * @function create
             * @memberof Game1006.NotifyPrepare
             * @static
             * @param {Game1006.INotifyPrepare=} [properties] Properties to set
             * @returns {Game1006.NotifyPrepare} NotifyPrepare instance
             */
            NotifyPrepare.create = function create(properties) {
                return new NotifyPrepare(properties);
            };

            /**
             * Encodes the specified NotifyPrepare message. Does not implicitly {@link Game1006.NotifyPrepare.verify|verify} messages.
             * @function encode
             * @memberof Game1006.NotifyPrepare
             * @static
             * @param {Game1006.INotifyPrepare} m NotifyPrepare message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NotifyPrepare.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                if (m.prepare != null && Object.hasOwnProperty.call(m, "prepare"))
                    w.uint32(8).int32(m.prepare);
                return w;
            };

            /**
             * Decodes a NotifyPrepare message from the specified reader or buffer.
             * @function decode
             * @memberof Game1006.NotifyPrepare
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Game1006.NotifyPrepare} NotifyPrepare
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NotifyPrepare.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Game1006.NotifyPrepare();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                        case 1:
                            m.prepare = r.int32();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                return m;
            };

            return NotifyPrepare;
        })();

        Game1006.NotifyCutDown = (function () {

            /**
             * Properties of a NotifyCutDown.
             * @memberof Game1006
             * @interface INotifyCutDown
             * @property {number} cutDown NotifyCutDown cutDown
             * @property {number} startTime NotifyCutDown startTime
             */

            /**
             * Constructs a new NotifyCutDown.
             * @memberof Game1006
             * @classdesc Represents a NotifyCutDown.
             * @implements INotifyCutDown
             * @constructor
             * @param {Game1006.INotifyCutDown=} [p] Properties to set
             */
            function NotifyCutDown(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * NotifyCutDown cutDown.
             * @member {number} cutDown
             * @memberof Game1006.NotifyCutDown
             * @instance
             */
            NotifyCutDown.prototype.cutDown = 0;

            /**
             * NotifyCutDown startTime.
             * @member {number} startTime
             * @memberof Game1006.NotifyCutDown
             * @instance
             */
            NotifyCutDown.prototype.startTime = 0;

            /**
             * Creates a new NotifyCutDown instance using the specified properties.
             * @function create
             * @memberof Game1006.NotifyCutDown
             * @static
             * @param {Game1006.INotifyCutDown=} [properties] Properties to set
             * @returns {Game1006.NotifyCutDown} NotifyCutDown instance
             */
            NotifyCutDown.create = function create(properties) {
                return new NotifyCutDown(properties);
            };

            /**
             * Encodes the specified NotifyCutDown message. Does not implicitly {@link Game1006.NotifyCutDown.verify|verify} messages.
             * @function encode
             * @memberof Game1006.NotifyCutDown
             * @static
             * @param {Game1006.INotifyCutDown} m NotifyCutDown message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NotifyCutDown.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                w.uint32(8).int32(m.cutDown);
                w.uint32(16).int32(m.startTime);
                return w;
            };

            /**
             * Decodes a NotifyCutDown message from the specified reader or buffer.
             * @function decode
             * @memberof Game1006.NotifyCutDown
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Game1006.NotifyCutDown} NotifyCutDown
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NotifyCutDown.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Game1006.NotifyCutDown();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                        case 1:
                            m.cutDown = r.int32();
                            break;
                        case 2:
                            m.startTime = r.int32();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                if (!m.hasOwnProperty("cutDown"))
                    throw $util.ProtocolError("missing required 'cutDown'", { instance: m });
                if (!m.hasOwnProperty("startTime"))
                    throw $util.ProtocolError("missing required 'startTime'", { instance: m });
                return m;
            };

            return NotifyCutDown;
        })();

        Game1006.NotifyStart = (function () {

            /**
             * Properties of a NotifyStart.
             * @memberof Game1006
             * @interface INotifyStart
             * @property {string} roundHash NotifyStart roundHash
             */

            /**
             * Constructs a new NotifyStart.
             * @memberof Game1006
             * @classdesc Represents a NotifyStart.
             * @implements INotifyStart
             * @constructor
             * @param {Game1006.INotifyStart=} [p] Properties to set
             */
            function NotifyStart(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * NotifyStart roundHash.
             * @member {string} roundHash
             * @memberof Game1006.NotifyStart
             * @instance
             */
            NotifyStart.prototype.roundHash = "";

            /**
             * Creates a new NotifyStart instance using the specified properties.
             * @function create
             * @memberof Game1006.NotifyStart
             * @static
             * @param {Game1006.INotifyStart=} [properties] Properties to set
             * @returns {Game1006.NotifyStart} NotifyStart instance
             */
            NotifyStart.create = function create(properties) {
                return new NotifyStart(properties);
            };

            /**
             * Encodes the specified NotifyStart message. Does not implicitly {@link Game1006.NotifyStart.verify|verify} messages.
             * @function encode
             * @memberof Game1006.NotifyStart
             * @static
             * @param {Game1006.INotifyStart} m NotifyStart message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NotifyStart.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                w.uint32(10).string(m.roundHash);
                return w;
            };

            /**
             * Decodes a NotifyStart message from the specified reader or buffer.
             * @function decode
             * @memberof Game1006.NotifyStart
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Game1006.NotifyStart} NotifyStart
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NotifyStart.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Game1006.NotifyStart();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                        case 1:
                            m.roundHash = r.string();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                if (!m.hasOwnProperty("roundHash"))
                    throw $util.ProtocolError("missing required 'roundHash'", { instance: m });
                return m;
            };

            return NotifyStart;
        })();

        Game1006.NotifyFlyInfo = (function () {

            /**
             * Properties of a NotifyFlyInfo.
             * @memberof Game1006
             * @interface INotifyFlyInfo
             * @property {number} multiplier NotifyFlyInfo multiplier
             * @property {Array.<Game1006.ICashOutUser>|null} [cashOutUsers] NotifyFlyInfo cashOutUsers
             * @property {boolean|null} [isExplode] NotifyFlyInfo isExplode
             */

            /**
             * Constructs a new NotifyFlyInfo.
             * @memberof Game1006
             * @classdesc Represents a NotifyFlyInfo.
             * @implements INotifyFlyInfo
             * @constructor
             * @param {Game1006.INotifyFlyInfo=} [p] Properties to set
             */
            function NotifyFlyInfo(p) {
                this.cashOutUsers = [];
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * NotifyFlyInfo multiplier.
             * @member {number} multiplier
             * @memberof Game1006.NotifyFlyInfo
             * @instance
             */
            NotifyFlyInfo.prototype.multiplier = 0;

            /**
             * NotifyFlyInfo cashOutUsers.
             * @member {Array.<Game1006.ICashOutUser>} cashOutUsers
             * @memberof Game1006.NotifyFlyInfo
             * @instance
             */
            NotifyFlyInfo.prototype.cashOutUsers = $util.emptyArray;

            /**
             * NotifyFlyInfo isExplode.
             * @member {boolean} isExplode
             * @memberof Game1006.NotifyFlyInfo
             * @instance
             */
            NotifyFlyInfo.prototype.isExplode = false;

            /**
             * Creates a new NotifyFlyInfo instance using the specified properties.
             * @function create
             * @memberof Game1006.NotifyFlyInfo
             * @static
             * @param {Game1006.INotifyFlyInfo=} [properties] Properties to set
             * @returns {Game1006.NotifyFlyInfo} NotifyFlyInfo instance
             */
            NotifyFlyInfo.create = function create(properties) {
                return new NotifyFlyInfo(properties);
            };

            /**
             * Encodes the specified NotifyFlyInfo message. Does not implicitly {@link Game1006.NotifyFlyInfo.verify|verify} messages.
             * @function encode
             * @memberof Game1006.NotifyFlyInfo
             * @static
             * @param {Game1006.INotifyFlyInfo} m NotifyFlyInfo message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NotifyFlyInfo.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                w.uint32(8).int32(m.multiplier);
                if (m.cashOutUsers != null && m.cashOutUsers.length) {
                    for (var i = 0; i < m.cashOutUsers.length; ++i)
                        $root.Game1006.CashOutUser.encode(m.cashOutUsers[i], w.uint32(18).fork()).ldelim();
                }
                if (m.isExplode != null && Object.hasOwnProperty.call(m, "isExplode"))
                    w.uint32(24).bool(m.isExplode);
                return w;
            };

            /**
             * Decodes a NotifyFlyInfo message from the specified reader or buffer.
             * @function decode
             * @memberof Game1006.NotifyFlyInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Game1006.NotifyFlyInfo} NotifyFlyInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NotifyFlyInfo.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Game1006.NotifyFlyInfo();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                        case 1:
                            m.multiplier = r.int32();
                            break;
                        case 2:
                            if (!(m.cashOutUsers && m.cashOutUsers.length))
                                m.cashOutUsers = [];
                            m.cashOutUsers.push($root.Game1006.CashOutUser.decode(r, r.uint32()));
                            break;
                        case 3:
                            m.isExplode = r.bool();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                if (!m.hasOwnProperty("multiplier"))
                    throw $util.ProtocolError("missing required 'multiplier'", { instance: m });
                return m;
            };

            return NotifyFlyInfo;
        })();

        return Game1006;
    })();

    return $root;
})(protobuf).Game1006;
module.exports = {
    Game1006: global.Game1006
}