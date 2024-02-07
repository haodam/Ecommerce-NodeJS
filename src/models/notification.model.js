const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Notification";

const COLLECTION_NAME = "Notifications";

// ORDER-001: order successfully
// ORDER-002: order failed
// ORDER-003: order canceled
// SHOP-001: shop new product by user following
// POROMOTION-001: new promotion

const notificationSchema = new Schema(
  {
    noti_type: {
      type: String,
      enum: [
        "ORDER-001",
        "ORDER-002",
        "ORDER-003",
        "SHOP-001",
        "POROMOTION-001",
      ],
      required: true,
    },
    noti_senderId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
      required: true,
    },
    noti_receivedId: {
      type: Number,
      required: true,
    },
    noti_content: {
      type: String,
      required: true,
    },
    noti_options: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    collation: COLLECTION_NAME,
  }
);

module.exports = {
    NOTI: model(DOCUMENT_NAME, notificationSchema),
}