import React, { useState, useEffect } from "react";
import { avocatAPI } from "../services/api.js";

const MesSeances = () => {
  const [seancesData, setSeancesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("");
  const [showOnlyDemain, setShowOnlyDemain] = useState(false);

  useEffect(() => {
    chargerSeances();
  }, []);

  const chargerSeances = async () => {
    try {
      setLoading(true);
      const data = await avocatAPI.getMesSeances();
      setSeancesData(data);
    } catch (error) {
      console.error("Erreur lors du chargement des séances:", error);
    } finally {
      setLoading(false);
    }
  };

  const formaterDate = (date) => {
    if (!date) return "Non définie";
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const formaterHeure = (heure) => {
    if (!heure) return "";
    return heure.substring(0, 5);
  };

  // Vérifier si une date est demain
  const estDemain = (date) => {
    if (!date) return false;
    const aujourdhui = new Date();
    const demain = new Date();
    demain.setDate(aujourdhui.getDate() + 1);
    
    const dateReservation = new Date(date);
    
    return dateReservation.getDate() === demain.getDate() &&
           dateReservation.getMonth() === demain.getMonth() &&
           dateReservation.getFullYear() === demain.getFullYear();
  };

  // Filtrer les séances
  const seancesFiltrees = seancesData.filter(item => {
    // Filtre par recherche
    const matchesSearch = 
      item.seance.seanceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.seance.typeSeance?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.seance.affaireId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtre par type
    const matchesType = !selectedType || item.seance.typeSeance === selectedType;
    
    // Filtre par statut
    const matchesStatut = !selectedStatut || item.seance.statut === selectedStatut;
    
    // Filtre "demain seulement"
    if (showOnlyDemain) {
      const aDesReservationsDemain = item.reservations.some(res => estDemain(res.dateReservee));
      if (!aDesReservationsDemain) return false;
    }
    
    return matchesSearch && matchesType && matchesStatut;
  });

  // Extraire les types et statuts uniques
  const typesSeance = [...new Set(seancesData.map(item => item.seance.typeSeance).filter(Boolean))];
  const statuts = [...new Set(seancesData.map(item => item.seance.statut).filter(Boolean))];

  // Compter les séances de demain
  const seancesDemainCount = seancesData.filter(item => 
    item.reservations.some(res => estDemain(res.dateReservee))
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des séances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">⚖️ Mes Séances</h1>
          <p className="text-gray-600 text-lg">
            {seancesFiltrees.length} séance(s) trouvée(s)
            {showOnlyDemain && ` (dont ${seancesDemainCount} demain)`}
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Barre de recherche */}
            <div className="md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Rechercher une séance..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>
            
            {/* Type de séance */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">Tous les types</option>
              {typesSeance.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>

            {/* Statut */}
            <select
              value={selectedStatut}
              onChange={(e) => setSelectedStatut(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">Tous les statuts</option>
              {statuts.map((statut, index) => (
                <option key={index} value={statut}>{statut}</option>
              ))}
            </select>

            {/* Bouton "Demain seulement" */}
            <button
              onClick={() => setShowOnlyDemain(!showOnlyDemain)}
              className={`px-4 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                showOnlyDemain 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {showOnlyDemain ? 'Toutes' : 'Demain'}
            </button>
          </div>
        </div>

        {/* Liste des séances */}
        {seancesFiltrees.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">⚖️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {seancesData.length === 0 ? "Aucune séance trouvée" : "Aucun résultat"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {seancesData.length === 0 
                ? "Vous n'avez pas encore de séances programmées"
                : "Aucune séance ne correspond à vos critères de recherche"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {seancesFiltrees.map((item, index) => {
              // Trouver les réservations de demain pour cette séance
              const reservationsDemain = item.reservations.filter(res => estDemain(res.dateReservee));
              
              return (
                <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100">
                  <div className="p-6">
                    {/* Header avec badge "Demain" si applicable */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 font-mono">
                          {item.seance.seanceId}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-gray-600">{item.seance.typeSeance}</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.seance.statut === 'EN_COURS' ? 'bg-green-100 text-green-800 border-green-200' :
                            item.seance.statut === 'ANNULEE' ? 'bg-red-100 text-red-800 border-red-200' :
                            item.seance.statut === 'TERMINEE' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                            'bg-yellow-100 text-yellow-800 border-yellow-200'
                          }`}>
                            {item.seance.statut}
                          </span>
                          {reservationsDemain.length > 0 && (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                              📅 Demain
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">ID Affaire</div>
                        <div className="font-medium text-gray-800">{item.seance.affaireId}</div>
                      </div>
                    </div>

                    {/* Informations générales */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Juge assigné</p>
                        <p className="text-gray-800">{item.seance.jugeId || "Non assigné"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total réservations</p>
                        <p className="text-gray-800">{item.nombreReservations}</p>
                      </div>
                    </div>

                    {/* Section Réservations */}
                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <span>📅 Réservations</span>
                        {reservationsDemain.length > 0 && (
                          <span className="text-sm text-blue-600">
                            ({reservationsDemain.length} demain)
                          </span>
                        )}
                      </h4>
                      
                      {item.reservations.length === 0 ? (
                        <p className="text-gray-500 italic text-sm p-3 bg-gray-50 rounded-lg">
                          Aucune réservation pour cette séance
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {item.reservations.map((reservation) => {
                            const estReservationDemain = estDemain(reservation.dateReservee);
                            
                            return (
                              <div 
                                key={reservation.reservationId} 
                                className={`p-4 rounded-lg border ${estReservationDemain 
                                  ? 'bg-blue-50 border-blue-200' 
                                  : 'bg-gray-50 border-gray-200'
                                }`}
                              >
                                {estReservationDemain && (
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    <span className="text-xs font-medium text-blue-600">
                                      ⚠️ Séance de demain
                                    </span>
                                  </div>
                                )}
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-500">Salle</p>
                                    <p className="font-medium text-gray-800">
                                      {reservation.salleId || reservation.salle?.salleId || "Non assignée"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Date</p>
                                    <p className="font-medium text-gray-800">
                                      {formaterDate(reservation.dateReservee)}
                                      {estReservationDemain && " 🚨"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Heure</p>
                                    <p className="font-medium text-gray-800">
                                      {formaterHeure(reservation.heureReservee)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">ID Réservation</p>
                                    <p className="font-medium text-gray-800">
                                      {reservation.reservationId}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Note pour les séances de demain */}
                    {reservationsDemain.length > 0 && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-700 text-sm">
                          <span className="font-medium">📌 Rappel :</span> Vous avez {reservationsDemain.length} 
                          séance{reservationsDemain.length > 1 ? 's' : ''} programmée{reservationsDemain.length > 1 ? 's' : ''} pour demain
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats en bas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total séances</p>
              <p className="text-2xl font-bold text-gray-800">{seancesData.length}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500">Séances demain</p>
              <p className="text-2xl font-bold text-blue-600">{seancesDemainCount}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500">En cours</p>
              <p className="text-2xl font-bold text-green-600">
                {seancesData.filter(item => item.seance.statut === 'EN_COURS').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MesSeances;