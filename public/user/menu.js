function increaseQty(button) {
    const input = button.parentElement.getElementsByTagName('input')[0]
    input.value = parseInt(input.value) + 1
}
function decreaseQty(button) {
    const input = button.parentElement.getElementsByTagName('input')[0]
    if (input.value == 1) return
    input.value = parseInt(input.value) - 1

}

function addCart(button) {
    const [item_id, item_name, price, image] = button.id.split('&')
    const qty = button.parentElement.getElementsByTagName('input')[0].value
    if (qty < 0) return;
    if (qty > 50) return;
    let cart = localStorage.getItem('cart')
    if (!cart) cart = {}
    else cart = JSON.parse(cart)

    if (cart[item_id]) {
        cart[item_id]['quantity'] += parseInt(qty)
    } else {
        cart[item_id] = {
            item_name,
            quantity: parseInt(qty),
            price: parseInt(price),
            image,
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart))
}

function createCard(item) {
    return `
    <div class="col-3 gy-3" >
                <div class="card">
                    <img src="${item.image}" class="card-img-top rounded-3 " >
                    <div class="card-body text-center">
                        <h5 class="card-title">${item.item_name}</h5>
                        <p class="card-text">
                             AED ${item.price}
                        </p>

                        <!-- Modal Stuff Starts Here -->
                        <button class="btn btn-primary w-100" data-bs-toggle="modal"
                            data-bs-target="#${item.item_id}">Add</button>

                        <div class="modal fade" id="${item.item_id}" tabindex="-1" aria-labelledby="${item.item_id}Label"
                            aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="container-fluid">
                                            <div class="row">
                                                <div class="col">
                                                    <img src="${item.image}" class="card-img-top rounded-3 w-75">
                                                </div>
                                            </div>
                                            <div class="row py-3">
                                                <h1 class="modal-title fs-5 text-center w-100">${item.item_name}</h1>
                                            </div>
                                            <div class="row">
                                                <p>
                                                ${item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <div class="input-group mb-3">
                                            <button class="btn btn-outline-secondary" onclick="decreaseQty(this)"
                                                type="button">-</button>

                                            <input id='quantity' class="form-control" type="number" value="1" min="1">
                                            <button class="btn btn-outline-secondary" onclick="increaseQty(this)"
                                                type="button">+</button>
                                            <!-- Placing all the Data in the ID , cuz lazy to code more ,  -->
                                            <!-- might be reason code breaks -->
                                            <button id='${item.item_id}&${item.item_name}&${item.price}&${item.image}' type="button"
                                                class="btn btn-primary mx-1" onclick="addCart(this)" data-bs-dismiss="modal">
                                                Add to cart</button>
                                        </div>

                                    </div>

                                </div>
                            </div>

                        </div>
                        <!-- Modal Stuff Ends Here -->
                    </div>
                </div>
            </div>
    `;
}
(async () => {
    const session = await getSession()
    const { data, error } = await client
        .from('menu')
        .select()
    if (error) {
        alert(error.message)
        console.error(error)
        return
    }
    document.getElementById('loadingicon').remove()
    const item_list = document.getElementById('item-list')
    for (const item of data) {
        item_list.innerHTML += createCard(item)
    }

})();