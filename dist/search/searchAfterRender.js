"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var findCtrl_1 = require("./findCtrl");
function searchAfterRender(options) {
    if (options.searchWhenRender) {
        var findCtrl = findCtrl_1.FindCtrl.getInstance();
        var search = options.searchWhenRender;
        if (search instanceof Array) {
            findCtrl.search({
                keywords: search
            });
        }
        else if (typeof search === 'string') {
            findCtrl.search({
                q: search
            });
        }
    }
}
exports.searchAfterRender = searchAfterRender;
