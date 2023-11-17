const _ = require('lodash')
const {Types} = require('mongoose')

const convertToObjectIdMongodb = id => {
    new Types.ObjectId(id)
}

const getInfoData = ({fileds = [], object = {}}) => {
    return _.pick(object, fileds)
}

// [ 'a', 'b' ] = [ a:1 . b:1 ] converts
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el => [el, 1])))
}
// ['a', 'b'] = [a: 0, b: 0]
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


/*
    const a = {
        c : {
            d: 1
            e: 2
        }
    }

    update:
    db.collection.updateOne({
        `c.d` : 1
        `c.e` : 2
    })
*/
const updateNestedObjectParser = obj => {
    console.log(`[1]::`, obj)
    const final = {}
    Object.keys(obj).forEach(i => {
        if (typeof obj[i] === 'object' && !Array.isArray(obj[i])) {
            const response = updateNestedObjectParser(obj[i])
            Object.keys( response || {} ).forEach(j => {
                final[`${i}.${j}`] = response[j]
            })
        } else {
            final[i] = obj[i]
        }
    })
    console.log(`[2]::`, final)
    return final
}

module.exports = {
    checkEnable,
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeAttrUndefined,
    updateNestedObjectParser,
    convert2ObjectId,
    convertToObjectIdMongodb
}