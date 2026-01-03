// Order Confirmation Page
document.addEventListener('DOMContentLoaded', function() {
    // Get order data from localStorage
    const orderData = JSON.parse(localStorage.getItem('lastOrder'));

    if (!orderData) {
        // If no order data, redirect to home
        window.location.href = 'index.html';
        return;
    }

    // Display order details
    const orderDetailsContainer = document.getElementById('orderDetails');
    
    const orderHTML = `
        <div class="order-info-card">
            <div class="info-row">
                <span class="info-label">Order ID:</span>
                <span class="info-value">${orderData.orderId}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Order Date:</span>
                <span class="info-value">${new Date(orderData.orderDate).toLocaleString()}</span>
            </div>
        </div>

        <div class="order-items-card">
            <h3>Order Items</h3>
            <div class="order-items-list">
                ${orderData.items.map(item => `
                    <div class="order-item-row">
                        <span class="item-emoji">${item.emoji}</span>
                        <span class="item-name">${item.name} × ${item.quantity}</span>
                        <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="order-summary-card">
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span>Subtotal</span>
                <span>$${orderData.totals.subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Delivery Fee</span>
                <span>$${orderData.totals.deliveryFee.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax</span>
                <span>$${orderData.totals.tax.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>Total</span>
                <span>$${orderData.totals.total.toFixed(2)}</span>
            </div>
        </div>

        <div class="customer-info-card">
            <h3>Delivery Details</h3>
            <div class="info-grid">
                <div class="info-item">
                    <strong>Name:</strong> ${orderData.customer.name}
                </div>
                <div class="info-item">
                    <strong>Phone:</strong> ${orderData.customer.phone}
                </div>
                <div class="info-item">
                    <strong>Email:</strong> ${orderData.customer.email}
                </div>
                <div class="info-item full-width">
                    <strong>Address:</strong> ${orderData.customer.address}, ${orderData.customer.city}, ${orderData.customer.zipCode}
                </div>
                <div class="info-item">
                    <strong>Payment:</strong> ${orderData.payment.method.charAt(0).toUpperCase() + orderData.payment.method.slice(1)}
                </div>
                <div class="info-item">
                    <strong>Delivery Time:</strong> ${orderData.delivery.time === 'asap' ? 'As soon as possible' : orderData.delivery.time}
                </div>
            </div>
            ${orderData.delivery.instructions ? `
                <div class="special-instructions">
                    <strong>Special Instructions:</strong> ${orderData.delivery.instructions}
                </div>
            ` : ''}
        </div>
    `;

    orderDetailsContainer.innerHTML = orderHTML;

    // Set delivery time based on preference
    const deliveryTimeElement = document.getElementById('deliveryTime');
    if (orderData.delivery.time === 'asap') {
        deliveryTimeElement.textContent = '30-45 minutes';
    } else if (orderData.delivery.time === '30min') {
        deliveryTimeElement.textContent = '30 minutes';
    } else if (orderData.delivery.time === '1hour') {
        deliveryTimeElement.textContent = '1 hour';
    } else if (orderData.delivery.time === '2hours') {
        deliveryTimeElement.textContent = '2 hours';
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
});


