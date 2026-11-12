'use strict';

// Cada curso incluye información general y un temario que se puede desplegar.
const cursos = [
  {
    codigo: 'HTML',
    nombre: 'HTML y desarrollo web',
    descripcion: 'Aprende a construir la estructura de páginas web con etiquetas, enlaces, imágenes y formularios.',
    nivel: 'Principiante',
    duracion: '4 semanas',
    icono: '</>',
    temario: ['Estructura de un documento HTML', 'Títulos, párrafos, enlaces e imágenes', 'Listas, tablas y formularios', 'Etiquetas semánticas y accesibilidad básica']
  },
  {
    codigo: 'CSS',
    nombre: 'Diseño de páginas con CSS',
    descripcion: 'Da vida a tus páginas con colores, tipografías, Flexbox, Grid y diseños que se adaptan a cada pantalla.',
    nivel: 'Principiante',
    duracion: '5 semanas',
    icono: '#',
    temario: ['Selectores, propiedades y valores', 'Colores, tipografía, márgenes y bordes', 'Distribución con Flexbox y CSS Grid', 'Diseño adaptable con media queries']
  },
  {
    codigo: 'JavaScript',
    nombre: 'Programación con JavaScript',
    descripcion: 'Crea experiencias interactivas usando variables, funciones, eventos y manipulación del DOM.',
    nivel: 'Inicial',
    duracion: '6 semanas',
    icono: 'JS',
    temario: ['Variables, constantes y tipos de datos', 'Condiciones, ciclos y funciones', 'Eventos y validación de formularios', 'Manipulación del DOM y creación de contenido']
  }
];

// Referencias a los elementos HTML que utiliza la aplicación.
const listaCursos = document.querySelector('#listaCursos');
const buscador = document.querySelector('#buscador');
const botonLimpiarBusqueda = document.querySelector('#limpiarBusqueda');
const estadoBusqueda = document.querySelector('#estadoBusqueda');
const estadoAccion = document.querySelector('#estadoAccion');
const contadorCursos = document.querySelector('#contadorCursos');
const textoContador = document.querySelector('#textoContador');
const formulario = document.querySelector('#formulario');
const mensaje = document.querySelector('#mensaje');
const campoNombre = document.querySelector('#nombre');
const campoCorreo = document.querySelector('#correo');
const campoCurso = document.querySelector('#curso');
const campoModalidad = document.querySelector('#modalidad');

