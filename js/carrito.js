/* ==============================================
                    Local storage
================================================== */
document.addEventListener('DOMContentLoaded', e => {
    fetchData()
    console.log('DOM fully loaded and parsed');
    if (localStorage.getItem('carrito')) {
        objetoCarrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
});

/* ==============================================
                    Declaraciones
================================================== */

const items = document.getElementById('items')
const footer = document.getElementById('footer')

const templatePlatos = document.getElementById('platos-template').content
const templateMenu = document.getElementById('menu-template').content
const templateCarrito = document.getElementById('template-carrito').content
const templateFooter = document.getElementById('template-footer').content

const fragment = document.createDocumentFragment()
let objetoCarrito = {}

/* ==============================================
                    Carrito modal
================================================== */

document.getElementById('carrito-abrir').onclick = () => {
    document.getElementById('carrito-container').classList.toggle('active')
}

document.getElementById('carrito-cerrar').onclick = () => {
    document.getElementById('carrito-container').classList.toggle('active')
}

/* ==============================================

================================================== */
const fetchData = async () => {
    const res = await fetch('productos.json');
    const data = await res.json()
    console.log(data)
    filtrado(data)
}

const filtrado = data => {
    let productosPlatos = []
    let productosMenu = []
    // console.log(data);

    data.forEach(e => {
        // console.log(e.categoria);
        if (e.categoria === 'platos') {
            productosPlatos.push(e)
        } else {
            productosMenu.push(e)
        }
    });

    productosPlatos.forEach(item => {
        templatePlatos.querySelector('img').setAttribute('src', item.image)
        templatePlatos.querySelector('h3').textContent = item.title
        templatePlatos.querySelector('span').textContent = item.precio
        templatePlatos.querySelector('.btn').dataset.id = item.id
        const clone = templatePlatos.cloneNode(true)
        fragment.appendChild(clone)
    })

    containerPlatos.appendChild(fragment)

    productosMenu.forEach(item => {
        templateMenu.querySelector('img').setAttribute('src', item.image)
        templateMenu.querySelector('h3').textContent = item.title
        templateMenu.querySelector('span').textContent = item.precio
        templateMenu.querySelector('.btn').dataset.id = item.id
        const clone = templateMenu.cloneNode(true)
        fragment.appendChild(clone)
    })

    containerMenu.appendChild(fragment)
}

containerMenu.addEventListener('click', e => {
    addCarrito(e)
})
containerPlatos.addEventListener('click', e => {
    addCarrito(e)
})

// AGREGAR PRODUCTOS AL CARRITO
const addCarrito = e => {
    // console.log(e.target.classList.contains('btn-add')) // devuelve true si el target contiene la clase 'btn-add'
    if (e.target.classList.contains('btn-add')) {
        setCarrito(e.target.parentElement)
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Agregado al carrito',
            showConfirmButton: false,
            timer: 1000
        })
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    // console.log(objeto);
    const producto = {
        id: objeto.querySelector('button').dataset.id,
        nombre: objeto.querySelector('h3').textContent,
        precio: objeto.querySelector('span').textContent,
        cantidad:1
    }
    if (objetoCarrito.hasOwnProperty(producto.id)) {
        producto.cantidad = objetoCarrito[producto.id].cantidad + 1
    }
    objetoCarrito[producto.id] = {...producto}
    pintarCarrito()
}

const pintarCarrito = () => {
    // console.log(objetoCarrito);
    items.innerHTML = ''
    Object.values(objetoCarrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-sum').dataset.id = producto.id
        templateCarrito.querySelector('.btn-res').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    localStorage.setItem('carrito', JSON.stringify(objetoCarrito))
    pintarFooter()
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(objetoCarrito).length === 0) {
        footer.innerHTML = `
        <th>Carrito vacío - ¡Comience a comprar ahora!</th>
        `
        return
    }

    const nCantidad = Object.values(objetoCarrito).reduce((acc, {cantidad}) => acc + cantidad,0)
    const nPrecio = Object.values(objetoCarrito).reduce((acc,{cantidad,precio}) => acc + cantidad * precio,0)


    templateFooter.querySelectorAll('td')[1].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        objetoCarrito = {}
        pintarCarrito()
    })
}

items.addEventListener('click', e => {
    btnAccion(e)
})

const btnAccion = e => {
    /* ACCION AUMENTAR */
    if (e.target.classList.contains('btn-sum')) {
        const producto = objetoCarrito[e.target.dataset.id]
        producto.cantidad++
        objetoCarrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }

    /* ACCION DISMINUIR */
    if (e.target.classList.contains('btn-res')) {
        const producto = objetoCarrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete objetoCarrito[e.target.dataset.id]
        }

        pintarCarrito()
    }

    e.stopPropagation()
}

/* ==============================================
            FINALIZAR COMPRAR
================================================== */

document.getElementById('finalizar-compra').onclick = () => {

    if (Object.keys(objetoCarrito).length === 0) {
        $('#carrito-container').toggleClass('active');
        $('#carrito-container').delay('700');
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Algo salio Mal!',
            footer: 'Su carrito se encuentra vacío actualmente'
        })
        return
    }

    $('#carrito-container').toggleClass('active');
    $('#finalizarCompra').delay(500)
    $('#finalizarCompra').toggleClass('active');

    //==================================//

    // document.getElementById('carrito-container').classList.toggle('active')
    // $('#finalizarCompra').delay(500)
    // document.getElementById('finalizarCompra').classList.toggle('active')
}

/* ==============================================
            COMPRA FINALIZADA
================================================== */
document.getElementById('btn-finalizar-compra').onclick = () => {

    $('#finalizarCompra').toggleClass('active')
    $('#finalizarCompra').delay(700)
    Swal.fire({
                icon: 'success',
                title: 'Compra Finalizada',
                text: 'Muchas Gracias por utilizar nuestro sistema!'
    })

    objetoCarrito = {}
    pintarCarrito()


    // $('#finalizarCompra').fadeOut(700,()=>{
    //     Swal.fire({
    //         icon: 'success',
    //         title: 'Compra Finalizada',
    //         text: 'Muchas Gracias por utilizar nuestro sistema!'
    //     })

    //     objetoCarrito = {}
    //     pintarCarrito()
    // })
}

/* ==============================================
            COMPRA FINALIZADA - SECTION ORDER
================================================== */
document.getElementById('finalizar-compra-order').onclick = () => {
    Swal.fire({
        icon: 'success',
        title: 'Compra Finalizada',
        text: 'Muchas Gracias por utilizar nuestro sistema! en breve recibira su pedido.'
    })
}

/* ==============================================
                    BUSQUEDA
================================================== */
let x = $('#search-form input').val()
console.log(x);