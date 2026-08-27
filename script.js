// =====================
// Search Food
// =====================

let search = document.getElementById("search");

if (search) {

    search.addEventListener("keyup", function () {

        let value = search.value.toLowerCase();

        let cards = document.querySelectorAll(".food-card");

        cards.forEach(function (card) {

            let foodName = card.querySelector("h3").innerText.toLowerCase();

            if (foodName.includes(value)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }

        });

    });

}


// =====================
// Order Button
// =====================

let orderBtn = document.getElementById("order-btn");

if (orderBtn) {

    orderBtn.addEventListener("click", function () {

        window.location.href = "cart.html";

    });

}


// =====================
// Login
// =====================

let loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;

        fetch("/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })

        })

        .then(response => response.json())

        .then(data => {

            if (data.success) {

                // User Details Save
                localStorage.setItem("user_id", data.user.id);
                localStorage.setItem("name", data.user.name);
                localStorage.setItem("email", data.user.email);

                alert("Login Successful");

                window.location.href = "profile.html";

            }

            else {

                alert(data.message);

            }

        });

    });

}


// =====================
// Signup
// =====================

let signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", function (e) {

        e.preventDefault();

        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;

        fetch("/signup", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                name: name,
                email: email,
                password: password

            })

        })

        .then(response => response.text())

        .then(data => {

            alert(data);

            if (data === "Signup Successful") {

                signupForm.reset();

                window.location.href = "index.html";

            }

        })

        .catch(function () {

            alert("Something Went Wrong");

        });

    });

}


// =====================
// Load Foods
// =====================

let foodContainer = document.getElementById("food-container");

if (foodContainer) {

    fetch("/foods")

    .then(response => response.json())

    .then(data => {

        foodContainer.innerHTML = "";

        data.forEach(function(food){

            foodContainer.innerHTML += `

            <div class="food-card">

                <img src="images/${food.image}" alt="${food.food_name}">

                <h3>${food.food_name}</h3>

                <p>Price : ₹${food.price}</p>

                <button
                    class="cart-btn"
                    data-id="${food.id}">
                    Add To Cart
                </button>

            </div>

            `;

        });

        // =====================
        // Add To Cart
        // =====================

        let buttons = document.querySelectorAll(".cart-btn");

        buttons.forEach(function(button){

            button.addEventListener("click", function(){

                let user_id = localStorage.getItem("user_id");

                if(!user_id){

                    alert("Please Login First");

                    window.location.href="login.html";

                    return;

                }

                let food_id = button.dataset.id;

                fetch("/cart",{

                    method:"POST",

                    headers:{
                        "Content-Type":"application/json"
                    },

                    body:JSON.stringify({

                        user_id:user_id,
                        food_id:food_id

                    })

                })

                .then(response=>response.text())

                .then(data=>{

                    alert(data);

                });

            });

        });

    });

}

// =====================
// Load Cart
// =====================

let cartTable = document.getElementById("cartTable");

if (cartTable) {

    let user_id = localStorage.getItem("user_id");

    if (!user_id) {

        alert("Please Login First");

        window.location.href = "login.html";

    } else {

        fetch("/cart-data/" + user_id)

        .then(response => response.json())

        .then(data => {

            cartTable.innerHTML = "";

            let total = 0;

            data.forEach(function(item){

                let itemTotal = item.price * item.quantity;

                total += itemTotal;

                cartTable.innerHTML += `

                <tr>

                    <td>${item.food_name}</td>

                    <td>₹${item.price}</td>

                    <td>${item.quantity}</td>

                    <td>₹${itemTotal}</td>

                </tr>

                `;

            });

            let grandTotal = document.getElementById("grandTotal");

            if (grandTotal) {

                grandTotal.innerText = "Grand Total : ₹" + total;

            }

        });

    }

}


// =====================
// Place Order
// =====================

let placeOrder = document.getElementById("placeOrder");

if (placeOrder) {

    placeOrder.addEventListener("click", function(){

        let user_id = localStorage.getItem("user_id");

        let bill = document.getElementById("grandTotal").innerText;

        if (bill === "Grand Total : ₹0") {

            alert("Your Cart is Empty!");

            return;

        }

        fetch("/cart/" + user_id, {

            method: "DELETE"

        })

        .then(response => response.text())

        .then(function(){

            alert(
                "Order Confirmed ✅\n\n" +
                bill +
                "\n\nThank You For Ordering!"
            );

            window.location.href = "index.html";

        });

    });

}


// =====================
// Profile
// =====================

let profileName = document.getElementById("profileName");
let profileEmail = document.getElementById("profileEmail");

if (profileName) {

    profileName.innerText = localStorage.getItem("name");

}

if (profileEmail) {

    profileEmail.innerText = localStorage.getItem("email");

}


// =====================
// Logout
// =====================

let logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function(){

        localStorage.clear();

        alert("Logout Successful");

        window.location.href = "login.html";

    });

}