import React, { useState, useEffect } from "react";
import { Gavel, Calendar, FileText, LogOut, Users, Clock, Building } from "lucide-react";
import { Link } from 'react-router-dom';
import { jugeAPI } from "../services/api.js";

const DashboardJuge = () => {
  const [user, setUser] = useState({});
  const [seances, setSeances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
    chargerSeances();
  }, []);

  const chargerSeances = async () => {
    try {
      setLoading(true);
      const data = await jugeAPI.getMesSeances();
      setSeances(data);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  // Formater l'heure
  const formaterHeure = (heure) => {
    if (!heure) return "Non définie";
    return new Date(`2000-01-01T${heure}`).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formater la date
  const formaterDate = (dateString) => {
    if (!dateString) return "Date non définie";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // Filtrer les séances d'aujourd'hui
  const seancesAujourdhui = seances.filter(seance => {
    if (!seance.dateSeance) return false;
    const aujourdhui = new Date().toISOString().split('T')[0];
    const seanceDate = new Date(seance.dateSeance).toISOString().split('T')[0];
    return aujourdhui === seanceDate;
  });

  // Séances à venir (après aujourd'hui)
  const seancesAvenir = seances.filter(seance => {
    if (!seance.dateSeance) return false;
    const aujourdhui = new Date().toISOString().split('T')[0];
    const seanceDate = new Date(seance.dateSeance).toISOString().split('T')[0];
    return seanceDate > aujourdhui;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-600 font-medium">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-700 to-amber-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <Gavel className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Tableau de Bord Juge</h1>
                <p className="text-amber-200">Bienvenue, {user.nom || "Monsieur le Juge"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-4 py-2 rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Section principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne de gauche - Actions rapides */}
          <div className="lg:col-span-1">
            {/* Profil */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{user.nom || "Juge"}</h2>
                  <p className="text-gray-600 text-sm">Tribunal de Grande Instance</p>
                  <p className="text-amber-600 text-sm font-medium mt-1">{user.email || "juge@tribunal.dz"}</p>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Actions Rapides</h3>
              <div className="space-y-3">
                <Link to="/dashboard-juge/mes-seances" className="block">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all hover:shadow-md border border-blue-200">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-700">Toutes mes séances</span>
                  </div>
                </Link>
                
                <Link to="/dashboard-juge/mon-profile" className="block">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all hover:shadow-md border border-purple-200">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-700">Mon profil</span>
                  </div>
                </Link>
              </div>
            </div>

           
          </div>

          {/* Colonne de droite - Séances */}
          <div className="lg:col-span-2">
            {/* Séances d'aujourd'hui */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-amber-600" />
                    Séances d'Aujourd'hui
                  </h2>
                  <p className="text-gray-600 mt-1">{formaterDate(new Date())}</p>
                </div>
                <span className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  {seancesAujourdhui.length} séance{seancesAujourdhui.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {seancesAujourdhui.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-10 h-10 text-amber-600" />
                  </div>
                  <p className="text-gray-600 text-lg">Aucune séance prévue aujourd'hui</p>
                  <p className="text-gray-400 mt-2">Profitez de cette journée pour étudier vos dossiers</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {seancesAujourdhui
                    .sort((a, b) => (a.heure || '').localeCompare(b.heure || ''))
                    .map((seance) => (
                      <div key={seance.idSeance} className="bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 p-5 rounded-xl border border-blue-200 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center min-w-[70px]">
                              <Clock className="w-5 h-5 text-blue-600 mb-1" />
                              <span className="text-lg font-bold text-blue-700">
                                {formaterHeure(seance.heure)}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 text-lg">
                                {seance.typeSeance || "Séance d'audience"}
                              </h3>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="flex items-center gap-1 text-sm text-gray-600">
                                  <Building className="w-4 h-4" />
                                  {seance.salle || "Salle non définie"}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-gray-600">
                                  <FileText className="w-4 h-4" />
                                  Affaire {seance.affaireId || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              seance.statut === 'planifiée' ? 'bg-green-100 text-green-800' :
                              seance.statut === 'en cours' ? 'bg-yellow-100 text-yellow-800' :
                              seance.statut === 'terminée' ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {seance.statut || "Non défini"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Prochaines séances */}
            {seancesAvenir.length > 0 && (
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-green-600" />
                    Prochaines Séances
                  </h2>
                  <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                    {seancesAvenir.length} à venir
                  </span>
                </div>
                
                <div className="space-y-4">
                  {seancesAvenir
                    .slice(0, 3) // Montrer seulement 3 prochaines
                    .map((seance) => (
                      <div key={seance.idSeance} className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 p-4 rounded-xl border border-green-200 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center min-w-[80px]">
                              <span className="text-sm text-gray-500">
                                {formaterDate(seance.dateSeance)}
                              </span>
                              <span className="text-lg font-bold text-green-700">
                                {formaterHeure(seance.heure)}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {seance.typeSeance || "Séance d'audience"}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                Salle {seance.salle || "non définie"} • Affaire {seance.affaireId || "N/A"}
                              </p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-xs font-medium">
                            {seance.statut || "Planifiée"}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardJuge;