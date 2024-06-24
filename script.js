let cart = [];
const deliveryFee = 3.50;

function addToCart(id, name, price) {
    let item = document.getElementById(id);
    let extraIngredients = item.querySelectorAll('.extra-ingredient:checked');
    let customization = item.querySelector(`#customization${id.replace('item', '')}`).value;
    let extras = [];
    let totalExtrasPrice = 0;

    extraIngredients.forEach(ingredient => {
        extras.push(ingredient.value);
        totalExtrasPrice += parseFloat(ingredient.dataset.price);
    });

    cart.push({
        id: id,
        name: name,
        price: price,
        extras: extras,
        customization: customization,
        totalPrice: price + totalExtrasPrice
    });

    alert('Item adicionado ao carrinho');
}

function showModal() {
    let modal = document.getElementById("cartModal");
    let cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = '';

    cart.forEach(item => {
        let div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <div class="cart-item-content">
                <span><strong>${item.name}</strong></span>
                <span>Preço: R$${item.price.toFixed(2)}</span>
                <span>Extras: ${item.extras.join(', ') || 'Nenhum'}</span>
                <span>Personalização: ${item.customization || 'Nenhuma'}</span>
                <span>Total: R$${item.totalPrice.toFixed(2)}</span>
            </div>
            <button onclick="removeFromCart('${item.id}')">Remover</button>
        `;
        cartItems.appendChild(div);
    });

    updateCartDisplay();
    modal.style.display = "block";
}

function updateCartDisplay() {
    const cartTotalElement = document.getElementById('cart-total');
    let total = 0;
    cart.forEach(item => {
        total += item.totalPrice;
    });

    const deliveryMethod = document.querySelector('input[name="delivery-method"]:checked');
    const isDelivery = deliveryMethod && deliveryMethod.value === 'delivery';

    if (isDelivery) {
        total += deliveryFee;
        document.getElementById('delivery-fee').style.display = 'block';
    } else {
        document.getElementById('delivery-fee').style.display = 'none';
    }

    cartTotalElement.textContent = total.toFixed(2);
}

function closeModal() {
    let modal = document.getElementById("cartModal");
    modal.style.display = "none";
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    showModal();
}

function toggleAddressFields() {
    const deliveryMethod = document.querySelector('input[name="delivery-method"]:checked');
    const addressContainer = document.getElementById('address-container');
    addressContainer.style.display = deliveryMethod && deliveryMethod.value === 'delivery' ? 'block' : 'none';
    updateCartDisplay();
}

function toggleTrocoField() {
    const paymentMethod = document.getElementById('payment-method').value;
    const trocoContainer = document.getElementById('troco-container');
    trocoContainer.style.display = paymentMethod === 'cash' ? 'block' : 'none';
}

function finalizeOrder() {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const district = document.getElementById('district').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const troco = paymentMethod === 'cash' ? document.getElementById('troco').value : 'N/A';

    const deliveryMethod = document.querySelector('input[name="delivery-method"]:checked').value;
    const isDelivery = deliveryMethod === 'delivery';

    if ((name && address && district && isDelivery) || (name && !isDelivery)) {
        const total = parseFloat(document.getElementById('cart-total').textContent);
        const orderDetails = `Pedido confirmado!\nNome: ${name}\nEndereço: ${address}\nBairro: ${district}\nMétodo de Pagamento: ${paymentMethod}\nTroco: ${troco}\nTotal: R$${total.toFixed(2)}`;
        
         // Enviar mensagem via WhatsApp
         let whatsappNumber = "5532984885431";
        let whatsappMessage = encodeURIComponent(orderDetails);
        window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');

        
        alert(orderDetails);
        cart = [];
        closeModal();
    } else {
        alert('Por favor, preencha todos os campos obrigatórios.');
    }
}