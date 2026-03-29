import React, { useState, useEffect } from "react";
import { avocatAPI } from "../services/api.js";

const affaireavo = () => {
  const [affaires, setAffaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("");
  const [changingStatut, setChangingStatut] = useState(null);
  const [archivingId, setArchivingId] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    chargerAffaires();
  }, []);

  const chargerAffaires = async () => {
    try {
      setLoading(true);
      const data = await avocatAPI.getMesAffaires();
      setAffaires(data);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchiverAffaire = async (affaireId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir archiver cette affaire ? Elle sera déplacée vers les archives.")) {
      return;
    }

    try {
      setArchivingId(affaireId);
      setError("");
      setSuccessMsg("");

      await avocatAPI.archiverAffaire(affaireId);
      
      // Mettre à jour la liste
      setAffaires(prevAffaires => 
        prevAffaires.filter(affaire => affaire.affaireId !== affaireId)
      );
      
      setSuccessMsg(`✅ Affaire ${affaireId} archivée avec succès !`);
      console.log(`Affaire ${affaireId} archivée`);
      
      // Cacher le message après 3 secondes
      setTimeout(() => setSuccessMsg(""), 3000);
      
    } catch (err) {
      setError(err.message || "Erreur lors de l'archivage");
      console.error(err);
    } finally {
      setArchivingId(null);
    }
  };

  const handleChangerStatut = async (affaireId, nouveauStatut) => {
    try {
      setChangingStatut(affaireId);
      setError("");
      setSuccessMsg("");
      
      await avocatAPI.changerStatutAffaire(affaireId, { statut: nouveauStatut });
      
      setAffaires(prevAffaires => 
        prevAffaires.map(affaire => 
          affaire.affaireId === affaireId 
            ? { ...affaire, statut: nouveauStatut } 
            : affaire
        )
      );
      
      setSuccessMsg(`✅ Statut de l'affaire ${affaireId} changé à ${nouveauStatut}`);
      setTimeout(() => setSuccessMsg(""), 3000);
      
    } catch (err) {
      setError(err.message || "Erreur lors du changement de statut");
      console.error(err);
    } finally {
      setChangingStatut(null);
    }
  };

  // Fonction pour vérifier si on peut changer le statut
  const peutChangerStatut = (statutActuel) => {
    return !["ANNULEE", "TERMINEE"].includes(statutActuel);
  };

  // Fonction pour vérifier si on peut archiver (par exemple, seulement les affaires terminées ou annulées)
  const peutArchiver = (statutActuel) => {
    return ["TERMINEE", "ANNULEE", "CLOTUREE"].includes(statutActuel);
  };

  // Filtrer les affaires
  const affairesFiltrees = affaires.filter(affaire => {
    const matchesSearch = affaire.affaireId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affaire.typeAffaire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affaire.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !selectedType || affaire.typeAffaire === selectedType;
    const matchesStatut = !selectedStatut || affaire.statut === selectedStatut;
    
    return matchesSearch && matchesType && matchesStatut;
  });

  // Extraire les types et statuts uniques
  const typesAffaire = [...new Set(affaires.map(affaire => affaire.typeAffaire).filter(Boolean))];
  const statuts = [...new Set(affaires.map(affaire => affaire.statut).filter(Boolean))];

  const formaterDate = (date) => {
    if (!date) return "Non définie";
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculerJoursRestants = (dateJugement) => {
    if (!dateJugement) return null;
    const aujourdhui = new Date();
    const jugement = new Date(dateJugement);
    const diffTime = jugement - aujourdhui;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatutColor = (statut) => {
    switch (statut?.toUpperCase()) {
      case 'EN_COURS': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'TERMINEE': return 'bg-green-100 text-green-800 border-green-200';
      case 'EN_ATTENTE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ANNULEE': return 'bg-red-100 text-red-800 border-red-200';
      case 'CLOTUREE': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'ACTIVE': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Options de statuts pour le select (sans ANNULEE et TERMINEE quand on veut changer)
  const statutOptions = [
    { value: 'EN_COURS', label: 'En cours' },
    { value: 'EN_ATTENTE', label: 'En attente' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'CLOTUREE', label: 'Clôturée' },
    { value: 'TERMINEE', label: 'Terminée' },
    { value: 'ANNULEE', label: 'Annulée' }
  ];

  // Options pour le changement (sans ANNULEE et TERMINEE comme options de changement)
  const statutOptionsChangement = [
    { value: 'EN_COURS', label: 'En cours' },
    { value: 'EN_ATTENTE', label: 'En attente' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'CLOTUREE', label: 'Clôturée' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des affaires...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📋 Mes Affaires</h1>
          <p className="text-gray-600 text-lg">{affairesFiltrees.length} affaire(s) trouvée(s)</p>
        </div>

        {/* Message de succès */}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-700">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{successMsg}</span>
            </div>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-700">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="🔍 Rechercher une affaire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            >
              <option value="">Tous les types</option>
              {typesAffaire.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={selectedStatut}
              onChange={(e) => setSelectedStatut(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            >
              <option value="">Tous les statuts</option>
              {statuts.map((statut, index) => (
                <option key={index} value={statut}>
                  {statutOptions.find(s => s.value === statut)?.label || statut}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Liste des affaires */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {affairesFiltrees.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune affaire trouvée</h3>
              <p className="text-gray-500">Aucune affaire ne correspond à vos critères de recherche.</p>
            </div>
          ) : (
            affairesFiltrees.map((affaire) => {
              const joursRestants = calculerJoursRestants(affaire.dateJugement);
              const isChanging = changingStatut === affaire.affaireId;
              const isArchiving = archivingId === affaire.affaireId;
              const peutChanger = peutChangerStatut(affaire.statut);
              const peutEtreArchivee = peutArchiver(affaire.statut);
              
              return (
                <div key={affaire.affaireId} className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 font-mono">
                          {affaire.affaireId}
                        </h3>
                        <p className="text-gray-600 mt-1">{affaire.typeAffaire}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatutColor(affaire.statut)}`}>
                          {statutOptions.find(s => s.value === affaire.statut)?.label || affaire.statut}
                        </span>
                        {!peutChanger && (
                          <span className="text-xs text-red-600">
                            (Verrouillé)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-4 italic">
                      {affaire.description || "Aucune description disponible"}
                    </p>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">📅 Création</p>
                        <p className="text-sm text-gray-800">{formaterDate(affaire.dateCreation)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">⚖️ Jugement</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-800">{formaterDate(affaire.dateJugement)}</p>
                          {joursRestants !== null && joursRestants > 0 && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                              {joursRestants} jour{joursRestants > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Informations supplémentaires */}
                    <div className="border-t border-gray-100 pt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-gray-500">🏛️ Tribunal</p>
                          <p className="text-gray-800 font-medium">{affaire.tribunalId || "Non assigné"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">👥 Client</p>
                          <p className="text-gray-800 font-medium">{affaire.clientId || "Non assigné"}</p>
                        </div>
                      </div>
                      
                      {/* Section changement de statut */}
                      <div className="border-t border-gray-100 pt-4 mb-4">
                        {peutChanger ? (
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-700">Changer le statut :</p>
                            <div className="flex gap-2">
                              <select
                                value={affaire.statut}
                                onChange={(e) => handleChangerStatut(affaire.affaireId, e.target.value)}
                                disabled={isChanging}
                                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              >
                                {affaire.statut === "TERMINEE" || affaire.statut === "ANNULEE" ? (
                                  <option value={affaire.statut}>
                                    {statutOptions.find(s => s.value === affaire.statut)?.label || affaire.statut}
                                  </option>
                                ) : (
                                  <>
                                    {statutOptionsChangement.map(option => (
                                      <option key={option.value} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                    <option value="TERMINEE">Terminée (verrouille l'affaire)</option>
                                    <option value="ANNULEE">Annulée (verrouille l'affaire)</option>
                                  </>
                                )}
                              </select>
                              {isChanging && (
                                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-gray-600 text-sm">
                              ⚠️ Cette affaire est {affaire.statut.toLowerCase()}. Le statut ne peut plus être modifié.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Bouton d'archivage */}
                      <div className="border-t border-gray-100 pt-4">
                        <button
                          onClick={() => handleArchiverAffaire(affaire.affaireId)}
                          disabled={isArchiving || !peutEtreArchivee}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition ${
                            peutEtreArchivee
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {isArchiving ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Archivage en cours...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                              </svg>
                              <span>
                                {peutEtreArchivee 
                                  ? "📁 Archiver cette affaire" 
                                  : "❌ Archive disponible uniquement pour les affaires Terminées/Annulées"}
                              </span>
                            </>
                          )}
                        </button>
                        {peutEtreArchivee && (
                          <p className="text-xs text-gray-500 text-center mt-2">
                            L'affaire sera déplacée vers les archives et retirée de cette liste
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Alerte si jugement proche */}
                    {joursRestants !== null && joursRestants <= 7 && joursRestants > 0 && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-700 text-sm font-medium">
                          ⚠️ Jugement dans {joursRestants} jour{joursRestants > 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default affaireavo;