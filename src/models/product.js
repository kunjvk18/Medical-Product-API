var mongoose = require('mongoose')
const ProductType = require('./productType')

var productSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        trim: true,
        ref: 'ProductType'
    },
    productName: {
        type: String,
        minLength: 3,
        required: true,
        trim: true
    },
    expiryDate:{
        type: Date,
        required:true
    },
    price: {
        type: Number,
       default:0,
    },
    likes:{
        type:Number,
        default:0
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: { createdAt: 'created_at' } });

productSchema.pre('save', async function (next) {
    const product = this
    
    const typeName = await ProductType.findOne({ name: product.type })
    if (typeName) {
        next()
    } else {
        const newType = new ProductType({
            name: product.type,
            owner: product.owner
        })
        await newType.save()
        next()
    }
})
productSchema.methods.toJSON = function (){
    const user=this
    const userObject = user.toObject()
    delete userObject.dislikers
    delete userObject.dislikes
    delete userObject.likers
    return userObject
}
const Product = mongoose.model('Product', productSchema)
module.exports = Product