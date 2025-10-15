import { Request, Response } from "express";
import Favorite from "../models/Favorite.js";
import { AuthRequest } from "../types/express.js";

export const addFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { productId } = req.body;

    if (!productId) {
      res.status(400).json({ message: "Product ID is required" });
      return;
    }

    const existingFavorite = await Favorite.findOne({ user: req.user.userId, product: productId });
    if (existingFavorite) {
      res.status(409).json({ message: "Product already in favorites" });
      return;
    }

    const newFavorite = new Favorite({
      user: req.user.userId,
      product: productId,
    });

    await newFavorite.save();

    res.status(201).json({ message: "Product added to favorites", favorite: newFavorite });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFavorites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const favorites = await Favorite.find({ user: req.user.userId }).populate("product");
    res.status(200).json({ favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { productId } = req.params;

    const deletedFavorite = await Favorite.findOneAndDelete({ user: req.user.userId, product: productId });

    if (!deletedFavorite) {
      res.status(404).json({ message: "Product not found in favorites" });
      return;
    }

    res.status(200).json({ message: "Product removed from favorites" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ message: "Server error" });
  }
};