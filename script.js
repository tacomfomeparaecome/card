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

async function finalizeOrder() {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let yOffset = 10;
    doc.text("Pedido Confirmado!", 10, yOffset);
    yOffset += 10;

    cart.forEach(item => {
        doc.text(`Item: ${item.name}`, 10, yOffset);
        yOffset += 10;
        doc.text(`Adicionar: ${item.addIngredients}`, 10, yOffset);
        yOffset += 10;
        doc.text(`Retirar: ${item.removeIngredients}`, 10, yOffset);
        yOffset += 10;
        doc.text(`Preço: R$${item.price.toFixed(2)}`, 10, yOffset);
        yOffset += 10;
    });

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'pedido.pdf';
    link.click();

    const deliveryMethod = document.querySelector('input[name="delivery-method"]:checked').value;
    const address = deliveryMethod === 'delivery' ? document.getElementById('address').value : 'Retirada no local';
    const district = deliveryMethod === 'delivery' ? document.getElementById('district').value : '';
    const name = document.getElementById('name').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const troco = paymentMethod === 'cash' ? document.getElementById('troco').value : '';

    const whatsappMessage = `
        Pedido Confirmado!
        Nome: ${name}
        Método de Recebimento: ${deliveryMethod}
        Endereço: ${address}
        Bairro: ${district}
        Método de Pagamento: ${paymentMethod}
        Troco para: ${troco}
        Total: R$${document.getElementById('cart-total').innerText}
    `;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=5532984885431&text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');

    alert('Pedido confirmado! Em breve, entraremos em contato.');

    closeCartModal();
    cart = [];
    updateCart();
    document.getElementById('order-form').reset();
    document.getElementById('address-container').style.display = 'none';
    document.getElementById('troco-container').style.display = 'none';
}
