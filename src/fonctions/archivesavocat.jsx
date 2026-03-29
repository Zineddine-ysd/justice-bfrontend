import React, { useState, useEffect } from "react";
import { avocatAPI } from "../services/api.js";

const ArchivesAvocat = () => {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    chargerArchives();
  }, []);

  const chargerArchives = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Appel à l'API pour récupérer les archives de l'avocat
      const data = await avocatAPI.getArchives();
      setArchives(data);
      
    } catch (error) {
      console.error("Erreur lors du chargement des archives:", error);
      setError("Erreur lors du chargement des archives");
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les archives
  const archivesFiltrees = archives.filter(archive => {
    const matchesSearch = archive.affaireId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         archive.typeAffaire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         archive.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !selectedType || archive.typeAffaire === selectedType;
    const matchesStatut = !selectedStatut || archive.statut === selectedStatut;
    
    return matchesSearch && matchesType && matchesStatut;
  });

  // Extraire les types et statuts uniques
  const typesAffaire = [...new Set(archives.map(archive => archive.typeAffaire).filter(Boolean))];
  const statuts = [...new Set(archives.map(archive => archive.statut).filter(Boolean))];

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
      case 'EN_COURS': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'TERMINEE': return 'bg-green-100 text-green-800 border-green-200';
      case 'EN_ATTENTE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ANNULEE': return 'bg-red-100 text-red-800 border-red-200';
      case 'CLOTUREE': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'ACTIVE': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
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
            📁 Archives des Affaires
          </h1>
          <p className="text-gray-600 text-lg">
            Retrouvez ici toutes vos affaires archivées
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{archivesFiltrees.length} affaire(s) archivée(s)</span>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center text-red-700">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Rechercher dans les archives..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
            >
              <option value="">Tous les types</option>
              {typesAffaire.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={selectedStatut}
              onChange={(e) => setSelectedStatut(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
            >
              <option value="">Tous les statuts</option>
              {statuts.map((statut, index) => (
                <option key={index} value={statut}>{statut}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Liste des archives */}
        {archivesFiltrees.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="text-7xl mb-6 text-gray-300">📁</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              {archives.length === 0 ? "Aucune archive trouvée" : "Aucun résultat"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {archives.length === 0 
                ? "Vous n'avez pas encore d'affaires archivées. Les archives se rempliront automatiquement."
                : "Aucune archive ne correspond à vos critères de recherche."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {archivesFiltrees.map((archive) => (
              <div 
                key={archive.archiveId || archive.affaireId} 
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header avec badge d'archive */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">📋</span>
                        <h3 className="text-xl font-bold text-gray-800 font-mono">
                          {archive.affaireId}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600">{archive.typeAffaire}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatutColor(archive.statut)}`}>
                          {archive.statut}
                        </span>
                      </div>
                    </div>
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                      Archivée
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <p className="text-gray-700 line-clamp-3">
                      {archive.description || "Aucune description disponible"}
                    </p>
                  </div>

                  {/* Dates importantes */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-sm">📅</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Création</p>
                        <p className="text-sm font-medium text-gray-800">{formaterDate(archive.dateCreation)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-sm">🏛️</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tribunal</p>
                        <p className="text-sm font-medium text-gray-800">{archive.tribunalId || "Non spécifié"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 text-sm">👤</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Client</p>
                        <p className="text-sm font-medium text-gray-800">{archive.clientId || "Non assigné"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Section d'archivage */}
                  <div className="border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600 text-sm">📁</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date d'archivage</p>
                        <p className="text-sm font-medium text-gray-800">
                          {formaterDateTime(archive.dateArchive)}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 text-center">
                        ✅ Cette affaire a été archivée et conservée pour consultation historique
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Note informative */}
        {archivesFiltrees.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-gray-500 text-sm bg-gray-50 px-4 py-2 rounded-lg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Les archives sont automatiquement créées pour les affaires de plus d'un an</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivesAvocat;