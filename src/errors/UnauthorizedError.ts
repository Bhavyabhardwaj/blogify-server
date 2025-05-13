import { CustomError } from "./CustomError";

export class UnauthorizedError extends CustomError{
    constructor(message : string = "Unauthorized access"){
        super(message, 401);
    }
}