// ==================================================
// Main JavaScript File
// This file handles:
// - Cart with localStorage
// - Add/remove/update quantity
// - Product search, filter, and sort
// - Product detail rendering
// - Checkout form validation
// ==================================================

// Key used to save cart data in localStorage
const CART_KEY = "novamart_cart";

// ==================================================
// Basic Helper Functions
// ==================================================

// Format product price into currency style
function formatPrice(price) {
  return "$" + price.toFixed(2);
}

// Get cart from localStorage
function getCart() {
  const cartData = localStorage.getItem(CART_KEY);

  if (cartData) {
    return JSON.parse(cartData);
  }

  return [];
}

// Save cart into localStorage
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

// Find product by id from PRODUCTS array
function findProduct(productId) {
  return PRODUCTS.find(function (product) {
    return product.id === productId;
  });
}

// Calculate total number of items in cart
function getCartItemCount() {
  const cart = getCart();

  return cart.reduce(function (total, item) {
    return total + item.quantity;
  }, 0);
}

// Update cart number in navbar
function updateCartCount() {
  const cartCountElement = document.getElementById("cartCount");

  if (cartCountElement) {
    cartCountElement.textContent = getCartItemCount();
  }
}

// Show a simple alert after adding item to cart
function showAddedMessage(productName) {
  alert(productName + " added to cart!");
}

// ==================================================
// Add Product To Cart
// ==================================================

function addToCart(productId, quantity) {
  const product = findProduct(productId);

  if (!product) {
    alert("Product not found.");
    return;
  }

  const cart = getCart();

  // Check if product already exists in cart
  const existingItem = cart.find(function (item) {
    return item.id === productId;
  });

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: productId,
      quantity: quantity
    });
  }

  saveCart(cart);
  showAddedMessage(product.name);
}

// ==================================================
// Product Card HTML
// Used on Home and Shop pages
// ==================================================

