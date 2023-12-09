var semana = 1;

inicializar();

function inicializar() {
    getAllGrupos();
    getAllMaterias();
}

function llenarCmbGrupo(data) {
    const select = document.getElementById('cmbGrupo');

    data.forEach(grupo => {
        const option = document.createElement('option');
        option.value = grupo.idGrupo;
        option.text = grupo.nombreGrupo;
        select.appendChild(option);
    });
}

function getAllMaterias() {
    fetch("../../api/materia/getAll", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({}) // Puedes pasar algún cuerpo si es necesario
    })
            .then(response => {
                return response.json();
            })
            .then(function (data) {
                llenarCmbMateria(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
}

function llenarCmbMateria(data) {
    const select = document.getElementById('cmbMateria');

    data.forEach(materia => {
        const option = document.createElement('option');
        option.value = materia.idMateria;
        option.text = materia.nombre;
        select.appendChild(option);
    });
}

function getAllGrupos() {
    fetch("../../api/grupo/getAll", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({}) 
    })
            .then(response => {
                return response.json();
            })
            .then(function (data) {
                llenarCmbGrupo(data);
            })
            .catch(error => {
                console.error('Error:', error);
            }
            );
}

const btnSemanaPosterior = document.getElementById('btnSemanaPosterior');
btnSemanaPosterior.addEventListener('click', function () {
    semanaPosterior();
});

const btnSemanaAnterior = document.getElementById('btnSemanaAnterior');
btnSemanaAnterior.addEventListener('click', function () {
    semanaAnterior(); // Llamar a la función semanaAnterior() al hacer clic en el botón
});

var tituloSemana = document.getElementById('tituloSemana');
var tituloParcial = document.getElementById('tituloParcial');

function semanaPosterior() {
    if (semana < 14) {
        semana++;
        tituloSemana.innerHTML = "Semana " + semana;
        if (semana >= 6 && semana <= 10) {
            tituloParcial.innerHTML = "Parcial 2";
        } else if (semana >= 11 && semana <= 14) {
            tituloParcial.innerHTML = "Parcial 3";
        } else {
            tituloParcial.innerHTML = "Parcial 1";
        }
        getVistaListaPorSemana();
    } else {
        semana = 1;
        tituloSemana.innerHTML = "Semana " + semana;
        tituloParcial.innerHTML = "Parcial 1";
        getVistaListaPorSemana();
    }
    cmbMateria.value = "";
    cmbGrupo.value = "";
    agregarAnimacion('siguiente');
    idMateria = 0;
    idGrupo = 0;
    dpFechaInicio.value = "";
    dpFechaFin.value = "";
}

function semanaAnterior() {
    if (semana > 1) {
        semana--;
        tituloSemana.innerHTML = "Semana " + semana;

        if (semana >= 6 && semana <= 10) {
            tituloParcial.innerHTML = "Parcial 2";
        } else if (semana >= 11 && semana <= 14) {
            tituloParcial.innerHTML = "Parcial 3";
        } else {
            tituloParcial.innerHTML = "Parcial 1";
        }
        getVistaListaPorSemana();
    } else {
        semana = 14;
        tituloSemana.innerHTML = "Semana " + semana;
        tituloParcial.innerHTML = "Parcial 3";
        getVistaListaPorSemana();
    }
    cmbMateria.value = "";
    cmbGrupo.value = "";
    agregarAnimacion('anterior');
    idMateria = 0;
    idGrupo = 0;
    dpFechaInicio.value = "";
    dpFechaFin.value = "";
}

function agregarAnimacion(direccion) {
    const tabla = document.getElementById('tablaAlumnos');
    let claseAnimacion = '';

    if (direccion === 'anterior') {
        claseAnimacion = 'animate__animated animate__slideInLeft';
    } else {
        claseAnimacion = 'animate__animated animate__slideInRight';
    }

    tabla.className = claseAnimacion;

    // Esperar a que termine la animación y luego eliminar las clases de animación
    tabla.addEventListener('animationend', function () {
        tabla.className = ''; // Reemplaza por las clases que ya tenga la tabla si es necesario
    }, {once: true});
}
