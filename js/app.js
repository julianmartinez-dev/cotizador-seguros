//Constructores

function Seguro(marca, year, tipoCobertura) {
  this.marca = marca;
  this.year = year;
  this.tipo = tipoCobertura;
}

//Realiza la cotizacion de los datos
Seguro.prototype.cotizarSeguro = function () {
  let valor; //En base a distintos parametros el valor final del seguro cambia
  const base = 2000; //Valor base del seguro
  /*
        1 = Nacional -> +1.15
        2= Asiatico -> 1.05
        3= Europeo -> 1.35
    */

  switch (this.marca) {
    case "1":
      valor = base * 1.15; //+15%
      break;
    case "2":
      valor = base * 1.05; //+5%
      break;
    case "3":
      valor = base * 1.35; //+35%
      break;
    default:
      break;
  }

  //Leer el año - Cada año el costo se reduce un 3% el valor del seguro
  // 1 año - 3%
  // 5 años - 15%
  // 10 años - 30%
  let diferencia = new Date().getFullYear() - this.year; //Calcula los años de antiguedad
  let porcentaje = diferencia * 3; //Calcula el porcentaje a descontar
  let descuento = (valor * porcentaje) / 100;
  valor -= descuento;

  /*
        Si el seguro es basico se le suma un 30%
        Si el seguro es completo se le suma un 50%
    */

  if (this.tipo === "basico") {
    valor = valor * 1.3;
  } else {
    valor = valor * 1.5;
  }

  return valor;
};

function UI() {}

//LLenar opciones del select

UI.prototype.generarOpciones = () => {
  const year = new Date().getFullYear();
  const selectYear = document.querySelector("#year");

  for (let i = year; i > year - 20; i--) {
    let opcion = document.createElement("option");
    opcion.value = i;
    opcion.textContent = i;

    selectYear.appendChild(opcion);
  }
};

UI.prototype.mostrarMensaje = (msj, tipo) => { //Mensaje dinamico, puede ser de error o de exito en base al tipo enviado
  const formulario = document.querySelector("#cotizar-seguro");

  const mensaje = document.createElement("p");
  mensaje.textContent = msj;

  if (tipo === "error") {
    mensaje.classList.add("error");
  } else {
    mensaje.classList.add("correcto");
  }

  mensaje.classList.add("mt-5");

  //Para que no salgan multiples carteles de error verificamos si ya existe
  if (document.querySelectorAll(".error").length === 0) {
    formulario.insertBefore(mensaje, document.querySelector("#resultado"));
  }

  setTimeout(() => { //Luego de 3 segundos eliminamos el mensaje
    mensaje.remove();
  }, 3000);
};

UI.prototype.mostrarResultado = (seguro, total) => {

   const MARCAS = {
     1: "Nacional",
     2: "Asiatico",
     3: "Europeo"
   }

  const {marca, year, tipo } = seguro; //Destructuring del parametro seguro


  const div = document.createElement("div");
  div.setAttribute("id", "div-resultado");
  div.classList.add("mt-10");
  div.innerHTML = `
        <p class="header">Tu resumen</p>
        <p <span class="font-bold">Total:</span> $${total.toFixed(2)}</p>
        <p <span class="font-bold">Modelo:</span> ${MARCAS[marca]}</p>
        <p <span class="font-bold">Año:</span> ${year}</p>
        <p <span class="font-bold">Tipo:</span> ${tipo.toUpperCase()}</p>

    `;
  const resultadoDIV = document.querySelector("#resultado");

  //Mostrar el spinner
  const spinner = document.querySelector("#cargando");
  spinner.style.display = "block";

    setTimeout(() => {
      spinner.style.display = "none"; //Se borra el spinner
      resultadoDIV.appendChild(div); //Se muestra el resultado
    }, 3000);
};

//Instanciar UI
const ui = new UI();

document.addEventListener("DOMContentLoaded", () => {
  ui.generarOpciones(); // LLena el select con los años
});

registrarEventListeners();
function registrarEventListeners() {
  const formulario = document.querySelector("#cotizar-seguro");
  formulario.addEventListener("submit", cotizarSeguro);
}

function cotizarSeguro(e) {
  e.preventDefault();

  //Leer la marca seleccionada
  const marca = document.querySelector("#marca").value;

  //Leer el año seleccionado
  const year = document.querySelector("#year").value;

  //Leer el tipo de cobertura
  const tipo = document.querySelector('input[name="tipo"]:checked').value;

  //Validamos que los campos no esten vacios
  if (marca === "" || year === "" || tipo === "") {
    ui.mostrarMensaje("Todos los campos son necesarios", "error");
    return;
  }
  ui.mostrarMensaje("Cotizando..");

  //Ocultar las cotizaciones previas
  const resultados = document.querySelector('#resultado div');
  if(resultados !== null){
      resultados.remove()
  }

  //Instanciar un seguro
  const seguro = new Seguro(marca, year, tipo);

  //Utilizar el prototype que va a cotizar
  const total = seguro.cotizarSeguro();

  //Mostrar el resultado de la cotizacion

  ui.mostrarResultado(seguro, total);
}
