// Initial Data
const menu = document.querySelector("#menu")
const cartButton = document.querySelector("#cart-btn")
const cartModalOverlay = document.querySelector("#cart-modal-overlay")
const cartItemsContainer = document.querySelector("#cart-items")
const cartTotal = document.querySelector("#cart-total")
const cartCounter = document.querySelector("#cart-count")
const removeButtons = document.querySelectorAll(".remove-cart-btn")
const addressInput = document.querySelector("#address")
const addressWarn = document.querySelector("#address-warn")
const checkoutButton = document.querySelector("#checkout-btn")

let cart = []

// Events
cartButton.addEventListener("click", handleShowModalCart)
cartModalOverlay.addEventListener("click", handleCloseModalCart)
menu.addEventListener("click", handleAddToCart)
cartItemsContainer.addEventListener("click", handleRemoveItemsCart)
addressInput.addEventListener("input", getAddressUser)
checkoutButton.addEventListener("click", finalizeOrder)

removeButtons.forEach((button) => {
  button.addEventListener("click", handleRemoveItemsCart)
})

// Functions
function handleShowModalCart() {
  updateCartModal()
  cartModalOverlay.classList.remove("hidden")
  cartModalOverlay.classList.add("flex")
}

function handleCloseModalCart(event) {
  const isCloseArea = event.target === cartModalOverlay
  if (isCloseArea) {
    cartModalOverlay.classList.remove("flex")
    cartModalOverlay.classList.add("hidden")
  }
}

function handleAddToCart(event) {
  let parentButton = event.target.closest(".add-to-cart-btn")

  if (parentButton) {
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))
    handleCartList(name, price)
  }
}

function handleCartList(name, price) {
  const existingItem = cart.find((item) => item.name === name)

  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.unshift({
      name,
      price,
      quantity: 1,
    })
  }
  updateCartModal()
}

function updateCartModal() {
  cartItemsContainer.innerHTML = ""
  let total = 0

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div")
    cartItemElement.classList.add(
      "separator",
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    )

    cartItemElement.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <h3 class="font-medium">${item.name}</h3>
        <p>Qtd:</> ${item.quantity}</p>
        <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
      </div>

      <button class="remove-cart-btn px-4 py-3 rounded-md hover:bg-red-400 hover:text-white duration-200" 
        data-name="${item.name}">Remover</button>
    </div>
    `

    total += item.price * item.quantity

    cartItemsContainer.appendChild(cartItemElement)
  })

  cartTotal.innerHTML = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
  cartCounter.innerText = cart.length
}

function handleRemoveItemsCart(event) {
  const hasClass = event.target.classList.contains("remove-cart-btn")

  if (hasClass) {
    const name = event.target.getAttribute("data-name")
    removeItemCart(name)
  }
}

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name)

  if (index !== -1) {
    const item = cart[index]

    if (item.quantity > 1) {
      item.quantity -= 1
    } else {
      cart.splice(index, 1)
    }
    updateCartModal()
  }
}
function getAddressUser(event) {
  let inputValue = event.target.value

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
  }
}
function finalizeOrder() {
  const isOpen = checkRestaurantOpen()
  if (!isOpen) {
    Toastify({
      text: "Ops! O restaurante está fechado!",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
    }).showToast()

    return
  }

  if (cart.length === 0) return
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
    return
  }
  const cartItems = cart
    .map((item) => {
      return `${item.name} - Qtd: (${item.quantity}) - Preço: R$ ${item.price} | `
    })
    .join("")

  const message = encodeURIComponent(cartItems)
  const phone = "998152434"
  const newAddress = encodeURIComponent(addressInput.value)

  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${newAddress}`,
    "_blank"
  )

  cart = []
  updateCartModal()
}

function checkRestaurantOpen() {
  const data = new Date()
  const hour = data.getHours()
  return hour >= 18 && hour < 22 // true: restaurante aberto
}

const spanItem = document.querySelector("#date-span")
const isOpen = checkRestaurantOpen()

if (isOpen) {
  spanItem.classList.remove("bg-red-600")
  spanItem.classList.add("bg-green-600")
} else {
  spanItem.classList.remove("bg-green-600")
  spanItem.classList.add("bg-red-600")
}
