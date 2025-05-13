import { CustomError } from "./CustomError";

export class ForbiddenError extends CustomError{
    constructor(message : string = "Forbidden access"){
        super(message, 403);
    }
}