function createProductCard(product) {
  return `
    <div class="col-sm-6 col-lg-4">
      <div class="card product-card">
        <div class="product-image">
          ${product.emoji}
        </div>

        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="category-badge">${product.category}</span>
            <span class="rating-text">★ ${product.rating}</span>
          </div>

          <h5 class="card-title">${product.name}</h5>

          <p class="card-text text-muted">
            ${product.shortDescription}
          </p>

          <p class="product-price mt-auto">
            ${formatPrice(product.price)}
          </p>

          <div class="d-flex gap-2">
            <a href="product.html?id=${product.id}" class="btn btn-outline-primary w-50">
              Details
            </a>

            <button class="btn btn-primary w-50" data-add-id="${product.id}">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==================================================
// Home Page
// ==================================================

function initHomePage() {
  const featuredGrid = document.getElementById("featuredGrid");

  if (!featuredGrid) {
    return;
  }

  // Show first 3 products as featured products
  const featuredProducts = PRODUCTS.slice(0, 3);

  featuredGrid.innerHTML = featuredProducts
    .map(function (product) {
      return createProductCard(product);
    })
    .join("");
}

// ==================================================
// Shop Page: Search, Filter, Sort
// ==================================================

function initShopPage() {
  const productsGrid = document.getElementById("productsGrid");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortSelect = document.getElementById("sortSelect");
  const productCount = document.getElementById("productCount");

  if (!productsGrid) {
    return;
  }

  // Render products based on current search/filter/sort
  function renderProducts() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const selectedSort = sortSelect.value;

    let filteredProducts = PRODUCTS.filter(function (product) {
      const matchesSearch = product.name.toLowerCase().includes(searchText);
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sorting logic
    if (selectedSort === "price-low") {
      filteredProducts.sort(function (a, b) {
        return a.price - b.price;
      });
    }

    if (selectedSort === "price-high") {
      filteredProducts.sort(function (a, b) {
        return b.price - a.price;
      });
    }

    if (selectedSort === "name-az") {
      filteredProducts.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    }

    if (selectedSort === "rating-high") {
      filteredProducts.sort(function (a, b) {
        return b.rating - a.rating;
      });
    }

    // Show product count
    productCount.textContent =
      "Showing " + filteredProducts.length + " product(s).";

    // Show message if no products found
    if (filteredProducts.length === 0) {
      productsGrid.innerHTML = `
        <div class="col-12">
          <div class="alert alert-warning">
            No products found. Try another search or category.
          </div>
        </div>
      `;
      return;
    }

    // Display product cards
    productsGrid.innerHTML = filteredProducts
      .map(function (product) {
        return createProductCard(product);
      })
      .join("");
  }

  // Event listeners for live filtering
  searchInput.addEventListener("input", renderProducts);
  categoryFilter.addEventListener("change", renderProducts);
  sortSelect.addEventListener("change", renderProducts);

  // Initial render
  renderProducts();
}

// ==================================================
// Product Detail Page
// ==================================================

function initProductDetailPage() {
  const productDetail = document.getElementById("productDetail");

  if (!productDetail) {
    return;
  }

  // Get product id from URL
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  const product = findProduct(productId);

  if (!product) {
    productDetail.innerHTML = `
      <div class="alert alert-danger">
        Product not found. <a href="shop.html">Go back to shop</a>.
      </div>
    `;
    return;
  }

  // Render product detail
  productDetail.innerHTML = `
    <div class="row g-4 align-items-center">
      <div class="col-lg-6">
        <div class="detail-image">
          ${product.emoji}
        </div>
      </div>

      <div class="col-lg-6">
        <div class="detail-card">
          <span class="category-badge">${product.category}</span>

          <h1 class="fw-bold mt-3">${product.name}</h1>

          <p class="rating-text">★ ${product.rating} Rating</p>

          <p class="lead text-muted">
            ${product.description}
          </p>

          <h2 class="product-price mb-4">
            ${formatPrice(product.price)}
          </h2>

          <label for="detailQty" class="form-label fw-bold">Quantity</label>

          <input
            type="number"
            id="detailQty"
            class="form-control quantity-input mb-3"
            min="1"
            value="1"
          />

          <div class="d-flex gap-3 flex-wrap">
            <button
              class="btn btn-primary btn-lg"
              data-add-id="${product.id}"
              data-qty-input="detailQty"
            >
              Add To Cart
            </button>

            <a href="shop.html" class="btn btn-outline-dark btn-lg">
              Back To Shop
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==================================================
// Cart Page
// ==================================================

function calculateCartTotals() {
  const cart = getCart();

  let subtotal = 0;

  cart.forEach(function (item) {
    const product = findProduct(item.id);

    if (product) {
      subtotal += product.price * item.quantity;
    }
  });

  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  return {
    subtotal: subtotal,
    shipping: shipping,
    total: total
  };
}

function renderCartPage() {
  const cartContent = document.getElementById("cartContent");

  if (!cartContent) {
    return;
  }

  const cart = getCart();

  // Empty cart message
  if (cart.length === 0) {
    cartContent.innerHTML = `
      <div class="text-center py-5">
        <h3>Your cart is empty.</h3>
        <p class="text-muted">Add some products from the shop page.</p>
        <a href="shop.html" class="btn btn-primary">Go To Shop</a>
      </div>
    `;
    return;
  }

  const totals = calculateCartTotals();

  const cartRows = cart
    .map(function (item) {
      const product = findProduct(item.id);

      if (!product) {
        return "";
      }

      const itemTotal = product.price * item.quantity;

      return `
        <tr>
          <td>
            <div class="d-flex align-items-center gap-3">
              <div class="cart-product-icon">${product.emoji}</div>
              <div>
                <strong>${product.name}</strong>
                <div class="text-muted small">${product.category}</div>
              </div>
            </div>
          </td>

          <td>${formatPrice(product.price)}</td>

          <td>
            <div class="d-flex align-items-center gap-2">
              <button class="qty-btn" data-cart-action="decrease" data-id="${product.id}">
                -
              </button>

              <span class="fw-bold">${item.quantity}</span>

              <button class="qty-btn" data-cart-action="increase" data-id="${product.id}">
                +
              </button>
            </div>
          </td>

          <td>${formatPrice(itemTotal)}</td>

          <td>
            <button
              class="btn btn-sm btn-danger"
              data-cart-action="remove"
              data-id="${product.id}"
            >
              Remove
            </button>
          </td>
        </tr>
      `;
    })
    .join("");

  cartContent.innerHTML = `
    <div class="row g-4">
      <div class="col-lg-8">
        <div class="table-responsive">
          <table class="table align-middle">
            <thead class="table-dark">
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              ${cartRows}
            </tbody>
          </table>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="cart-summary">
          <h4 class="fw-bold mb-4">Cart Summary</h4>

          <div class="d-flex justify-content-between mb-2">
            <span>Subtotal</span>
            <strong>${formatPrice(totals.subtotal)}</strong>
          </div>

          <div class="d-flex justify-content-between mb-2">
            <span>Shipping</span>
            <strong>${formatPrice(totals.shipping)}</strong>
          </div>

          <hr />

          <div class="d-flex justify-content-between mb-4">
            <span class="fw-bold">Total</span>
            <strong class="product-price">${formatPrice(totals.total)}</strong>
          </div>

          <a href="checkout.html" class="btn btn-success w-100 mb-2">
            Proceed To Checkout
          </a>

          <a href="shop.html" class="btn btn-outline-primary w-100">
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  `;
}

// Handle cart increase, decrease, and remove
function handleCartAction(action, productId) {
  let cart = getCart();

  const item = cart.find(function (cartItem) {
    return cartItem.id === productId;
  });

  if (!item) {
    return;
  }

  if (action === "increase") {
    item.quantity++;
  }

  if (action === "decrease") {
    item.quantity--;

    if (item.quantity <= 0) {
      cart = cart.filter(function (cartItem) {
        return cartItem.id !== productId;
      });
    }
  }

  if (action === "remove") {
    cart = cart.filter(function (cartItem) {
      return cartItem.id !== productId;
    });
  }

  saveCart(cart);
  renderCartPage();
}

// ==================================================
// Checkout Page
// ==================================================

function renderCheckoutSummary() {
  const checkoutSummary = document.getElementById("checkoutSummary");

  if (!checkoutSummary) {
    return;
  }

  const cart = getCart();

  if (cart.length === 0) {
    checkoutSummary.innerHTML = `
      <div class="alert alert-warning">
        Your cart is empty. Please add products before checkout.
      </div>

      <a href="shop.html" class="btn btn-primary w-100">
        Go To Shop
      </a>
    `;
    return;
  }

  const totals = calculateCartTotals();

  const summaryItems = cart
    .map(function (item) {
      const product = findProduct(item.id);

      if (!product) {
        return "";
      }

      return `
        <div class="checkout-item">
          <div>
            <strong>${product.name}</strong>
            <div class="text-muted small">Qty: ${item.quantity}</div>
          </div>

          <span>${formatPrice(product.price * item.quantity)}</span>
        </div>
      `;
    })
    .join("");

  checkoutSummary.innerHTML = `
    ${summaryItems}

    <div class="mt-4">
      <div class="d-flex justify-content-between mb-2">
        <span>Subtotal</span>
        <strong>${formatPrice(totals.subtotal)}</strong>
      </div>

      <div class="d-flex justify-content-between mb-2">
        <span>Shipping</span>
        <strong>${formatPrice(totals.shipping)}</strong>
      </div>

      <hr />

      <div class="d-flex justify-content-between">
        <span class="fw-bold">Total</span>
        <strong class="product-price">${formatPrice(totals.total)}</strong>
      </div>
    </div>
  `;
}

// Clear all checkout error messages
function clearCheckoutErrors() {
  const errorIds = [
    "fullNameError",
    "emailError",
    "phoneError",
    "addressError",
    "cityError",
    "postalCodeError"
  ];

  errorIds.forEach(function (id) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = "";
    }
  });
}

