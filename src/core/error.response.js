const { StatusCodes, ReasonPhrases } = require("./httpStatusCode");

class BaseError extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}


class BadRequestError extends BaseError{
    constructor(message = ReasonPhrases.CONFLICT, status = StatusCodes.FORBIDDEN){
        super(message, status)
    }
}

class AuthFailureError extends BaseError{
    constructor(message = ReasonPhrases.UNAUTHORIZED, status = StatusCodes.UNAUTHORIZED){
        super(message, status)
    }
}

class ForbiddenError extends BaseError{
    constructor(message = ReasonPhrases.FORBIDDEN, status = StatusCodes.FORBIDDEN){
        super(message, status)
    }
}

class NotFoundError extends BaseError{
    constructor(message = ReasonPhrases.NOT_FOUND, status = StatusCodes.NOT_FOUND){
        super(message, status)
    }
}


class Api409Error extends BaseError {
    constructor(message = ReasonPhrases.CONFLICT, status = StatusCodes.CONFLICT ) {
        super(message, status);
    }
}

class Api403Error extends BaseError {
    constructor(message = ReasonPhrases.FORBIDDEN, status = StatusCodes.FORBIDDEN ) {
        super(message, status);
    }
}

class Api401Error extends BaseError {
    constructor(message = ReasonPhrases.UNAUTHORIZED, status = StatusCodes.UNAUTHORIZED ) {
        super(message, status);
    }
}

class BusinessLogicError extends BaseError {
    constructor(message = ReasonPhrases.INTERNAL_SERVER_ERROR, status = StatusCodes.INTERNAL_SERVER_ERROR ) {
        super(message, status);
    }
}

class Api404Error extends BaseError {
    constructor(message = ReasonPhrases.NOT_FOUND, status = StatusCodes.NOT_FOUND ) {
        super(message, status);
    }
}

module.exports = {
    Api401Error,
    Api403Error,
    Api404Error,
    Api409Error,
    BusinessLogicError,
    BaseError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError
}