/** Normaliza el texto para que la búsqueda no dependa de mayúsculas o tildes. */
function normalizarTexto(texto) {
  return texto
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/** Crea una tarjeta de curso mediante nodos del DOM y texto seguro. */
function crearTarjeta(curso) {
  const tarjeta = document.createElement('article');
  tarjeta.classList.add('tarjeta-curso');
  tarjeta.dataset.curso = curso.codigo;

  const icono = document.createElement('div');
  icono.classList.add('icono-curso');
  icono.setAttribute('aria-hidden', 'true');
  icono.textContent = curso.icono;

  const categoria = document.createElement('span');
  categoria.classList.add('categoria-curso');
  categoria.textContent = `RUTA ${curso.codigo.toUpperCase()}`;

  const titulo = document.createElement('h3');
  titulo.id = `titulo-${curso.codigo.toLowerCase()}`;
  titulo.textContent = curso.nombre;

  const descripcion = document.createElement('p');
  descripcion.classList.add('descripcion-curso');
  descripcion.textContent = curso.descripcion;

  const detalles = document.createElement('div');
  detalles.classList.add('detalle-curso');

  const nivel = document.createElement('span');
  nivel.textContent = `Nivel: ${curso.nivel}`;

  const duracion = document.createElement('span');
  duracion.textContent = `Duración: ${curso.duracion}`;
  detalles.append(nivel, duracion);

  const temario = document.createElement('div');
  temario.classList.add('temario-curso');
  temario.id = `temario-${curso.codigo.toLowerCase()}`;
  temario.hidden = true;

  const tituloTemario = document.createElement('h4');
  tituloTemario.textContent = 'Lo que aprenderás';
  const listaTemario = document.createElement('ul');
  curso.temario.forEach(function (tema) {
    const elemento = document.createElement('li');
    elemento.textContent = tema;
    listaTemario.append(elemento);
  });
  temario.append(tituloTemario, listaTemario);

  const acciones = document.createElement('div');
  acciones.classList.add('acciones-curso');

  const botonTemario = document.createElement('button');
  botonTemario.classList.add('boton-temario');
  botonTemario.type = 'button';
  botonTemario.textContent = 'Ver temario';
  botonTemario.setAttribute('aria-expanded', 'false');
  botonTemario.setAttribute('aria-controls', temario.id);
  botonTemario.addEventListener('click', function () {
    const seEstaMostrando = !temario.hidden;
    temario.hidden = seEstaMostrando;
    botonTemario.setAttribute('aria-expanded', String(!seEstaMostrando));
    botonTemario.textContent = seEstaMostrando ? 'Ver temario' : 'Ocultar temario';
  });

  const botonElegir = document.createElement('button');
  botonElegir.classList.add('boton-elegir');
  botonElegir.type = 'button';
  botonElegir.textContent = 'Elegir este curso';
  botonElegir.addEventListener('click', function () {
    campoCurso.value = curso.codigo;
    estadoAccion.textContent = `Seleccionaste ${curso.nombre}. Completa tus datos para continuar con la inscripción.`;
    document.querySelector('#inscripcion').scrollIntoView({ behavior: 'smooth', block: 'start' });
    campoNombre.focus({ preventScroll: true });
  });

  acciones.append(botonTemario, botonElegir);
  tarjeta.append(icono, categoria, titulo, descripcion, detalles, temario, acciones);
  return tarjeta;
}

/** Renderiza el catálogo, informa resultados y actualiza el contador. */
function mostrarCursos(datos, terminoBusqueda = '') {
  listaCursos.setAttribute('aria-busy', 'true');
  listaCursos.replaceChildren();
  contadorCursos.textContent = String(datos.length);
  textoContador.textContent = datos.length === 1 ? 'curso visible' : 'cursos visibles';

  if (datos.length === 0) {
    const aviso = document.createElement('p');
    aviso.classList.add('sin-resultados');
    aviso.textContent = 'No encontramos cursos con ese nombre. Prueba con HTML, CSS o JavaScript.';
    listaCursos.append(aviso);
    estadoBusqueda.textContent = terminoBusqueda
      ? `No se encontraron cursos para: ${terminoBusqueda}.`
      : 'No hay cursos disponibles para mostrar.';
    listaCursos.setAttribute('aria-busy', 'false');
    return;
  }

  datos.forEach(function (curso) {
    listaCursos.append(crearTarjeta(curso));
  });

  estadoBusqueda.textContent = terminoBusqueda
    ? `Se encontraron ${datos.length} ${datos.length === 1 ? 'curso' : 'cursos'}.`
    : `Se muestran ${datos.length} cursos.`;
  listaCursos.setAttribute('aria-busy', 'false');
}

/** Filtra el catálogo por nombre; admite diferencias de tildes y mayúsculas. */
function buscarCursos() {
  const termino = normalizarTexto(buscador.value);
  const resultados = cursos.filter(function (curso) {
    return normalizarTexto(curso.nombre).includes(termino);
  });
  mostrarCursos(resultados, buscador.value.trim());
}

/** Valida que el nombre tenga al menos tres caracteres útiles. */
function validarNombre() {
  const nombreLimpio = campoNombre.value.trim();
  const tieneContenido = campoNombre.value.length > 0;

  if (tieneContenido && nombreLimpio.length < 3) {
    campoNombre.setCustomValidity('El nombre debe tener al menos 3 caracteres útiles, sin contar espacios externos.');
  } else {
    campoNombre.setCustomValidity('');
  }
}

/** Devuelve una orientación según el curso seleccionado. */
function obtenerMensajeCurso(codigoCurso) {
  const recomendaciones = {
    HTML: 'Comenzarás aprendiendo a organizar el contenido de una página web.',
    CSS: 'Aprenderás a transformar estructuras web en diseños claros y adaptables.',
    JavaScript: 'Darás el paso hacia páginas dinámicas que responden a las acciones del usuario.'
  };
  return recomendaciones[codigoCurso] || 'Pronto podrás comenzar tu ruta de aprendizaje.';
}

/** Muestra la confirmación creando nodos y usando textContent. */
function mostrarConfirmacion(datos) {
  mensaje.replaceChildren();

  const titulo = document.createElement('strong');
  titulo.textContent = `¡Gracias, ${datos.nombre}! Tu inscripción de demostración fue recibida.`;

  const detalle = document.createElement('p');
  detalle.textContent = `Curso: ${datos.cursoNombre}. Modalidad: ${datos.modalidad}. Correo: ${datos.correo}.`;

  const consejo = document.createElement('p');
  consejo.textContent = obtenerMensajeCurso(datos.cursoCodigo);

  const nota = document.createElement('p');
  nota.classList.add('nota-confirmacion');
  nota.textContent = 'Esta confirmación solo se muestra en esta página; los datos no se envían ni se almacenan.';

  mensaje.append(titulo, detalle, consejo, nota);
  mensaje.hidden = false;
  mensaje.focus();
}

// Validación personalizada del nombre mientras el usuario escribe.
campoNombre.addEventListener('input', validarNombre);

// Elimina espacios externos del correo cuando se termina de editar.
campoCorreo.addEventListener('blur', function () {
  campoCorreo.value = campoCorreo.value.trim();
});

// La búsqueda se actualiza al escribir y puede restablecerse con un botón.
buscador.addEventListener('input', buscarCursos);
botonLimpiarBusqueda.addEventListener('click', function () {
  buscador.value = '';
  buscarCursos();
  buscador.focus();
});

// Procesa el formulario únicamente cuando supera las validaciones.
formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();
  validarNombre();

  if (!formulario.checkValidity()) {
    formulario.reportValidity();
    return;
  }

  const datosInscripcion = {
    nombre: campoNombre.value.trim(),
    correo: campoCorreo.value.trim(),
    cursoCodigo: campoCurso.value,
    modalidad: campoModalidad.value,
    cursoNombre: campoCurso.options[campoCurso.selectedIndex].text
  };

  formulario.reset();
  mostrarConfirmacion(datosInscripcion);
});

// Al reiniciar, limpia validaciones personalizadas y el mensaje anterior.
formulario.addEventListener('reset', function () {
  campoNombre.setCustomValidity('');
  mensaje.hidden = true;
  mensaje.replaceChildren();
  estadoAccion.textContent = '';
});

// Carga los tres cursos iniciales al abrir la página.
mostrarCursos(cursos);
