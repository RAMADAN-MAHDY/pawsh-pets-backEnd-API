import { Request, Response } from "express";
import  Product  from "../models/Product.js";
import uploadToImgBB from '../utils/uploadToImgBB.js';
import { AuthRequest } from "../types/express.js";

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Product image is required" });
      return;
    }

    const uploadResult = await uploadToImgBB(req.file.buffer);

    const {
      title,
      description,
      weight,
      price,
      rating,
      isFavorite,
      category,
    } = req.body;

    if (!title || !weight || !price || !category) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const newProduct = new Product({
      title,
      description,
      image: uploadResult.url,
      weight,
      price,
      rating: rating || 0,
      isFavorite: isFavorite || false,
      category,
    });

    await newProduct.save();

    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category");

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      weight,
      price,
      rating,
      isFavorite,
      category,
    } = req.body;

    let imageUrl = req.body.image; // Keep existing image if not new file

    if (req.file) {
      const uploadResult = await uploadToImgBB(req.file.buffer);
      imageUrl = uploadResult.url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        title,
        description,
        image: imageUrl,
        weight,
        price,
        rating,
        isFavorite,
        category,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
};