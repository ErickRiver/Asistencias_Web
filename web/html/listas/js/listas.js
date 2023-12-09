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
            algunCheckboxMarcado == true) {

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

function saveDiasClase() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    var diasClases = [];

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            diasClases.push(checkbox.value);
        }
    });

    fetch("../../api/formatoLista/getLastId", {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
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
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                    body: params
                })
                .then(response => response.json())
                .then(function (data) {
                    return { success: true };
                })
                .catch(error => {
                    return { success: false };
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

function saveHorasClase() {
    const checkboxesHora = document.querySelectorAll('input[type="checkbox"].hora');
    var horasClase = [];

    checkboxesHora.forEach(checkbox => {
        if (checkbox.checked) {
            horasClase.push(checkbox.value);
        }
    });

    horasClase.forEach(hora => {
        const horaClase = {
            hora: hora,
            "diaClase": {
                "idDiaClase": 1
            }
        };

        const datos = {
            datosHoraClase: JSON.stringify(horaClase)
        };

        const params = new URLSearchParams(datos);
        fetch("../../api/horasClase/save?", {
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
            body: params
        })
                .then(response => {
                    return response.json();
                })
                .then(function (data) {
                    console.log("SUCCESS")
                })
                .catch(error => {
                    console.error('Error:', error);
                });
    });
}
