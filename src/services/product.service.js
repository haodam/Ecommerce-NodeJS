
const { product, clothing, electronics } = require('../models/product.model');
const {  BadRequestError, ForbiddenError } = require('../core/error.response');
const { 
    findAllDraftsForShop, 
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductsByUser,
    findAllProducts,
    findProduct,
    updateProductById
} = require('../models/repository/product.repo');
const { insertInventory } = require('../models/repository/inventory.repo');
const { model } = require('mongoose');
const { updateNestedObjectParser } = require('../utils');


// define Factory class to create product

class ProductFactory {
    /*
        type: Clothing
        payload
    */

    static productRegistry = {} // key-class

    static registerProductType(type , classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type , payload){
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass){
            throw new BadRequestError(`Invalid Product Types ${type}`)
        }
        return new productClass(payload).createProduct()
    }

    static async updateProduct(type , productId , payload){
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass){
            throw new BadRequestError(`Invalid Product Types ${type}`)
        }
        return new productClass(payload).updateProduct(productId)
    }

    // PUT //
    static async publishProductByShop({ product_shop, product_id}){
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unPublishProductByShop({ product_shop, product_id}){
        return await unPublishProductByShop({ product_shop, product_id })
    }

    // Query

    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }){
        const query = {product_shop, isDraft: true}
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }){
        const query = { product_shop, isPublished : true }
        return await findAllPublishForShop({ query, limit, skip })
    }

    static async searchProducts ({ keySearch }){
        return await searchProductsByUser({keySearch})
    }

    static async findAllProducts ({limit = 50, sort = 'ctime', page = 1, filter = {isPublished: true}}){
        return await findAllProducts({limit, sort, page, filter,
            select: ['product_name', 'product_price', 'product_thump', 'product_shop']
        })
    }

    static async findProduct({product_id}){
        return await findProduct({product_id, unSelect: ['__v']})
    }

    // Detail
    static async findProduct ({keySearch}){
        return await findAllProduct({keySearch})
    }

    // static async createProduct(type, payload){
    //     switch (type) {
    //         case 'Electronics':
    //             return new Electronics(payload).createProduct()
    //         case 'Clothing':
    //             return new Clothing(payload).createProduct()
    //         default:
    //             throw new BadRequestError(`Invalid Product Types ${type}`)
    //     }
    // }
}


// define base product class

class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_quantity, product_type, product_shop, product_attributes
    }) {

    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes

    }

    // create new product
    async createProduct( product_id ){
        const newProduct = await product.create({... this, _id: product_id })
        if(newProduct) {
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })
        }
        return newProduct
    }

    // create Product
    async updateProduct(productId, bodyUpdate){
        return await updateProductById({ productId, bodyUpdate, model: product })
    }
}

// Define sub-class for different product types clothing

class Clothing extends Product{
    async createProduct(){
        const newClothing = await clothing.create(this.product_attributes)
        if(!newClothing){
            throw new BadRequestError('create new Clothing error')
        }

        const newProduct = await super.createProduct()
        if(!newProduct){
            throw new BadRequestError('create new Product error')
        }

        return newProduct;
    }

    async updateProduct(productId){
        // 1. remove attributes has null underfined
        // 2. check update field
        console.log(`[1]::`, this)
        const updateNest = updateNestedObjectParser(this)
        const objectParams = removeAttrUndefined(updateNest)
        console.log(`[2]::`, objectParams)
        if (objectParams.product_attributes){
            // update child
            await updateProductById({ 
                productId, 
                bodyUpdate: objectParams,
                model: clothing })
        }

        const updateProduct = await super.updateProduct(productId, objectParams)
        return updateProduct
    }
}

// Define sub-class for different product types electronics

class Electronics extends Product{
    async createProduct(){
        const newElectronics = await electronics.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElectronics ){
            throw new BadRequestError('create new electronics error')
        }

        const newProduct = await super.createProduct(newElectronics._id)
        if(!newProduct){
            throw new BadRequestError('create new Product error')
        }

        return newProduct;
    }
}

// Define sub-class for different product types Furniture

class Furniture extends Product{
    async createProduct(){
        const newfurniture = await electronics.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newfurniture ){
            throw new BadRequestError('create new furniture error')
        }

        const newProduct = await super.createProduct(newfurniture._id)
        if(!newfurniture){
            throw new BadRequestError('create new Product error')
        }

        return newfurniture;
    }
}

// Register product types
ProductFactory.registerProductType('Furniture', Furniture)
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)

module.exports = ProductFactory;

