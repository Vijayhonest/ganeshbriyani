// Order Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Render cart items
    if (cart) {
        cart.renderCartItems();
    }

    // Payment method toggle
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const cardDetails = document.getElementById('cardDetails');

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'card' || this.value === 'online') {
                cardDetails.style.display = 'block';
                // Make card fields required
                document.getElementById('cardNumber').required = true;
                document.getElementById('expiryDate').required = true;
                document.getElementById('cvv').required = true;
            } else {
                cardDetails.style.display = 'none';
                // Remove required from card fields
                document.getElementById('cardNumber').required = false;
                document.getElementById('expiryDate').required = false;
                document.getElementById('cvv').required = false;
            }
        });
    });

    // Format card number input
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }

    // Format expiry date input
    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    // Format CVV input (numbers only)
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // Form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Check if cart is empty
            if (!cart || cart.items.length === 0) {
                showNotification('Your cart is empty!', 'error');
                return;
            }

            // Get form data
            const formData = new FormData(this);
            const orderData = {
                customer: {
                    name: formData.get('fullName'),
                    phone: formData.get('phone'),
                    email: formData.get('email'),
                    address: formData.get('address'),
                    city: formData.get('city'),
                    zipCode: formData.get('zipCode')
                },
                delivery: {
                    time: formData.get('deliveryTime'),
                    instructions: formData.get('specialInstructions')
                },
                payment: {
                    method: formData.get('payment'),
                    cardNumber: formData.get('cardNumber'),
                    expiryDate: formData.get('expiryDate'),
                    cvv: formData.get('cvv')
                },
                items: cart.items,
                totals: {
                    subtotal: cart.getTotal(),
                    deliveryFee: 2.99,
                    tax: cart.getTotal() * 0.08,
                    total: cart.getTotal() + 2.99 + (cart.getTotal() * 0.08)
                },
                orderDate: new Date().toISOString(),
                orderId: 'ORD-' + Date.now()
            };

            // Save order to localStorage
            localStorage.setItem('lastOrder', JSON.stringify(orderData));

            // Clear cart
            cart.clearCart();

            // Show loading animation
            const submitBtn = document.getElementById('placeOrderBtn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;

            // Simulate order processing
            setTimeout(() => {
                // Redirect to confirmation page
                window.location.href = 'confirmation.html';
            }, 1500);
        });
    }

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    });
});

// Notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#e74c3c' : 'var(--primary-color)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}


