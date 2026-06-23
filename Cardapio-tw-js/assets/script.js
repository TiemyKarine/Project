const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById ("modal-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address-input");
const addressWarn = document.getElementById("address-warn");

let cart = [];

//Abrir do carrinho
cartBtn.addEventListener("click", function(){
    cartModal.style.display = "flex" ;
    updateCartModal();
});


//Fechar do carrinho
cartModal.addEventListener("click", (event) => {
    if(event.target === cartModal){
        cartModal.style.display = "none";
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none";
})


menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name,price)
    }
});


//Add no carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.quantity += 1;
    }else{

    cart.push({
        name,
        price,
        quantity: 1
    })

    }

    updateCartModal()
}

function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between w-full">
            <div>
                <p class="font-medium"> ${item.name}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                <p> Qtd: ${item.quantity}</p>
            </div>

                <button class="remove-from-cart-btn text-red-500 hover:text-red-700 font-medium data-name="${item.name}">
                    Remover
                </button>
            
        </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    });

    if (cartCounter) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCounter.textContent = totalItems;
    }

    cartCounter.innerHTML = cart.length;
}

cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

    removeItemCart(name);
    }
})

function removeItemsCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }

}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

//finalizar pedido
checkoutBtn.addEventListener("click", function(){
    const isOpen = checkRestaurentOpen();
    if(!isOpen){
    Toastify({
        text: "Ops o restaurante está fechado!!",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top",
        position: "left", 
        stopOnFocus: true, 
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function(){} 
}).showToast(); 

    return;
    
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }



//Enviar o pedido
const  cartItems = cart.map((item) => {
    return(
        `${item.name} Quatidade: (${item.quantity}) Preço: R$${item.price} | `
    )
}).join("");

    const message = encodeURIComponent(`${cartItems} Endereço:${addressInput.value}`);
    const phone = "11945855834"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();
})


//verificar a horario de funcionario (17h a 23h)
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 17 && hora < 23;

}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}

