// ===============================
// EMBER & CRUST PIZZERIA
// ===============================

// Cart state
let cart = [];

// ===============================
// ADD TO CART (from card button)
// ===============================
function addToCart(button) {
    const card  = button.closest(".card");
    const name  = card.dataset.name;
    const price = Number(card.dataset.price);

    // Button feedback
    button.disabled = true;
    button.innerHTML = "✅ Added!";
    button.style.background = "#4caf50";

    setTimeout(() => {
        button.disabled = false;
        button.innerHTML = "Add to Cart 🛒";
        button.style.background = "";
    }, 1600);

    // Check existing
    const existing = cart.find(i => i.name === name);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCart();
    updateBadge();

    // Smooth scroll to cart
    document.getElementById("cart-section").scrollIntoView({ behavior: "smooth" });
}

// ===============================
// UPDATE CART DISPLAY
// ===============================
function updateCart() {
    const cartItems   = document.getElementById("cart-items");
    const cartSummary = document.getElementById("cart-summary");
    const cartSubtotal = document.getElementById("cart-subtotal");
    const cartTotal   = document.getElementById("cart-total");

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart-box">
                <div class="empty-icon">🍕</div>
                <p>Your cart is empty.</p>
                <small>Add some delicious pizzas from the menu above!</small>
            </div>`;
        cartSummary.style.display = "none";
        return;
    }

    // Build cart items
    let subtotal = 0;
    cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;

        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <div class="cart-item-info">
                <h4>🍕 ${item.name}</h4>
                <small>₹${item.price} each</small>
            </div>
            <div class="cart-item-right">
                <div class="qty-control">
                    <button class="qty-btn" onclick="changeQty(${index}, -1)">−</button>
                    <span class="qty-count">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                </div>
                <span class="cart-item-price">₹${item.price * item.quantity}</span>
                <button class="remove-btn" onclick="removeItem(${index})">✕ Remove</button>
            </div>
        `;
        cartItems.appendChild(div);
    });

    // Update summary
    cartSubtotal.innerText = subtotal;
    cartTotal.innerText    = subtotal;
    cartSummary.style.display = "block";
}

// ===============================
// QUANTITY CHANGE
// ===============================
function changeQty(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCart();
    updateBadge();
}

// ===============================
// REMOVE ITEM
// ===============================
function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
    updateBadge();
}

// ===============================
// CART BADGE COUNT
// ===============================
function updateBadge() {
    const badge = document.getElementById("cart-badge");
    if (!badge) return;
    const total = cart.reduce((sum, i) => sum + i.quantity, 0);
    if (total > 0) {
        badge.innerText = total;
        badge.style.display = "inline-flex";
    } else {
        badge.style.display = "none";
    }
}

// ===============================
// CLEAR CART
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    const clearBtn = document.getElementById("clear-cart");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            if (cart.length === 0) return;
            if (confirm("Clear all items from cart?")) {
                cart = [];
                updateCart();
                updateBadge();
            }
        });
    }

    // Nav Order → scroll to menu
    const navOrderBtn = document.getElementById("nav-order-btn");
    if (navOrderBtn) {
        navOrderBtn.addEventListener("click", () => {
            document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
        });
    }

    // Visit Order Now → scroll to menu
    const visitOrderBtn = document.getElementById("visit-order-btn");
    if (visitOrderBtn) {
        visitOrderBtn.addEventListener("click", () => {
            document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
        });
    }

    // Show user name in nav if logged in
    try {
        const storedUser = localStorage.getItem("ember_user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            const loginLink = document.getElementById("nav-login-link");
            if (loginLink && user.name) {
                loginLink.innerHTML = `👤 ${user.name}`;
                loginLink.style.background   = "#fff";
                loginLink.style.color        = "#b22222";
                loginLink.style.padding      = "4px 12px";
                loginLink.style.borderRadius = "20px";
                loginLink.style.fontWeight   = "bold";
                loginLink.title = "Logged in";
            }
        }
    } catch (e) {
        console.error(e);
    }
});

// ===============================
// CHECKOUT / PLACE ORDER
// ===============================
function handleCheckout() {
    if (cart.length === 0) return;

    const total    = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const names    = cart.map(i => `${i.name} ×${i.quantity}`).join(", ");
    const modalMsg = document.getElementById("modal-msg");

    if (modalMsg) {
        modalMsg.innerHTML = `<strong>${names}</strong><br>Total: ₹${total}`;
    }

    document.getElementById("orderModal").style.display = "flex";

    // Clear cart after order
    cart = [];
    updateCart();
    updateBadge();
}

function closeOrderModal() {
    document.getElementById("orderModal").style.display = "none";
}
