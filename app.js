const express = require('express');
const path = require('path');
const { EC2Client, StartInstancesCommand, StopInstancesCommand, DescribeInstancesCommand } = require('@aws-sdk/client-ec2');

const app = express();

// Configura el motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Inicializa el cliente EC2
const ec2Client = new EC2Client({ region: process.env.AWS_REGION });

// Función para obtener el estado de la instancia
const getInstanceStatus = async () => {
    try {
        const params = {
            InstanceIds: [process.env.INSTANCE_ID],
        };
        const command = new DescribeInstancesCommand(params);
        const data = await ec2Client.send(command);
        const state = data.Reservations[0].Instances[0].State.Name; // Obtiene el estado de la instancia
        return state;
    } catch (err) {
        console.error('Error al obtener el estado de la instancia:', err);
        throw err;
    }
};

// Función para apagar la instancia
const stopInstance = async () => {
    try {
        const params = { InstanceIds: [process.env.INSTANCE_ID] };
        const command = new StopInstancesCommand(params);
        const data = await ec2Client.send(command);
        console.log('Instancia apagada automáticamente después de 60 minutos');
    } catch (err) {
        console.error('Error al apagar la instancia:', err);
    }
};

// Ruta para renderizar la página principal
app.get('/', (req, res) => {
    const pageTitle = process.env.PAGE_TITLE || 'Control de EC2';
    res.render('index', { pageTitle });
});

// Ruta para obtener el estado de la instancia
app.get('/status', async (req, res) => {
    try {
        const status = await getInstanceStatus();
        res.send(`El estado actual de la instancia es: ${status}`);
    } catch (err) {
        res.status(500).send('Error al obtener el estado de la instancia.');
    }
});

// Ruta para encender la instancia
app.post('/start', async (req, res) => {
    try {
        const params = { InstanceIds: [process.env.INSTANCE_ID] };
        const command = new StartInstancesCommand(params);
        await ec2Client.send(command);
        res.send('Instancia encendida');

        // Iniciar un temporizador de 60 minutos para apagar la instancia automáticamente
        setTimeout(stopInstance, 60 * 60 * 1000); // 60 minutos
    } catch (err) {
        console.error('Error al encender la instancia:', err);
        res.status(500).send('Error al encender la instancia.');
    }
});

// Ruta para apagar la instancia manualmente
app.post('/stop', async (req, res) => {
    try {
        await stopInstance();
        res.send('Instancia apagada');
    } catch (err) {
        console.error('Error al apagar la instancia:', err);
        res.status(500).send('Error al apagar la instancia.');
    }
});

app.listen(3000, () => {
    console.log('App escuchando en el puerto 3000');
});
