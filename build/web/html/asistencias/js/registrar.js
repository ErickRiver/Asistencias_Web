var cuerpotblAlumno = "";
var registroAlumno;
var alumnos = [];
var listaSemana = [];
var semana = 1;
var idMateria;
var idGrupo;
var listaDatosTabla = [];
var listaAlumnos = [];
const cmbGrupo = document.getElementById('cmbGrupo');
const cmbMateria = document.getElementById('cmbMateria');

inicializar();

function inicializar() {
    getAllGrupos();
    getAllMaterias();
    getVistaListaPorSemana();

    configureTableFilter(document.getElementById("txtBuscar"), document.getElementById("tablaAlumnos"));
}

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
                llenarCmbAlumnos(listaAlumnos);
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

    select.appendChild(option);

    listaAlumnos.forEach(lista => {
        const option = document.createElement('option');
        option.value = lista.idAlumno;
        option.text = lista.nombre + " " + lista.apellido;
        select.appendChild(option);
    });
}

function getAllDocentes() {
    fetch("../../api/docente/getAll", {
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
                llenarCmbDocente(data);
            })
            .catch(error => {
                console.error('Error:', error);
            }
            );
}

function llenarCmbDocente(data) {
    const select = document.getElementById('cmbDocente');
    data.forEach(docente => {
        const option = document.createElement('option');
        option.value = docente.idDocente;
        option.text = docente.nombre + " " + docente.apellido;
        select.appendChild(option);
    });
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
                listaSemana = data;
                llenarTablaAlumnos(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
}

function getVistaListaPorSemana2() {
    fetch("../../api/listaAsistencia/getVistaListaPorSemana?semana=" + semana, {
        method: "GET",
        headers: {'Content-Type': 'application/json'}
    })
            .then(response => {
                return response.json();
            })
            .then(function (data) {
                listaSemana = data;
                if (idGrupo == null && idMateria == null) {
                    llenarTablaAlumnos(listaSemana);
                } else if (idGrupo != null) {
                    cmbGrupo.value = idGrupo;
                    filtrarPorGrupo();
                } else if (idMateria != null) {
                    cmbMateria.value = idMateria;
                    filtrarPorMateria();
                } else {
                    cmbGrupo.value = idGrupo;
                    cmbMateria.value = idMateria;

                    filtrarPorGrupo();
                    filtrarPorMateria();
                }
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


cmbGrupo.onchange = function () {
    idGrupo = this.value;
    filtrarPorGrupo();
};

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

function getAllMaterias2() {
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
                llenarCmbMateria2(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
}

function llenarCmbMateria2(data) {
    const select = document.getElementById('cmbMateria2');

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

function llenarTablaAlumnos(data) {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    listaDatosTabla = data;
    data.forEach(asistencia => {
        const partesFecha = asistencia.dia.split('-');
        const anio = parseInt(partesFecha[0]);
        const mes = parseInt(partesFecha[1]) - 1;
        const dia = parseInt(partesFecha[2]);
        const fecha = new Date(anio, mes, dia);
        const diaSemana = fecha.getDay();

        registroAlumno =
                '<tr onclick="mostrarMensaje(' + (asistencia.idListaAsistencia) + ');" >' +
                '<td>' + asistencia.alumno.nombre + " " + asistencia.alumno.apellido + '</td>' +
                '<td>' + asistencia.materia.nombre + '</td>' +
                '<td>' + diasSemana[diaSemana] + " " + dia + "/" + meses[mes] + "/" + anio + '</td>' +
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

function mostrarMensaje(idListaAsistencia) {
    const asis = listaDatosTabla.find(item => item.idListaAsistencia === idListaAsistencia);

    Swal.fire({
        icon: 'warning',
        title: '¿Quieres modificar la asistencia?',
        html: `<select id="selectAsistencia">
                    <option value="A">Asistió</option>
                    <option value="F">Falta</option>
                    <option value="R">Retardo</option>
                    <option value="J">Justificada</option>
                </select>`,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            const selectValue = document.getElementById('selectAsistencia').value;

            if (selectValue === 'J' && localStorage.getItem('rol') == "docente") {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No tiene los permisos necesarios',
                    showConfirmButton: false,
                    timer: 2000 // Tiempo en milisegundos para que se cierre automáticamente
                });

            } else {
                datos = {
                    idListaAsistencia: asis.idListaAsistencia,
                    asistencia: selectValue
                };

                params = new URLSearchParams(datos);
                fetch("../../api/listaAsistencia/update?",
                        {
                            method: "POST",
                            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                            body: params
                        })
                        .then(response => {
                            return response.json();
                        })
                        .then(function (data) {
                            const Toast = Swal.mixin({
                                toast: true,
                                position: "top-end",
                                showConfirmButton: false,
                                timer: 3000,
                                timerProgressBar: true,
                                didOpen: (toast) => {
                                    toast.onmouseenter = Swal.stopTimer;
                                    toast.onmouseleave = Swal.resumeTimer;
                                }
                            });
                            Toast.fire({
                                icon: "success",
                                title: "La asistencia se modifico correctamente"
                            });

                            getVistaListaPorSemana2();
                        })
                        .catch(error => {
                            const Toast = Swal.mixin({
                                toast: true,
                                position: "top-end",
                                showConfirmButton: false,
                                timer: 3000,
                                timerProgressBar: true,
                                didOpen: (toast) => {
                                    toast.onmouseenter = Swal.stopTimer;
                                    toast.onmouseleave = Swal.resumeTimer;
                                }
                            });
                            Toast.fire({
                                icon: "error",
                                title: "Ocurrio un error    "
                            });
                            console.error('Error:', error);
                        });
            }
        }
    });
}

function saveAsistencia() {
    getAllDocentes();
    getAllMaterias2();
    getAllAlumnos();

    Swal.fire({
        title: 'Registrar nueva asistencia',
        html:
                '<p>Semana ' + semana + '</p>' +
                '<div class="contenedor-cmb" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">' +
                '<select id="cmbAlumnos" name="cmbAlumnos" title="cmbAlumnos" style="border: none; border-bottom: 1px solid black; outline: none; max-width: 250px; width: 100%; height: 30px;">' +
                '<option value="" disabled selected>Alumno</option>' +
                '</select>' +
                '</div>' +
                '<div class="contenedor-cmb" style="display: flex; flex-direction: column; margin-block: 20px; justify-content: center; align-items: center;">' +
                '<select id="cmbDocente" name="cmbDocente" title="cmbDocente" style="border: none; border-bottom: 1px solid black; outline: none; max-width: 250px; width: 100%; height: 30px;">' +
                '<option value="" disabled selected>Docente</option>' +
                '</select>' +
                '<select id="cmbMateria2" name="cmbMateria2" title="Materias2" style="border: none; border-bottom: 1px solid black; outline: none; max-width: 250px; width: 100%; height: 30px;">' +
                '<option value="" disabled selected>Materia</option>' +
                '</select>' +
                '</div>' +
                '<div class="contenedor-fecha">' +
                '<label for="dpFechaAsistencia">Fecha de asistencia</label>' +
                '<input type="date" id="dpFechaAsistencia" title="Fecha de asistencia" style="border: none; border-bottom: 1px solid black; outline: none; max-width: 250px; width: 100%; height: 30px;">' +
                '<div class="contenedor-hora" style="display: flex; flex-direction: column; margin-block: 20px;">' +
                '<label for="dpHoraAsistencia">Hora</label>' +
                '<input type="time" id="dpHoraAsistencia" title="dpHoraAsistencia" style="border: none; border-bottom: 1px solid black; outline: none; max-width: 250px; width: 100%; height: 30px;">' +
                '</div>' +
                '<div class="contenedor-cmb" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">' +
                '<label for="hora">Asistencia</label>' +
                '<select id="selectAsistencia" style="border: none; border-bottom: 1px solid black; outline: none; max-width: 250px; width: 100%; height: 30px;">' +
                '<option value="A">Asistió</option>' +
                '<option value="F">Falta</option>' +
                '<option value="R">Retardo</option>' +
                '</select>' +
                '</div>',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        didOpen: () => {
            // Aquí se ejecuta después de que se abre el modal
            const select = document.getElementById('cmbAlumnos');
            const inputBuscar = document.createElement('input');
           
            inputBuscar.setAttribute('type', 'text');
            inputBuscar.setAttribute('placeholder', 'Buscar alumno');
            inputBuscar.addEventListener('input', function (event) {
                const searchText = event.target.value.toLowerCase();
                Array.from(select.options).forEach(option => {
                    const alumnoText = option.text.toLowerCase();
                    option.style.display = alumnoText.includes(searchText) ? 'block' : 'none';
                });
            });

            const contenedorSelect = select.parentElement;
            contenedorSelect.insertBefore(inputBuscar, select); // Inserta el campo de búsqueda antes del select
        },
    }).then((result) => {
        if (result.isConfirmed) {
            const alumnoSeleccionado = document.getElementById('cmbAlumnos').value;
            const docenteSeleccionado = document.getElementById('cmbDocente').value;
            const materiaSeleccionada = document.getElementById('cmbMateria2').value;
            const fechaAsistencia = document.getElementById('dpFechaAsistencia').value;
            const horaAsistencia = document.getElementById('dpHoraAsistencia').value;
            const asistenciaSeleccionada = document.getElementById('selectAsistencia').value;

            let jsonAsistencia = {
                "alumno": {
                    "idAlumno": alumnoSeleccionado
                },
                "materia": {
                    "idMateria": materiaSeleccionada
                },
                "docente": {
                    "idDocente": docenteSeleccionado
                },
                "dia": fechaAsistencia,
                "hora": horaAsistencia,
                "semana": semana,
                "asistencia": asistenciaSeleccionada
            };

            datos = {
                datosLista: JSON.stringify(jsonAsistencia)
            };

            saveAsistencia2(datos);
        }
    });


}

function saveAsistencia2(datos) {
    params = new URLSearchParams(datos);

    fetch("../../api/listaAsistencia/save?",
            {
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                body: params
            })
            .then(response => {
                return response.json();
            })
            .then(function (data) {
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                Toast.fire({
                    icon: "success",
                    title: "La asistencia se registro correctamente"
                });
                getVistaListaPorSemana2();
            })
            .catch(error => {
                console.error('Error:', error);
            });
}