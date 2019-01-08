var inquirer = require("inquirer");
var mysql = require("mysql");



// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    console.log("Connected as id: " + connection.threadId);
    if (err) throw err;
    product();
});

function product() {
    console.log("\nWelcome to bamazon! Selecting all products for you: \n");
    connection.query("SELECT * FROM products ORDER BY item_id", function (err, results) {
        if (err) throw err;
        for(let i = 0; i < results.length; i++) {
            console.log("~~~~~~~~~~~~");
            console.log("ID:" + results[i].item_id + " Product: " + results[i].product_name + " " + "$"+results[i].price);
        }
        chooseID();
    });
}



var chooseID = function() {
    inquirer.prompt({
        name: "orderID",
        message: "Please select the item you want to purchase by its ID:\n",
        type: "input"
    }).then(answer => {
        var id = answer.orderID;
        if (id <=10){
         
            chooseQuantity(id);
                
        }else{

            console.log("Sorry wrong item ID entered!");
            chooseID();

        }
    })
}

var chooseQuantity = function(id) {
    inquirer.prompt({
        name:"quantity",
        message:"Please select the amount you would like to order:\n",
        type:"input",

    }).then(answer => {
        connection.query("SELECT * from products WHERE item_id = ?", [id], function (err, results){
           if (err) throw err;
               if (answer.quantity > results[0].stock_quantity || answer.quantity === "") {
                   console.log("Unfortunately we couldn't fulfill your order at this time, please try to lower your quantity");
                   chooseQuantity(id);
               }else {
                   console.log("Thank you for your purchase, your order has been recieved");
                   
               } 
        });
    });
}



