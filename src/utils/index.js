const _ = require('lodash')
const {Types} = require("mongoose")

const getInfoData = ({fileds = [], object = {}}) => {
    return _.pick(object, fileds)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el => [el, 1])))
}

const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map((el => [el, 0])))
}

const checkEnable = (value) => {
    return value === 'true'
}

const convert2ObjectId = id => {
    return new Types.ObjectId(id)
}

const removeAttrUndefined = (object) => {
    Object.keys(object).forEach(key => {
        if (object[key] === undefined
            || object[key] === null) delete object[key]
    })

    return object
}

const updateNestedObjectParser = obj => {
    const final = {}
    Object.keys(obj).forEach(i => {
        if (typeof obj[i] === 'object' && !Array.isArray(obj[i])) {
            const response = updateNestedObjectParser(obj[i])
            Object.keys(obj[i]).forEach(j => {
                final[`${i}.${j}`] = response[j]
            })
        } else {
            final[i] = obj[i]
        }
    })

    return final
}

module.exports = {
    checkEnable,
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeAttrUndefined,
    updateNestedObjectParser,
    convert2ObjectId
}