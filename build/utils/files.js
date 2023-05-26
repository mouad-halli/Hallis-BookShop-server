"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameFile = exports.deleteFileIfExist = void 0;
var fs_1 = require("fs");
var envConfig_1 = require("../config/envConfig");
var path_1 = require("path");
var deleteFileIfExist = function (fileToDelete) {
    (0, fs_1.readdirSync)(envConfig_1.UPLOAD_LOCATION)
        .forEach(function (fileName) {
        if (fileName === fileToDelete)
            (0, fs_1.unlinkSync)("".concat(envConfig_1.UPLOAD_LOCATION, "/").concat(fileToDelete));
    });
};
exports.deleteFileIfExist = deleteFileIfExist;
var renameFile = function (fileName, newName) {
    var newFileName = "".concat(envConfig_1.UPLOAD_LOCATION).concat(newName).concat((0, path_1.extname)(fileName));
    (0, fs_1.rename)(fileName, newFileName, function (err) {
        if (err)
            console.log(err);
    });
    return newFileName;
};
exports.renameFile = renameFile;
