var mysql = require("mysql");
var inquirer = require("inquirer");

// Create connection for SQL database
var connection = mysql.createConnection
    ({
        host: "localhost",
        port: 8889,
        user: "root",
        password: "root",
        database: "bamazon"
    })

// Connect to MYSQL server and SQL Databse
connection.connect(function (error) {
    if (error) throw error;

    console.log("Welcome to Bamazon! \n");

    displayProducts();
})

// Display all items available for sale
// Include ids, names, and prices of products for sale.
var displayProducts = function () {

    console.log("Below are the list of products available for sale: \n");
    console.log("---------------------------------------------------------------------------");

    connection.query("SELECT * FROM products", function (error, response) {
        for (var i = 0; i < response.length; i++) {
            console.log("Item #: " + response[i].item_id + " || Product: " + response[i].product_name + " || Price: $" + response[i].price + "\n");
        }
        console.log("---------------------------------------------------------------------------");

        promptCustomer(response);
    })
}

// Prompt customer with two messages
var promptCustomer = function (response) {

    // Ask ID of the product they would like to buy
    inquirer.prompt
        ([{
            type: "input",
            name: "selection",
            message: "What is the item number of the product you would like to buy? [If you want to quit, press 'Q']"
        }]).then(function (answer) {
            var correct = false;
            if (answer.selection.toUpperCase() == "Q") {
                process.exit();
            }

            // Ask how many units of the product they would like to buy
            for (var i = 0; i < response.length; i++) {
                if (response[i].item_id == answer.selection) {
                    correct = true;
                    var productName = response[i].product_name;
                    var productPrice = response[i].price;
                    var productQuantity;

                    // Saving ID number customer wants to buy
                    var id = i;
                    inquirer.prompt
                        ({
                            type: "input",
                            name: "quantity",
                            message: "How many units of the product would you like to buy?",

                            validate: function (value) {
                                if (isNaN(value) == false) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        })
                        .then(function (answer) {
                            if ((response[id].stock_quantity - answer.quantity) > 0) {

                                //parseInt changes from string to integer
                                productQuantity = parseInt(answer.quantity);

                                connection.query("Update products SET stock_quantity =' " + (response[id].stock_quantity - answer.quantity) + "' WHERE product_name='" + productName + "'", function (error, response2) {
                                    console.log("Item(s) purchased!");
                                    displayOrder(productQuantity, productName, productPrice);
                                })

                                // Check quantity of product to meet customer's request
                                // If not, log message `Insufficient quantity!`, and prevent the order from going through.
                            }
                            else {
                                console.log("Try again. Insufficient quantity!");
                                promptCustomer(response);
                            }
                        })
                }
            }

            // Check if customer placed valid item number 
            if (i == response.length && correct == false) {
                // If not, log message `Not a valid selection.`, and prevent the order from going through.
                console.log("Not a valid selection.");
                promptCustomer(response);
            }
        })
}

// If my store does have enough product, fulfill customer's order(s)
function displayOrder(quantity, name, price) {
    orderTotal = quantity * price;
    console.log("Thanks for your order! Please see details of your order below: \n");

    // Once update goes through, show the customer the total cost of their purchase
    console.log("Total cost of purchase: $" + orderTotal);
    console.log("---------------------------------------------------------------------------");

    // End the program
    process.exit();
}