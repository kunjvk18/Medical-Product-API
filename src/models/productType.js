var mongoose = require('mongoose');
var productTypeSchema = new mongoose.Schema({
    name: {
        type: 'string',
        minLength: 2,
        required: true,
        unique: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: { createdAt: 'created_at' } })

module.exports = mongoose.model('ProductType', productTypeSchema)