"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(obj, keyOrder, dontSortByUnicode) {
    if (!obj)
        return;
    const res = {};
    if (keyOrder) {
        keyOrder.forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                res[key] = obj[key];
                delete obj[key];
            }
        });
    }
    const keys = Object.keys(obj);
    if (!dontSortByUnicode)
        keys.sort();
    keys.forEach((key) => {
        res[key] = obj[key];
    });
    return res;
}
exports.default = default_1;
