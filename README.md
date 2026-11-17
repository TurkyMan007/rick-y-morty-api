# Archivo del Multiverso

Proyecto de la evaluación Web API (Desarrollo de Videojuegos y Simulación Virtual, PUCV).

## De qué se trata

Es una página que le pide personajes de Rick and Morty a una API y los muestra
en tarjetas. Tiene filtros para buscar por nombre, estado (vivo, muerto, desconocido)
y especie.

## Cómo funciona 

- Al abrir la página, el código le pide los datos a la API con `fetch`.
- La API manda los personajes y yo los guardo en un arreglo.
- Hay una función que arma una tarjeta por cada personaje, así que no escribí
  las tarjetas una por una en el HTML.
- Los filtros no vuelven a llamar a la API, revisan el arreglo que ya tengo guardado
  y muestran solo los que coinciden.
- Solo 7 personajes tienen su foto real. Los demás tienen una foto de perfil por
  defecto, como cuando alguien no se pone foto en WhatsApp.

## Qué usé

- HTML y CSS
- Bootstrap (por CDN) para que se vea ordenado y se adapte al celular
- JavaScript
- Git y GitHub
- Los datos son de [The Rick and Morty API](https://rickandmortyapi.com)

## Carpetas

````
proyecto-web-api/
├── index.html
├── css/        (estilos)
├── js/         (el código que hace todo funcionar)
├── assets/     (la foto de perfil por defecto)
└── README.md
````

## Cómo abrirlo

Abre `index.html` en el navegador. También sirve la extensión Live Server de VS Code.
Se necesita internet porque los datos vienen de la API.

## Uso de IA

Se utilizó Claude para ayudarme con este proyecto. Para ser transparente:
-Hizo la interfaz de usuario
-El JavaScript



## Link de la página

(https://github.com/TurkyMan007/rick-y-morty-api/tree/main)

## Autor

Martín Alonso Márquez
