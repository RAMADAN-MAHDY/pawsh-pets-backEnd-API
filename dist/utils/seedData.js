import Category from '../models/Category.js';
import Product from '../models/Product.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getImagePath = (imageName) => {
    // Return a URL path that matches the static route defined in app.ts
    return `/images/Pawsh-Pet's_App (1)/${imageName}`;
};
const categoriesToSeed = [
    { name: 'Dry Food', description: 'Various types of dry food for pets.' },
    { name: 'Wet Food', description: 'Different brands and flavors of wet food.' },
    { name: 'Shop\'s Offers 14% Off', description: 'Special offers with 14% discount.' },
    { name: 'Today\'s Offers', description: 'Daily special deals.' },
    { name: 'Best Sales Today', description: 'Top selling products with great discounts.' },
    { name: 'Toys', description: 'A wide range of toys for pets.' },
    { name: 'Collars & Leashes', description: 'Stylish and durable collars and leashes.' },
];
export const seedCategories = async () => {
    try {
        for (const categoryData of categoriesToSeed) {
            const existingCategory = await Category.findOne({ name: categoryData.name });
            if (!existingCategory) {
                await Category.create(categoryData);
                console.log(`Category '${categoryData.name}' seeded.`);
            }
            else {
                console.log(`Category '${categoryData.name}' already exists.`);
            }
        }
        console.log('Category seeding complete.');
    }
    catch (error) {
        console.error('Error seeding categories:', error);
    }
};
export const seedProducts = async () => {
    try {
        await seedCategories(); // Ensure categories exist before seeding products
        const dryFoodCategory = await Category.findOne({ name: 'Dry Food' });
        const wetFoodCategory = await Category.findOne({ name: 'Wet Food' });
        const toysCategory = await Category.findOne({ name: 'Toys' });
        if (!dryFoodCategory || !wetFoodCategory || !toysCategory) {
            console.error('Required categories not found for product seeding.');
            return;
        }
        const productsToSeed = [
            {
                title: 'Premium Dry Dog Food',
                description: 'High-quality dry food for adult dogs.',
                image: getImagePath('Rectangle 8-1.png'),
                weight: '10kg',
                price: 45.99,
                rating: 4.5,
                isFavorite: false,
                category: dryFoodCategory._id,
            },
            {
                title: 'Tuna Wet Cat Food',
                description: 'Delicious wet food with real tuna for cats.',
                image: getImagePath('Rectangle 8-2.png'),
                weight: '85g',
                price: 1.29,
                rating: 4.8,
                isFavorite: true,
                category: wetFoodCategory._id
            },
            {
                title: 'Interactive Cat Toy',
                description: 'Feather wand toy for interactive play.',
                image: getImagePath('Rectangle 8-3.png'),
                weight: '50g',
                price: 9.99,
                rating: 4.2,
                isFavorite: false,
                category: toysCategory._id
            },
            {
                title: 'Puppy Training Dry Food',
                description: 'Specially formulated dry food for puppies.',
                image: getImagePath('Rectangle 8-4.png'),
                weight: '5kg',
                price: 25.00,
                rating: 4.0,
                isFavorite: false,
                category: dryFoodCategory._id
            },
            {
                title: 'Chicken & Rice Wet Dog Food',
                description: 'Complete and balanced wet food for dogs.',
                image: getImagePath('Rectangle 8-5.png'),
                weight: '400g',
                price: 2.50,
                rating: 4.3,
                isFavorite: false,
                category: wetFoodCategory._id
            },
            {
                title: 'Salmon Dry Cat Food',
                description: 'Nutritious dry food with salmon for cats.',
                image: getImagePath('Rectangle 8-6.png'),
                weight: '2kg',
                price: 18.75,
                rating: 4.6,
                isFavorite: false,
                category: dryFoodCategory._id,
            },
            {
                title: 'Beef Wet Dog Food',
                description: 'Hearty wet food with beef for dogs.',
                image: getImagePath('Rectangle 8-7.png'),
                weight: '300g',
                price: 2.00,
                rating: 4.1,
                isFavorite: false,
                category: wetFoodCategory._id,
            },
            {
                title: 'Laser Pointer Toy',
                description: 'Interactive laser toy for cats and dogs.',
                image: getImagePath('Rectangle 8-8.png'),
                weight: '20g',
                price: 7.50,
                rating: 4.7,
                isFavorite: true,
                category: toysCategory._id,
            },
            {
                title: 'Adult Dog Dry Food Large Breed',
                description: 'Dry food for large breed adult dogs.',
                image: getImagePath('Rectangle 8-9.png'),
                weight: '15kg',
                price: 55.00,
                rating: 4.4,
                isFavorite: false,
                category: dryFoodCategory._id,
            },
            {
                title: 'Variety Pack Wet Cat Food',
                description: 'Assorted flavors of wet food for cats.',
                image: getImagePath('Rectangle 8-10.png'),
                weight: '6 x 85g',
                price: 7.99,
                rating: 4.9,
                isFavorite: false,
                category: wetFoodCategory._id,
            },
            {
                title: 'Chew Rope Toy',
                description: 'Durable rope toy for dogs to chew and play.',
                image: getImagePath('Rectangle 8-11.png'),
                weight: '150g',
                price: 12.00,
                rating: 4.0,
                isFavorite: false,
                category: toysCategory._id,
            },
            {
                title: 'Senior Dog Dry Food',
                description: 'Easily digestible dry food for senior dogs.',
                image: getImagePath('Rectangle 8-12.png'),
                weight: '7kg',
                price: 30.00,
                rating: 4.2,
                isFavorite: false,
                category: dryFoodCategory._id,
            },
            {
                title: 'Grain-Free Wet Dog Food',
                description: 'Grain-free wet food for dogs with sensitivities.',
                image: getImagePath('Rectangle 8-13.png'),
                weight: '370g',
                price: 3.25,
                rating: 4.5,
                isFavorite: false,
                category: wetFoodCategory._id,
            },
            {
                title: 'Plush Squeaky Toy',
                description: 'Soft plush toy with squeaker for pets.',
                image: getImagePath('Rectangle 8-14.png'),
                weight: '80g',
                price: 8.50,
                rating: 4.3,
                isFavorite: false,
                category: toysCategory._id,
            },
            {
                title: 'Hypoallergenic Dry Dog Food',
                description: 'Specialized dry food for dogs with allergies.',
                image: getImagePath('Rectangle 8-15.png'),
                weight: '8kg',
                price: 48.00,
                rating: 4.7,
                isFavorite: false,
                category: dryFoodCategory._id,
            },
            {
                title: 'Chicken Pate Wet Cat Food',
                description: 'Smooth chicken pate wet food for cats.',
                image: getImagePath('Rectangle 8-16.png'),
                weight: '100g',
                price: 1.50,
                rating: 4.6,
                isFavorite: false,
                category: wetFoodCategory._id,
            },
            {
                title: 'Catnip Filled Mouse Toy',
                description: 'Mouse toy filled with catnip for feline fun.',
                image: getImagePath('Rectangle 8-17.png'),
                weight: '15g',
                price: 5.00,
                rating: 4.8,
                isFavorite: true,
                category: toysCategory._id,
            },
            {
                title: 'Weight Management Dry Dog Food',
                description: 'Low-calorie dry food for weight control in dogs.',
                image: getImagePath('Rectangle 8-18.png'),
                weight: '12kg',
                price: 40.00,
                rating: 4.1,
                isFavorite: false,
                category: dryFoodCategory._id,
            },
            {
                title: 'Seafood Cocktail Wet Cat Food',
                description: 'Gourmet seafood wet food for discerning cats.',
                image: getImagePath('Rectangle 8-19.png'),
                weight: '85g',
                price: 1.75,
                rating: 4.7,
                isFavorite: false,
                category: wetFoodCategory._id,
            },
            {
                title: 'Puzzle Feeder Toy',
                description: 'Dispenses treats as pets play, stimulating their mind.',
                image: getImagePath('Rectangle 8-20.png'),
                weight: '200g',
                price: 15.00,
                rating: 4.4,
                isFavorite: false,
                category: toysCategory._id,
            },
            {
                title: 'Small Breed Dry Dog Food',
                description: 'Tailored nutrition for small breed adult dogs.',
                image: getImagePath('Rectangle 8-21.png'),
                weight: '3kg',
                price: 20.00,
                rating: 4.3,
                isFavorite: false,
                category: dryFoodCategory._id,
            },
            {
                title: 'Vegetable Stew Wet Dog Food',
                description: 'Wholesome vegetable stew wet food for dogs.',
                image: getImagePath('Rectangle 8-22.png'),
                weight: '400g',
                price: 2.75,
                rating: 4.0,
                isFavorite: false,
                category: wetFoodCategory._id,
            },
            {
                title: 'Feather Teaser Wand',
                description: 'Long wand with feathers to entice cats to play.',
                image: getImagePath('Rectangle 8-23.png'),
                weight: '30g',
                price: 6.50,
                rating: 4.6,
                isFavorite: false,
                category: toysCategory._id,
            },
            {
                title: 'Performance Dry Dog Food',
                description: 'High-energy dry food for active dogs.',
                image: getImagePath('Rectangle 8-24.png'),
                weight: '10kg',
                price: 50.00,
                rating: 4.8,
                isFavorite: false,
                category: dryFoodCategory._id,
            },
            {
                title: 'Turkey & Giblets Wet Cat Food',
                description: 'Rich turkey and giblets wet food for cats.',
                image: getImagePath('Rectangle 8-25.png'),
                weight: '85g',
                price: 1.60,
                rating: 4.5,
                isFavorite: false,
                category: wetFoodCategory._id,
            },
            {
                title: 'Rubber Ball Toy',
                description: 'Durable rubber ball for fetching and chewing.',
                image: getImagePath('Rectangle 8-26.png'),
                weight: '100g',
                price: 9.00,
                rating: 4.2,
                isFavorite: false,
                category: toysCategory._id,
            },
            {
                title: 'Grain-Free Dry Cat Food',
                description: 'Grain-free dry food for cats with sensitive stomachs.',
                image: getImagePath('Rectangle 8-27.png'),
                weight: '1.5kg',
                price: 16.00,
                rating: 4.7,
                isFavorite: false,
                category: dryFoodCategory._id,
            },
            {
                title: 'Lamb & Rice Wet Dog Food',
                description: 'Gentle lamb and rice wet food for dogs.',
                image: getImagePath('Rectangle 8-28.png'),
                weight: '395g',
                price: 2.80,
                rating: 4.1,
                isFavorite: false,
                category: wetFoodCategory._id,
            },
            {
                title: 'Interactive Treat Dispenser',
                description: 'Toy that dispenses treats as pets play.',
                image: getImagePath('Rectangle 8.png'),
                weight: '180g',
                price: 14.00,
                rating: 4.5,
                isFavorite: false,
                category: toysCategory._id,
            },
        ];
        for (const productData of productsToSeed) {
            const existingProduct = await Product.findOne({ title: productData.title });
            if (!existingProduct) {
                await Product.create(productData);
                console.log(`Product '${productData.title}' seeded.`);
            }
            else {
                console.log(`Product '${productData.title}' already exists.`);
            }
        }
        console.log('Product seeding complete.');
    }
    catch (error) {
        console.error('Error seeding products:', error);
    }
};
export const deleteProducts = async () => {
    try {
        const result = await Product.deleteMany({});
        console.log(`${result.deletedCount} products deleted.`);
        console.log('Product deletion complete.');
    }
    catch (error) {
        console.error('Error deleting products:', error);
    }
};
