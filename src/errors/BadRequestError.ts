import { CustomError } from "./CustomError";

export class BadRequestError extends CustomError{
    constructor(message : string = "Bad request"){
        super(message, 400);
    }
}
