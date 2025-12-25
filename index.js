// ====== DATOS DE PRODUCTOS (ejemplo) ======
const products = [
    {
        id: 1,
        name: "Suéter navideño rojo para dama",
        category: "clothing",
        price: 299,
        rating: 4.8,
        image: "https://via.placeholder.com/200x200?text=Sueter+Navideno"
    },
    {
        id: 2,
        name: "Playera deportiva Smucky hombre",
        category: "clothing",
        price: 199,
        rating: 4.5,
        image: "https://via.placeholder.com/200x200?text=Playera+Smucky"
    },
    {
        id: 3,
        name: "Short deportivo dama Smucky",
        category: "clothing",
        price: 249,
        rating: 4.6,
        image: "https://via.placeholder.com/200x200?text=Short+Smucky"
    },
    {
        id: 4,
        name: "Calcetines deportivos premium (3 pares)",
        category: "clothing",
        price: 149,
        rating: 4.7,
        image: "https://via.placeholder.com/200x200?text=Calcetines"
    },
    {
        id: 5,
        name: "Juego de esferas navideñas doradas",
        category: "navidad",
        price: 189,
        rating: 4.4,
        image: "https://via.placeholder.com/200x200?text=Esferas+Navidenas"
    },
    {
        id: 6,
        name: "Series de luces LED navideñas",
        category: "navidad",
        price: 159,
        rating: 4.9,
        image: "https://via.placeholder.com/200x200?text=Luces+LED"
    },
    {
        id: 7,
        name: "Luces navideñosas para árbol (100 piezas)",
        category: "navidad",
        price: 399,
        rating: 4.2,
        image: "https://via.placeholder.com/200x200?text=Audifonos"
    },
    /*{
        id: 8,
        name: "Balón de fútbol tamaño 5",
        category: "sports",
        price: 259,
        rating: 4.3,
        image: "https://via.placeholder.com/200x200?text=Balon+Futbol"
    },*/
    /*{
        id: 9,
        name: "Libro: Guía de regalos navideños",
        category: "books",
        price: 199,
        rating: 4.1,
        image: "https://via.placeholder.com/200x200?text=Libro"
    }*/
];

// ====== REFERENCIAS A ELEMENTOS DEL DOM ======
const productsGrid = document.getElementById("productsGrid");
const navLinks = document.querySelectorAll(".nav-link");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const sortSelect = document.getElementById("sortSelect");
const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");
const cartModal = document.getElementById("cartModal");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalSpan = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

// ====== ESTADO ======
let currentCategory = "all";
let filteredProducts = [...products];
let cart = [];

// ====== RENDER DE PRODUCTOS ======
function renderProducts(list) {
    productsGrid.innerHTML = "";

    if (list.length === 0) {
        productsGrid.innerHTML = "<p>No se encontraron productos.</p>";
        return;
    }

    list.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <p class="product-rating">⭐ ${product.rating.toFixed(1)}</p>
            <button class="add-to-cart-btn" data-id="${product.id}">
                Agregar al carrito
            </button>
        `;
        productsGrid.appendChild(card);
    });

    attachAddToCartEvents();
}

// ====== AÑADIR EVENTOS A BOTONES "AGREGAR AL CARRITO" ======
function attachAddToCartEvents() {
    const addButtons = document.querySelectorAll(".add-to-cart-btn");
    addButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.dataset.id, 10);
            addToCart(id);
        });
    });
}

// ====== FILTRAR POR CATEGORÍA ======
function filterByCategory(category) {
    currentCategory = category;
    searchInput.value = ""; // limpia búsqueda

    if (category === "all") {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(p => p.category === category);
    }

    applySortAndRender();
}

// ====== BÚSQUEDA ======
function searchProducts() {
    const term = searchInput.value.trim().toLowerCase();

    if (term === "") {
        // si está vacío, mostrar según categoría actual
        filterByCategory(currentCategory);
        return;
    }

    filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(term)
    );

    applySortAndRender();
}

// ====== ORDENAMIENTO ======
function applySortAndRender() {
    let list = [...filteredProducts];

    switch (sortSelect.value) {
        case "price-low":
            list.sort((a, b) => a.price - b.price);
            break;
        case "price-high":
            list.sort((a, b) => b.price - a.price);
            break;
        case "rating":
            list.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // "Más relevante": sin ordenar especial, solo por id
            list.sort((a, b) => a.id - b.id);
            break;
    }

    renderProducts(list);
}

// ====== CARRITO ======
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            qty: 1
        });
    }

    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    // contador
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    cartCount.textContent = totalQty;

    // listado
    cartItemsContainer.innerHTML = "";
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Tu carrito está vacío.</p>";
    } else {
        cart.forEach(item => {
            const div = document.createElement("div");
            div.classList.add("cart-item");
            div.innerHTML = `
                <div class="cart-item-info">
                    <p class="cart-item-title">${item.name}</p>
                    <p class="cart-item-qty">Cantidad: ${item.qty}</p>
                </div>
                <div>
                    <p class="cart-item-subtotal">$${(item.price * item.qty).toFixed(2)}</p>
                    <button class="remove-item-btn" data-id="${item.id}">
                        Eliminar
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(div);
        });

        // eventos de eliminar
        const removeBtns = document.querySelectorAll(".remove-item-btn");
        removeBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.dataset.id, 10);
                removeFromCart(id);
            });
        });
    }

    // total
    const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    cartTotalSpan.textContent = total.toFixed(2);
}

// ====== MODAL DEL CARRITO ======
function openCartModal() {
    cartModal.style.display = "flex";
}

function closeCartModal() {
    cartModal.style.display = "none";
}

// ====== EVENTOS GLOBALES ======
navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();

        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        const category = link.dataset.category || "all";
        filterByCategory(category);
    });
});

searchBtn.addEventListener("click", searchProducts);

searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        searchProducts();
    }
});

sortSelect.addEventListener("change", applySortAndRender);

cartBtn.addEventListener("click", openCartModal);
closeCartBtn.addEventListener("click", closeCartModal);

window.addEventListener("click", (e) => {
    if (e.target === cartModal) {
        closeCartModal();
    }
});

checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    alert("Gracias por tu compra 🧡 (demo). Aquí iría el proceso de pago real.");
});

// ====== INICIO ======
filterByCategory("all");
updateCartUI();
