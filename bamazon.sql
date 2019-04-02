-- Create MySQL Database called `bamazon`
DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

-- Create a Table called `products`
CREATE TABLE products
(
-- Products includes the following columns:

    -- item_id (unique id for each product)
    item_id INT NOT NULL AUTO_INCREMENT, 

    -- product_name (Name of product)
    product_name VARCHAR(100) NOT NULL,

    -- department_name
    department_name VARCHAR(100) NOT NULL,

    -- price (cost to customer)
    price DECIMAL(10,2) NOT NULL,

    -- stock_quantity (how much of the product is available in stores)
    stock_quantity INT(10) NOT NULL, 

    PRIMARY KEY(item_id)
);

-- Populate database with around 10 different products
    INSERT INTO products
        (product_name, department_name, price, stock_quantity)
    VALUES
        ("OTTO Swivel Recliner", "Living", 3595, 100),
        ("Aspen French Oak", "Dining", 2495, 100),
        ("ST. James Armoire", "Bed", 2695, 100),
        ("Belgian Linen Soap", "Bath", 22, 200),
        ("Brutalist Lamp", "Lighting", 595, 100),
        ("Vintage Rug", "Rugs", 5139, 100),
        ("Dakota Rod Finnials", "Hardware", 49, 200),
        ("Hanbel Pillow Collection", "Decor", 239, 200),
        ("KOEN Lybaert Art", "Art", 3295, 50),
        ("Provence Seating Collection", "Outdoor", 995, 100);

    -- SELECT * FROM bamazon.products;
    SELECT * FROM products;
