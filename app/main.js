const logout = () => {
    // Borra el token del almacenamiento local
    localStorage.removeItem('jwt');

    // Redirige al usuario a la página de inicio de sesión
    loginPage();
    location.reload();
};

// Agrega un listener para el botón de cerrar sesión
const addLogoutListener = () => {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.onclick = logout;
    }
};

const addProfileFormListener = async () => {  // Define la función como async
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.onsubmit = async (e) => {
            e.preventDefault();

            const formData = new FormData(profileForm);
            const data = Object.fromEntries(formData.entries());

            const token = localStorage.getItem('jwt');
            const response = await fetch('/update-profile', {  // await solo dentro de funciones async
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Perfil actualizado con éxito');
            } else {
                alert('Hubo un error al actualizar el perfil');
            }
        };
    }
};


// Llamar a esta función cuando se cargue la configuración
const loadConfigSection = () => {
    document.getElementById('configSection').style.display = 'block';
    addProfileFormListener();
};

const loadUsers = async () => {
    const token = localStorage.getItem('jwt');

    const response = await fetch('/users', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        const users = await response.json();
        const usersContainer = document.getElementById('users-container');
        usersContainer.innerHTML = ''; // Limpiar el contenedor

        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.innerHTML = `
                Email: ${user.email}, Username: ${user.username}
                <button onclick="deleteUser('${user._id}')">Eliminar</button>
            `;
            usersContainer.appendChild(userElement);
        });
    } else {
        console.error('Error al cargar usuarios');
    }
};

