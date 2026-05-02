const { default: mongoose, mongo } = require("mongoose");

const CryptoSchema =  mongoose.Schema({
    name: {
        type:String,
        required: true,
    },
    symbol: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    change24h: {
        type: Number,
        required: true,
    }, //percentage change
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('Crypto', CryptoSchema);