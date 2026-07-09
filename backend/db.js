const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Chan@0713",
    database: "food_ordering"
});

connection.connect(function(err){

    if(err){
        console.log("Database Connection Failed");
    }

    else{
        console.log("Database Connected Successfully");
    }

});

module.exports = connection;