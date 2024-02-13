const { getSelectData, unGetSelectData } = require('../../utils/')
const { convertToObjectIdMongodb } = require("../../utils")
const discount = require('../discount.model')

const findDiscountByCode = async ({ code, shopId }) => {
    return await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean()
  }

const finAllDiscountCodeUnSelect = async({
    limit = 50, page = 1 , sort ='ctime',
    filter, unSelect
}) => {
    const skip = (page -1) * limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const documents = await discount.find( filter )
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean()

    return documents;

}

const finAllDiscountCodeSelect = async({
    limit = 50, page =1 , sort ='ctime',
    filter, select, model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const documents = await model
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()

    return documents
}

const checkDiscountExists = async({ model , filter }) => {
    return await model.findOne(filter).lean()
}


module.exports = {
    finAllDiscountCodeUnSelect,
    finAllDiscountCodeSelect,
    checkDiscountExists,
    findDiscountByCode
}