var mysql = require("mysql");
var inquirer = require("inquirer");

// create connection for SQL database
var connection = mysql.createConnection
    ({
        host: "localhost",
        port: 8889,
        user: "root",
        password: "root",
        database: "bamazon"
    })

// function to display main menu options
var mainMenu = function () {
    inquirer.prompt
        ([{
            // create list of menu options for manager to select from
            // View Products for Sale, View Low Inventory, Add to Inventory, Add New Product, Exit
            name: "menuOptions",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale",
                "View Items with Low Inventory",
                "Add Inventory to an Item",
                "Add a new Product",
                "Exit"
            ]
        }])
        .then(function (answer) {
            console.log(answer);

            switch (answer.menuOptions) {

                case "View Products for Sale":
                    displayProducts();
                    break;

                case "View Items with Low Inventory":
                    lowInventory();
                    break;

                case "Add Inventory to an Item":
                    addInventory();
                    break;

                case "Add a new Product":
                    addNewProduct();
                    break;

                case "Exit":
                    process.exit();
            }
        })
}

mainMenu();

// Function to display all products available for sale
var displayProducts = function () {

    console.log("Available Products for Sale: \n");

    connection.query("SELECT * FROM products", function (error, response) {
        if (error) throw error;

        // If a manager selects`View Products for Sale`, list item IDs, names, prices, and quantities.
        // console.log("Item ID\t", "Product Name\t", "Price\t", "Quantity\t")
        console.log("---------------------------------------------------------------------------");

        for (var i = 0; i < response.length; i++) {
            console.log(
                "Item ID: " + response[i].item_id + "\t" +
                "Product: " + response[i].product_name + "\t" +
                "\tPrice: " + response[i].price + "\t" +
                "\tQty: " + response[i].stock_quantity + "\t" + "\n");
        }
        console.log("--------------------------------------------------------------------------");

        mainMenu();
    })
}

// if manager selects`View Low Inventory`, list all items with inventory of five units or less.
var lowInventory = function () {
    console.log("Below are the list of product(s) with low inventory: \n");

    connection.query("SELECT * FROM products", function (error, response) {
        if (error) throw error;

        console.log("Item ID\t", "Product Name\t", "Price\t", "Quantity\t")
        console.log("---------------------------------------------------------------------------");

        for (var i = 0; i < response.length; i++) {
            if (response[i].stock_quantity <= 5) {
                console.log(
                    response[i].item_id + "\t" +
                    response[i].product_name + "\t" +
                    response[i].price + "\t" +
                    response[i].stock_quantity + "\t" + "\n");
            }
        }
        mainMenu();
    });
}

// if manager selects`Add New Product`, allow manager to add new product to store.
var addNewProduct = function () {
    // prompt manager for new product name, department name, price, and quantity to be added
    inquirer.prompt
        ([
            {
                name: "productName",
                type: "input",
                message: "What is the new product name you would like to add in the store?"
            },
            {
                name: "departmentName",
                type: "input",
                message: "What is the department name?"
            },
            {
                name: "unitPrice",
                type: "input",
                message: "What is the unit price?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "stockQuantity",
                type: "input",
                message: "What is the quantity available for sale?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            // after prompt is done, insert new product to database with information manager entered
            connection.query("INSERT INTO products SET ?",
                {
                    product_name: answer.productName,
                    department_name: answer.departmentName,
                    price: answer.unitPrice,
                    stock_quantity: answer.stockQuantity
                },
                function (error) {
                    if (error) throw (error)
                    console.log("\n Your new product has been added succesfully! \n");

                    displayProducts();
                }
            )
        });
}

// if manager selects`Add to Inventory`, allow manager to add any item currently in store.
var addInventory = function () {

    connection.query("SELECT * FROM products", function (error, response) {
        if (error) throw error;
        inquirer.prompt
            ([{
                name: "productName",
                type: "list",
                message: "What is the current product name you would like to update?",
                choices: ["Tide Free and Gentle Laundry Detergent Pods", "Vega One Organic All-in-One Shake Berry",
                    "Wellness Complete Health Natural Cat Food", "The Critters Collection (Blu-ray)",
                    "Invasion of the Body Snatchers Olive Signature", "Ozium Regular Smoke & Odors Eliminator Gel",
                    "Amazon.com eGift Card", "TCL 55-Inch 4K Ultra HD Roku Smart LED TV",
                    "Pet Sematary by Stephen King", "Apple iPad (Wi-Fi, 32GB) - Space Gray"]

            },
            {
                name: "stockQuantity",
                type: "input",
                message: "What quantity is available to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
            ])
            .then(function (answer) {
                var quantityOnHand;
                for (var i = 0; i < response.length; i++) {
                    if (response[i].product_name == answer.productName) {
                        quantityOnHand = response[i].stock_quantity;
                    }
                }
                connection.query("UPDATE products SET ? WHERE ?",
                    [{ stock_quantity: quantityOnHand + parseInt(answer.stockQuantity) },
                    { product_name: answer.productName }],
                    function (error, response) {
                        if (error) throw error;
                        if (response.affectedRows == 0) {
                            console.log("The product does not exist. Please try again!");
                            displayProducts();
                        }
                        else {
                            console.log("\n Your inventory has been added succesfully to an existing product! \n");
                            displayProducts();
                        }
                    });
            })
    });
}


