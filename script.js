let cart = [];
let currentItem = null;
let basePrice = 0;

function openCustomizationModal(itemId, itemName, itemPrice) {
    currentItem = { id: itemId, name: itemName, price: itemPrice, addIngredients: '', removeIngredients: '' };
    basePrice = itemPrice;
    document.getElementById('customizationDetails').innerText = `Personalizando: ${itemName} - R$${itemPrice.toFixed(2)}`;
    document.getElementById('removeIngredients').value = '';
    document.getElementById('customizationTotal').innerText = itemPrice.toFixed(2);
    document.getElementById('customizationModal').style.display = 'block';

    const addIngredients = document.getElementsByName('addIngredient');
    addIngredients.forEach(radio => {
        radio.checked = false;
        radio.addEventListener('change', updateCustomizationTotal);
    });
}

function closeCustomizationModal() {
    document.getElementById('customizationModal').style.display = 'none';
}

function updateCustomizationTotal() {
    let total = basePrice;
    const addIngredients = document.getElementsByName('addIngredient');
    addIngredients.forEach(radio => {
        if (radio.checked) {
            total += parseFloat(radio.getAttribute('data-price'));
        }
    });
    document.getElementById('customizationTotal').innerText = total.toFixed(2);
}

function addToCart() {
    const addIngredients = document.getElementsByName('addIngredient');
    let selectedAddIngredients = [];
    addIngredients.forEach(radio => {
        if (radio.checked) {
            selectedAddIngredients.push(radio.value);
        }
    });
    currentItem.addIngredients = selectedAddIngredients.join(', ');
    currentItem.removeIngredients = document.getElementById('removeIngredients').value;
    currentItem.price = parseFloat(document.getElementById('customizationTotal').innerText);
    cart.push(currentItem);
    closeCustomizationModal();
    updateCart();
}

function updateCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    cartItemsDiv.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <p>${item.name}</p>
            <p>Adicionar: ${item.addIngredients}</p>
            <p>Retirar: ${item.removeIngredients}</p>
            <p>Preço: R$${item.price.toFixed(2)}</p>
        `;
        cartItemsDiv.appendChild(itemDiv);
        total += item.price;
    });

    document.getElementById('cart-total').innerText = total.toFixed(2);
}

function showCartModal() {
    document.getElementById('cartModal').style.display = 'block';
}

function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

function toggleAddressFields() {
    const addressContainer = document.getElementById('address-container');
    const deliveryMethod = document.querySelector('input[name="delivery-method"]:checked').value;
    if (deliveryMethod === 'delivery') {
        addressContainer.style.display = 'block';
        document.getElementById('delivery-fee').style.display = 'block';
    } else {
        addressContainer.style.display = 'none';
        document.getElementById('delivery-fee').style.display = 'none';
    }
}

function toggleTrocoField() {
    const paymentMethod = document.getElementById('payment-method').value;
    const trocoContainer = document.getElementById('troco-container');
    if (paymentMethod === 'cash') {
        trocoContainer.style.display = 'block';
    } else {
        trocoContainer.style.display = 'none';
    }
}

function finalizeOrder() {
    // Gerar a mensagem do pedido
    let message = 'Pedido confirmado!\n\n';
    cart.forEach(item => {
        message += `Produto: ${item.name}\n`;
        message += `Adicionar: ${item.addIngredients}\n`;
        message += `Retirar: ${item.removeIngredients}\n`;
        message += `Preço: R$${item.price.toFixed(2)}\n\n`;
    });
    const total = document.getElementById('cart-total').innerText;
    message += `Total: R$${total}\n\n`;

    // Adicionar informações de entrega ou retirada
    const deliveryMethod = document.querySelector('input[name="delivery-method"]:checked').value;
    if (deliveryMethod === 'delivery') {
        const customerName = document.getElementById('customer-name').value;
        const customerAddress = document.getElementById('customer-address').value;
        const customerPhone = document.getElementById('customer-phone').value;
        message += `Informações de Entrega:\nNome: ${customerName}\nEndereço: ${customerAddress}\nTelefone: ${customerPhone}\n`;
    } else {
        const customerName = document.getElementById('customer-name').value;
        message += `Informações de Retirada:\nNome: ${customerName}\n`;
    }

    // Redirecionar para o WhatsApp com a mensagem
    const whatsappUrl = `https://wa.me/5532984885431?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Resetar carrinho e dados do cliente
    cart = [];
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-address').value = '';
    document.getElementById('customer-phone').value = '';
    document.querySelector('input[name="delivery-method"]:checked').checked = false;
    document.getElementById('payment-method').value = '';
    document.getElementById('removeIngredients').value = '';
    const addIngredients = document.getElementsByName('addIngredient');
    addIngredients.forEach(radio => {
        radio.checked = false;
    });
    document.getElementById('troco-container').style.display = 'none';
    document.getElementById('address-container').style.display = 'none';
    document.getElementById('delivery-fee').style.display = 'none';
    updateCart();

    closeCartModal();
    alert('Pedido confirmado! Em breve, entraremos em contato.');
}
