
/* =========================
   PRODUCT DATA
========================= */

const products = [

    {
        name: "Atomic Habits",
        category: "book",
        price: 250,
        seller: "Priya",
        transactions: 18,
        icon: "📘"
    },

    {
        name: "The Psychology of Money",
        category: "book",
        price: 180,
        seller: "Arjun",
        transactions: 31,
        icon: "📕"
    },

    {
        name: "Harry Potter Collection",
        category: "book",
        price: 450,
        seller: "Manya",
        transactions: 12,
        icon: "📚"
    },

    {
        name: "Cotton T-Shirt",
        category: "clothes",
        price: 200,
        seller: "Riya",
        transactions: 9,
        icon: "👕"
    },

    {
        name: "Denim Jacket",
        category: "clothes",
        price: 500,
        seller: "Rahul",
        transactions: 24,
        icon: "🧥"
    },

    {
        name: "Casual Dress",
        category: "clothes",
        price: 350,
        seller: "Asha",
        transactions: 16,
        icon: "👗"
    }

];


/* =========================
   DISPLAY PRODUCTS
========================= */

function displayProducts(items) {

    const container = document.getElementById("products");

    container.innerHTML = "";

    items.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `

            <div class="product-image">
                ${product.photo
                    ? `<img src="${product.photo}" style="width:100%;height:100%;object-fit:cover">`
                    : product.icon}
            </div>

            <div class="product-info">

                <h3>${product.name}</h3>

                <div class="product-meta">

                    <span class="product-price">
                        ₹${product.price}
                    </span>

                    <span>
                        ${product.category === "book" ? "📚 Book" : "👕 Clothing"}
                    </span>

                </div>

                <div class="product-seller">

                    <span>
                        Seller: <strong>${product.seller}</strong>
                    </span>

                    <span>
                        ✓ ${product.transactions} sales
                    </span>

                </div>

                <button
                    class="buy-button"
                    onclick="viewProduct('${product.name}')"
                >
                    View Item →
                </button>

            </div>
        `;

        container.appendChild(card);

    });
}


/* =========================
   FILTER
========================= */

function filterProducts(category, button) {

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    if (category === "all") {
        displayProducts(products);
    } else {
        displayProducts(
            products.filter(product => product.category === category)
        );
    }
}


/* =========================
   PRODUCT VIEW
========================= */

function viewProduct(name) {

    const product = products.find(item => item.name === name);

    if (!product) return;

    alert(
        `${product.name}\n\n` +
        `Price: ₹${product.price}\n` +
        `Seller: ${product.seller}\n\n` +
        `This is a demo marketplace.`
    );
}


/* =========================
   NAVIGATION
========================= */

function goToSection(id) {

    const section = document.getElementById(id);

    if (section) {
        section.scrollIntoView({
            behavior: "smooth"
        });
    }
}


/* =========================
   LOGIN
========================= */

function openLogin() {

    document.getElementById("loginModal")
        .classList.add("show");
}


function loginDemo() {

    const name =
        document.getElementById("loginName").value.trim();

    if (!name) {

        alert("Please enter your name.");

        return;
    }

    closeModal("loginModal");

    alert(
        `Welcome, ${name}! 🌱\n\n` +
        `Your GiveWithPurpose profile is ready.`
    );
}


/* =========================
   DONATION
========================= */

function openDonation() {

    document.getElementById("donationModal")
        .classList.add("show");
}


function submitDonation() {

    const type =
        document.getElementById("donationType").value;

    const quantity =
        document.getElementById("donationQuantity").value;

    const delivery =
        document.getElementById("donationDelivery").value;

    if (!quantity || quantity <= 0) {

        alert("Please enter the quantity you want to donate.");

        return;
    }

    closeModal("donationModal");

    alert(
        `Donation created successfully! 💚\n\n` +
        `Item: ${type}\n` +
        `Quantity: ${quantity}\n` +
        `Method: ${delivery}\n\n` +
        `In the final application, this donation will receive a tracking ID.`
    );
}


/* =========================
   SELL
========================= */

function openSell() {

    document.getElementById("sellModal")
        .classList.add("show");
}


function submitSell() {

    const title =
        document.getElementById("sellTitle").value.trim();

    const category =
        document.getElementById("sellCategory").value;

    const price =
        document.getElementById("sellPrice").value;

    if (!title || !price) {

        alert("Please enter the item name and price.");

        return;
    }

    closeModal("sellModal");

    alert(
        `Your item has been listed! 🏷️\n\n` +
        `${title}\n` +
        `${category}\n` +
        `₹${price}`
    );
}


/* =========================
   VOLUNTEER
========================= */

function joinVolunteer() {

    openLogin();

}


/* =========================
   CLOSE MODAL
========================= */

function closeModal(id) {

    document.getElementById(id)
        .classList.remove("show");
}


/* =========================
   LANGUAGE
========================= */

document
    .getElementById("languageSelect")
    .addEventListener("change", function () {

        alert(
            `Language selected: ${this.value}\n\n` +
            `Multilingual support will be connected to the final application.`
        );

    });


/* =========================
   CLOSE MODAL WHEN CLICKING
   OUTSIDE THE BOX
========================= */

document.querySelectorAll(".modal").forEach(modal => {

    modal.addEventListener("click", function(event) {

        if (event.target === modal) {
            modal.classList.remove("show");
        }

    });

});


/* =========================
   START WEBSITE
========================= */

displayProducts(products);