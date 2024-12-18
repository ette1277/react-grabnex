import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';

// Function for adding a product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      colors,
      bestsellers,
      stock,
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !subCategory) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields' });
    }

    const images = [];
    if (req.files) {
      ['image1', 'image2', 'image3', 'image4'].forEach((key) => {
        if (req.files[key] && req.files[key][0]) images.push(req.files[key][0]);
      });
    }

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        if (!item.path) throw new Error('Invalid file path for upload');
        const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
        return result.secure_url;
      })
    );

    let parsedSizes = [];
    let parsedColors = [];
    try {
      parsedSizes = sizes ? JSON.parse(sizes) : [];
      parsedColors = colors ? JSON.parse(colors) : [];
    } catch (error) {
      return res.status(400).json({ success: false, message: 'Invalid JSON for sizes or colors' });
    }

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      bestsellers: bestsellers === 'true',
      sizes: parsedSizes,
      colors: parsedColors,
      stock: Number(stock),
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: 'Product Added', data: product });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, message: 'Failed to add product' });
  }
};

// Function for listing products
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error listing products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

// Function for removing a product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, message: 'Product ID is required' });

    const product = await productModel.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product Removed' });
  } catch (error) {
    console.error('Error removing product:', error);
    res.status(500).json({ success: false, message: 'Failed to remove product' });
  }
};

// Function for getting a single product's info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: 'Product ID is required' });

    const product = await productModel.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching single product:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
};

export { listProducts, addProduct, removeProduct, singleProduct };