const deleteUser = async (userId) => {
    const token = localStorage.getItem('jwt');

    const response = await fetch(`/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        alert('Usuario eliminado con éxito');
        loadUsers(); // Recargar la lista de usuarios después de la eliminación
    } else {
        alert('Error al eliminar el usuario');
    }
};


const loadExternalHtml = async (filePath) => {
    const token = localStorage.getItem('jwt');

    const response = await fetch(filePath, {
        headers: {
            'Authorization': token
        }
    });

    if (response.status === 401) {
        // Si el usuario no está autorizado, redirige al login
        loginPage();
    } else {
        const htmlContent = await response.text();
        document.body.innerHTML = htmlContent;
        loadExternalResources();
        addLogoutListener();
    }
};

const loadExternalResources = async (token) => {
    // Carga y aplica CSS
    const cssResponse = await fetch('/Front-end/styles.css', {
        headers: { 'Authorization': token }
    });
    if (cssResponse.ok) {
        const cssContent = await cssResponse.text();
        const style = document.createElement('style');
        style.textContent = cssContent;
        document.head.appendChild(style);
    }

    // Carga y aplica JS
    const jsResponse = await fetch('/Front-end/main.js', {
        headers: { 'Authorization': token }
    });
    if (jsResponse.ok) {
        const jsContent = await jsResponse.text();
        const script = document.createElement('script');
        script.textContent = jsContent;
        document.body.appendChild(script);
    }

    const imageElements = document.querySelectorAll('img[src]');
    for (const imgElement of imageElements) {
        const imgPath = imgElement.getAttribute('src');
        const imgResponse = await fetch(imgPath, {
            headers: { 'Authorization': token }
        });
        if (imgResponse.ok) {
            const blob = await imgResponse.blob();
            const imgURL = URL.createObjectURL(blob);
            imgElement.src = imgURL;
        } else {
            console.error(`Error al cargar la imagen: ${imgPath}`);
        }
    }
};


const checkLogin = () => localStorage.getItem('jwt')

const animalsPage = () => {
    loadExternalHtml('Front-end/index.html');
}

const loadRegisterTemplate = () => {
    const template = `
        <style>
                html {
            --s: 100px;
            /* control the size */
            --c1: #d0c058;
            /* color oro */
            --c2: #2a2eac;
            /* color azul */
            --_g: var(--c1) 90deg, #0000 90.5deg;
            background:
                conic-gradient(from -45deg, var(--_g)),
                conic-gradient(from 135deg, var(--_g)) calc(var(--s) / 2) 0,
                var(--c2);
            background-size: var(--s) var(--s);
            height: 100%;
            /* Asegúrate de que el fondo cubra toda la ventana */
            display: flex;
            justify-content: center;
            align-items: center;
        }

        body {
            background-color: rgba(255, 255, 255, 0.9);
        }

        #form-container {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        #register-form,
        #login-form {
            background-color: rgba(255, 255, 255, 0.9);
            /* Fondo blanco semi-transparente */
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            width: 300px;
            margin: 10px;
            /* Espacio entre los formularios */
        }

        h1 {
            color: var(--c2);
            /* Azul para el título */
            text-align: center;
        }

        form {
            display: flex;
            flex-direction: column;
        }

        label {
            margin-bottom: 5px;
            color: var(--c2);
            /* Azul para las etiquetas */
        }

        input {
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid var(--c2);
            border-radius: 5px;
            width: 100%;
            /* Asegura que los inputs sean del 100% de ancho */
            box-sizing: border-box;
            /* Incluye padding y border en el ancho total */
        }

        button {
            background-color: var(--c2);
            /* Azul para el botón */
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            /* Asegura que el botón sea del 100% de ancho */
        }

        button:hover {
            background-color: darkblue;
            /* Efecto hover para el botón */
        }

        #login,
        #register {
            text-align: center;
            display: block;
            margin: 10px;
            color: var(--c1);
            /* Color oro para el enlace */
            text-decoration: none;
            /* Sin subrayado */
        }

        #login:hover,
        #register:hover {
            text-decoration: underline;
            /* Subrayado al pasar el mouse sobre el enlace */
        }

        #login:active,
        #register:active {
            color: blue;
            /* Cambia a azul al hacer clic */
        }
        
        </style>
        <h1>Registrarse</h1>
        <form id="register-form">
            <div>
                <label>Correo</label>
                <input name="email" />
            </div>
            <div>
                <label>Contraseña</label>
                <input name="password" />
            </div>
            <button type="submit">Enviar</button>
        </form>
        <a href="#" id="login">Iniciar sesión</a>
        <div id="error"></div>
    `
    document.body.innerHTML = template
}

const gotoLoginListener = () => {
    document.getElementById('login').onclick = (e) => {
        e.preventDefault()
        loginPage()
    }
}

const registerPage = () => {
    loadRegisterTemplate()
    addRegisterListener()
    gotoLoginListener()
}

const loginPage = () => {
    loadLoginTemplate()
    addLoginListener()
    gotoRegisterListener()
}

const loadLoginTemplate = () => {
    const template = `
        <style>
                html {
            --s: 100px;
            /* control the size */
            --c1: #d0c058;
            /* color oro */
            --c2: #2a2eac;
            /* color azul */
            --_g: var(--c1) 90deg, #0000 90.5deg;
            background:
                conic-gradient(from -45deg, var(--_g)),
                conic-gradient(from 135deg, var(--_g)) calc(var(--s) / 2) 0,
                var(--c2);
            background-size: var(--s) var(--s);
            height: 100%;
            /* Asegúrate de que el fondo cubra toda la ventana */
            display: flex;
            justify-content: center;
            align-items: center;
        }
            
        body {
            background-color: rgba(255, 255, 255, 0.9);
        }

        #form-container {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        #register-form,
        #login-form {
            background-color: rgba(255, 255, 255, 0.9);
            /* Fondo blanco semi-transparente */
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            width: 300px;
            margin: 10px;
            /* Espacio entre los formularios */
        }

        h1 {
            color: var(--c2);
            /* Azul para el título */
            text-align: center;
        }

        form {
            display: flex;
            flex-direction: column;
        }

        label {
            margin-bottom: 5px;
            color: var(--c2);
            /* Azul para las etiquetas */
        }

        input {
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid var(--c2);
            border-radius: 5px;
            width: 100%;
            /* Asegura que los inputs sean del 100% de ancho */
            box-sizing: border-box;
            /* Incluye padding y border en el ancho total */
        }

        button {
            background-color: var(--c2);
            /* Azul para el botón */
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            /* Asegura que el botón sea del 100% de ancho */
        }

        button:hover {
            background-color: darkblue;
            /* Efecto hover para el botón */
        }

        #login,
        #register {
            text-align: center;
            display: block;
            margin: 10px;
            color: var(--c1);
            /* Color oro para el enlace */
            text-decoration: none;
            /* Sin subrayado */
        }

        #login:hover,
        #register:hover {
            text-decoration: underline;
            /* Subrayado al pasar el mouse sobre el enlace */
        }

        #login:active,
        #register:active {
            color: blue;
            /* Cambia a azul al hacer clic */
        }
        </style>
        <h1>Iniciar Sesión</h1>
        <form id="login-form">
            <div>
                <label>Correo</label>
                <input name="email" />
            </div>
            <div>
                <label>Contraseña</label>
                <input name="password" />
            </div>
            <button type="submit">Enviar</button>
        </form>
        <a href="#" id="register">Registrarse</a>
        <div id="error"></div>
    `
    document.body.innerHTML = template
}



const gotoRegisterListener = () => {
    document.getElementById('register').onclick = (e) => {
        e.preventDefault()
        registerPage()
    }
}

const authListener = action => () => {
    const form = document.getElementById(`${action}-form`);
    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries()); // Convierte FormData a un objeto de JavaScript.

        console.log('Datos enviados:', data);

        const response = await fetch(`/${action}`, {
            method: 'POST',
            body: JSON.stringify(data), // Enviar el cuerpo como JSON
            headers: {
                'Content-Type': 'application/json', // Asegurarse de que se especifica el tipo de contenido
            },
        });

        const responseData = await response.text();
        if (response.status >= 300) {
            document.getElementById('error').innerHTML = responseData;
        } else {
            localStorage.setItem('jwt', `Bearer ${responseData}`);
            animalsPage();
            location.reload();
        }
    };
};

const addLoginListener = authListener('login')
const addRegisterListener = authListener('register')
// main.js

window.onload = () => {
    if (checkLogin()) {
        animalsPage()
    } else {
        loginPage()
    }
}
