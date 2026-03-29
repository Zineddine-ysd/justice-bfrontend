import React, { useState, useEffect } from "react";
import { secretaireAPI } from "../services/api.js";

const Salles = () => {
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chargerSalles();
  }, []);

  const chargerSalles = async () => {
    try {
      const data = await secretaireAPI.getSalles();
      setSalles(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-500/20 rounded-full">
            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (salles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-6">🏛️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Aucune salle disponible</h2>
          <p className="text-gray-600">Aucune salle n'est actuellement enregistrée.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* En-tête élégant */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-6">
            <span className="text-4xl">🏛️</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Salles du Tribunal</h1>
          <div className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
            <span className="text-gray-700">
              <span className="font-bold text-blue-600">{salles.length}</span> salle{salles.length > 1 ? 's' : ''} disponible{salles.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Grille moderne */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salles.map((salle, index) => (
            <div
              key={salle.salleId}
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
            >
              {/* Effet de fond décoratif */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Bandeau supérieur avec numéro */}
              <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-500 to-purple-500 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                #{index + 1}
              </div>

              {/* Carte principale */}
              <div className="p-6 relative">
                {/* Icône décorative */}
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-500">
                  <span className="text-3xl">🏛️</span>
                </div>

                {/* Titre principal */}
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  Salle : {salle.salleId}
                </h3>

                {/* Code d'identification */}
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-1">Identifiant unique</div>
                  <div className="font-mono text-lg font-semibold text-gray-800 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                    {salle.salleId}
                  </div>
                </div>

                {/* Ligne décorative */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4"></div>

              
              </div>

              {/* Effet de bordure animée */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          ))}
        </div>

        {/* Footer élégant */}
        <div className="mt-12 pt-8 border-t border-gray-200/50 text-center">
          <p className="text-gray-500 text-sm">
            Système de gestion des salles • Tribunal de Justice
          </p>
        </div>
      </div>
    </div>
  );
};

export default Salles;