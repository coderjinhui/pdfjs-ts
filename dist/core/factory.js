"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FactoryOptions = /** @class */ (function () {
    function FactoryOptions(option) {
        var _this = this;
        this.multiple = false;
        this.renderText = false;
        Object.keys(option).forEach(function (key) {
            _this[key] = option[key];
        });
    }
    return FactoryOptions;
}());
exports.FactoryOptions = FactoryOptions;
