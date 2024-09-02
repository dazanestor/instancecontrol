const express = require('express');
const { EC2Client, StartInstancesCommand, StopInstancesCommand } = require('@aws-sdk/client-ec2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configura AWS SDK usando variables de entorno
const region = process.env.AWS_REGION;
const instanceId = process.env.INSTANCE_ID;

const ec2Client = new EC2Client({ region });

// Ruta para encender la instancia
app.post('/start', async (req, res) => {
    const params = {
        InstanceIds: [instanceId],
    };

    const command = new StartInstancesCommand(params);

    try {
        const data = await ec2Client.send(command);
        console.log('Instancia encendida:', data);
        res.send('Instancia encendida');
    } catch (err) {
        console.error('Error al encender la instancia:', err);
        res.status(500).send('Error al encender la instancia');
    }
});

// Ruta para apagar la instancia
app.post('/stop', async (req, res) => {
    const params = {
        InstanceIds: [instanceId],
    };

    const command = new StopInstancesCommand(params);

    try {
        const data = await ec2Client.send(command);
        console.log('Instancia apagada:', data);
        res.send('Instancia apagada');
    } catch (err) {
        console.error('Error al apagar la instancia:', err);
        res.status(500).send('Error al apagar la instancia');
    }
});

// Inicia el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App escuchando en el puerto ${port}`);
});
