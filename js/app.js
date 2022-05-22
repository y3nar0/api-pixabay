const resultado = document.querySelector('#resultado')
const formulario = document.querySelector('#formulario')
const paginacionDiv = document.querySelector('#paginacion')

const registrosPorPagina = 40
let totalPaginas;
let iterador;
let paginaActual = 1

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario)
    // paginacionDiv.addEventListener('click', );
}

function validarFormulario(e) {
    e.preventDefault()

    const terminoBusqueda = document.querySelector('#termino').value

    if(terminoBusqueda === '') {
        mostrarAlerta('Agrega un término de búsqueda')
        return
    }

    buscarImagenes()
}

function mostrarAlerta(mensaje) {

    const existeAlerta = document.querySelector('.bg-red-100')

    if(existeAlerta) {
        const alerta = document.createElement('p')
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center')
    
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `
    
        formulario.appendChild(alerta)
    
        setTimeout(() => {
            alerta.remove()
        }, 2000);
    }

}

function buscarImagenes() {
    const termino = document.querySelector('#termino').value

    const key = '25548716-e2ac5375e758a1262e10d160a'
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`
    // console.log(url);

    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( resultado => {
            // console.log(resultado.hits);

            totalPaginas = calcularPaginas(resultado.totalHits)
            mostrarImagenes(resultado.hits);
        })
}

// Generador que va a registrar la cantidad de elementos de acuerdo a las páginas
function *crearPaginador(total) {
    // console.log(total);
    for (let i=1; i<=total; i++) {
        yield i
    }
}

function mostrarImagenes(imagenes) {
    // console.log(imagenes);
    limpiarHTLM()

    // Iterar sobre el arreglo de imagenes y construir el HTML
    imagenes.forEach(imagen => {
        const { previewURL, likes, views, largeImageURL } = imagen

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 mb-4 p-3">
                <div class="bg-white ">
                    <img class="w-full" src=${previewURL} alt={tags} />
                    <div class="p-4">
                        <p class="card-text">${likes} Me Gusta</p>
                        <p class="card-text">${views} Vistas </p>

                        <a href=${largeImageURL} 
                        rel="noopener noreferrer" 
                        target="_blank" class="bg-blue-800 w-full p-1 block mt-5 rounded text-center font-bold uppercase hover:bg-blue-500 text-white">Ver Imagen</a>
                    </div>
                </div>
            </div>
        `
    });

    // Limpiar el paginador previo
    while(paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild)
    }

    // Generamos el nuevo HTML
    imprimirPaginador()

}

function limpiarHTLM() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}

function calcularPaginas(total) {
    return parseInt( Math.ceil(total / registrosPorPagina) )
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas)
    // console.log(iterador.next().done);

    while(true) {
        const { value, done } = iterador.next()

        if(done) return

        // Caso contrario, genera un botón por cada elemento en el generador
        const boton = document.createElement('a')
        boton.href = '#'
        boton.dataset.pagina = value
        boton.textContent = value
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded')

        boton.onclick = () => {
            paginaActual = value
            // console.log(paginaActual);
            buscarImagenes()
        }

        paginacionDiv.appendChild(boton)
    }
}