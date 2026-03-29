import React, { useState, useEffect } from "react";
import { rechercheAPI } from "../services/api.js";

const AllArchives = () => {
  const [archivesAffaires, setArchivesAffaires] = useState([]);
  const [archivesSeances, setArchivesSeances] = useState([]);
  const [loadingAffaires, setLoadingAffaires] = useState(true);
  const [loadingSeances, setLoadingSeances] = useState(true);
  const [activeTab, setActiveTab] = useState("affaires");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    chargerArchivesAffaires();
    chargerArchivesSeances();
  }, []);

  const chargerArchivesAffaires = async () => {
    try {
      setLoadingAffaires(true);
      const data = await rechercheAPI.getAllArchives();
      setArchivesAffaires(data);
    } catch (error) {
      console.error("Erreur lors du chargement des archives d'affaires:", error);
    } finally {
      setLoadingAffaires(false);
    }
  };

  const chargerArchivesSeances = async () => {
    try {
      setLoadingSeances(true);
      const data = await rechercheAPI.getArchives();
      setArchivesSeances(data);
    } catch (error) {
      console.error("Erreur lors du chargement des archives de séances:", error);
    } finally {
      setLoadingSeances(false);
    }
  };

  // Filtrer les archives selon la recherche
  const filteredAffaires = archivesAffaires.filter(archive =>
    archive.affaireId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    archive.typeAffaire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    archive.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSeances = archivesSeances.filter(archive =>
    archive.seanceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    archive.typeSeance?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    archive.affaireId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formaterDate = (date) => {
    if (!date) return "Non définie";
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formaterDateTime = (dateTime) => {
    if (!dateTime) return "Non définie";
    const date = new Date(dateTime);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatutColor = (statut) => {
    switch (statut?.toUpperCase()) {
      case 'EN_COURS': return 'bg-yellow-100 text-yellow-800';
      case 'TERMINEE': return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE': return 'bg-blue-100 text-blue-800';
      case 'ANNULEE': return 'bg-red-100 text-red-800';
      case 'CLOTUREE': return 'bg-gray-100 text-gray-800';
      case 'ACTIVE': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isLoading = loadingAffaires && loadingSeances;
  const currentData = activeTab === "affaires" ? filteredAffaires : filteredSeances;
  const currentCount = activeTab === "affaires" ? filteredAffaires.length : filteredSeances.length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement des archives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🗃️ Archives Complètes
          </h1>
          <p className="text-gray-600 text-lg">
            Consultation de toutes les archives d'affaires et de séances
          </p>
        </div>

        {/* Tabs et Recherche */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            {/* Tabs */}
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("affaires")}
                className={`px-6 py-3 rounded-xl font-medium transition ${activeTab === "affaires" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                📋 Affaires ({archivesAffaires.length})
              </button>
              <button
                onClick={() => setActiveTab("seances")}
                className={`px-6 py-3 rounded-xl font-medium transition ${activeTab === "seances" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                ⚖️ Séances ({archivesSeances.length})
              </button>
            </div>

            {/* Barre de recherche */}
            <div className="relative w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder={`Rechercher dans les ${activeTab === "affaires" ? "affaires" : "séances"}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-lg">📋</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Affaires archivées</p>
                  <p className="text-xl font-bold text-gray-800">{archivesAffaires.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-green-600 text-lg">⚖️</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Séances archivées</p>
                  <p className="text-xl font-bold text-gray-800">{archivesSeances.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-purple-600 text-lg">📊</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total archives</p>
                  <p className="text-xl font-bold text-gray-800">{archivesAffaires.length + archivesSeances.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des archives */}
        {currentCount === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-7xl mb-6 text-gray-300">📁</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              Aucune archive trouvée
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm 
                ? `Aucune ${activeTab === "affaires" ? "affaire" : "séance"} ne correspond à votre recherche`
                : `Aucune ${activeTab === "affaires" ? "affaire" : "séance"} n'a été archivée pour le moment`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeTab === "affaires" ? (
              filteredAffaires.map((archive) => (
                <div key={archive.archiveId} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 font-mono">
                          {archive.affaireId}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-gray-600">{archive.typeAffaire}</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatutColor(archive.statut)}`}>
                            {archive.statut}
                          </span>
                        </div>
                      </div>
                      <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                        Archivée
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {archive.description || "Aucune description disponible"}
                    </p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm">📅 Création:</span>
                        <span className="text-sm font-medium">{formaterDate(archive.dateCreation)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm">🏛️ Tribunal:</span>
                        <span className="text-sm font-medium">{archive.tribunalId || "Non spécifié"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm">👤 Client:</span>
                        <span className="text-sm font-medium">{archive.clientId || "Non assigné"}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">📁 Archivée le:</span>
                        <span className="text-sm font-medium">{formaterDateTime(archive.dateArchive)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              filteredSeances.map((archive) => (
                <div key={archive.archiveId} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 font-mono">
                          {archive.seanceId}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-gray-600">{archive.typeSeance}</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatutColor(archive.statut)}`}>
                            {archive.statut}
                          </span>
                        </div>
                      </div>
                      <div className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-medium">
                        Séance archivée
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm">📋 Affaire:</span>
                        <span className="text-sm font-medium">{archive.affaireId || "Non spécifiée"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm">⚖️ Juge:</span>
                        <span className="text-sm font-medium">{archive.jugeId || "Non assigné"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm">👨‍💼 Avocat:</span>
                        <span className="text-sm font-medium">{archive.avocatId || "Non assigné"}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">📁 Archivée le:</span>
                        <span className="text-sm font-medium">{formaterDateTime(archive.dateArchive)}</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {archive.statut === "ANNULEE" ? "Séance annulée" : "Séance terminée"}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Note informative */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-gray-500 text-sm bg-gray-50 px-4 py-3 rounded-xl">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>
              {activeTab === "affaires" 
                ? "Les affaires sont archivées automatiquement après 1 an ou manuellement par les avocats"
                : "Les séances sont archivées automatiquement lorsqu'elles sont annulées ou terminées"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllArchives;