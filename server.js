const express = require('express');
const path = require('path');
const { connectDB, getDB } = require('./config/database');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Moteur de template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route d'accueil
app.get('/', (req, res) => {
  res.render('index', { title: 'Accueil' });
});

// Route pour afficher tous les utilisateurs
app.get('/utilisateurs', async (req, res) => {
  try {
    const db = getDB();
    const utilisateurs = await db.collection('utilisateurs').find().toArray();
    res.render('utilisateurs', { 
      title: 'Liste des utilisateurs',
      utilisateurs 
    });
  } catch (error) {
    res.status(500).send('Erreur serveur');
  }
});

// Route pour afficher le formulaire d'ajout
app.get('/ajouter', (req, res) => {
  res.render('ajouter', { title: 'Ajouter un utilisateur' });
});

// Route pour traiter l'ajout d'utilisateur
app.post('/ajouter', async (req, res) => {
  try {
    const db = getDB();
    const { nom, email, age } = req.body;
    
    await db.collection('utilisateurs').insertOne({
      nom,
      email,
      age: parseInt(age),
      dateCreation: new Date()
    });
    
    res.redirect('/utilisateurs');
  } catch (error) {
    res.status(500).send('Erreur lors de l\'ajout');
  }
});

// Route pour supprimer un utilisateur
app.post('/supprimer/:id', async (req, res) => {
  try {
    const db = getDB();
    const { ObjectId } = require('mongodb');
    
    await db.collection('utilisateurs').deleteOne({
      _id: new ObjectId(req.params.id)
    });
    
    res.redirect('/utilisateurs');
  } catch (error) {
    res.status(500).send('Erreur lors de la suppression');
  }
});

// Connecter à MongoDB puis démarrer le serveur
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  });
});