inicialize();

function inicialize() {
    getAllGrupos();
    getAllMaterias();
    getAllAlumnos();
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
                console.log(data);
                llenarCmbGrupo(data);
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
                console.log(data);
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
``

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
                console.log(data);
                llenarCmbGrupo(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
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
                console.log(data);
                llenarTablaAlumnos(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
}

function llenarTablaAlumnos(data) {
    const tabla = document.querySelector('.contenedor-tabla table tbody');

    // Limpiar la tabla antes de llenarla para evitar duplicados
    tabla.innerHTML = '';

    data.forEach(alumno => {
        const fila = document.createElement('tr');
        const nombreAlumno = document.createElement('td');
        nombreAlumno.textContent = `${alumno.nombre} ${alumno.apellido}`;
        fila.appendChild(nombreAlumno);

        // Ejemplo de datos de asistencia
        const datosAsistencia = ['J', 'F', 'A']; // Ejemplo de datos, reemplazar con los datos reales

        datosAsistencia.forEach(asistencia => {
            const celdaAsistencia = document.createElement('td');
            celdaAsistencia.textContent = asistencia;
            fila.appendChild(celdaAsistencia);
        });

        tabla.appendChild(fila);
    });
}
