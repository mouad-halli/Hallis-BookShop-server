"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerOptions = void 0;
var multer_1 = require("multer");
var fs_1 = require("fs");
var path_1 = require("path");
var errors_1 = require("../utils/errors");
var files_1 = require("../utils/files");
var envConfig_1 = require("./envConfig");
// type DestinationCallback = (error: Error | null, destination: string) => void
// type FileNameCallback = (error: Error | null, filename: string) => void
exports.multerOptions = {
    // file size limits
    // limits: {
    //     fileSize: +process.env.MAX_FILE_SIZE,
    // },
    // Check the mimetypes to allow for upload
    fileFilter: function (req, file, cb) {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            // Allow storage of file
            cb(null, true);
        }
        else {
            // Reject file
            cb((0, errors_1.createError)(400, "Unsupported file type ".concat((0, path_1.extname)(file.originalname))), false);
        }
    },
    // Storage properties
    storage: (0, multer_1.diskStorage)({
        // Destination storage path details
        destination: function (req, file, cb) {
            // Create folder if doesn't exist
            if (!(0, fs_1.existsSync)(envConfig_1.UPLOAD_LOCATION)) {
                (0, fs_1.mkdirSync)(envConfig_1.UPLOAD_LOCATION);
            }
            cb(null, envConfig_1.UPLOAD_LOCATION);
        },
        // File modification details
        filename: function (req, file, cb) {
            var uploadedFile = '';
            if (req.baseUrl === '/user')
                uploadedFile += "".concat(req.user.id).concat((0, path_1.extname)(file.originalname));
            else if (req.baseUrl === '/book')
                uploadedFile += "".concat(req.params.id).concat((0, path_1.extname)(file.originalname));
            (0, files_1.deleteFileIfExist)(uploadedFile);
            cb(null, uploadedFile);
        }
    })
};
