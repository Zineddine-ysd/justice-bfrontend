import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Marcher from "./pages/Marcher.jsx";
import SeConnecter from "./pages/SeConnecter.jsx";
import DashboardAdmin from "./components/DashboardAdmin.jsx";
import DashboardAvocat from "./components/DashboardAvocat.jsx";
import DashboardSecretaire from "./components/DashboardSecretaire.jsx";
import DashboardJuge from "./components/DashboardJuge.jsx";

// Pages Admin

import AjouterAvocat from "./fonctions/ajouteravocat";
import AjouterJuge from "./fonctions/ajouterjuge";
import Historique from "./fonctions/historique";
import ListerAvocat from "./fonctions/listeravocat";
import ListerJuge from "./fonctions/listerjuge";
import ArchivesSeancesA from "./fonctions/allarchivesAdm.jsx";



//pages juge
import SeanceJuge from "./fonctions/MesSeancesJuge.jsx";
import MonProfileJuge from "./components/profilJuge.jsx";



//pages avocat
import MonProfileAvocat from "./components/profilAvo.jsx";
import AjoutCli from "./fonctions/ajouterclient.jsx";    
import ListerClientAV from "./fonctions/listerclient";
import ListerMesAffaires from "./fonctions/affaireavo.jsx"
import CreerAffaire from "./fonctions/ajouteraffaire.jsx";
import ArchivesAvocat from "./fonctions/archivesavocat.jsx";
import SeancesAvo from "./fonctions/MesSeances.jsx";
//pages secretaire
import MonProfileSecretaire from "./components/profilSec.jsx";
import SecClient from "./fonctions/listerclientsecr.jsx";
import SecHist from "./fonctions/affairesecr.jsx";
import SecAvocats from"./fonctions/listeravocatcli.jsx";
import Salles from "./fonctions/salles.jsx";
 import Addseancessecr from "./fonctions/ajouterseance.jsx";
import SeancesSecr from "./fonctions/listerseancessecr.jsx";
import Reservation from "./fonctions/reservation.jsx";
import ArchivesSeances from "./fonctions/allarchives.jsx";

const App = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Masquer navbar sur tous les dashboard
  const shouldShowNavbar = !location.pathname.startsWith("/dashboard-");

  const requireAuth = (component, expectedRole) => {
    return token && role === expectedRole
      ? component
      : <Navigate to="/home/se-connecter" replace />;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-amber-50">

      {shouldShowNavbar && <Navbar />}

      <main className={shouldShowNavbar ? "pt-20 pb-10" : "min-h-screen"}>
        <Routes>

          {/* Public */}
          <Route path="/home" element={<Home />} />
          <Route path="/home/marcher" element={<Marcher />} />
          <Route path="/home/se-connecter" element={<SeConnecter />} />

          {/* Dashboard Admin */}
          <Route
            path="/dashboard-admin"
            element={requireAuth(<DashboardAdmin />, "admin")}
          />

          {/* Sous-pages admin */}
          <Route
            path="/dashboard-admin/ajouter-avocat"
            element={requireAuth(<AjouterAvocat />, "admin")}
          />
          <Route
            path="/dashboard-admin/ajouter-juge"
            element={requireAuth(<AjouterJuge />, "admin")}
          />
          <Route
            path="/dashboard-admin/historique-juridique"
            element={requireAuth(<Historique />, "admin")}
          />
         
          <Route
            path="/dashboard-admin/lister-avocat"
            element={requireAuth(<ListerAvocat />, "admin")}
          />
          <Route
            path="/dashboard-admin/lister-juge"
            element={requireAuth(<ListerJuge />, "admin")}
/>
<Route path="/dashboard-admin/archives-seances"
element={requireAuth(<ArchivesSeancesA />, "admin")}
/>
          {/* Dashboard Avocat */}
          <Route
            path="/dashboard-avocat"
            element={requireAuth(<DashboardAvocat />, "avocat")}
          />
          <Route
            path="/dashboard-avocat/mes-archives"
            element={requireAuth(<ArchivesAvocat />, "avocat")}
          />
          <Route
            path="/dashboard-avocat/mon-profile"
            element={requireAuth(<MonProfileAvocat />, "avocat")}
          />
          <Route
            path="/dashboard-avocat/ajouter-client"
            element={requireAuth(<AjoutCli />, "avocat")}
          />
          <Route 
          path="/dashboard-avocat/mes-affaires"
          element={requireAuth(<ListerMesAffaires />, "avocat")}
          />

          <Route 
          path="/dashboard-avocat/mes-seances"
          element={requireAuth(<SeancesAvo />, "avocat")}
          />
          <Route
          path= "/dashboard-avocat/mes-clients"
          element={requireAuth(<ListerClientAV />, "avocat")}
          />
          <Route
            path="/dashboard-avocat/ajouter-affaire"
            element={requireAuth(<CreerAffaire />, "avocat")}
          />




          {/* Dashboard Secretaire */}
          <Route
            path="/dashboard-secretaire/reservations"
            element={requireAuth(<Reservation />, "secretaire")}
          />
          <Route
            path="/dashboard-secretaire"
            element={requireAuth(<DashboardSecretaire />, "secretaire")}
          />
          <Route
            path="/dashboard-secretaire/mon-profile"
            element={requireAuth(<MonProfileSecretaire />, "secretaire")}
            />
          <Route 
          path="/dashboard-secretaire/clients"
          element={requireAuth(<SecClient />, "secretaire")}
          />
         <Route
            path="/dashboard-secretaire/salles"
            element={requireAuth(<Salles />, "secretaire")}
          />
          <Route
            path="/dashboard-secretaire/affaires"
            element={requireAuth(<SecHist />, "secretaire")}
          />
          <Route
            path="/dashboard-secretaire/avocat"
            element={requireAuth(<SecAvocats />, "secretaire")}
/>
<Route path="/dashboard-secretaire/archives-seances"
element={requireAuth(<ArchivesSeances />, "secretaire")}
/>
<Route 
path="/dashboard-secretaire/creer-seance"
element ={requireAuth(<Addseancessecr/>,"secretaire")}
/>
<Route 
path="/dashboard-secretaire/seances"
element ={requireAuth(<SeancesSecr />, "secretaire")}
/>

          {/* Dashboard Juge */}
          <Route
            path="/dashboard-juge"
            element={requireAuth(<DashboardJuge />, "juge")}
          />
          <Route
            path="/dashboard-juge/mes-seances"
            element={requireAuth(<SeanceJuge />, "juge")}
          />
          <Route
            path="/dashboard-juge/mon-profile"
            element={requireAuth(<MonProfileJuge />, "juge")}
            />



          {/* Default */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />

        </Routes>
      </main>

      {shouldShowNavbar && (
        <footer className="bg-blue-900 text-amber-200 py-6 text-center">
          <p className="text-sm">© 2025 JusticeDz – Tous droits réservés ⚖️</p>
        </footer>
      )}
    </div>
  );
};

export default App;
