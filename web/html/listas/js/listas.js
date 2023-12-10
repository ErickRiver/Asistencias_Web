let alumnosExcel = [];

inicializar();
function inicializar() {
    getAllGrupos();
    getAllMaterias();
    getAllDocentes();
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

function llenarCmbGrupo(data) {
    const select = document.getElementById('cmbGrupo');
    data.forEach(grupo => {
        const option = document.createElement('option');
        option.value = grupo.idGrupo;
        option.text = grupo.nombreGrupo;
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

function saveAlumnosExcel() {
    console.log("*********GUARDAR ALUMNOS******************");
    alumnosExcel.forEach(alumno => {
        //obtenerUltimoIdUsuario
        //saveUsuario con usuarioUltimoIdUsuario + 1 y password 1234
        //el insert devuelve idUsuario
        //hacer lo mismo con grupo

        let fechaNacimiento = alumno.fechaNacimiento;
        if (fechaNacimiento == "\r") {
            fechaNacimiento = "0000-00-00";
        }
        let jsonAlumno = {
            "nombre": alumno.nombre,
            "apellido": alumno.apellido,
            "fechaNacimiento": fechaNacimiento,
            "grupo": {
                "idGrupo": document.getElementById('cmbGrupo').value
            },
            "usuario": {
                "idUsuario": 10
            }
        };

        datos = {
            datosAlumno: JSON.stringify(jsonAlumno)
        };

        params = new URLSearchParams(datos);
        fetch("../../api/Alumno/save?",
                {
                    method: "POST",
                    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                    body: params
                })
                .then(response => {
                    return response.json();
                })
                .then(function (data) {
                    console.log("success");
                })
                .catch(error => {
                    console.error('Error:', error);
                });
    });
}

function saveFormatoLista() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let algunCheckboxMarcado = false;

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            algunCheckboxMarcado = true;
        }
    });

    if (document.getElementById("cmbGrupo").value != "" &&
            document.getElementById("cmbMateria").value != "" &&
            document.getElementById("cmbDocente").value != "" &&
            document.getElementById("txtSemanas").value != "" &&
            document.getElementById("cmbPeriodo").value != "" &&
            algunCheckboxMarcado == true,
            alumnosExcel.length != 0) {

        saveAlumnosExcel();

        let formatoLista = {
            "grupo": {
                "idGrupo": document.getElementById("cmbGrupo").value
            },
            "materia": {
                "idMateria": document.getElementById("cmbMateria").value
            },
            "docente": {
                "idDocente": document.getElementById("cmbDocente").value
            },
            "semanas": document.getElementById("txtSemanas").value,
            "periodo": document.getElementById("cmbPeriodo").value, 
            "nomenclatura": 1
        };
        datos = {
            datosFormato: JSON.stringify(formatoLista)
        };
        params = new URLSearchParams(datos);
        fetch("../../api/formatoLista/save?",
                {
                    method: "POST",
                    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                    body: params
                })
                .then(response => {
                    return response.json();
                })
                .then(function (data) {
                    saveDiasClase();
                })
                .catch(error => {
                    console.error('Error:', error);
                });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Llene todos los campos',
            confirmButtonText: 'Aceptar'
        });
    }
}

let diasClases = [];

