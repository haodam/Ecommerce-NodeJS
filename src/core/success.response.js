
const { StatusCodes } = require("./httpStatusCode");

class SuccessResponse {

    constructor({message, status = StatusCodes.OK, metadata = {}}) {
        this.message = message;
        this.status = status;
        this.metadata = metadata;
    }

    send(res, headers = {}) {
        return res.status(this.status)
            .json(this)
    }
}

class OK extends SuccessResponse {
    constructor({message, metadata}) {
        super({message, metadata})
    }
}


class CREATED extends SuccessResponse {
    constructor({options = {} ,message, status = StatusCodes.CREATED ,metadata}) {
        super({message, status , metadata})
        this.options = options
    }
}

// const CREATED = (res, message, metadata) => {
//     new Create({
//         message,
//         metadata,
//         options
//     }).send(res)
// }

// const OK = (res, message, metadata) => {
//     new Ok({
//         message,
//         metadata,
//         options
//     }).send(res)
// }


module.exports = {
    OK,
    CREATED,
    SuccessResponse
}