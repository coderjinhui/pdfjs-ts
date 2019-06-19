"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const loadEvent = new Event('load');
// const renderEvent = new Event('render');
// const renderrTextEvent = new Event('renderText');
var progress = document.createElement('div');
function emit(type, data) {
    var e = new CustomEvent(type, { detail: data });
    progress.dispatchEvent(e);
}
function addEvent(type, cb) {
    progress.addEventListener(type, cb);
}
exports.ProgressEvent = {
    addEvent: addEvent,
    emit: emit
};
