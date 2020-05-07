"use strict";
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
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
var exec = __importStar(require("@actions/exec"));
var tc = __importStar(require("@actions/tool-cache"));
var buildx_1 = require("../fetchers/buildx");
var config_1 = require("../utils/config");
var getConfig = function () {
    var configRaw = config_1.configTool({
        qemu: 'true',
        buildx: 'true',
        platforms: 'linux/amd64',
        target: '',
        dockerfile: './Dockerfile',
        tag: '',
        load: 'false',
        push: 'false',
        context: '.',
        defaultBuildArgs: '',
    });
    var config = {
        qemu: configRaw.qemu === 'true',
        buildx: configRaw.buildx === 'true',
        load: configRaw.load === 'true',
        push: configRaw.push === 'true',
        platforms: configRaw.platforms.split(','),
        tag: configRaw.tag.split(',').filter(function (x) { return x !== ''; }),
        target: configRaw.target,
        dockerfile: configRaw.dockerfile,
        context: configRaw.context,
        defaultBuildArgs: '',
    };
    if (config.tag.length === 0 && config.push) {
        throw new Error('with: tag **must** be set to push.');
    }
    return config;
};
var defaultBuildArgs = function () { return __awaiter(void 0, void 0, void 0, function () {
    var gitCommit, _a, gitBranch, _b, buildDate;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = process.env.GITHUB_SHA;
                if (_a) return [3 /*break*/, 2];
                return [4 /*yield*/, exec.exec('git rev-parse HEAD')];
            case 1:
                _a = (_c.sent());
                _c.label = 2;
            case 2:
                gitCommit = _a;
                _b = (process.env.GITHUB_REF && process.env.GITHUB_REF.replace('refs/heads/', ''));
                if (_b) return [3 /*break*/, 4];
                return [4 /*yield*/, exec.exec('git rev-parse --abbrev-ref HEAD')];
            case 3:
                _b = (_c.sent());
                _c.label = 4;
            case 4:
                gitBranch = _b;
                buildDate = new Date().toISOString();
                return [2 /*return*/, "--build-arg GIT_COMMIT=\"" + gitCommit + "\" --build-arg GIT_BRANCH=\"" + gitBranch + "\" --build-arg BUILD_DATE=\"" + buildDate + "\""];
        }
    });
}); };
exports.makeBuildFlags = function (config) {
    var flags = __spread([
        config.defaultBuildArgs,
        '--platform',
        config.platforms.join(',')
    ], (config.tag.length !== 0 && ("--tag " + config.tag.join(',')).split(' ')), [
        config.push && '--push',
        config.load && '--load'
    ], (config.target && ("--target " + config.target).split(' ')), (config.dockerfile && ("--file " + config.dockerfile).split(' ')), [
        config.context,
    ]);
    return flags.filter(function (x) { return x !== false; }).filter(function (x) { return x !== ''; });
};
exports.runBuild = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var buildx, flags;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                buildx = "sudo " + tc.find('buildx', '0.4.1') + "/buildx";
                return [4 /*yield*/, core.group('buildx create', function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, exec.exec(buildx + " create --driver docker-container --use --platform " + config.platforms)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, exec.exec(buildx + " inspect --bootstrap")];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _a.sent();
                flags = exports.makeBuildFlags(config);
                return [4 /*yield*/, core.group('buildx build', function () { return exec.exec(buildx + " build " + flags.join(' ')); })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var config, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                config = getConfig();
                if (!config.qemu) return [3 /*break*/, 2];
                return [4 /*yield*/, core.group('Fetch QEMU', function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, exec.exec('sudo apt-get update')];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, exec.exec('sudo apt-get install -y qemu binfmt-support qemu-user-static')];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, exec.exec('sudo update-binfmts --enable')];
                                case 3:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _b.sent();
                _b.label = 2;
            case 2:
                if (!config.buildx) return [3 /*break*/, 4];
                return [4 /*yield*/, core.group('Fetch Buildx', function () { return buildx_1.getBuildx(); })];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                _a = config;
                return [4 /*yield*/, defaultBuildArgs()];
            case 5:
                _a.defaultBuildArgs = _b.sent();
                return [4 /*yield*/, exports.runBuild(config)];
            case 6:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
if (!module.parent) {
    exports.run().catch(function (e) {
        core.error(e);
        process.exit(1);
    });
}
