const express = require('express')
const router = new express.Router()
const Product = require('../models/product')
const User = require('../models/user')
const auth = require("./../middleware/auth")

//Add Product
router.post("/products", auth, async (req, res) => {
    const product = new Product({
        ...req.body,
        owner: req.user._id
    })
    try {
        await product.save()
        await req.user.products.unshift(product)
        await req.user.save()
        res.status(201).send({ product })

    } catch (e) {
        res.status(400).send(e.message)
    }
})

//Read all Products
router.get("/products/all", async (req, res) => {
    Product.find({}).populate('comments').exec((err, result) => {
        res.send(result)
    })
})

//Read products by Type
//GET /products?type=new
router.get("/products", auth, async (req, res) => {
    try {
        Product.find({ type: req.query.type }).populate('comments').exec((err, result) => {
            res.send(result)
        })
    } catch (e) {
        res.status(500).send()

    }

})
//Read most recent product
router.get("/products/recent", auth, async (req, res) => {
    Product.findOne().sort('-created_at').exec(function (err, product) 
    { 
        res.send(product) 
    });

})

// Read Product by id
router.get("/products/:id", async (req, res) => {
    Product.findById(req.params.id).exec((err, result) => {
        if (err) {
            res.send(err)
        }
        res.send(result)
    })
})

//Like/Dislike a product
router.post("/products/:id", auth, async (req, res) => {
    
    try {
        if(req.query.like === 'true'){
            await Product.findOneAndUpdate({_id:req.params.id},{$inc:{likes:1}},{'new':true})
            res.send('Liked the product')
            console.log(req.query.like)
        }
        else if(req.query.like === 'false'){
            await Product.findOneAndUpdate({_id:req.params.id},{$inc :{likes:-1}},{'new':true})
            res.send('Disliked the product')
            console.log(req.query.like)
        }
        else{
            res.send('please like or dislike the product')
        }

    } catch (e) {
        res.status(400).send(e)
    }

});

//Get Most liked product
router.get("/mostlikedProduct", auth, async (req, res) => {
    
    try {
        const product = await Product.find().sort({likes:-1}).limit(1)
        res.status(200).send({product})
    } catch (e) {
        res.status(400).send(e)
    }

});

//Update a product
router.patch('/products/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["type", "price", "productName"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send('this updates are not allowed... you can only update "type", "price", "productName"')
    }

    try {
        const result = await Product.findOne({ _id: req.params.id, owner: req.user._id })

        updates.forEach((update) => result[update] = req.body[update])

        //by this middleware will be executed
        await result.save()

        if (!result) {
            return res.status(404).send()
        }

        res.send(result)
    } catch (e) {
        console.log(e);
        res.status(400).send()
    }
})

//Delete a product
router.delete('/products/:id', auth, async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!product) {
            return res.status(404).send()
        }

        res.send(product)
    } catch (e) {
        res.status(500).send(e)
    }
})
module.exports = router