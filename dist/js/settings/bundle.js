/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/settings/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/settings/index.ts":
/*!*******************************!*\
  !*** ./src/settings/index.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("$(function () {\r\n    let ws;\r\n    setTimeout(() => {\r\n        let domain = \"\";\r\n        fetch(\"./api/v1/getWebSocketURL\").then(res => res.json()).then((data) => {\r\n            // console.log(data);\r\n            domain = data.url;\r\n            // console.log(domain);\r\n            let url = \"ws://\" + domain;\r\n            if (location.protocol == 'https:') {\r\n                url = \"wss://\" + domain;\r\n            }\r\n            // console.log(location.protocol, location.protocol == 'https:');\r\n            ws = new WebSocket(url);\r\n            ws.addEventListener(\"message\", e => {\r\n                const data = JSON.parse(e.data);\r\n                if (data.type == \"add\") {\r\n                    $(\".list .\" + data.target).append($(\"<div></div>\").html(data.text));\r\n                }\r\n                else if (data.type == \"reset\" || data.type == \"set\") {\r\n                    $(\".list .\" + data.target).html(\"\").append($(\"<div></div>\").html(data.text));\r\n                }\r\n                else if (data.type == \"hello\") {\r\n                    data.data.forEach(element => {\r\n                        console.log(element);\r\n                        $(\".list .\" + data.target).append($(\"<div></div>\").html(element));\r\n                    });\r\n                }\r\n            });\r\n            ws.addEventListener(\"open\", e => {\r\n                ws.send(JSON.stringify({\r\n                    type: \"hello\",\r\n                    target: \"slide\"\r\n                }));\r\n                ws.send(JSON.stringify({\r\n                    type: \"hello\",\r\n                    target: \"slide-label\"\r\n                }));\r\n                ws.send(JSON.stringify({\r\n                    type: \"hello\",\r\n                    target: \"slide-left\"\r\n                }));\r\n            });\r\n            ws.addEventListener(\"close\", e => {\r\n                Library.dialog(\"通信が切断されました。\");\r\n            });\r\n        }).catch((e) => {\r\n            console.log(e);\r\n            Library.dialog(\"通信に失敗しました。\");\r\n        });\r\n    }, 250);\r\n    $(\".slide-send-btn\").on({ \"click\": () => {\r\n            ws.send(JSON.stringify({\r\n                type: \"add\",\r\n                target: \"slide\",\r\n                text: $(\".text.slide\").val()\r\n            }));\r\n        } });\r\n    $(\".slide-reset-btn\").on({ \"click\": () => {\r\n            ws.send(JSON.stringify({\r\n                type: \"reset\",\r\n                target: \"slide\",\r\n                text: $(\".text.slide\").val()\r\n            }));\r\n        } });\r\n    $(\".slide-label-send-btn\").on({ \"click\": () => {\r\n            ws.send(JSON.stringify({\r\n                type: \"set\",\r\n                target: \"slide-label\",\r\n                text: $(\".text.slide-label\").val()\r\n            }));\r\n        } });\r\n    $(\".slide-left-send-btn\").on({ \"click\": () => {\r\n            ws.send(JSON.stringify({\r\n                type: \"set\",\r\n                target: \"slide-left\",\r\n                text: $(\".text.slide-left\").val()\r\n            }));\r\n        } });\r\n});\r\n\n\n//# sourceURL=webpack:///./src/settings/index.ts?");

/***/ })

/******/ });