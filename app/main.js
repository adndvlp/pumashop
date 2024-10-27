// Función para cargar archivos HTML externos
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
    }
};

const checkLogin = () => localStorage.getItem('jwt')

const animalsPage = () => {
    loadExternalHtml('/Front-end/index.html');
}

const loadRegisterTemplate = () => {
    const template = `
        <h1>Register</h1>
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
        <h1>Login</h1>
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
        }
    };
};

const addLoginListener = authListener('login')
const addRegisterListener = authListener('register')

window.onload = () => {
    if (checkLogin()) {
        animalsPage()
    } else {
        loginPage()
    }
}
