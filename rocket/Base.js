var $protobuf = require("./protobuf");

(global).Base = (function ($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

    // Exported root namespace
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

    $root.Base = (function () {

        /**
         * Namespace Base.
         * @exports Base
         * @namespace
         */
        var Base = $root.Base || {};

        /**
         * Cmd enum.
         * @name Base.Cmd
         * @enum {string}
         * @property {number} Heart=10001 Heart value
         * @property {number} LoginReq=10002 LoginReq value
         * @property {number} LoginResp=10003 LoginResp value
         * @property {number} EnterGameReq=10004 EnterGameReq value
         * @property {number} EnterGameResp=10005 EnterGameResp value
         */
        Base.Cmd = (function () {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[10001] = "Heart"] = 10001;
            values[valuesById[10002] = "LoginReq"] = 10002;
            values[valuesById[10003] = "LoginResp"] = 10003;
            values[valuesById[10004] = "EnterGameReq"] = 10004;
            values[valuesById[10005] = "EnterGameResp"] = 10005;
            return values;
        })();

        /**
         * Code enum.
         * @name Base.Code
         * @enum {string}
         * @property {number} Success=0 Success value
         * @property {number} AlreadyLogin=10001 AlreadyLogin value
         * @property {number} LoginFailed=10002 LoginFailed value
         * @property {number} NotLogin=10003 NotLogin value
         * @property {number} AlreadyInGame=10004 AlreadyInGame value
         * @property {number} GameNotExit=10005 GameNotExit value
         * @property {number} InnerError=10006 InnerError value
         * @property {number} GetUserInfoError=10007 GetUserInfoError value
         */
        Base.Code = (function () {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "Success"] = 0;
            values[valuesById[10001] = "AlreadyLogin"] = 10001;
            values[valuesById[10002] = "LoginFailed"] = 10002;
            values[valuesById[10003] = "NotLogin"] = 10003;
            values[valuesById[10004] = "AlreadyInGame"] = 10004;
            values[valuesById[10005] = "GameNotExit"] = 10005;
            values[valuesById[10006] = "InnerError"] = 10006;
            values[valuesById[10007] = "GetUserInfoError"] = 10007;
            return values;
        })();

        Base.LoginReq = (function () {

            /**
             * Properties of a LoginReq.
             * @memberof Base
             * @interface ILoginReq
             * @property {string} userId LoginReq userId
             * @property {string} token LoginReq token
             */

            /**
             * Constructs a new LoginReq.
             * @memberof Base
             * @classdesc Represents a LoginReq.
             * @implements ILoginReq
             * @constructor
             * @param {Base.ILoginReq=} [p] Properties to set
             */
            function LoginReq(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * LoginReq userId.
             * @member {string} userId
             * @memberof Base.LoginReq
             * @instance
             */
            LoginReq.prototype.userId = "";

            /**
             * LoginReq token.
             * @member {string} token
             * @memberof Base.LoginReq
             * @instance
             */
            LoginReq.prototype.token = "";

            /**
             * Creates a new LoginReq instance using the specified properties.
             * @function create
             * @memberof Base.LoginReq
             * @static
             * @param {Base.ILoginReq=} [properties] Properties to set
             * @returns {Base.LoginReq} LoginReq instance
             */
            LoginReq.create = function create(properties) {
                return new LoginReq(properties);
            };

            /**
             * Encodes the specified LoginReq message. Does not implicitly {@link Base.LoginReq.verify|verify} messages.
             * @function encode
             * @memberof Base.LoginReq
             * @static
             * @param {Base.ILoginReq} m LoginReq message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LoginReq.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                w.uint32(10).string(m.userId);
                w.uint32(18).string(m.token);
                return w;
            };

            /**
             * Decodes a LoginReq message from the specified reader or buffer.
             * @function decode
             * @memberof Base.LoginReq
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Base.LoginReq} LoginReq
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LoginReq.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Base.LoginReq();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                        case 1:
                            m.userId = r.string();
                            break;
                        case 2:
                            m.token = r.string();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                if (!m.hasOwnProperty("userId"))
                    throw $util.ProtocolError("missing required 'userId'", { instance: m });
                if (!m.hasOwnProperty("token"))
                    throw $util.ProtocolError("missing required 'token'", { instance: m });
                return m;
            };

            return LoginReq;
        })();

        Base.LoginResp = (function () {

            /**
             * Properties of a LoginResp.
             * @memberof Base
             * @interface ILoginResp
             * @property {Base.Code|null} [code] LoginResp code
             * @property {string|null} [msg] LoginResp msg
             * @property {string|null} [userId] LoginResp userId
             */

            /**
             * Constructs a new LoginResp.
             * @memberof Base
             * @classdesc Represents a LoginResp.
             * @implements ILoginResp
             * @constructor
             * @param {Base.ILoginResp=} [p] Properties to set
             */
            function LoginResp(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * LoginResp code.
             * @member {Base.Code} code
             * @memberof Base.LoginResp
             * @instance
             */
            LoginResp.prototype.code = 0;

            /**
             * LoginResp msg.
             * @member {string} msg
             * @memberof Base.LoginResp
             * @instance
             */
            LoginResp.prototype.msg = "";

            /**
             * LoginResp userId.
             * @member {string} userId
             * @memberof Base.LoginResp
             * @instance
             */
            LoginResp.prototype.userId = "";

            /**
             * Creates a new LoginResp instance using the specified properties.
             * @function create
             * @memberof Base.LoginResp
             * @static
             * @param {Base.ILoginResp=} [properties] Properties to set
             * @returns {Base.LoginResp} LoginResp instance
             */
            LoginResp.create = function create(properties) {
                return new LoginResp(properties);
            };

            /**
             * Encodes the specified LoginResp message. Does not implicitly {@link Base.LoginResp.verify|verify} messages.
             * @function encode
             * @memberof Base.LoginResp
             * @static
             * @param {Base.ILoginResp} m LoginResp message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LoginResp.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                if (m.code != null && Object.hasOwnProperty.call(m, "code"))
                    w.uint32(8).int32(m.code);
                if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                    w.uint32(18).string(m.msg);
                if (m.userId != null && Object.hasOwnProperty.call(m, "userId"))
                    w.uint32(26).string(m.userId);
                return w;
            };

            /**
             * Decodes a LoginResp message from the specified reader or buffer.
             * @function decode
             * @memberof Base.LoginResp
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Base.LoginResp} LoginResp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LoginResp.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Base.LoginResp();
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
                            m.userId = r.string();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                return m;
            };

            return LoginResp;
        })();

        Base.EnterGameReq = (function () {

            /**
             * Properties of an EnterGameReq.
             * @memberof Base
             * @interface IEnterGameReq
             * @property {string} userId EnterGameReq userId
             * @property {number} gameId EnterGameReq gameId
             */

            /**
             * Constructs a new EnterGameReq.
             * @memberof Base
             * @classdesc Represents an EnterGameReq.
             * @implements IEnterGameReq
             * @constructor
             * @param {Base.IEnterGameReq=} [p] Properties to set
             */
            function EnterGameReq(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * EnterGameReq userId.
             * @member {string} userId
             * @memberof Base.EnterGameReq
             * @instance
             */
            EnterGameReq.prototype.userId = "";

            /**
             * EnterGameReq gameId.
             * @member {number} gameId
             * @memberof Base.EnterGameReq
             * @instance
             */
            EnterGameReq.prototype.gameId = 0;

            /**
             * Creates a new EnterGameReq instance using the specified properties.
             * @function create
             * @memberof Base.EnterGameReq
             * @static
             * @param {Base.IEnterGameReq=} [properties] Properties to set
             * @returns {Base.EnterGameReq} EnterGameReq instance
             */
            EnterGameReq.create = function create(properties) {
                return new EnterGameReq(properties);
            };

            /**
             * Encodes the specified EnterGameReq message. Does not implicitly {@link Base.EnterGameReq.verify|verify} messages.
             * @function encode
             * @memberof Base.EnterGameReq
             * @static
             * @param {Base.IEnterGameReq} m EnterGameReq message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EnterGameReq.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                w.uint32(10).string(m.userId);
                w.uint32(16).int32(m.gameId);
                return w;
            };

            /**
             * Decodes an EnterGameReq message from the specified reader or buffer.
             * @function decode
             * @memberof Base.EnterGameReq
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Base.EnterGameReq} EnterGameReq
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EnterGameReq.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Base.EnterGameReq();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                        case 1:
                            m.userId = r.string();
                            break;
                        case 2:
                            m.gameId = r.int32();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                if (!m.hasOwnProperty("userId"))
                    throw $util.ProtocolError("missing required 'userId'", { instance: m });
                if (!m.hasOwnProperty("gameId"))
                    throw $util.ProtocolError("missing required 'gameId'", { instance: m });
                return m;
            };

            return EnterGameReq;
        })();

        Base.EnterGameResp = (function () {

            /**
             * Properties of an EnterGameResp.
             * @memberof Base
             * @interface IEnterGameResp
             * @property {Base.Code|null} [code] EnterGameResp code
             * @property {string|null} [msg] EnterGameResp msg
             * @property {string} userId EnterGameResp userId
             * @property {number} gameId EnterGameResp gameId
             * @property {Uint8Array|null} [data] EnterGameResp data
             */

            /**
             * Constructs a new EnterGameResp.
             * @memberof Base
             * @classdesc Represents an EnterGameResp.
             * @implements IEnterGameResp
             * @constructor
             * @param {Base.IEnterGameResp=} [p] Properties to set
             */
            function EnterGameResp(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * EnterGameResp code.
             * @member {Base.Code} code
             * @memberof Base.EnterGameResp
             * @instance
             */
            EnterGameResp.prototype.code = 0;

            /**
             * EnterGameResp msg.
             * @member {string} msg
             * @memberof Base.EnterGameResp
             * @instance
             */
            EnterGameResp.prototype.msg = "";

            /**
             * EnterGameResp userId.
             * @member {string} userId
             * @memberof Base.EnterGameResp
             * @instance
             */
            EnterGameResp.prototype.userId = "";

            /**
             * EnterGameResp gameId.
             * @member {number} gameId
             * @memberof Base.EnterGameResp
             * @instance
             */
            EnterGameResp.prototype.gameId = 0;

            /**
             * EnterGameResp data.
             * @member {Uint8Array} data
             * @memberof Base.EnterGameResp
             * @instance
             */
            EnterGameResp.prototype.data = null;

            /**
             * Creates a new EnterGameResp instance using the specified properties.
             * @function create
             * @memberof Base.EnterGameResp
             * @static
             * @param {Base.IEnterGameResp=} [properties] Properties to set
             * @returns {Base.EnterGameResp} EnterGameResp instance
             */
            EnterGameResp.create = function create(properties) {
                return new EnterGameResp(properties);
            };

            /**
             * Encodes the specified EnterGameResp message. Does not implicitly {@link Base.EnterGameResp.verify|verify} messages.
             * @function encode
             * @memberof Base.EnterGameResp
             * @static
             * @param {Base.IEnterGameResp} m EnterGameResp message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EnterGameResp.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                if (m.code != null && Object.hasOwnProperty.call(m, "code"))
                    w.uint32(8).int32(m.code);
                if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                    w.uint32(18).string(m.msg);
                w.uint32(26).string(m.userId);
                w.uint32(32).int32(m.gameId);
                if (m.data != null && Object.hasOwnProperty.call(m, "data"))
                    w.uint32(42).bytes(m.data);
                return w;
            };

            /**
             * Decodes an EnterGameResp message from the specified reader or buffer.
             * @function decode
             * @memberof Base.EnterGameResp
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Base.EnterGameResp} EnterGameResp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EnterGameResp.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Base.EnterGameResp();
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
                            m.userId = r.string();
                            break;
                        case 4:
                            m.gameId = r.int32();
                            break;
                        case 5:
                            m.data = r.bytes();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                if (!m.hasOwnProperty("userId"))
                    throw $util.ProtocolError("missing required 'userId'", { instance: m });
                if (!m.hasOwnProperty("gameId"))
                    throw $util.ProtocolError("missing required 'gameId'", { instance: m });
                return m;
            };

            return EnterGameResp;
        })();

        Base.Message = (function () {

            /**
             * Properties of a Message.
             * @memberof Base
             * @interface IMessage
             * @property {number} seq Message seq
             * @property {number} cmd Message cmd
             * @property {Uint8Array|null} [data] Message data
             */

            /**
             * Constructs a new Message.
             * @memberof Base
             * @classdesc Represents a Message.
             * @implements IMessage
             * @constructor
             * @param {Base.IMessage=} [p] Properties to set
             */
            function Message(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * Message seq.
             * @member {number} seq
             * @memberof Base.Message
             * @instance
             */
            Message.prototype.seq = 0;

            /**
             * Message cmd.
             * @member {number} cmd
             * @memberof Base.Message
             * @instance
             */
            Message.prototype.cmd = 0;

            /**
             * Message data.
             * @member {Uint8Array} data
             * @memberof Base.Message
             * @instance
             */
            Message.prototype.data = null;

            /**
             * Creates a new Message instance using the specified properties.
             * @function create
             * @memberof Base.Message
             * @static
             * @param {Base.IMessage=} [properties] Properties to set
             * @returns {Base.Message} Message instance
             */
            Message.create = function create(properties) {
                return new Message(properties);
            };

            /**
             * Encodes the specified Message message. Does not implicitly {@link Base.Message.verify|verify} messages.
             * @function encode
             * @memberof Base.Message
             * @static
             * @param {Base.IMessage} m Message message or plain object to encode
             * @param {$protobuf.Writer} [w] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Message.encode = function encode(m, w) {
                if (!w)
                    w = $Writer.create();
                w.uint32(8).int32(m.seq);
                w.uint32(16).int32(m.cmd);
                if (m.data != null && Object.hasOwnProperty.call(m, "data"))
                    w.uint32(26).bytes(m.data);
                return w;
            };

            /**
             * Decodes a Message message from the specified reader or buffer.
             * @function decode
             * @memberof Base.Message
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {Base.Message} Message
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Message.decode = function decode(r, l) {
                if (!r)
                    return r;
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.Base.Message();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                        case 1:
                            m.seq = r.int32();
                            break;
                        case 2:
                            m.cmd = r.int32();
                            break;
                        case 3:
                            m.data = r.bytes();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                    }
                }
                if (!m.hasOwnProperty("seq"))
                    throw $util.ProtocolError("missing required 'seq'", { instance: m });
                if (!m.hasOwnProperty("cmd"))
                    throw $util.ProtocolError("missing required 'cmd'", { instance: m });
                return m;
            };

            return Message;
        })();

        return Base;
    })();

    return $root;
})(protobuf).Base;

module.exports = {
    Base: global.Base
}