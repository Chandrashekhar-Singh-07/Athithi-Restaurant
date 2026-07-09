const express = require("express");
const path = require("path");

const app = express();
const db = require("./db");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Frontend Folder
app.use(express.static(path.join(__dirname, "../frontend")));

const PORT = 3000;

// ================= HOME =================

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ================= SIGNUP =================

app.post("/signup", function (req, res) {

    const { name, email, password } = req.body;

    const sql =
        "INSERT INTO users(name,email,password) VALUES(?,?,?)";

    db.query(sql, [name, email, password], function (err) {

        if (err) {
            console.log(err);
            return res.send("Signup Failed");
        }

        res.send("Signup Successful");

    });

});

// ================= LOGIN =================

app.post("/login", function (req, res) {

    const { email, password } = req.body;

    const sql =
        "SELECT * FROM users WHERE email=? AND password=?";

    db.query(sql, [email, password], function (err, result) {

        if (err) {

            console.log(err);

            return res.json({
                success: false,
                message: "Login Failed"
            });

        }

        if (result.length == 0) {

            return res.json({
                success: false,
                message: "Invalid Email or Password"
            });

        }

        res.json({
            success: true,
            user: result[0]
        });

    });

});

// ================= LOAD FOODS =================

app.get("/foods", function (req, res) {

    db.query("SELECT * FROM foods", function (err, result) {

        if (err) {

            console.log(err);

            return res.json([]);

        }

        res.json(result);

    });

});

// ================= ADD TO CART =================

app.post("/cart", function (req, res) {

    const food_id = req.body.food_id;
    const user_id = req.body.user_id;

    const checkSql =
        "SELECT * FROM cart WHERE user_id=? AND food_id=?";

    db.query(checkSql, [user_id, food_id], function (err, result) {

        if (err) {

            console.log(err);

            return res.send("Failed");

        }

        if (result.length > 0) {

            const updateSql =
                "UPDATE cart SET quantity=quantity+1 WHERE user_id=? AND food_id=?";

            db.query(updateSql, [user_id, food_id], function (err) {

                if (err) {

                    console.log(err);

                    return res.send("Failed");

                }

                res.send("Added To Cart");

            });

        }

        else {

            const insertSql =
                "INSERT INTO cart(user_id,food_id,quantity) VALUES(?,?,1)";

            db.query(insertSql, [user_id, food_id], function (err) {

                if (err) {

                    console.log(err);

                    return res.send("Failed");

                }

                res.send("Added To Cart");

            });

        }

    });

});

// ================= LOAD USER CART =================

app.get("/cart-data/:user_id", function (req, res) {

    const user_id = req.params.user_id;

    const sql = `

    SELECT
    foods.food_name,
    foods.price,
    foods.image,
    cart.quantity

    FROM cart

    JOIN foods

    ON cart.food_id=foods.id

    WHERE cart.user_id=?

    `;

    db.query(sql, [user_id], function (err, result) {

        if (err) {

            console.log(err);

            return res.json([]);

        }

        res.json(result);

    });

});

// ================= CLEAR CART AFTER ORDER =================

app.delete("/cart/:user_id", function (req, res) {

    const user_id = req.params.user_id;

    db.query(
        "DELETE FROM cart WHERE user_id=?",
        [user_id],
        function (err) {

            if (err) {

                console.log(err);

                return res.send("Failed");

            }

            res.send("Success");

        }
    );

});

// ================= START SERVER =================

app.listen(PORT, function () {

    console.log(`Server Running : http://localhost:${PORT}`);

});