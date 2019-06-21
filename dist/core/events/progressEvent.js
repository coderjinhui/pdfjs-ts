"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var searchEvent_1 = require("./searchEvent");
var progress = document.createElement('div');
function emit(type, data) {
    var e = new CustomEvent(type, { detail: data });
    progress.dispatchEvent(e);
}
function addEvent(type, cb) {
    progress.addEventListener(type, cb);
}
searchEvent_1.searchEvent.addEvent('search', function (e) {
    var data = {
        total: e.detail.total,
        loaded: e.detail.loaded,
        progress: e.detail.loaded / e.detail.total * 100
    };
    emit('search_progress', data);
});
exports.progressEvent = {
    addEvent: addEvent,
    emit: emit
};
