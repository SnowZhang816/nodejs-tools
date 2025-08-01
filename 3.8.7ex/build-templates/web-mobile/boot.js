System.register("chunks:///_virtual/application.js", [], function (_export, _context) {
	"use strict";

	var cc, Application;
	function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
	function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
	function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
	function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
	return {
		setters: [],
		execute: function () {
			_export("Application", Application = /*#__PURE__*/function () {
				function Application() {
					_classCallCheck(this, Application);
					this.showFPS = false;
				}
				_createClass(Application, [{
					key: "init",
					value: function init(engine) {
						cc = engine;
						cc.game.onPostBaseInitDelegate.add(this.onPostInitBase.bind(this));
						cc.game.onPostSubsystemInitDelegate.add(this.onPostSystemInit.bind(this));
						cc.game.onPostInfrastructureInitDelegate.add(this.onPostInfrastructureInit.bind(this));
					}
				}, {
					key: "onPostInitBase",
					value: function onPostInitBase() {
						// cc.settings.overrideSettings('assets', 'server', '');
						// do custom logic
					}
				}, {
					key: "onPostSystemInit",
					value: function onPostSystemInit() {
						// do custom logic
					}
				}, {
					key: "onPostInfrastructureInit",
					value: function onPostInfrastructureInit() {
						// do custom logic
						if (!('serviceWorker' in navigator && "caches" in window)) {
							if ('ZipUtil' in window && ZipUtil.register) {
								ZipUtil.register();
							}
						}
						__updateProgress__(1.0 * 100);
					}
				}, {
					key: "start",
					value: function start() {
						return cc.game.init({
							debugMode: false ? cc.DebugMode.INFO : cc.DebugMode.ERROR,
							overrideSettings: window.__settings || {},
						}).then(function () {
							return cc.game.run();
						});
					}
				}]);
				return Application;
			}());
		}
	};
});

System.register("chunks:///_virtual/index.js", ["chunks:///_virtual/application.js"], function (_export, _context) {
	"use strict";

	var Application, canvas, $p, bcr, application;
	function topLevelImport(url) {
		return System["import"](url);
	}
	return {
		setters: [function (_applicationJs) {
			Application = _applicationJs.Application;
		}],
		execute: function () {
			canvas = document.getElementById('GameCanvas');
			$p = canvas.parentElement;
			bcr = $p.getBoundingClientRect();
			canvas.width = bcr.width;
			canvas.height = bcr.height;
			application = new Application();
			topLevelImport('cc').then(function (engine) {
				__updateProgress__(0.1 * 100);
				return application.init(engine);
			}).then(function () {
				return application.start();
			})["catch"](function (err) {
				console.error(err);
			});
		}
	};
});

System.import('chunks:///_virtual/index.js');