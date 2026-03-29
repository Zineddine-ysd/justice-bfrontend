import React, { useState, useEffect } from "react";
import { avocatAPI } from "../services/api.js";

const listerclient = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedWillaya, setSelectedWillaya] = useState("");

  useEffect(() => {
    chargerClients();
  }, []);

  const chargerClients = async () => {
    try {
      setLoading(true);
      const data = await avocatAPI.getMesClients();
      setClients(data);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les clients
  const clientsFiltres = clients.filter(client => {
    const matchesSearch = client.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.clientId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !selectedType || client.typeClient === selectedType;
    const matchesWillaya = !selectedWillaya || client.willaya === selectedWillaya;
    
    return matchesSearch && matchesType && matchesWillaya;
  });

  // Extraire les types et willayas uniques
  const typesClient = [...new Set(clients.map(client => client.typeClient).filter(Boolean))];
  const willayas = [...new Set(clients.map(client => client.willaya).filter(Boolean))];

  // Calculer l'âge
  const calculerAge = (dateNaissance) => {
    if (!dateNaissance) return "N/A";
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">👥 Mes Clients</h1>
          <p className="text-gray-600 text-lg">{clientsFiltres.length} client(s) trouvé(s)</p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="🔍 Rechercher un client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">Tous les types</option>
              {typesClient.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={selectedWillaya}
              onChange={(e) => setSelectedWillaya(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">Toutes les willayas</option>
              {willayas.map((willaya, index) => (
                <option key={index} value={willaya}>{willaya}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Liste des clients */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientsFiltres.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun client trouvé</h3>
              <p className="text-gray-500">Aucun client ne correspond à vos critères de recherche.</p>
            </div>
          ) : (
            clientsFiltres.map((client) => (
              <div key={client._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer border border-gray-100">
                <div className="p-6">
                  {/* Header avec avatar */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                      {client.prenom?.[0]}{client.nom?.[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">{client.prenom} {client.nom}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                          {client.typeClient || "Non spécifié"}
                        </span>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          {client.willaya || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Informations */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">📧 Email:</span>
                      <span className="text-sm text-gray-800">{client.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">📞 Téléphone:</span>
                      <span className="text-sm text-gray-800">{client.telephone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500"> Âge:</span>
                      <span className="text-sm text-gray-800">
                        {calculerAge(client.dateDeNaissance)} ans
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">🆔 ID:</span>
                      <span className="text-sm font-mono text-gray-800">{client.clientId}</span>
                    </div>
                  </div>

                  {/* Adresse */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">🏠 Adresse:</span> {client.adresse || "Non renseignée"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default listerclient;