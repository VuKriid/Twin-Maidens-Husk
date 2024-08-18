const cron = require('node-cron');
const mongoose = require('mongoose');
const Maiden = require('./schemas/Maiden'); // Ajusta la ruta a tu modelo

// Conexión a la base de datos
mongoose.connect(process.env.MONGODB_URI);

// Configura la tarea para que se ejecute cada día a medianoche
const daysThreshold = 3;

// Configura la tarea para que se ejecute cada día a medianoche
cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() - daysThreshold); // Calcula la fecha umbral

    const maidens = await Maiden.find({
      lastModified: { $lte: thresholdDate }, // Encuentra documentos cuyo último cambio es antes de la fecha umbral
    });

    maidens.forEach(async (maiden) => {
      const randomValue = Math.floor(Math.random() * 10); // Valor aleatorio para restar, ajusta el rango según necesites
      maiden.affect = maiden.affect - randomValue;
      if (maiden.affect < 0) maiden.affect = 0; // Asegúrate de que el valor no sea negativo
      
    });

  } catch (error) {
    console.error('Error updating affect values:', error);
  }
});
