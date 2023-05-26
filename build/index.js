"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var envConfig_1 = require("./config/envConfig");
var databaseConf_1 = require("./config/databaseConf");
var auth_1 = __importDefault(require("./routes/auth"));
var user_1 = __importDefault(require("./routes/user"));
var book_1 = __importDefault(require("./routes/book"));
var cart_1 = __importDefault(require("./routes/cart"));
var payment_1 = __importDefault(require("./routes/payment"));
var order_1 = __importDefault(require("./routes/order"));
var http_status_codes_1 = require("http-status-codes");
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var cors_1 = __importDefault(require("cors"));
var passport_1 = __importDefault(require("passport"));
var app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: envConfig_1.CLIENT_URL,
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize());
app.get('/uploads/:file', function (req, res) {
    res.sendFile(req.params.file, { root: envConfig_1.UPLOAD_LOCATION });
});
app.get('/api', function (req, res) {
    res.status(200).json('welcom');
});
app.use('/payment', payment_1.default);
app.use(express_1.default.json());
app.use('/auth', auth_1.default);
app.use('/user', user_1.default);
app.use('/book', book_1.default);
app.use('/cart', cart_1.default);
app.use('/order', order_1.default);
app.use(function (error, req, res, next) {
    var errorStatus = error.status || 500;
    var errorMessage = error.message || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(errorStatus).json({
        message: errorMessage,
    });
});
app.listen(envConfig_1.PORT, function () {
    console.log("server listening on port ".concat(envConfig_1.PORT));
    (0, databaseConf_1.connectToDatabase)();
});
