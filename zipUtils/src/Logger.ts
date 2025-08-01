enum LoggerType {
	NULL = 0,
	DEBUG = 1,
	INFO = 2,
	WARN = 4,
	ERROR = 8,
}

export class Logger {
	static init(level?: LoggerType, isVConsole?: boolean) {
		Logger.log = Logger.info = Logger.warn = Logger.error = function () {};

		level = level || LoggerType.NULL;

		let nav = navigator.userAgent;
		let testUa = [
			'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1',
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
		];
		if (testUa.includes(nav)) {
			level = LoggerType.DEBUG | LoggerType.INFO | LoggerType.WARN | LoggerType.ERROR;
		}

		if (isVConsole) {
			let _log = function (...args: any[]) {
				console.log(...args);
			};
			if (level & LoggerType.DEBUG) {
				Logger.log = function (...args) {
					_log(...args);
				};
			}

			if (level & LoggerType.INFO) {
				Logger.log = function (...args) {
					_log(...args);
				};
			}

			if (level & LoggerType.WARN) {
				Logger.log = function (...args) {
					_log(...args);
				};
			}

			if (level & LoggerType.ERROR) {
				Logger.log = function (...args) {
					_log(...args);
				};
			}
		} else {
			if (level & LoggerType.DEBUG) {
				Logger.log = console.log.bind(console);
			}

			if (level & LoggerType.INFO) {
				Logger.info = console.info ? console.info.bind(console) : console.log.bind(console);
			}

			if (level & LoggerType.WARN) {
				Logger.warn = console.warn ? console.warn.bind(console) : console.log.bind(console);
			}

			if (level & LoggerType.ERROR) {
				Logger.error = console.error ? console.error.bind(console) : console.log.bind(console);
			}
		}

		Logger.log('Logger initialized: ', level, isVConsole);
	}

	static log(...args: any) {}

	static info(...args: any) {}

	static warn(...args: any) {}

	static error(...args: any) {}
}
