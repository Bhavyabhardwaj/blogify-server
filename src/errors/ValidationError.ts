import { CustomError } from "./CustomError";

export class ValidationError extends CustomError{
    constructor(message : string = "Validation error"){
        super(message, 422);
    }
}