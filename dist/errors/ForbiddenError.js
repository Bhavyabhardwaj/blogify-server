"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = void 0;
const CustomError_1 = require("./CustomError");
class ForbiddenError extends CustomError_1.CustomError {
    constructor(message = "Forbidden access") {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