// Show error under a specific field
function setFieldError(id, message) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = message;
  }
}

// Validate checkout form
function validateCheckoutForm() {
  clearCheckoutErrors();

  let isValid = true;

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const postalCode = document.getElementById("postalCode").value.trim();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^\+?\d[\d\s-]{9,14}$/;

  if (fullName.length < 3) {
    setFieldError("fullNameError", "Full name must be at least 3 characters.");
    isValid = false;
  }

  if (!emailPattern.test(email)) {
    setFieldError("emailError", "Enter a valid email address.");
    isValid = false;
  }

  if (!phonePattern.test(phone)) {
    setFieldError("phoneError", "Enter a valid phone number.");
    isValid = false;
  }

  if (address.length < 8) {
    setFieldError("addressError", "Address must be at least 8 characters.");
    isValid = false;
  }

  if (city.length < 2) {
    setFieldError("cityError", "City is required.");
    isValid = false;
  }

  if (postalCode.length < 4) {
    setFieldError("postalCodeError", "Postal code must be at least 4 characters.");
    isValid = false;
  }

  return isValid;
}

function initCheckoutPage() {
  const checkoutForm = document.getElementById("checkoutForm");
  const checkoutMessage = document.getElementById("checkoutMessage");

  if (!checkoutForm) {
    return;
  }

  renderCheckoutSummary();

  checkoutForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const cart = getCart();

    if (cart.length === 0) {
      checkoutMessage.innerHTML = `
        <div class="alert alert-danger">
          Your cart is empty. Please add products before placing an order.
        </div>
      `;
      return;
    }

    if (!validateCheckoutForm()) {
      checkoutMessage.innerHTML = `
        <div class="alert alert-danger">
          Please fix the form errors before submitting.
        </div>
      `;
      return;
    }

    // UI-only order success.
    // Real payment/order backend is not required for this internship task.
    checkoutMessage.innerHTML = `
      <div class="alert alert-success">
        Order placed successfully! This is a UI-only checkout confirmation.
      </div>
    `;

    // Clear cart after successful order
    localStorage.removeItem(CART_KEY);
    updateCartCount();
    renderCheckoutSummary();
    checkoutForm.reset();
  });
}

