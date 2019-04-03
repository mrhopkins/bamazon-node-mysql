-- create mysql database `bamazon`
DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

-- create a table `products`
CREATE TABLE products
(
-- `products` includes following columns:
    item_id INT NOT NULL AUTO_INCREMENT, 
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT(10) NOT NULL, 
    PRIMARY KEY(item_id)
);

-- populate `bamazon` database with products
    INSERT INTO products
        (product_name, department_name, price, stock_quantity)
    VALUES
        ("Tide Free and Gentle Laundry Detergent Pods", "Household Supplies", 17, 5),
        ("Vega One Organic All-in-One Shake Berry", "Sports Nutrition", 34, 50),
        ("Wellness Complete Health Natural Cat Food", "Pet Supplies", 32, 50),
        ("The Critters Collection (Blu-ray)", "Movies & TV", 50, 200),
        ("Invasion of the Body Snatchers Olive Signature", "Movies & TV", 29, 50),
        ("Ozium Regular Smoke & Odors Eliminator Gel", "Air Fresheners", 16, 50),
        ("Amazon.com eGift Card", "Gift Cards", 25, 200),
        ("TCL 55-Inch 4K Ultra HD Roku Smart LED TV", "Televisions", 570, 80),
        ("Pet Sematary by Stephen King", "Books", 18, 50),
        ("Apple iPad (Wi-Fi, 32GB) - Space Gray", "Tablets", 329, 90);

-- verify `products` table populated with products
SELECT * FROM products;