function saveDiasClase() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            diasClases.push(checkbox.value);
        }
    });
    fetch("../../api/formatoLista/getLastId", {
        method: "GET",
        headers: {'Content-Type': 'application/json'}
    })
            .then(response => response.json())
            .then(function (data) {
                var idFM = data.idFormatoLista;
                Promise.all(diasClases.map(dia => {
                    var diasClase = {
                        dia: dia,
                        "formatoLista": {
                            "idFormatoLista": idFM
                        }
                    };
                    var datos = {
                        datosDiaClase: JSON.stringify(diasClase)
                    };
                    var params = new URLSearchParams(datos);
                    return fetch("../../api/diasClase/save?", {
                        method: "POST",
                        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                        body: params
                    })
                            .then(response => response.json())
                            .then(function (data) {
                                console.log(data);
                                switch (dia) {
                                    case 'Lunes':
                                        horariosSeleccionadosLunes.forEach(horarioLunes => {
                                            console.log(horarioLunes);
                                            const horaClase = {
                                                horario: horarioLunes,
                                                "diaClase": {
                                                    "idDiaClase": data
                                                }
                                            };
                                            console.log(horaClase);
                                            const datos = {
                                                datosHorario: JSON.stringify(horaClase)
                                            };
                                            const params = new URLSearchParams(datos);
                                            fetch("../../api/horario/save?", {
                                                method: "POST",
                                                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                                                body: params
                                            })
                                                    .then(response => {
                                                        return response.json();
                                                    })
                                                    .then(function (data) {
                                                        console.log("SUCCESS");
                                                    })
                                                    .catch(error => {
                                                        console.error('Error:', error);
                                                    });
                                        });
                                        break;
                                    case 'Martes':
                                        horariosSeleccionadosMartes.forEach(horarioMartes => {
                                            console.log(horarioMartes);
                                            const horaClase = {
                                                horario: horarioMartes,
                                                "diaClase": {
                                                    "idDiaClase": data
                                                }
                                            };
                                            console.log(horaClase);
                                            const datos = {
                                                datosHorario: JSON.stringify(horaClase)
                                            };
                                            const params = new URLSearchParams(datos);
                                            fetch("../../api/horario/save?", {
                                                method: "POST",
                                                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                                                body: params
                                            })
                                                    .then(response => {
                                                        return response.json();
                                                    })
                                                    .then(function (data) {
                                                        console.log("SUCCESS");
                                                    })
                                                    .catch(error => {
                                                        console.error('Error:', error);
                                                    });
                                        });
                                        break;
                                    case 'Miercoles':
                                        horariosSeleccionadosMiercoles.forEach(horarioMiercoles => {
                                            console.log(horarioMiercoles);
                                            const horaClase = {
                                                horario: horarioMiercoles,
                                                "diaClase": {
                                                    "idDiaClase": data
                                                }
                                            };
                                            console.log(horaClase);
                                            const datos = {
                                                datosHorario: JSON.stringify(horaClase)
                                            };
                                            const params = new URLSearchParams(datos);
                                            fetch("../../api/horario/save?", {
                                                method: "POST",
                                                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                                                body: params
                                            })
                                                    .then(response => {
                                                        return response.json();
                                                    })
                                                    .then(function (data) {
                                                        console.log("SUCCESS");
                                                    })
                                                    .catch(error => {
                                                        console.error('Error:', error);
                                                    });
                                        });
                                        break;
                                    case 'Jueves':
                                        horariosSeleccionadosJueves.forEach(horarioJueves => {
                                            console.log(horarioJueves);
                                            const horaClase = {
                                                horario: horarioJueves,
                                                "diaClase": {
                                                    "idDiaClase": data
                                                }
                                            };
                                            console.log(horaClase);
                                            const datos = {
                                                datosHorario: JSON.stringify(horaClase)
                                            };
                                            const params = new URLSearchParams(datos);
                                            fetch("../../api/horario/save?", {
                                                method: "POST",
                                                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                                                body: params
                                            })
                                                    .then(response => {
                                                        return response.json();
                                                    })
                                                    .then(function (data) {
                                                        console.log("SUCCESS");
                                                    })
                                                    .catch(error => {
                                                        console.error('Error:', error);
                                                    });
                                        });
                                        break;
                                    case 'Viernes':
                                        horariosSeleccionadosViernes.forEach(horarioViernes => {
                                            console.log(horarioViernes);
                                            const horaClase = {
                                                horario: horarioViernes,
                                                "diaClase": {
                                                    "idDiaClase": data
                                                }
                                            };
                                            console.log(horaClase);
                                            const datos = {
                                                datosHorario: JSON.stringify(horaClase)
                                            };
                                            const params = new URLSearchParams(datos);
                                            fetch("../../api/horario/save?", {
                                                method: "POST",
                                                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                                                body: params
                                            })
                                                    .then(response => {
                                                        return response.json();
                                                    })
                                                    .then(function (data) {
                                                        console.log("SUCCESS");
                                                    })
                                                    .catch(error => {
                                                        console.error('Error:', error);
                                                    });
                                        });
                                        break;
                                    case 'Sabado':
                                        horariosSeleccionadosSabado.forEach(horarioSabado => {
                                            console.log(horarioSabado);
                                            const horaClase = {
                                                horario: horarioSabado,
                                                "diaClase": {
                                                    "idDiaClase": data
                                                }
                                            };
                                            console.log(horaClase);
                                            const datos = {
                                                datosHorario: JSON.stringify(horaClase)
                                            };
                                            const params = new URLSearchParams(datos);
                                            fetch("../../api/horario/save?", {
                                                method: "POST",
                                                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                                                body: params
                                            })
                                                    .then(response => {
                                                        return response.json();
                                                    })
                                                    .then(function (data) {
                                                        console.log("SUCCESS");
                                                    })
                                                    .catch(error => {
                                                        console.error('Error:', error);
                                                    });
                                        });
                                        break;
                                }
//                                    saveHorarioDiaClase(dia);

                                return {success: true};
                            })
                            .catch(error => {
                                return {success: false};
                            });
                }))
                        .then(results => {
                            const allSuccess = results.every(result => result.success);
                            if (allSuccess) {
                                Swal.fire({
                                    icon: 'success',
                                    title: '¡Guardado exitoso!',
                                    text: 'Los días de clase se han guardado correctamente.'
                                });
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error al guardar',
                                    text: 'Hubo un problema al guardar los días de clase.'
                                });
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Ha ocurrido un error al procesar la solicitud.'
                            });
                        });
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ha ocurrido un error al obtener el ID del formato de lista.'
                });
            });
}

