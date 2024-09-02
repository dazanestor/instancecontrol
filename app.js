const express = require('express');
const path = require('path');
const app = express();

// Configura el motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Renderiza la página principal, pasando la variable de entorno a la plantilla
app.get('/', (req, res) => {
    const pageTitle = process.env.PAGE_TITLE || 'Control de EC2';
    res.render('index', { pageTitle });
});

// Tu código para EC2Client, rutas de start y stop va aquí...

const { EC2Client, StartInstancesCommand, StopInstancesCommand } = require('@aws-sdk/client-ec2');

const ec2Client = new EC2Client({ region: process.env.AWS_REGION });

const startInstance = async () => {
    try {
        const params = { InstanceIds: [process.env.INSTANCE_ID] };
        const command = new StartInstancesCommand(params);
        const data = await ec2Client.send(command);
        console.log('Instancia encendida:', data);
    } catch (err) {
        console.error('Error al encender la instancia:', err);
    }
};

const stopInstance = async () => {
    try {
        const params = { InstanceIds: [process.env.INSTANCE_ID] };
        const command = new StopInstancesCommand(params);
        const data = await ec2Client.send(command);
        console.log('Instancia apagada:', data);
    } catch (err) {
        console.error('Error al apagar la instancia:', err);
    }
};

app.post('/start', async (req, res) => {
    await startInstance();
    res.send('Instancia encendida');
});

app.post('/stop', async (req, res) => {
    await stopInstance();
    res.send('Instancia apagada');
});

app.listen(3000, () => {
    console.log('App escuchando en el puerto 3000');
});
