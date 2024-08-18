const { Schema, model } = require('mongoose');

const UserProfileSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        balance: {
            type: Number,
            default: 0,
        },
        lastDailyCollected: {
            type: Date,
        },
        health: {
            type: Number,
            default: 100,
        },
        defeatedBosses: {
            type: [String],
            default: [],
        },
        stats: {
            level: {
                type: Number,
                default: 1,
            },
            vitality: {
                type: Number,
                default: 1,
            },
            attack: {
                type: Number,
                default: 1,
            },
            evasion: {
                type: Number,
                default: 1,
            },
            accuracy: {
                type: Number,
                default: 1,
            }
        }
    }, 
    { timestamps: true }
);

module.exports = model('UserProfile', UserProfileSchema);
