const { Schema, model } = require('mongoose');

const InventorySchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        items: [
            {
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                usable: { type: Boolean, required: true, default: false },
                description: {type: String, required: false},
            }
        ],
    }
);

module.exports = model('Inventory', InventorySchema);
