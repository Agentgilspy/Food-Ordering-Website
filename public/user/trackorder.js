const statusMessages = {
    1: 'Order Confirmed',
    2: 'Food is being prepared',
    3: 'Out of delivery',
    4: 'Delivered'
}

function createRow({ order_id, placedAt, cart, status }) {
    // Converts the date object to a 00:00 AM time string
    const time = new Date(placedAt).toLocaleTimeString('en-US',
        { hour12: true, hour: '2-digit', minute: '2-digit' })
    let cartSummary = ''
    // Makes a Cart Summary of Quantity x ItemName
    const items = Object.keys(cart)
    for (const item of items) {
        cartSummary += `${cart[item]['quantity']} x ${cart[item]['item_name']}<br>`
    }
    return `
    <tr>
    <td>${order_id}</td>
    <td>${time}</td>
    <td>${statusMessages[status]}</td>
    <td>${cartSummary}</td>
    </tr >`
}
window.onload = async () => {
    try {
        const session = await getSession()

        const res = await fetch(`/vieworders?access_token=${session.access_token}`)
        const orders = await res.json()

        if (!orders) {
            alert('No Active Orders')
            return location = '/menu'
        }
        const maintable = document.getElementById('main-table')
        const loadingIcon = document.getElementById('loadingicon')
        const tablebody = document.getElementById('tablebody')
        for (const order of orders) {
            tablebody.innerHTML += createRow(order)
        }
        maintable.hidden = false
        loadingIcon.remove()
    } catch (error) {
        alert(error.message)
        console.error(error)
    }
}