"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
const CustomError_1 = require("./CustomError");
class UnauthorizedError extends CustomError_1.CustomError {
    constructor(message = "Unauthorized access") {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
