const {model, Schema} = require('mongoose');

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

const discountSchema = new Schema({

    discount_name: {type: String , require: true}, // Ten voucher
    discount_description: {type: String , require: true}, // mo ta ma giam gias
    discount_type: {type: String , default: 'fixed_amount'}, // percentage
    discount_value: {type: Number , require: true}, //10.000
    discount_code: {type: String , require: true},  // ma code giam gia 
    discount_start_date: {type: Date , require: true}, // thoi gian bat dau
    discount_end_date: {type: Date , require: true}, // thoi gian ket thuc
    discount_max_uses: {type: Number , require: true}, // so luong discount duoc ap dung
    discount_uses_count: {type: Number , require: true}, // so discount da su dung
    discount_users_used: {type: Array , default: []}, // nguoi dung nao su dung
    discount_max_uses_per_user:  {type: Number , require: true}, // so luong cho phep toi da duoc su dung
    discount_min_order_value: {type: Number , require: true}, // gia tri don hang toi thieu
    discount_shopId: {type: Schema.Types.ObjectId , ref: 'Shop'},
    discount_is_active: {type: Boolean , default: true},
    discount_applies_to: {type: String , require: true, enum: ['all', 'specific']},
    discount_product_ids: {type: Array , default: []} // so san pham duoc ap dung

},{
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, discountSchema);