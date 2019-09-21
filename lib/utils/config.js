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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@actions/core");
function configTool(defaultConfig) {
    var config = __assign({}, defaultConfig);
    Object.keys(defaultConfig).forEach(function (key) {
        var input = core_1.getInput(key);
        if (input) {
            config[key] = input;
        }
    });
    return config;
}
exports.configTool = configTool;
