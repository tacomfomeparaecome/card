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
    alert('Pedido confirmado! Em breve, entraremos em contato.');
    closeCartModal();
    cart = [];
    updateCart();
}