function checkboxSeleccionado(checkbox) {
    if (checkbox.checked) {
        switch (checkbox.value) {
            case 'Lunes':
                document.getElementById("horariosLunes").style.display = "";
                break;
            case 'Martes':
                document.getElementById("horariosMartes").style.display = "";
                break;
            case 'Miercoles':
                document.getElementById("horariosMiercoles").style.display = "";
                break;
            case 'Jueves':
                document.getElementById("horariosJueves").style.display = "";
                break;
            case 'Viernes':
                document.getElementById("horariosViernes").style.display = "";
                break;
            case 'Sabado':
                document.getElementById("horariosSabado").style.display = "";
                break;
        }
    } else {
        switch (checkbox.value) {
            case 'Lunes':
                document.getElementById("horariosLunes").style.display = "none";
                break;
            case 'Martes':
                document.getElementById("horariosMartes").style.display = "none";
                break;
            case 'Miercoles':
                document.getElementById("horariosMiercoles").style.display = "none";
                break;
            case 'Jueves':
                document.getElementById("horariosJueves").style.display = "none";
                break;
            case 'Viernes':
                document.getElementById("horariosViernes").style.display = "none";
                break;
            case 'Sabado':
                document.getElementById("horariosSabado").style.display = "none";
                break;
        }
    }
}

