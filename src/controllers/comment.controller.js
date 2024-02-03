const { SuccessResponse } = require('../core/success.response')
const { createComment } = require('../services/comment.service')


class CommentController {
    createComment = async ( req ,res , next) => {
        new SuccessResponse({
            message: 'Create new Comment',
            metadata : await createComment(req.body)
        }).send(res)
    }
}

module.exports = new CommentController()