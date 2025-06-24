"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
const CustomError_1 = require("./CustomError");
class ValidationError extends CustomError_1.CustomError {
    constructor(message = "Validation error") {
        super(message, 422);
    }
}
exports.ValidationError = ValidationError;