let horariosSeleccionadosLunes = [];
let horariosSeleccionadosMartes = [];
let horariosSeleccionadosMiercoles = [];
let horariosSeleccionadosJueves = [];
let horariosSeleccionadosViernes = [];
let horariosSeleccionadosSabado = [];
function agregarHorario(dia) {
    switch (dia) {
        case 'lunes':
            horariosSeleccionadosLunes.push(document.getElementById("cmbHorarioLunes").value);
            var divHoras = document.getElementById("horasSeleccionadasLunes");
            divHoras.innerHTML = "";
            var titulo = document.createElement("h4");
            titulo.textContent = "Horas seleccionadas";
            divHoras.appendChild(titulo);
            horariosSeleccionadosLunes.forEach(function (horario) {
                var parrafo = document.createElement("p");
                parrafo.textContent = horario;
                divHoras.appendChild(parrafo);
            });
            break;
        case 'martes':
            horariosSeleccionadosMartes.push(document.getElementById("cmbHorarioMartes").value);
            var divHoras = document.getElementById("horasSeleccionadasMartes");
            divHoras.innerHTML = "";
            var titulo = document.createElement("h4");
            titulo.textContent = "Horas seleccionadas";
            divHoras.appendChild(titulo);
            horariosSeleccionadosMartes.forEach(function (horario) {
                var parrafo = document.createElement("p");
                parrafo.textContent = horario;
                divHoras.appendChild(parrafo);
            });
            break;
        case 'miercoles':
            horariosSeleccionadosMiercoles.push(document.getElementById("cmbHorarioMiercoles").value);
            var divHoras = document.getElementById("horasSeleccionadasMiercoles");
            divHoras.innerHTML = "";
            var titulo = document.createElement("h4");
            titulo.textContent = "Horas seleccionadas";
            divHoras.appendChild(titulo);
            horariosSeleccionadosMiercoles.forEach(function (horario) {
                var parrafo = document.createElement("p");
                parrafo.textContent = horario;
                divHoras.appendChild(parrafo);
            });
            break;
        case 'jueves':
            horariosSeleccionadosJueves.push(document.getElementById("cmbHorarioJueves").value);
            var divHoras = document.getElementById("horasSeleccionadasJueves");
            divHoras.innerHTML = "";
            var titulo = document.createElement("h4");
            titulo.textContent = "Horas seleccionadas";
            divHoras.appendChild(titulo);
            horariosSeleccionadosJueves.forEach(function (horario) {
                var parrafo = document.createElement("p");
                parrafo.textContent = horario;
                divHoras.appendChild(parrafo);
            });
            break;
        case 'viernes':
            horariosSeleccionadosViernes.push(document.getElementById("cmbHorarioViernes").value);
            var divHoras = document.getElementById("horasSeleccionadasViernes");
            divHoras.innerHTML = "";
            var titulo = document.createElement("h4");
            titulo.textContent = "Horas seleccionadas";
            divHoras.appendChild(titulo);
            horariosSeleccionadosViernes.forEach(function (horario) {
                var parrafo = document.createElement("p");
                parrafo.textContent = horario;
                divHoras.appendChild(parrafo);
            });
            break;
        case 'sabado':
            horariosSeleccionadosSabado.push(document.getElementById("cmbHorarioSabado").value);
            var divHoras = document.getElementById("horasSeleccionadasSabado");
            divHoras.innerHTML = "";
            var titulo = document.createElement("h4");
            titulo.textContent = "Horas seleccionadas";
            divHoras.appendChild(titulo);
            horariosSeleccionadosSabado.forEach(function (horario) {
                var parrafo = document.createElement("p");
                parrafo.textContent = horario;
                divHoras.appendChild(parrafo);
            });
            break;
    }
}

