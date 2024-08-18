const { Schema, model } = require('mongoose');

const requirementSchema = new Schema({
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true }
});

const shopItemSchema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        usable: { type: Boolean, required: true},
        stockable: { type: Boolean, required: true},
        description: { type: String, required: false},
        image: { type: String, required: false},
        requirements: { type: [requirementSchema], default: [] }
    },
);

module.exports = model('ShopItem', shopItemSchema);
