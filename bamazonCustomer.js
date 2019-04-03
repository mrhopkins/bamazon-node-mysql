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

// connect to mySQL server and SQL databse
connection.connect(function (error) {
    if (error) throw error;

    console.log("Welcome to Bamazon! \n");

    displayProducts();
})

// display all items available for sale
// include ids, names, and prices of products for sale.
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

// prompt customer with two messages
var promptCustomer = function (response) {

    // ask ID of the product they would like to buy
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

            // ask how many units of the product they would like to buy
            for (var i = 0; i < response.length; i++) {
                if (response[i].item_id == answer.selection) {
                    correct = true;
                    var productName = response[i].product_name;
                    var productPrice = response[i].price;
                    var productQuantity;

                    // saving ID number customer wants to buy
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

                                // check quantity of product to meet customer's request
                                // else, log message `Insufficient quantity!`, and prevent the order from going through
                            }
                            else {
                                console.log("Insufficient quantity! Try again.");
                                promptCustomer(response);
                            }
                        })
                }
            }

            // check if customer placed valid item number 
            if (i == response.length && correct == false) {
                // else, log message `Not a valid selection.`, and prevent the order from going through
                console.log("Not a valid selection.");
                promptCustomer(response);
            }
        })
}

// if store has enough product quantity, fulfill customer order
function displayOrder(quantity, name, price) {
    orderTotal = quantity * price;
    console.log("Thanks for your order! Please see details of your order below: \n");

    // after update goes through, show customer total cost of purchase
    console.log("Total cost of purchase: $" + orderTotal);
    console.log("---------------------------------------------------------------------------");

    // end program
    process.exit();
}