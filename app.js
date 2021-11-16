let stockProductos = []
    
 fetch('./stock.json')
     .then( (res) => res.json() )
     .then( (data) => {
        stockProductos = data
         mostrarProductos(stockProductos)
     })


const contenedorProductos = document.getElementById('contenedor-productos')
const contenedorCarrito = document.getElementById('carrito-contenedor')
const selectPrecios = document.getElementById('precios')
const contadorCarrito = document.getElementById('contadorCarrito')
const precioTotal = document.getElementById('precioTotal')
const DOMfinalizarCompra = document.querySelector('#finalizarCompra');
const miLocalStorage = window.localStorage;

let carrito = []


//muestro productos en la pantalla
function mostrarProductos(array) {

    contenedorProductos.innerHTML = ''

    array.forEach( (producto) => {
        const div = document.createElement('div')
        div.classList.add('producto')
        div.innerHTML = `
                    <img src=${producto.img} alt="">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.desc}</p>
                    <p>Cantidad: ${producto.cantidad}</p>
                    <p class="precioProducto">Precio: $${producto.precio}</p>
                    <button onclick=agregarAlCarrito(${producto.id}) class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button>
        `
        
        contenedorProductos.appendChild(div)
    } )
}
//agregar productos al carrito
function agregarAlCarrito(itemId) {

    let itemEnCarrito = carrito.find(el => el.id == itemId)

    if (itemEnCarrito) {
        itemEnCarrito.cantidad += 1
    } else {
        let {id, nombre, precio} = stockProductos.find( el => el.id == itemId )
        carrito.push({id: id, nombre: nombre, precio: precio, cantidad: 1})
    }

    actualizarCarrito()
    guardarCarritoEnLocalStorage ()
}

//eliminar del carrito
function eliminarProducto(id) {
    let productoAEliminar = carrito.find( el => el.id == id )

    productoAEliminar.cantidad=0

    if (productoAEliminar.cantidad == 0) {
        let indice = carrito.indexOf(productoAEliminar)
        carrito.splice(indice, 1)
    }

    console.log(carrito)
    actualizarCarrito()
    guardarCarritoEnLocalStorage ()
}


function actualizarCarrito() {
    contenedorCarrito.innerHTML=''

    carrito.forEach( (producto) => {

        const div = document.createElement('div')
        div.classList.add('productoEnCarrito')
        div.innerHTML = `
                        <p>${producto.nombre}</p>
                        <p>Precio: $${producto.precio * producto.cantidad}</p>
                        <p>Cantidad: ${producto.cantidad}</p>
                        <button onclick=eliminarProducto(${producto.id}) class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
                    `

        contenedorCarrito.appendChild(div)
    })

   var contadorProducto = contadorCarrito.innerText = carrito.reduce( (acc, el) => acc + (el.cantidad /2 + el.cantidad /2), 0 )

    precioTotal.innerText = carrito.reduce( (acc, el) => acc + (el.precio * el.cantidad), 0 )
}

// MERCADO PAGO

const finalizarCompra = async () => {

    const itemsToMP = carrito.map( (prod) => {
        return {
            title: prod.nombre,
            description: "",
            picture_url: "",
            category_id: prod.id,
            quantity: prod.cantidad,
            currency_id: "ARS",
            unit_price: prod.precio
        }
    })

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
                method: 'POST',
                headers: {
                    Authorization: "Bearer TEST-7455881845025495-110405-093d602f9b7da3167bbe71dcccdd5370-535896771"
                },
                body: JSON.stringify({
                    items: itemsToMP,
                    back_urls: {
                        success: window.location.href,
                        failure: window.location.href
                    }

                })
            })
    const data = await response.json()

    window.location.replace(data.init_point)
    localStorage.clear();
}
DOMfinalizarCompra.addEventListener('click', finalizarCompra);


//Local Storage
function guardarCarritoEnLocalStorage () {
    miLocalStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDeLocalStorage () {
    if (miLocalStorage.getItem('carrito') !== null) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
     }
}

//Inicio
cargarCarritoDeLocalStorage();
actualizarCarrito();


//alert compra exitosa
$(document).ready(function(){
    $("#finalizarCompra").click(function finalizarCompra(){
        Swal.fire(
            'Excelente!',
            'Gracias por confiar en nosotros!',
            'success'
          )
    }); 
});

const $form = document.querySelector('#form')
const $buttonMailto = document.querySelector('#trucazo')

    $form.addEventListener('submit', handleSubmit)

    function handleSubmit(event) {
      event.preventDefault()
      const form = new FormData(this)
      $buttonMailto.setAttribute('href', `mailto:arsarquis@gmail.com?subject=nombre ${form.get('name')}  correo ${form.get('email')}&body=${form.get('message')}`)
      $buttonMailto.click()
    }