function saveHorarioDiaClase(dia) {
    fetch("../../api/diasClase/getLastId", {
        method: "GET",
        headers: {'Content-Type': 'application/json'}
    })
            .then(response => {
                return response.json();
            })
            .then(function (data) {
                console.log("*****************************");
                console.log("********** ULTIMO ID **************");
                console.log(data);
                switch (dia) {
                    case 'Lunes':
                        horariosSeleccionadosLunes.forEach(horarioLunes => {
                            console.log(horarioLunes);
                            const horaClase = {
                                horario: horarioLunes,
                                "diaClase": {
                                    "idDiaClase": data.idDiaClase
                                }
                            };
                            console.log(horaClase);
                            const datos = {
                                datosHorario: JSON.stringify(horaClase)
                            };
                            const params = new URLSearchParams(datos);
                            fetch("../../api/horario/save?", {
                                method: "POST",
                                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                                body: params
                            })
                                    .then(response => {
                                        return response.json();
                                    })
                                    .then(function (data) {
                                        console.log("SUCCESS");
                                    })
                                    .catch(error => {
                                        console.error('Error:', error);
                                    });
                        });
                        break;
                    case 'Martes':
                        horariosSeleccionadosMartes.forEach(horarioMartes => {
                            console.log(horarioMartes);
                            const horaClase = {
                                horario: horarioMartes,
                                "diaClase": {
                                    "idDiaClase": data.idDiaClase
                                }
                            };
                            console.log(horaClase);
                            const datos = {
                                datosHorario: JSON.stringify(horaClase)
                            };
                            const params = new URLSearchParams(datos);
                            fetch("../../api/horario/save?", {
                                method: "POST",
                                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                                body: params
                            })
                                    .then(response => {
                                        return response.json();
                                    })
                                    .then(function (data) {
                                        console.log("SUCCESS");
                                    })
                                    .catch(error => {
                                        console.error('Error:', error);
                                    });
                        });
                        break;
                    case 'Miercoles':
                        horariosSeleccionadosMiercoles.forEach(horarioMiercoles => {
                            console.log(horarioMiercoles);
                            const horaClase = {
                                horario: horarioMiercoles,
                                "diaClase": {
                                    "idDiaClase": data.idDiaClase
                                }
                            };
                            console.log(horaClase);
                            const datos = {
                                datosHorario: JSON.stringify(horaClase)
                            };
                            const params = new URLSearchParams(datos);
                            fetch("../../api/horario/save?", {
                                method: "POST",
                                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                                body: params
                            })
                                    .then(response => {
                                        return response.json();
                                    })
                                    .then(function (data) {
                                        console.log("SUCCESS");
                                    })
                                    .catch(error => {
                                        console.error('Error:', error);
                                    });
                        });
                        break;
                    case 'Jueves':
                        horariosSeleccionadosJueves.forEach(horarioJueves => {
                            console.log(horarioJueves);
                            const horaClase = {
                                horario: horarioJueves,
                                "diaClase": {
                                    "idDiaClase": data.idDiaClase
                                }
                            };
                            console.log(horaClase);
                            const datos = {
                                datosHorario: JSON.stringify(horaClase)
                            };
                            const params = new URLSearchParams(datos);
                            fetch("../../api/horario/save?", {
                                method: "POST",
                                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                                body: params
                            })
                                    .then(response => {
                                        return response.json();
                                    })
                                    .then(function (data) {
                                        console.log("SUCCESS");
                                    })
                                    .catch(error => {
                                        console.error('Error:', error);
                                    });
                        });
                        break;
                    case 'Viernes':
                        horariosSeleccionadosViernes.forEach(horarioViernes => {
                            console.log(horarioViernes);
                            const horaClase = {
                                horario: horarioViernes,
                                "diaClase": {
                                    "idDiaClase": data.idDiaClase
                                }
                            };
                            console.log(horaClase);
                            const datos = {
                                datosHorario: JSON.stringify(horaClase)
                            };
                            const params = new URLSearchParams(datos);
                            fetch("../../api/horario/save?", {
                                method: "POST",
                                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                                body: params
                            })
                                    .then(response => {
                                        return response.json();
                                    })
                                    .then(function (data) {
                                        console.log("SUCCESS");
                                    })
                                    .catch(error => {
                                        console.error('Error:', error);
                                    });
                        });
                        break;
                    case 'Sabado':
                        horariosSeleccionadosSabado.forEach(horarioSabado => {
                            console.log(horarioSabado);
                            const horaClase = {
                                horario: horarioSabado,
                                "diaClase": {
                                    "idDiaClase": data.idDiaClase
                                }
                            };
                            console.log(horaClase);
                            const datos = {
                                datosHorario: JSON.stringify(horaClase)
                            };
                            const params = new URLSearchParams(datos);
                            fetch("../../api/horario/save?", {
                                method: "POST",
                                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                                body: params
                            })
                                    .then(response => {
                                        return response.json();
                                    })
                                    .then(function (data) {
                                        console.log("SUCCESS");
                                    })
                                    .catch(error => {
                                        console.error('Error:', error);
                                    });
                        });
                        break;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
}

function abrirBiblioteca() {
    const input = document.getElementById('inputArchivo');
    input.click();

    input.onchange = function (e) {
        const archivo = e.target.files[0];
        if (!archivo) {
            return;
        }

        if (archivo.type !== 'text/csv') {
            alert('Por favor, selecciona un archivo CSV.');
            return;
        }

        const nombreInput = document.getElementById('nombreArchivo');
        nombreInput.value = archivo.name;

        const lector = new FileReader();
        lector.onload = function (e) {
            const contenido = e.target.result;
            procesarCSV(contenido);
        };
        lector.readAsText(archivo);
    };
}

function procesarCSV(contenido) {
    const lineas = contenido.split('\n');
    const datos = [];
    for (let i = 1; i < lineas.length; i++) {
        const campos = lineas[i].split(',');
        if (campos.length === 3) {
            const nombre = campos[0];
            const apellido = campos[1];
            const fechaNacimiento = campos[2];
            datos.push({nombre, apellido, fechaNacimiento});
        }
    }

    alumnosExcel = datos;
    console.log(alumnosExcel);
}
