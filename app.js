const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configura AWS SDK usando variables de entorno
AWS.config.update({ region: process.env.AWS_REGION });

const ec2 = new AWS.EC2();

// Ruta para encender la instancia
app.post('/start', (req, res) => {
    const params = {
        InstanceIds: [process.env.INSTANCE_ID],
    };

    ec2.startInstances(params, (err, data) => {
        if (err) {
            console.log(err, err.stack);
            res.status(500).send('Error al encender la instancia');
        } else {
            res.send('Instancia encendida');
        }
    });
});

// Ruta para apagar la instancia
app.post('/stop', (req, res) => {
    const params = {
        InstanceIds: [process.env.INSTANCE_ID],
    };

    ec2.stopInstances(params, (err, data) => {
        if (err) {
            console.log(err, err.stack);
            res.status(500).send('Error al apagar la instancia');
        } else {
            res.send('Instancia apagada');
        }
    });
});

// Inicia el servidor
app.listen(3000, () => {
    console.log('App escuchando en el puerto 3000');
});
