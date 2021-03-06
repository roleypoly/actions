"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core = __importStar(require("@actions/core"));
var config_1 = require("../utils/config");
var request_1 = require("@octokit/request");
var getConfig = function () {
    var config = config_1.configTool({
        environment: 'test',
        new_tag: '',
        app: '',
        description: '',
        github_auth_token: '',
    });
    if (config.app === '') {
        throw new Error("app isn't set");
    }
    if (config.new_tag === '') {
        throw new Error("new_tag isn't set");
    }
    if (config.github_auth_token === '') {
        throw new Error("github_auth_token isn't set");
    }
    return config;
};
exports.run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ghAuthToken, config, commit, repo, branch, actor, commitSourceInfo;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = getConfig(), ghAuthToken = _a.github_auth_token, config = __rest(_a, ["github_auth_token"]);
                commit = process.env.GITHUB_SHA;
                repo = process.env.GITHUB_REPOSITORY;
                branch = process.env.GITHUB_REF;
                actor = process.env.GITHUB_ACTOR;
                commitSourceInfo = "Initiated by Github Actions ran from " + repo + ":" + branch + " commit: " + commit + " at " + new Date() + " by " + actor;
                console.log({ commitSourceInfo: commitSourceInfo });
                console.log({ config: config });
                return [4 /*yield*/, request_1.request('POST /repos/:owner/:repo/dispatches', {
                        headers: {
                            authorization: "token " + ghAuthToken,
                        },
                        owner: 'roleypoly',
                        repo: 'devops',
                        event_type: 'deploy',
                        client_payload: __assign(__assign({}, config), { description: commitSourceInfo + "\n\n---\n\n" + config.description }),
                    })];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
if (!module.parent) {
    exports.run().catch(function (e) {
        console.error(e);
        core.error(e);
    });
}
