// Shopping Cart Management
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartUI();
    }

    loadCart() {
        const cart = localStorage.getItem('biryaniCart');
        return cart ? JSON.parse(cart) : [];
    }

    saveCart() {
        localStorage.setItem('biryaniCart', JSON.stringify(this.items));
        this.updateCartUI();
    }

    addItem(name, price, emoji) {
        const existingItem = this.items.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                name: name,
                price: parseFloat(price),
                emoji: emoji,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.showAddToCartAnimation();
    }

    removeItem(name) {
        this.items = this.items.filter(item => item.name !== name);
        this.saveCart();
    }

    updateQuantity(name, quantity) {
        const item = this.items.find(item => item.name === name);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(name);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    clearCart() {
        this.items = [];
        this.saveCart();
    }

    updateCartUI() {
        // Update cart badge
        const badge = document.getElementById('cartBadge');
        if (badge) {
            const count = this.getItemCount();
            badge.textContent = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        }

        // Update cart items on order page
        if (document.getElementById('cartItems')) {
            this.renderCartItems();
        }
    }

    renderCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartSummary = document.getElementById('cartSummary');
        
        if (!cartItemsContainer) return;

        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Add some delicious biryani to get started!</p>
                    <button class="btn btn-primary" onclick="window.location.href='index.html#menu'">Browse Menu</button>
                </div>
            `;
            if (cartSummary) cartSummary.style.display = 'none';
            return;
        }

        cartItemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item" data-name="${item.name}">
                <div class="cart-item-emoji">${item.emoji}</div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)} each</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn minus" onclick="cart.updateQuantity('${item.name}', ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" onclick="cart.updateQuantity('${item.name}', ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-item-total">
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <button class="remove-item" onclick="cart.removeItem('${item.name}')" title="Remove item">×</button>
            </div>
        `).join('');

        if (cartSummary) {
            const subtotal = this.getTotal();
            const deliveryFee = 2.99;
            const tax = subtotal * 0.08;
            const total = subtotal + deliveryFee + tax;

            document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('deliveryFee').textContent = `$${deliveryFee.toFixed(2)}`;
            document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
            document.getElementById('total').textContent = `$${total.toFixed(2)}`;
            cartSummary.style.display = 'block';
        }
    }

    showAddToCartAnimation() {
        // This will be called from the main page
        if (typeof showNotification === 'function') {
            showNotification('Item added to cart! 🛒');
        }
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Make cart available globally
window.cart = cart;


