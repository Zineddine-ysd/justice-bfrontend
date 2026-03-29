import React, { useState, useEffect } from "react";
import { avocatAPI } from "../services/api.js";
import { useNavigate } from "react-router-dom";

const ajouteraffaire = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");
  const [showClientList, setShowClientList] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  
  const [formData, setFormData] = useState({
    affaireId: "",
    typeAffaire: "",
    description: "",
    dateCreation: new Date().toISOString().split('T')[0],
    dateJugement: "",
    statut: "EN_COURS",
    tribunalId: "",
    clientId: "",  // ⭐ AJOUTÉ
    secretaireId: ""
  });

  useEffect(() => {
    chargerClients();
  }, []);

  const chargerClients = async () => {
    try {
      setLoadingClients(true);
      const clientsData = await avocatAPI.getMesClients();
      setClients(clientsData || []);
    } catch (err) {
      setError("Erreur lors du chargement des clients");
      console.error(err);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectClient = (client) => {
    setFormData(prev => ({
      ...prev,
      clientId: client.clientId
    }));
    setSelectedClient(client);
    setShowClientList(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validation
      if (!formData.typeAffaire) {
        throw new Error("Le type d'affaire est obligatoire");
      }
      
      if (!formData.description) {
        throw new Error("La description est obligatoire");
      }

      // ⭐ VÉRIFICATION : Le client doit exister dans la liste
      if (formData.clientId && !clients.find(c => c.clientId === formData.clientId)) {
        throw new Error("Le client sélectionné n'existe pas ou ne vous appartient pas");
      }

      // Générer un ID affaire unique si non fourni
      const affaireData = {
        ...formData,
        affaireId: formData.affaireId || `AFF-${Date.now()}`
      };

      await avocatAPI.createAffaire(affaireData);
      alert("✅ Affaire créée avec succès !");
      navigate("/dashboard-avocat/mes-affaires");

    } catch (err) {
      setError(err.message);
      console.error(err);
    }

    setLoading(false);
  };

  const typesAffaire = [
    "AFFAIRE_CIVILE",
    "AFFAIRE_PENALE", 
    "AFFAIRE_COMMERCIALE",
    "AFFAIRE_ADMINISTRATIVE",
    "AFFAIRE_SOCIALE",
    "AFFAIRE_FAMILIALE",
    "CONTENTIEUX",
    "CONSULTATION",
    "AUTRE"
  ];

  const statuts = [
    "EN_COURS"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* En-tête */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Nouvelle Affaire</h1>
              <p className="text-gray-600">Créer une affaire pour un client</p>
            </div>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ID Affaire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Affaire
                </label>
                <input
                  type="text"
                  name="affaireId"
                  value={formData.affaireId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  placeholder="Laissé vide pour génération auto"
                />
                <p className="mt-1 text-xs text-gray-500">Ex: AFF-2024-001</p>
              </div>

              {/* Type Affaire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'Affaire *
                </label>
                <select
                  name="typeAffaire"
                  value={formData.typeAffaire}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                >
                  <option value="">Sélectionnez un type</option>
                  {typesAffaire.map((type, index) => (
                    <option key={index} value={type}>
                      {type.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut *
                </label>
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                >
                  {statuts.map((statut, index) => (
                    <option key={index} value={statut}>
                      {statut.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tribunal ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Tribunal
                </label>
                <input
                  type="text"
                  name="tribunalId"
                  value={formData.tribunalId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  placeholder="Ex: TRI-75001"
                />
              </div>
            </div>

            {/* Sélection du Client */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Client Associé</h3>
                  <p className="text-sm text-gray-600">Sélectionnez un client existant</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowClientList(!showClientList)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
                >
                  {showClientList ? "Masquer la liste" : "Voir mes clients"}
                </button>
              </div>

              {/* Champ ID Client avec bouton liste */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Client
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Ex: CLI-001 ou sélectionnez ci-dessous"
                  />
                  <button
                    type="button"
                    onClick={() => setShowClientList(!showClientList)}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    📋 Liste
                  </button>
                </div>
              </div>

              {/* Détails du client sélectionné */}
              {selectedClient && (
                <div className="mt-4 p-3 bg-white border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {selectedClient.nom} {selectedClient.prenom}
                      </h4>
                      <p className="text-sm text-gray-600">ID: {selectedClient.clientId}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, clientId: "" }));
                        setSelectedClient(null);
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ✕ Supprimer
                    </button>
                  </div>
                </div>
              )}

              {/* Liste des clients (modal) */}
              {showClientList && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                    <div className="bg-blue-600 text-white p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Mes Clients</h3>
                        <button
                          onClick={() => setShowClientList(false)}
                          className="text-white hover:text-gray-200"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 max-h-[60vh] overflow-y-auto">
                      {loadingClients ? (
                        <div className="text-center py-8">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <p className="mt-2 text-gray-600">Chargement des clients...</p>
                        </div>
                      ) : clients.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          Aucun client trouvé
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {clients.map((client) => (
                            <div
                              key={client.clientId}
                              onClick={() => handleSelectClient(client)}
                              className={`p-4 border rounded-lg cursor-pointer transition ${
                                selectedClient?.clientId === client.clientId
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium text-gray-800">
                                    {client.nom} {client.prenom}
                                  </h4>
                                  <p className="text-sm text-gray-600">ID: {client.clientId}</p>
                                </div>
                                <div className="text-blue-600">
                                  {selectedClient?.clientId === client.clientId ? "✓ Sélectionné" : "Sélectionner"}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t p-4">
                      <button
                        onClick={() => setShowClientList(false)}
                        className="w-full px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
                      >
                        Fermer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description de l'affaire *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                placeholder="Décrivez brièvement l'affaire, les enjeux, les parties concernées..."
              />
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 text-white py-4 px-6 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Création en cours...</span>
                  </div>
                ) : (
                  "📋 Créer l'Affaire"
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard-avocat")}
                className="flex-1 bg-gray-500 text-white py-4 px-6 rounded-lg hover:bg-gray-600 transition font-medium text-lg"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ajouteraffaire;