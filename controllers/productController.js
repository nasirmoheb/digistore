const Product = require('./../models/producModel');

exports.createProduct = async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);

    res.json({
      status: 'success',
      data: newProduct
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getProduct = async (req, res, next) => {
  
};
