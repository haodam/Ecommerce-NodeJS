const { SuccessResponse } = require('../core/success.response')
const { createComment, getCommentsByParentId, deleteComments } = require('../services/comment.service')


class CommentController {
    createComment = async ( req ,res , next) => {
        new SuccessResponse({
            message: 'Create new Comment',
            metadata : await createComment(req.body)
        }).send(res)
    }

    getCommentsByParentId = async ( req , res , next) => {
        new SuccessResponse({
            message: 'Get Comments By ParentId',
            metadata: await getCommentsByParentId(req.query)
        }).send(res)
    }

    deleteComment = async (req , res, next) => {
        new SuccessResponse({
            message: 'Delete Comment successfully',
            metadata: await deleteComments(req.body)
        }).send(res)
    }
}

module.exports = new CommentController()