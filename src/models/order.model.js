
const {model, Schema} = require("mongoose");

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

const orderSchema = new Schema({

    order_userId: { type: Number, require: true },
    order_checkout: { type: Object, default: {} },
    /*
        order_checkout = {
            totalPrice,
            totalAllpyDiscount,
            feeShip
        }
    */
   order_Shipping : { type: Object, default: {} }, // Thong tin cua don hang
   /*
        street,
        city,
        state,
        country
   */
  order_payment: { type: Object, default: {} },
  order_products: { type: Array, require: true },
  order_trackingNumber: { type: String, default: '#0000103112023' }, // Theo doi don hang
  order_status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending' }

}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    },
});

module.exports = {
    order: model(DOCUMENT_NAME, orderSchema)
}
