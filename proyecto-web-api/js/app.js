/* 
   Archivo del Multiverso
   - Consulta la API pública de Rick and Morty
   - Muestra los personajes en pantalla (renderizado)
    */

// ---------- Configuración ----------
const URL_API = "https://rickandmortyapi.com/api/character";
const PAGINAS_A_CARGAR = 3; // 3 páginas x 20 = 60 personajes

// Solo los primeros 7 personajes usan su foto real de la API.
// El resto muestra una foto de perfil por defecto (ahorra descargas).
const MAX_IMAGENES = 7;
const AVATAR_POR_DEFECTO = "assets/avatar-default.svg";

// Traducción de los estados que entrega la API
const ESTADOS = { Alive: "Vivo", Dead: "Muerto", unknown: "Desconocido" };

// ---------- Referencias al DOM ----------
const formulario = document.getElementById("formulario-filtros");
const inputNombre = document.getElementById("filtro-nombre");
const selectEstado = document.getElementById("filtro-estado");
const selectEspecie = document.getElementById("filtro-especie");
const contenedor = document.getElementById("lista-personajes");
const mensaje = document.getElementById("mensaje");
const contador = document.getElementById("contador");

// Aquí se guardan todos los personajes descargados
let personajes = [];

/**
 * Descarga varias páginas de la API en paralelo
 * y devuelve un único arreglo con todos los personajes.
 * @returns {Promise<Array>} lista de personajes
 */
async function obtenerPersonajes() {
  const peticiones = [];

  for (let pagina = 1; pagina <= PAGINAS_A_CARGAR; pagina++) {
    peticiones.push(
      fetch(`${URL_API}?page=${pagina}`).then((resp) => {
        if (!resp.ok) throw new Error(`Error HTTP ${resp.status}`);
        return resp.json();
      })
    );
  }

  const respuestas = await Promise.all(peticiones);
  // Une los "results" de cada página en una sola lista
  return respuestas.flatMap((respuesta) => respuesta.results);
}

/**
 * Crea el HTML de una tarjeta para un personaje.
 * Se usa textContent con los datos de la API para evitar inyectar HTML.
 * @param {Object} personaje - objeto devuelto por la API
 * @returns {HTMLElement} columna de Bootstrap con la tarjeta
 */
function crearTarjeta(personaje) {
  const columna = document.createElement("div");
  columna.className = "col-12 col-sm-6 col-lg-4 col-xl-3";

  const articulo = document.createElement("article");
  articulo.className = "tarjeta";

  // ¿Este personaje está entre los primeros MAX_IMAGENES de la lista completa?
  const tieneFoto = personajes.indexOf(personaje) < MAX_IMAGENES;

  const imagen = document.createElement("img");
  imagen.className = "tarjeta__imagen";
  imagen.loading = "lazy";

  if (tieneFoto) {
    imagen.src = personaje.image;
    imagen.alt = `Retrato de ${personaje.name}`;
  } else {
    imagen.src = AVATAR_POR_DEFECTO;
    imagen.alt = `Foto de perfil por defecto de ${personaje.name}`;
  }

  const cuerpo = document.createElement("div");
  cuerpo.className = "tarjeta__cuerpo";

  const nombre = document.createElement("h3");
  nombre.className = "tarjeta__nombre";
  nombre.textContent = personaje.name;

  const estado = document.createElement("p");
  estado.className = `tarjeta__dato estado estado--${personaje.status.toLowerCase()}`;
  estado.textContent = ESTADOS[personaje.status] || personaje.status;

  const especie = document.createElement("p");
  especie.className = "tarjeta__dato";
  especie.textContent = `Especie: ${personaje.species}`;

  const origen = document.createElement("p");
  origen.className = "tarjeta__dato";
  origen.textContent = `Origen: ${personaje.origin.name}`;

  cuerpo.append(nombre, estado, especie, origen);
  articulo.append(imagen, cuerpo);
  columna.append(articulo);
  return columna;
}

/**
 * Dibuja en pantalla una lista de personajes.
 * Limpia el contenedor y agrega una tarjeta por cada elemento.
 * @param {Array} lista - personajes a mostrar
 */
function mostrarPersonajes(lista) {
  contenedor.innerHTML = "";

  lista.forEach((personaje) => {
    contenedor.appendChild(crearTarjeta(personaje));
  });

  contador.textContent = `${lista.length} de ${personajes.length} personajes`;
  mensaje.textContent = lista.length === 0
    ? "Ningún personaje coincide. Prueba con otro nombre o limpia los filtros."
    : "";
}

/**
 * Filtro dinámico: lee los tres campos del formulario,
 * filtra el arreglo en memoria y vuelve a dibujar el resultado.
 */
function aplicarFiltros() {
  const texto = inputNombre.value.trim().toLowerCase();
  const estado = selectEstado.value;
  const especie = selectEspecie.value;

  const filtrados = personajes.filter((personaje) => {
    const coincideNombre = personaje.name.toLowerCase().includes(texto);
    const coincideEstado = estado === "" || personaje.status === estado;
    const coincideEspecie = especie === "" || personaje.species === especie;
    return coincideNombre && coincideEstado && coincideEspecie;
  });

  mostrarPersonajes(filtrados);
}

/**
 * Llena el selector de especies con las que existen en los datos,
 * sin repetir ninguna y en orden alfabético.
 */
function cargarEspecies() {
  const especies = [...new Set(personajes.map((p) => p.species))].sort();

  especies.forEach((especie) => {
    const opcion = document.createElement("option");
    opcion.value = especie;
    opcion.textContent = especie;
    selectEspecie.appendChild(opcion);
  });
}

/**
 * Punto de entrada: carga los datos y muestra los personajes.
 */
async function iniciar() {
  try {
    personajes = await obtenerPersonajes();
    cargarEspecies();
    mostrarPersonajes(personajes);
  } catch (error) {
    console.error(error);
    mensaje.textContent = "No se pudieron cargar los datos. Revisa tu conexión e inténtalo de nuevo.";
    mensaje.classList.add("mensaje--error");
  }
}

// ---------- Eventos ----------
// Filtra mientras se escribe y cuando cambian los selectores
inputNombre.addEventListener("input", aplicarFiltros);
selectEstado.addEventListener("change", aplicarFiltros);
selectEspecie.addEventListener("change", aplicarFiltros);

// Evita que el formulario recargue la página con Enter
formulario.addEventListener("submit", (evento) => evento.preventDefault());

// Al limpiar, espera a que el formulario se resetee y vuelve a mostrar todo
formulario.addEventListener("reset", () => setTimeout(aplicarFiltros, 0));

iniciar();
