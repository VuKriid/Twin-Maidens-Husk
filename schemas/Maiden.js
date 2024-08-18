const { Schema, model } = require('mongoose');

const MaidenSchema = new Schema(
    {
        ownerId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        personality: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        affect: {
            type: Number,
            default: 0,
        },
        nickname: {
            type: String,
            required: false,
        },
        lastModified: { // Nuevo campo para almacenar la última fecha de modificación
            type: Date,
            default: Date.now,
        }
    }
);

module.exports = model('Maidens', MaidenSchema);
