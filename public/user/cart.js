



function increaseQty(button) {
    // Gets the item id from the elementid then gets the qty value from the input element
    // Adds 1 to it
    const [item_id] = button.id.split('_')
    const input = button.parentElement.getElementsByTagName('input')[0]
    let qty = parseInt(input.value)
    qty += 1
    if (qty >= 50) return;
    input.value = qty + 1

    // Fetches the cart from the localstorage then updates the quantity
    let cart = localStorage.getItem('cart')
    cart = JSON.parse(cart)
    cart[item_id]['quantity'] = parseInt(qty)
    localStorage.setItem('cart', JSON.stringify(cart))
    // Updating the total price to match the quantity
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

    // Fetches the cart from localstorage and deletes the item from it
    let cart = localStorage.getItem('cart')
    cart = JSON.parse(cart)
    delete cart[item_id]
    localStorage.setItem('cart', JSON.stringify(cart))
    // Removes the table row of the item
    button.parentElement.parentElement.remove()
    // Updating the total price 
    updateTotal()
}

function updateTotal() {
    // Gets the elements which display the total prices 
    const finaltotalprice = document.getElementById('final_total_price')
    const totalprice = document.getElementById('total_price')
    // Fetches the cart and iterates through all the items
    // (price & quantity) to calculate the total sum
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
    // Gets the credit card and address from the input elements
    // The Credit card infois not processed here, its just used as an payment example
    const creditcard = document.getElementById('creditcard').value
    const address = document.getElementById('deliveryaddress').value || 'Default '
    // We use a loading effect here since sending requests to the server
    // will take time
    const loadingicon = document.getElementById('loadingicon')
    if (!creditcard && !deliveryaddress) return alert('Please Enter Random Details')
    const cart = JSON.parse(localStorage.getItem('cart'))
    button.hidden = true // Hiding the button so the user cant click it again
    loadingicon.hidden = false

    try {
        // Get the session of the current logged in user and get  
        // the access token of the session  this is used to verify
        // the identity of the user making the request on the backend
        const { data, error } = await client.auth.getSession()
        const { access_token } = data.session
        if (error) throw error
        // Sends a POST Request with access_token in the request query
        // and cart and address in the request body
        const { order_id } = await (await fetch(`/createOrder?access_token=${access_token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cart, address
            })
        })).json()
        // The server should respond with the orderid which is then displayed
        // otherwise the code in the catch {} runs if there was an error
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
    await getSession()
    const tablebody = document.getElementById('item-list')
    // Fetching the cart from local storage , which was made in the menu page
    let cart = localStorage.getItem('cart')

    // Making cart an empty object instead of null to avoid errors
    cart = JSON.parse(cart) || {}
    const item_ids = Object.keys(cart)
    // Using DOM manipulation to remove the empty cart message 
    // and show the actual cart table
    if (item_ids.length == 0) {
        document.getElementById('empty-cart-msg').hidden = false
        document.getElementById('main-table').hidden = true
    }
    for (const item_id of item_ids) {
        // Using the spread operator so i can also add item_id along with the item object
        tablebody.innerHTML += createRow({ item_id, ...cart[item_id] })
    }
    // Brings the total price row to the end of the table
    const totalprice = document.getElementById('totalprice')
    tablebody.append(totalprice)
    updateTotal()
}

