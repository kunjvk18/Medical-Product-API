const express = require('express')
const router = new express.Router()

const Comment = require('../models/comment')
const Product = require('../models/product')
const auth = require('../middleware/auth')

router.post("/products/:productId/comment", auth, async (req, res) => {
    // INSTANTIATE INSTANCE OF MODEL
    const comment = new Comment({
        ...req.body,
        by: req.user._id,
        for: req.params.productId
    });

    try {
        await comment.save()
        const product = await Product.findById(req.params.productId)
        await product.comments.unshift(comment)
        await product.save()
        res.status(201).send({ product })
    } catch (e) {
        res.status(400).send(e.message)
    }
});

module.exports = router