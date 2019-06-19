"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var progress = document.createElement('div');
function emit(type, data) {
    var e = new CustomEvent(type, { detail: data });
    progress.dispatchEvent(e);
}
function addEvent(type, cb) {
    progress.addEventListener(type, cb);
}
exports.searchEvent = {
    addEvent: addEvent,
    emit: emit
};
