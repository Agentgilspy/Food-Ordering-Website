



function increaseQty(button) {
    const [item_id] = button.id.split('_')
    const input = button.parentElement.getElementsByTagName('input')[0]
    let qty = parseInt(input.value)
    qty += 1
    if (qty >= 50) return;
    input.value = qty + 1

    let cart = localStorage.getItem('cart')
    cart = JSON.parse(cart)
    cart[item_id]['quantity'] = parseInt(qty)
    localStorage.setItem('cart', JSON.stringify(cart))
    const total = `AED ${qty * cart[item_id]['price']}`

    const pricerow = document.getElementById(`${item_id}_price`)
    pricerow.innerText = total
    updateTotal()

}
function decreaseQty(button) {
    const [item_id] = button.id.split('_')
    const input = button.parentElement.getElementsByTagName('input')[0]
    let qty = parseInt(input.value)
    if (qty <= 1) return;
    input.value = qty - 1
    qty -= 1


    let cart = localStorage.getItem('cart')
    cart = JSON.parse(cart)
    cart[item_id]['quantity'] = parseInt(qty)
    localStorage.setItem('cart', JSON.stringify(cart))
    const total = `AED ${qty * cart[item_id]['price']}`

    const pricerow = document.getElementById(`${item_id}_price`)
    pricerow.innerText = total
    updateTotal()


}

function cartRemove(button) {
    const [item_id] = button.id.split('_')

    let cart = localStorage.getItem('cart')
    cart = JSON.parse(cart)
    delete cart[item_id]

    localStorage.setItem('cart', JSON.stringify(cart))
    // Removes the table row
    button.parentElement.parentElement.remove()
    updateTotal()
}

function updateTotal() {
    const finaltotalprice = document.getElementById('final_total_price')
    const totalprice = document.getElementById('total_price')
    let sum = 0

    let cart = localStorage.getItem('cart')
    cart = JSON.parse(cart) || {}
    const item_ids = Object.keys(cart)

    for (const item_id of item_ids) {
        const { price, quantity } = cart[item_id]
        sum += price * quantity
    }
    totalprice.innerText = `AED ${sum}`
    finaltotalprice.innerText = `Total Price: AED ${sum}`
}
async function placeorder(button) {
    const creditcard = document.getElementById('creditcard').value
    const address = document.getElementById('deliveryaddress').value || 'Default '
    const loadingicon = document.getElementById('loadingicon')
    if (!creditcard && !deliveryaddress) return alert('Please Enter Random Details')
    const cart = JSON.parse(localStorage.getItem('cart'))
    button.hidden = true
    loadingicon.hidden = false

    try {
        const { data, error } = await client.auth.getUser()
        if (error) throw error

        const uid = data.user.id
        const email = data.user.email
        const { order_id } = await (await fetch('/createOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uid,
                cart, address, email
            })
        })).json()

        loadingicon.hidden = true
        const successDiv = document.getElementById('successdiv')
        successDiv.innerHTML = `Your order has been placed you can track it
        <a href="/trackorder?order_id=${order_id}"> here</a>`
        successDiv.hidden = false
        localStorage.removeItem('cart') // To reset the cart

    } catch (error) {
        loadingicon.hidden = true
        const errorDiv = document.getElementById('errordiv')
        errorDiv.innerHTML = `${error.message}`
        errorDiv.hidden = false

    }

}

function createRow({ item_id, item_name, quantity, image, price }) {
    return `
    <tr >
    <th scope="row">
        <img src="${image}" height="60">
    </th>
    <td class=" align-middle">
        <h6 class="m-0">${item_name}</h6>
    </td>
    <td class="text-center align-middle">
        <div class="input-group align-items-center justify-content-center">
            <button id="${item_id}_decrease" class="btn btn-outline-secondary rounded-2"
                onclick="decreaseQty(this)" type="button">-</button>

            <input class="form-control rounded-1" type="number" value="${quantity}"
                min="1" readonly>
            <button id="${item_id}_increase" class="btn btn-outline-secondary rounded-2"
                onclick="increaseQty(this)" type="button">+</button>
        </div>
    </td>
    <td class="text-center align-middle" id="${item_id}_price">AED ${quantity * price}</td>
    <td class="text-center align-middle">
        <button id='${item_id}_remove' type="button"
            class="btn btn-danger mx-1 " onclick="cartRemove(this)">
            Remove
        </button>
    </td>
</tr>
    `
}

window.onload = async () => {
    const session = await getSession()
    const tablebody = document.getElementById('item-list')
    let cart = localStorage.getItem('cart')

    // Making cart an empty object instead of null 
    // to avoid errors
    cart = JSON.parse(cart) || {}
    const item_ids = Object.keys(cart)

    if (item_ids.length == 0) {
        document.getElementById('empty-cart-msg').hidden = false
        document.getElementById('main-table').hidden = true
    }


    for (const item_id of item_ids) {
        // Using the spread operator so i can give an object with item_id
        tablebody.innerHTML += createRow({ item_id, ...cart[item_id] })
    }

    // Brings the total price row to the end of the cart
    const totalprice = document.getElementById('totalprice')
    tablebody.append(totalprice)

    updateTotal()
}

