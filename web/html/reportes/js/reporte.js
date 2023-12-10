var cuerpotblAlumno = "";
var registroAlumno;
var alumnos = [];
var listaAsistencia = [];
var idAlumno;
var idGrupo;
var idMateria;

inicializar();

function inicializar() {
    getAllGrupos();
    getAllMaterias();
    getAllAlumnos();
}

const cmbAlumnos = document.getElementById('cmbAlumnos');
cmbAlumnos.onchange = function () {
    idAlumno = this.value;
    getVistaListaPorAlumno(idAlumno);
};

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

function getAllAlumnos() {
    fetch("../../api/Alumno/getAll", {
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
                llenarCmbAlumnos(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
}

function llenarCmbAlumnos(data) {
    const select = document.getElementById('cmbAlumnos');

    data.forEach(alumno => {
        const option = document.createElement('option');
        option.value = alumno.idAlumno;
        option.text = alumno.nombre + " " + alumno.apellido;
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

function llenarCmbGrupo(data) {
    const select = document.getElementById('cmbGrupo');

    data.forEach(grupo => {
        const option = document.createElement('option');
        option.value = grupo.idGrupo;
        option.text = grupo.nombreGrupo;
        select.appendChild(option);
    });
}

function getVistaListaPorAlumno(idAlumno) {
    fetch("../../api/listaAsistencia/getVistaListaPorAlumno?idAlumno=" + idAlumno, {
        method: "GET",
        headers: {'Content-Type': 'application/json'}
    })
            .then(response => {
                return response.json();
            })
            .then(function (data) {
                listaAsistencia = data;
                llenarTablaAlumnos(data);
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
                '<td>' + diasSemana[diaSemana] + " " + dia + "/" + meses[mes] + "/" + anio + '</td>' +
                '<td>' + asistencia.asistencia + '</td></tr>';
        cuerpotblAlumno += registroAlumno;
    });

    if (data.length === 0) {
        registroAlumno =
                '<tr>' +
                '<td colspan="2" style="text-align: center;">No hay registros</td>' +
                '<td hidden></td>' +
                '</tr>';
        cuerpotblAlumno += registroAlumno;
    }

    document.getElementById("tblAlumnos").innerHTML = cuerpotblAlumno;
    cuerpotblAlumno = "";
}

const dpFechaInicio = document.getElementById('dpFechaInicio');
const dpFechaFin = document.getElementById('dpFechaFin');

function filtrarPorMateria() {
    var listaFiltro = [];
    var fechaInicio = document.getElementById('dpFechaInicio').value;
    var fechaFin = document.getElementById('dpFechaFin').value;
    var fechaEstaEnRango;

    if (cmbGrupo.value == "" && fechaInicio == "" && fechaFin == "") {
        listaAsistencia.forEach(lista => {
            if (lista.materia.idMateria == idMateria) {
                listaFiltro.push(lista);
            }
        });
    } else if (cmbGrupo.value == "") {
        listaAsistencia.forEach(lista => {
            fechaEstaEnRango = lista.dia >= fechaInicio && lista.dia <= fechaFin;
            if (lista.materia.idMateria == idMateria &&
                    fechaEstaEnRango == true) {
                listaFiltro.push(lista);
            }
        });
    } else if (fechaInicio == "" && fechaFin == "") {
        listaAsistencia.forEach(lista => {
            if (lista.materia.idMateria == idMateria && lista.alumno.grupo.idGrupo == idGrupo) {
                listaFiltro.push(lista);
            }
        });
    } else {
        listaAsistencia.forEach(lista => {
            fechaEstaEnRango = lista.dia >= fechaInicio && lista.dia <= fechaFin;
            if (lista.materia.idMateria == idMateria &&
                    lista.alumno.grupo.idGrupo == idGrupo &&
                    fechaEstaEnRango === true) {
                listaFiltro.push(lista);
            }
        });
    }

    llenarTablaAlumnos(listaSemanaFiltro);
    llenarCmbAlumnos(listaFiltro);
}

function filtrarPorGrupo() {
    var listaFiltro = [];
    var fechaInicio = document.getElementById('dpFechaInicio').value;
    var fechaFin = document.getElementById('dpFechaFin').value;
    var fechaEstaEnRango;

    if (cmbMateria.value == "" && fechaInicio == "" && fechaFin == "") {
        listaAsistencia.forEach(lista => {
            if (lista.alumno.grupo.idGrupo == idGrupo) {
                listaFiltro.push(lista);
            }
        });
    } else if (cmbMateria.value == "") {
        listaAsistencia.forEach(lista => {
            fechaEstaEnRango = lista.dia >= fechaInicio && lista.dia <= fechaFin;
            if (lista.alumno.grupo.idGrupo == idGrupo &&
                    fechaEstaEnRango == true) {
                listaFiltro.push(lista);
            }
        });
    } else if (fechaInicio == "" && fechaFin == "") {
        listaAsistencia.forEach(lista => {
            if (lista.alumno.grupo.idGrupo == idGrupo &&
                    lista.materia.idMateria == idMateria) {
                listaFiltro.push(lista);
            }
        });
    } else {
        listaAsistencia.forEach(lista => {
            fechaEstaEnRango = lista.dia >= fechaInicio && lista.dia <= fechaFin;
            if (lista.alumno.grupo.idGrupo == idGrupo &&
                    lista.materia.idMateria == idMateria &&
                    fechaEstaEnRango === true) {
                listaFiltro.push(lista);
            }
        });
    }

    console.log(listaFiltro);
    llenarTablaAlumnos(listaFiltro);
    llenarCmbAlumnos(listaFiltro);
}

function filtrarPorFechas() {
    var listaFiltro = [];
    var fechaInicio = document.getElementById('dpFechaInicio').value;
    var fechaFin = document.getElementById('dpFechaFin').value;
    var fechaEstaEnRango;

    if (fechaInicio != "" && fechaFin != "") {
        if (cmbMateria.value == "" && cmbGrupo.value == "") {
            listaAsistencia.forEach(lista => {
                fechaEstaEnRango = lista.dia >= fechaInicio && lista.dia <= fechaFin;
                if (fechaEstaEnRango == true) {
                    listaFiltro.push(lista);
                }
            });
        } else if (cmbMateria.value == "") {
            listaAsistencia.forEach(lista => {
                fechaEstaEnRango = lista.dia >= fechaInicio && lista.dia <= fechaFin;
                if (lista.alumno.grupo.idGrupo == idGrupo &&
                        fechaEstaEnRango == true) {
                    listaFiltro.push(lista);
                }
            });
        } else if (cmbMateria.value == "") {
            listaAsistencia.forEach(lista => {
                if (lista.materia.idMateria == idMateria &&
                        fechaEstaEnRango == true) {
                    listaFiltro.push(lista);
                }
            });
        } else {
            listaAsistencia.forEach(lista => {
                fechaEstaEnRango = lista.dia >= fechaInicio && lista.dia <= fechaFin;
                if (lista.alumno.grupo.idGrupo == idGrupo &&
                        lista.materia.idMateria == idMateria &&
                        fechaEstaEnRango === true) {
                    listaFiltro.push(lista);
                }
            });
        }
        llenarTablaAlumnos(listaFiltro);
    }
}

function generarReportePDF() {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const doc = new jsPDF();
    let y = 20;
    const cellWidth = 85;
    const cellHeight = 10;
    const column1X = 20;
    const column2X = column1X + cellWidth + 10;
    const pageHeight = doc.internal.pageSize.height; // Altura de la página

    // Encabezado de la tabla
    doc.text(column1X, 10, 'Reporte de Asistencias - ' + listaAsistencia[1].alumno.nombre + " " + listaAsistencia[1].alumno.apellido);
    doc.text(column1X, y, 'Fecha de Asistencia');
    doc.text(column2X, y, 'Asistencia');
    y += 10;

    if (listaAsistencia.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Llene todos los campos',
            confirmButtonText: 'Aceptar'
        });
    } else {
        listaAsistencia.forEach(asistencia => {
            const partesFecha = asistencia.dia.split('-');
            const anio = parseInt(partesFecha[0]);
            const mes = parseInt(partesFecha[1]) - 1;
            const dia = parseInt(partesFecha[2]);
            const fecha = new Date(anio, mes, dia);
            const diaSemana = fecha.getDay();

            const fechaTexto = diasSemana[diaSemana] + " " + dia + "/" + meses[mes] + "/" + anio;
            const asistenciaTexto = asistencia.asistencia;

            if (y >= pageHeight - 20) {
                doc.addPage();
                y = 20;
                doc.text(column1X, 10, 'Reporte de Asistencias - ' + listaAsistencia[1].alumno.nombre + " " + listaAsistencia[1].alumno.apellido);
                doc.text(column1X, y, 'Fecha de Asistencia');
                doc.text(column2X, y, 'Asistencia');
                y += 10;
            }

            doc.rect(column1X, y, cellWidth, cellHeight);
            doc.rect(column2X, y, cellWidth, cellHeight);
            doc.text(column1X + 2, y + 5, fechaTexto);
            doc.text(column2X + 2, y + 5, asistenciaTexto);
            y += 10;
        });

        doc.save('reporte_asistencias.pdf');
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Se generó el reporte correctamente.'
        });
    }
}
