var cuerpotblAlumno = "";
var registroAlumno;
var alumnos = [];
var listaAsistencia = [];
var listaAlumnos = [];
var idAlumno;
var idGrupo;
var idMateria;
var listaFiltro = [];

inicializar();

function inicializar() {
    getAllVistaLista();
    getAllGrupos();
    getAllMaterias();
    getAllAlumnos();
}

const cmbAlumnos = document.getElementById('cmbAlumnos');
cmbAlumnos.onchange = function () {
    idAlumno = this.value;
    cambiarListaFiltro();
};

function cambiarListaFiltro() {
    var listaFiltro2 = [];
    listaFiltro.forEach(lista => {
        if (lista.alumno.idAlumno == idAlumno) {
            listaFiltro2.push(lista);
        }
    });
    
    llenarTablaAlumnos(listaFiltro2);
}

const cmbGrupo = document.getElementById('cmbGrupo');
cmbGrupo.onchange = function () {
    idGrupo = this.value;
    filtrarPorGrupo();
    llenarCmbAlumnos();
};

const cmbMateria = document.getElementById('cmbMateria');
cmbMateria.onchange = function () {
    idMateria = this.value;
    filtrarPorMateria();
    //llenarCmbAlumnos();
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
                listaAlumnos = data;
            })
            .catch(error => {
                console.error('Error:', error);
            });
}

function llenarCmbAlumnos() {
    const select = document.getElementById('cmbAlumnos');
    select.innerHTML = '';

    const option = document.createElement('option');
    option.value = '';
    option.text = 'Alumnos';
    option.disabled = true;
    option.selected = true;

    console.log(listaFiltro);
    select.appendChild(option);

    listaAlumnos.forEach(lista => {
        if (lista.grupo.idGrupo == idGrupo) {
            const option = document.createElement('option');
            option.value = lista.idAlumno;
            option.text = lista.nombre + " " + lista.apellido;
            select.appendChild(option);
        }
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

function getAllVistaLista() {
    fetch("../../api/listaAsistencia/getAll", {
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
                listaAsistencia = data;
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
                '<td>' + asistencia.materia.nombre + '</td>' +
                '<td>' + dia + "/" + meses[mes] + "/" + anio + '</td>' +
                '<td>' + asistencia.hora + '</td>' +
                '<td>' + asistencia.asistencia + '</td></tr>';
        cuerpotblAlumno += registroAlumno;
    });

    if (data.length === 0) {
        registroAlumno =
                '<tr>' +
                '<td colspan="5" style="text-align: center;">No hay registros</td>' +
                '<td hidden></td>' +
                '<td hidden></td>' +
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
    listaFiltro = [];
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

    llenarCmbAlumnos(listaFiltro);
    llenarTablaAlumnos(listaFiltro);
}

function filtrarPorGrupo() {
    listaFiltro = [];
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

    llenarCmbAlumnos(listaFiltro);
    llenarTablaAlumnos(listaFiltro);
}

function filtrarPorFechas() {
    listaFiltro = [];
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
        
        console.log("listafiltro************************++")
        llenarTablaAlumnos(listaFiltro);
    }
}


function generarReportePDF() {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const doc = new jsPDF();
    let y = 20;
    const cellWidth = 65;
    const cellHeight = 10;
    const column1X = 20;
    const column2X = column1X + cellWidth;
    const column3X = column2X + 21.9;
    const column4X = column3X + 21.9;
    const pageHeight = doc.internal.pageSize.height; // Altura de la página

    // Encabezado de la tabla
    doc.text(column1X, y, 'REPORTE DE ASISTENCIAS');
    y += 10;

    console.log("listaFiltro************************");
    console.log(listaFiltro);

    if (listaFiltro.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No hay registros',
            confirmButtonText: 'Aceptar'
        });
    } else if (document.getElementById("cmbGrupo").value == "" && document.getElementById("cmbMateria").value == "" && document.getElementById("cmbAlumnos").value == "") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Seleccione un filtro',
            confirmButtonText: 'Aceptar'
        });
    } else {
        let previousAlumnoNombre = '';

        listaFiltro.forEach(asistencia => {
            const partesFecha = asistencia.dia.split('-');
            const anio = parseInt(partesFecha[0]);
            const mes = parseInt(partesFecha[1]) - 1;
            const dia = parseInt(partesFecha[2]);
            const fecha = new Date(anio, mes, dia);
            const diaSemana = fecha.getDay();
            const horaAsistencia = asistencia.hora;

            const fechaTexto = diasSemana[diaSemana] + " " + dia + "/" + meses[mes] + "/" + anio;
            const asistenciaTexto = asistencia.asistencia;
            doc.setFontSize(12);

            if (asistencia.alumno.nombre !== previousAlumnoNombre) {
                if (y >= pageHeight - 20) {
                    doc.addPage();
                    y = 50;
                }
                // Agregar encabezado con el nombre del alumno
                doc.text(column1X, y + 10, 'Reporte de Asistencias - ' + asistencia.alumno.nombre + " " + asistencia.alumno.apellido);
                y += 20; // Ajustar posición vertical
                previousAlumnoNombre = asistencia.alumno.nombre; // Actualizar el nombre del alumno
            }

            if (y >= pageHeight - 20) {
                doc.addPage();
                y = 20;
                doc.text(column1X, 10, 'Reporte de Asistencias - ' + asistencia.alumno.nombre + " " + asistencia.alumno.apellido);
                y += 10;
            }

            doc.rect(column1X, y, cellWidth, cellHeight); // La primera celda es el doble de ancha
            doc.rect(column2X, y, cellWidth / 3, cellHeight); // Las demás celdas son la mitad de ancho
            doc.rect(column3X, y, cellWidth / 3, cellHeight);
            doc.rect(column4X, y, (cellWidth / 2) + 5, cellHeight);

            doc.text(column1X + 2, y + 5, fechaTexto);
            doc.text(column2X + 2, y + 5, asistenciaTexto);
            doc.text(column3X + 2, y + 5, horaAsistencia);
            doc.text(column4X + 2, y + 5, asistencia.materia.nombre);
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
