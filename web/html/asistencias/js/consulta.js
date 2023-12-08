var cuerpotblAlumno = "";
var registroAlumno;
var alumnos = [];
var listaSemana = [];
var semana = 1;
var idMateria;
var idGrupo;
inicializar();

function inicializar() {
    getAllGrupos();
    getAllMaterias();
    //getAllAlumnos();
    getVistaListaPorSemana();
    //getListaAsistencia();
    configureTableFilter(document.getElementById("txtBuscar"), document.getElementById("tablaAlumnos"));
}

function configureTableFilter(textField, table) {
    let rows = table.tBodies[0].rows;
    textField.addEventListener('input', applyFilter);
    function applyFilter(e)
    {
        let search = e.target.value;

        // get terms to filter on 
        let terms = search.split(/\s+/)
                .filter((x) => x.length > 0) // skip empty terms
                .map(x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); // escape regex

        // build pattern/regex
        let pattern = '(' + terms.join('|') + ')';
        let regEx = new RegExp(pattern, 'gi');

        // apply to all rows
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let match = row.textContent.match(regEx);
            row.classList.toggle('hide-row', match == null ||
                    match.length < terms.length);
        }
    }
}

function getVistaListaPorSemana() {
    fetch("../../api/listaAsistencia/getVistaListaPorSemana?semana=" + semana, {
        method: "GET",
        headers: {'Content-Type': 'application/json'}
    })
            .then(response => {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                listaSemana = data;
                llenarTablaAlumnos(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
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

const cmbGrupo = document.getElementById('cmbGrupo');
cmbGrupo.onchange = function () {
    idGrupo = this.value;
    filtrarPorGrupo();
};

const cmbMateria = document.getElementById('cmbMateria');
cmbMateria.onchange = function () {
    idMateria = this.value;
    filtrarPorMateria();
};

const dpFechaInicio = document.getElementById('dpFechaInicio');
const dpFechaFin = document.getElementById('dpFechaFin');

function filtrarPorMateria() {
    var listaSemanaFiltro = [];
    var fechaInicio = document.getElementById('dpFechaInicio').value;
    var fechaFin = document.getElementById('dpFechaFin').value;
    var fechaEstaEnRango;

    if (cmbGrupo.value == "" && fechaInicio == "" && fechaFin == "") {
        listaSemana.forEach(lista => {
            if (lista.materia.idMateria == idMateria) {
                listaSemanaFiltro.push(lista);
            }
        });
    } else if (cmbGrupo.value == "") {
        listaSemana.forEach(lista => {
            fechaEstaEnRango = lista.dia >= fechaInicio && lista.dia <= fechaFin;
            if (lista.materia.idMateria == idMateria &&
                    fechaEstaEnRango == true) {
                listaSemanaFiltro.push(lista);
            }
        });
    } else if (fechaInicio == "" && fechaFin == "") {
        listaSemana.forEach(lista => {
            if (lista.materia.idMateria == idMateria && lista.alumno.grupo.idGrupo == idGrupo) {
                listaSemanaFiltro.push(lista);
            }
        });
    } else {
        listaSemana.forEach(lista => {
            fechaEstaEnRango = lista.dia >= fechaInicio && lista.dia <= fechaFin;
            if (lista.materia.idMateria == idMateria &&
                    lista.alumno.grupo.idGrupo == idGrupo &&
                    fechaEstaEnRango === true) {
                listaSemanaFiltro.push(lista);
            }
        });
    }

    llenarTablaAlumnos(listaSemanaFiltro);
}

function filtrarPorGrupo() {
    var listaSemanaFiltro = [];
    var fechaInicio = document.getElementById('dpFechaInicio').value;
    var fechaFin = document.getElementById('dpFechaFin').value;
    var fechaEstaEnRango;

    if (cmbMateria.value == "" && fechaInicio == "" && fechaFin == "") {
        listaSemana.forEach(lista => {
            if (lista.alumno.grupo.idGrupo == idGrupo) {
                listaSemanaFiltro.push(lista);
            }
        });
    } else if (cmbMateria.value == "") {
        listaSemana.forEach(lista => {
            fechaEstaEnRango = lista.dia >= fechaInicio && lista.dia <= fechaFin;
            if (lista.alumno.grupo.idGrupo == idGrupo &&
                    fechaEstaEnRango == true) {
                listaSemanaFiltro.push(lista);
            }
        });
    } else if (fechaInicio == "" && fechaFin == "") {
        listaSemana.forEach(lista => {
            if (lista.alumno.grupo.idGrupo == idGrupo &&
                    lista.materia.idMateria == idMateria) {
                listaSemanaFiltro.push(lista);
            }
        });
    } else {
        listaSemana.forEach(lista => {
            fechaEstaEnRango = lista.dia >= fechaInicio && lista.dia <= fechaFin;
            if (lista.alumno.grupo.idGrupo == idGrupo &&
                    lista.materia.idMateria == idMateria &&
                    fechaEstaEnRango === true) {
                listaSemanaFiltro.push(lista);
            }
        });
    }

    llenarTablaAlumnos(listaSemanaFiltro);
}

function filtrarPorFechas() {
    var listaSemanaFiltro = [];
    var fechaInicio = document.getElementById('dpFechaInicio').value;
    var fechaFin = document.getElementById('dpFechaFin').value;
    var fechaEstaEnRango;

    if (fechaInicio != "" && fechaFin != "") {
        if (cmbMateria.value == "" && cmbGrupo.value == "") {
            listaSemana.forEach(lista => {
                fechaEstaEnRango = lista.dia >= fechaInicio && lista.dia <= fechaFin;
                if (fechaEstaEnRango == true) {
                    listaSemanaFiltro.push(lista);
                }
            });
        } else if (cmbMateria.value == "") {
            listaSemana.forEach(lista => {
                fechaEstaEnRango = lista.dia >= fechaInicio && lista.dia <= fechaFin;
                if (lista.alumno.grupo.idGrupo == idGrupo &&
                        fechaEstaEnRango == true) {
                    listaSemanaFiltro.push(lista);
                }
            });
        } else if (cmbMateria.value == "") {
            listaSemana.forEach(lista => {
                if (lista.materia.idMateria == idMateria &&
                        fechaEstaEnRango == true) {
                    listaSemanaFiltro.push(lista);
                }
            });
        } else {
            listaSemana.forEach(lista => {
                fechaEstaEnRango = lista.dia >= fechaInicio && lista.dia <= fechaFin;
                if (lista.alumno.grupo.idGrupo == idGrupo &&
                        lista.materia.idMateria == idMateria &&
                        fechaEstaEnRango === true) {
                    listaSemanaFiltro.push(lista);
                }
            });
        }
        llenarTablaAlumnos(listaSemanaFiltro);
    }
}

function getListaAsistencia() {
    fetch("../../api/listaAsistencia/getAll", {
        method: "POST",
        headers: {'Content-Type': 'application/json;charset=UTF-8'}
    })
            .then(response => {
                return response.json();
            })
            .then(function (data) {

            })
            .catch(error => {
                console.error('Error:', error);
            });
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
        body: JSON.stringify({}) // Puedes pasar algún cuerpo si es necesario
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

function getAllAlumnos() {
    fetch("../../api/Alumno/getAll", {
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
                //llenarTablaAlumnos(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
}

function llenarTablaAlumnos(data) {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    data.forEach(asistencia => {
        const partesFecha = asistencia.dia.split('-');
        const anio = parseInt(partesFecha[0]);
        const mes = parseInt(partesFecha[1]) - 1;
        const dia = parseInt(partesFecha[2]);
        const fecha = new Date(anio, mes, dia);
        const diaSemana = fecha.getDay();

        registroAlumno =
                '<tr>' +
                '<td>' + asistencia.alumno.nombre + " " + asistencia.alumno.apellido + '</td>' +
                '<td>' + diasSemana[diaSemana] + " " + dia + "/" + meses[mes] + "/" + anio + '</td>' +
                '<td>' + asistencia.hora + '</td>' +
                '<td>' + asistencia.asistencia + '</td></tr>';
        cuerpotblAlumno += registroAlumno;
    });

    if (data.length === 0) {
        registroAlumno =
                '<tr>' +
                '<td colspan="4" style="text-align: center;">No hay registros</td>' +
                '<td hidden></td>' +
                '<td hidden></td>' +
                '<td hidden></td>' +
                '</tr>';
        cuerpotblAlumno += registroAlumno;
    }

    document.getElementById("tblAlumnos").innerHTML = cuerpotblAlumno;
    cuerpotblAlumno = "";

//    Toma datos de getAllAlumnos
//    alumnos = data;
//
//    alumnos.forEach(alumno => {
//        registroAlumno =
//                '<tr>' +
//                '<td>' + alumno.nombre + " " + alumno.apellido + '</td></tr>';
//        cuerpotblAlumno += registroAlumno;
//    });
//
//    if (alumnos.length == 0) {
//        registroAlumno =
//                '<tr>' +
//                '<td colspan="10">No hay registros</td>' +
//                '<td hidden></td>' +
//                '<td hidden></td>' +
//                '<td hidden></td>' +
//                '</tr>';
//        cuerpotblAlumno += registroAlumno;
//    }
//
//    document.getElementById("tblAlumnos").innerHTML = cuerpotblAlumno;
}

