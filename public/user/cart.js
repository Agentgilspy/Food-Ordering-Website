function increaseQty(button) {
    const [item_id] = button.id.split('&')
    const input = button.parentElement.getElementsByTagName('input')[0]
    let qty = parseInt(input.value)
    input.value = qty + 1
    qty += 1

    if (qty < 0) return;
    if (qty > 50) return;
    let cart = localStorage.getItem('cart')
    cart = JSON.parse(cart)

    cart[item_id]['quantity'] = parseInt(input.value)
    localStorage.setItem('cart', JSON.stringify(cart))

}
function decreaseQty(button) {
    const [item_id] = button.id.split('&')
    const input = button.parentElement.getElementsByTagName('input')[0]
    let qty = parseInt(input.value)
    input.value = qty - 1
    qty -= 1

    if (qty < 0) return;
    if (qty > 50) return;
    let cart = localStorage.getItem('cart')
    cart = JSON.parse(cart)
    cart[item_id]['quantity'] = parseInt(input.value)
    localStorage.setItem('cart', JSON.stringify(cart))


}
function removeCart(button) {
    const [item_id, item_name, image, price] = button.id.split('&')

    let cart = localStorage.getItem('cart')
    JSON.parse(cart)
    delete cart[item_id]

    localStorage.setItem('cart', JSON.stringify(cart))
    // Removes the ancestor row
    button.parentElement.parentElement.parentElement.remove()
}

function createRow({ item_id, item_name, quantity, image, price }) {
    return `
    <div class="row bg-info-subtle py-3">
    <div class="col-2 text-center  ">
        <img class='border  border-primary border-3 rounded-3' src="${image}" height="60">
    </div>
    <div class="col-2 text-center align-items-center justify-content-center  d-flex">
        <p class="m-0">${item_name}</p>
    </div>
    <div class="col-5  d-flex">
        <div class="input-group align-items-center justify-content-center">
            <button id="BG101&decrease" class="btn btn-outline-secondary rounded-2" onclick="decreaseQty(this)"
                type="button">-</button>

            <input id='quantity' class="form-control rounded-1" type="number" value="${quantity}" min="1">
            <button id="BG101&increase" class="btn btn-outline-secondary rounded-2" onclick="increaseQty(this)"
                type="button">+</button>
            <button id='${item_id}&${item_name}&${price}&${image}' type="button"
                class="btn btn-danger mx-1 " onclick="cartRemove(this)">Remove</button>
        </div>
        </div>
    </div>
    `
}

(async () => {
    const session = await getSession()
    const cartContainer = document.getElementById('item-list')
    let cart = localStorage.getItem('cart')
    cart = JSON.parse(cart)

    for (const item_id of Object.keys(cart)) {
        // Using the spread operator so i can give an object with item_id
        cartContainer.innerHTML += createRow({ item_id, ...cart[item_id] })
    }
})();