// ==================================================
// Global Click Events
// Handles add-to-cart and cart buttons
// ==================================================

document.addEventListener("click", function (event) {
  // Add to cart button
  const addButton = event.target.closest("[data-add-id]");

  if (addButton) {
    const productId = addButton.getAttribute("data-add-id");
    const quantityInputId = addButton.getAttribute("data-qty-input");

    let quantity = 1;

    // If product detail page has quantity input, use that value
    if (quantityInputId) {
      const quantityInput = document.getElementById(quantityInputId);
      quantity = Number(quantityInput.value);

      if (quantity < 1 || isNaN(quantity)) {
        quantity = 1;
      }
    }

    addToCart(productId, quantity);
  }

  // Cart action button
  const cartActionButton = event.target.closest("[data-cart-action]");

  if (cartActionButton) {
    const action = cartActionButton.getAttribute("data-cart-action");
    const productId = cartActionButton.getAttribute("data-id");

    handleCartAction(action, productId);
  }
});

// ==================================================
// Page Initializer
// Runs correct function based on page
// ==================================================

document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();

  const page = document.body.getAttribute("data-page");

  if (page === "home") {
    initHomePage();
  }

  if (page === "shop") {
    initShopPage();
  }

  if (page === "product") {
    initProductDetailPage();
  }

  if (page === "cart") {
    renderCartPage();
  }

  if (page === "checkout") {
    initCheckoutPage();
  }
});