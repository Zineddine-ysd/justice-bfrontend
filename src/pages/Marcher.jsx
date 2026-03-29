import React from 'react';
import './GuideUtilisation.css';

const GuideUtilisation = () => {
  return (
    <div className="guide-container">
      <header className="guide-header">
        <h1> Guide d'Utilisation - Application Web du Tribunal</h1>
        <p className="guide-subtitle">Guide complet pour les 4 rôles principaux du système</p>
      </header>

      <div className="guide-intro">
        <p>Cette application web permet la gestion numérique des processus judiciaires avec des interfaces adaptées à chaque rôle. Suivez ce guide pour comprendre les fonctionnalités disponibles pour chaque profil.</p>
      </div>

      {/* Section pour les Dashboards */}
      <section className="dashboard-section">
        <h2> Tableaux de Bord par Rôle</h2>
        <p className="section-description">Chaque utilisateur accède à une interface personnalisée selon ses responsabilités.</p>
        
        <div className="dashboards-grid">
          {/* Dashboard Administrateur */}
          <div className="dashboard-card admin">
            <div className="dashboard-header">
              <div className="role-icon"></div>
              <h3>Administrateur Système</h3>
            </div>
         
            <div className="dashboard-features">
              <h4>Fonctionnalités principales :</h4>
              <ul>
                <li><strong>Gestion des utilisateurs :</strong> Ajouter/lister avocats et juges</li>
                <li><strong>Consultation des données :</strong> Historique juridique et archives</li>
                <li><strong>Navigation :</strong> Menu latéral fixe avec accès complet</li>
              </ul>
              <div className="process">
                <h5> Processus typique (ajout d'un avocat) :</h5>
                <ol>
                  <li>Admin se connecte</li>
                  <li>Clique sur "Ajouter Avocat"</li>
                  <li>Remplit le formulaire (nom, email, spécialité, etc.)</li>
                  <li>L'avocat apparaît dans "Lister Les Avocats"</li>
                  <li>L'admin peut consulter "Historique" pour voir les ajouts</li>
                </ol>
              </div>
            </div>
            <div className="dashboard-note">
              <strong> Particularités :</strong> Accès global au système • Création/suppression des comptes • Vision système complète
            </div>
          </div>

          {/* Dashboard Secrétaire */}
          <div className="dashboard-card secretary">
            <div className="dashboard-header">
              <div className="role-icon"></div>
              <h3>Secrétaire</h3>
            </div>
           
            <div className="dashboard-features">
              <h4>Fonctionnalités principales :</h4>
              <ul>
                <li><strong>Gestion des audiences :</strong> Création, gestion et archivage des séances</li>
                <li><strong>Gestion logistique :</strong> Réservations et gestion des salles</li>
                <li><strong>Gestion des dossiers :</strong> Clients et affaires</li>
              </ul>
              <div className="process">
                <h5> Processus typique (création d'une audience) :</h5>
                <ol>
                  <li>Clique sur "Créer Séance"</li>
                  <li>Remplit les détails (date, heure, salle, juge, avocats, etc.)</li>
                  <li>La séance apparaît dans "Gérer Séances"</li>
                  <li>Peut attribuer une salle via "Salles"</li>
                  <li>Après l'audience, archive la séance</li>
                </ol>
              </div>
            </div>
            <div className="dashboard-note">
              <strong> Particularités :</strong> Organisation pratique du tribunal • Gestion des ressources • Coordination entre acteurs
            </div>
          </div>

          {/* Dashboard Juge */}
          <div className="dashboard-card judge">
            <div className="dashboard-header">
              <div className="role-icon"></div>
              <h3>Juge</h3>
            </div>
          
            <div className="dashboard-features">
              <h4>Fonctionnalités principales :</h4>
              <ul>
                <li><strong>Agenda personnel :</strong> Toutes les séances et séances du jour</li>
                <li><strong>Gestion de profil :</strong> Mise à jour des informations personnelles</li>
                <li><strong>Informations contextuelles :</strong> Tribunal et email professionnel</li>
              </ul>
              <div className="process">
                <h5> Processus typique (consultation des séances) :</h5>
                <ol>
                  <li>Juge se connecte</li>
                  <li>Voit ses séances du jour</li>
                  <li>Clique sur "Toutes mes séances" pour le calendrier complet</li>
                  <li>Accède à son profil pour mettre à jour ses informations</li>
                </ol>
              </div>
            </div>
            <div className="dashboard-note">
              <strong> Particularités :</strong> Interface minimaliste et focalisée • Pas de gestion administrative directe
            </div>
          </div>

          {/* Dashboard Avocat */}
          <div className="dashboard-card lawyer">
            <div className="dashboard-header">
              <div className="role-icon"></div>
              <h3>Avocat</h3>
            </div>
            
            <div className="dashboard-features">
              <h4>Fonctionnalités principales :</h4>
              <ul>
                <li><strong>Tableau de bord général :</strong> Accueil personnalisé "Bonjour, Maître Avocat"</li>
                <li><strong>Gestion du profil :</strong> Informations personnelles</li>
                <li><strong>Gestion des clients et dossiers :</strong> Nouveau client, mes clients, mes affaires</li>
                <li><strong>Calendrier :</strong> Consultation des séances à venir</li>
                <li><strong>Archivage :</strong> Consultation des dossiers archivés</li>
              </ul>
              <div className="process">
                <h5> Processus d'ajout d'un client/dossier :</h5>
                <ol>
                  <li>Connexion à l'espace sécurisé</li>
                  <li><strong>Ajout d'un client :</strong> Clique sur "Nouveau Client" → Remplit fiche client</li>
                  <li><strong>Création d'une affaire :</strong> Clique sur "Nouvelle Affaire" → Associe au client</li>
                  <li><strong>Suivi :</strong> L'affaire apparaît dans "Mes Affaires"</li>
                  <li><strong>Archivage :</strong> Après clôture, archivage dans "Mes Archives"</li>
                </ol>
              </div>
            </div>
            <div className="dashboard-note">
              <strong> Particularités :</strong> Espace de gestion juridique centralisé • Gestion complète des dossiers clients
            </div>
          </div>
        </div>
      </section>

      <footer className="guide-footer">
        <p>© 2025 Application Web du Tribunal • Guide d'utilisation</p>
      </footer>
    </div>
  );
};

export default GuideUtilisation;