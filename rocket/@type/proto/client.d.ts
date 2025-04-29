declare global {
 // DO NOT EDIT! This is a generated file. Edit the JSDoc in src/*.js instead and run 'npm run types'.

/** Namespace Base. */
export namespace Base {

    /** Properties of a Head. */
    interface IHead {

        /** Head seq */
        seq: (number|Long);

        /** Head cmd */
        cmd: number;

        /** Head userId */
        userId: (number|Long);

        /** Head msgLen */
        msgLen: number;
    }

    /** Represents a Head. */
    class Head implements IHead {

        /**
         * Constructs a new Head.
         * @param [p] Properties to set
         */
        constructor(p?: Base.IHead);

        /** Head seq. */
        public seq: (number|Long);

        /** Head cmd. */
        public cmd: number;

        /** Head userId. */
        public userId: (number|Long);

        /** Head msgLen. */
        public msgLen: number;

        /**
         * Creates a new Head instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Head instance
         */
        public static create(properties?: Base.IHead): Base.Head;

        /**
         * Encodes the specified Head message. Does not implicitly {@link Base.Head.verify|verify} messages.
         * @param m Head message or plain object to encode
         * @param [w] Writer to encode to
         * @returns Writer
         */
        public static encode(m: Base.IHead, w?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Head message from the specified reader or buffer.
         * @param r Reader or buffer to decode from
         * @param [l] Message length if known beforehand
         * @returns Head
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): Base.Head;
    }
}

/** Namespace Game1006. */
export namespace Game1006 {

    /** Cmd enum. */
    enum Cmd {
        Bet = 1006001,
        CancelBet = 1006002,
        GetOff = 1006003,
        FlyInfo = 1006004
    }

    /** Properties of a Bet. */
    interface IBet {

        /** Bet betCoin */
        betCoin: (number|Long);
    }

    /** Represents a Bet. */
    class Bet implements IBet {

        /**
         * Constructs a new Bet.
         * @param [p] Properties to set
         */
        constructor(p?: Game1006.IBet);

        /** Bet betCoin. */
        public betCoin: (number|Long);

        /**
         * Creates a new Bet instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Bet instance
         */
        public static create(properties?: Game1006.IBet): Game1006.Bet;

        /**
         * Encodes the specified Bet message. Does not implicitly {@link Game1006.Bet.verify|verify} messages.
         * @param m Bet message or plain object to encode
         * @param [w] Writer to encode to
         * @returns Writer
         */
        public static encode(m: Game1006.IBet, w?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Bet message from the specified reader or buffer.
         * @param r Reader or buffer to decode from
         * @param [l] Message length if known beforehand
         * @returns Bet
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): Game1006.Bet;
    }

    /** Properties of a CancelBet. */
    interface ICancelBet {
    }

    /** Represents a CancelBet. */
    class CancelBet implements ICancelBet {

        /**
         * Constructs a new CancelBet.
         * @param [p] Properties to set
         */
        constructor(p?: Game1006.ICancelBet);

        /**
         * Creates a new CancelBet instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CancelBet instance
         */
        public static create(properties?: Game1006.ICancelBet): Game1006.CancelBet;

        /**
         * Encodes the specified CancelBet message. Does not implicitly {@link Game1006.CancelBet.verify|verify} messages.
         * @param m CancelBet message or plain object to encode
         * @param [w] Writer to encode to
         * @returns Writer
         */
        public static encode(m: Game1006.ICancelBet, w?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CancelBet message from the specified reader or buffer.
         * @param r Reader or buffer to decode from
         * @param [l] Message length if known beforehand
         * @returns CancelBet
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): Game1006.CancelBet;
    }

    /** Properties of a GetOff. */
    interface IGetOff {

        /** GetOff result */
        result: boolean;
    }

    /** Represents a GetOff. */
    class GetOff implements IGetOff {

        /**
         * Constructs a new GetOff.
         * @param [p] Properties to set
         */
        constructor(p?: Game1006.IGetOff);

        /** GetOff result. */
        public result: boolean;

        /**
         * Creates a new GetOff instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetOff instance
         */
        public static create(properties?: Game1006.IGetOff): Game1006.GetOff;

        /**
         * Encodes the specified GetOff message. Does not implicitly {@link Game1006.GetOff.verify|verify} messages.
         * @param m GetOff message or plain object to encode
         * @param [w] Writer to encode to
         * @returns Writer
         */
        public static encode(m: Game1006.IGetOff, w?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetOff message from the specified reader or buffer.
         * @param r Reader or buffer to decode from
         * @param [l] Message length if known beforehand
         * @returns GetOff
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): Game1006.GetOff;
    }

    /** Properties of a FlyInfo. */
    interface IFlyInfo {

        /** FlyInfo multiplier */
        multiplier: number;

        /** FlyInfo isExplode */
        isExplode?: (boolean|null);
    }

    /** Represents a FlyInfo. */
    class FlyInfo implements IFlyInfo {

        /**
         * Constructs a new FlyInfo.
         * @param [p] Properties to set
         */
        constructor(p?: Game1006.IFlyInfo);

        /** FlyInfo multiplier. */
        public multiplier: number;

        /** FlyInfo isExplode. */
        public isExplode: boolean;

        /**
         * Creates a new FlyInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FlyInfo instance
         */
        public static create(properties?: Game1006.IFlyInfo): Game1006.FlyInfo;

        /**
         * Encodes the specified FlyInfo message. Does not implicitly {@link Game1006.FlyInfo.verify|verify} messages.
         * @param m FlyInfo message or plain object to encode
         * @param [w] Writer to encode to
         * @returns Writer
         */
        public static encode(m: Game1006.IFlyInfo, w?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FlyInfo message from the specified reader or buffer.
         * @param r Reader or buffer to decode from
         * @param [l] Message length if known beforehand
         * @returns FlyInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): Game1006.FlyInfo;
    }
}
 
} 
 export {}