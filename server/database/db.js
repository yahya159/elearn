import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDb = async () => {
    try {
        if (!process.env.DB) {
            throw new Error('La chaîne de connexion à la base de données n\'est pas définie');
        }

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        await mongoose.connect(process.env.DB, options);
        console.log("✅ Base de données connectée avec succès");

        // Gestion des événements de connexion
        mongoose.connection.on('error', (err) => {
            console.error('Erreur de connexion MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB déconnecté. Tentative de reconnexion...');
            setTimeout(connectDb, 5000);
        });

    } catch (error) {
        console.error("❌ Erreur de connexion à la base de données:", error.message);
        // Attendre 5 secondes avant de réessayer
        setTimeout(connectDb, 5000);
    }
};

// Gestion de la terminaison du processus
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('Connexion MongoDB fermée via terminaison de l\'application');
        process.exit(0);
    } catch (err) {
        console.error('Erreur lors de la fermeture de la connexion MongoDB:', err);
        process.exit(1);
    }
});
