const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.marcarCitasCompletadas = functions.pubsub
    .schedule("every 1 hours")
    .onRun(async () => {
      const ahora = new Date();

      try {
        const citasRef = db.collection("appointments");
        const snapshot = await citasRef.where("estado", "==", "agendado").get();

        const batch = db.batch();

        snapshot.forEach((doc) => {
          const cita = doc.data();
          const fechaHoraCita = new Date(`${cita.fecha}T${cita.hora}:00Z`);

          if (fechaHoraCita < ahora) {
            batch.update(doc.ref, {estado: "Completado"});
          }
        });

        await batch.commit();
        console.log("Citas completadas automáticamente.");
        return null;
      } catch (error) {
        console.error("Error al actualizar citas:", error);
        return null;
      }
    });
