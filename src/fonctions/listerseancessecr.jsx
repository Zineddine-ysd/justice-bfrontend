import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, Building, User, 
  FileText, Edit, CheckCircle, 
  XCircle, AlertCircle, Search,
  ChevronDown, ChevronUp, RefreshCw, Lock
} from 'lucide-react';
import { secretaireAPI } from '../services/api';

const ListerSeancesSecretaire = () => {
  const [seances, setSeances] = useState([]);
  const [filteredSeances, setFilteredSeances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeance, setSelectedSeance] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatut, setNewStatut] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    statut: 'TOUS',
    date: '',
    salle: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'dateSeance',
    direction: 'asc'
  });

  const navigate = useNavigate();

  // Fonction pour vérifier si on peut modifier le statut
  const canChangeStatus = (currentStatus) => {
    const nonModifiableStatuses = ['ANNULEE', 'TERMINEE'];
    return !nonModifiableStatuses.includes(currentStatus);
  };

  // Récupérer les séances en utilisant l'API
  const fetchSeances = async () => {
    try {
      setLoading(true);
      const data = await secretaireAPI.getSeances();
      setSeances(data);
      setFilteredSeances(data);
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération des séances');
    } finally {
      setLoading(false);
    }
  };

  // Changer le statut d'une séance en utilisant l'API
  const changerStatutSeance = async (seanceId, statut) => {
    try {
      // Vérifier si le nouveau statut est valide
      if (['ANNULEE', 'TERMINEE'].includes(statut)) {
        const confirmation = window.confirm(
          `Êtes-vous sûr de vouloir marquer cette séance comme ${statut.toLowerCase()} ?\nCette action est irréversible.`
        );
        if (!confirmation) return;
      }

      const updatedSeance = await secretaireAPI.changerStatutSeance(seanceId, { statut });
      
      // Mettre à jour la liste
      setSeances(prev => prev.map(s => 
        s.seanceId === seanceId ? updatedSeance : s
      ));
      
      setShowModal(false);
      setSelectedSeance(null);
      alert('Statut mis à jour avec succès!');
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  // Appliquer les filtres et recherche
  useEffect(() => {
    let result = seances;

    // Recherche
    if (searchTerm) {
      result = result.filter(seance =>
        seance.seanceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seance.affaireId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seance.avocatId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seance.jugeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seance.salle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (filters.statut !== 'TOUS') {
      result = result.filter(seance => seance.statut === filters.statut);
    }

    // Filtre par date
    if (filters.date) {
      const filterDate = new Date(filters.date);
      result = result.filter(seance => {
        const seanceDate = new Date(seance.dateSeance);
        return seanceDate.toDateString() === filterDate.toDateString();
      });
    }

    // Filtre par salle
    if (filters.salle) {
      result = result.filter(seance => 
        seance.salle?.toLowerCase().includes(filters.salle.toLowerCase())
      );
    }

    // Tri
    result.sort((a, b) => {
      if (sortConfig.key === 'dateSeance') {
        const dateA = new Date(a.dateSeance);
        const dateB = new Date(b.dateSeance);
        if (dateA.getTime() === dateB.getTime()) {
          return sortConfig.direction === 'asc' 
            ? a.heure?.localeCompare(b.heure)
            : b.heure?.localeCompare(a.heure);
        }
        return sortConfig.direction === 'asc'
          ? dateA - dateB
          : dateB - dateA;
      }
      
      if (sortConfig.key === 'heure') {
        return sortConfig.direction === 'asc'
          ? a.heure?.localeCompare(b.heure)
          : b.heure?.localeCompare(a.heure);
      }

      return 0;
    });

    setFilteredSeances(result);
  }, [seances, searchTerm, filters, sortConfig]);

  useEffect(() => {
    fetchSeances();
  }, []);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getStatutBadge = (statut) => {
    const config = {
      'PLANIFIEE': { color: 'bg-blue-100 text-blue-800', icon: <Calendar className="w-4 h-4" /> },
      'CONFIRMEE': { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> },
      'EN_COURS': { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" /> },
      'TERMINEE': { color: 'bg-purple-100 text-purple-800', icon: <CheckCircle className="w-4 h-4" /> },
      'ANNULEE': { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" /> },
      'REPORTEE': { color: 'bg-orange-100 text-orange-800', icon: <AlertCircle className="w-4 h-4" /> }
    };

    const { color, icon } = config[statut] || { color: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="w-4 h-4" /> };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${color}`}>
        {icon}
        {statut}
      </span>
    );
  };

  const openStatutModal = (seance) => {
    if (!canChangeStatus(seance.statut)) {
      alert(`Impossible de modifier une séance ${seance.statut.toLowerCase()}`);
      return;
    }
    
    setSelectedSeance(seance);
    setNewStatut(seance.statut);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date non définie';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des séances...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="mt-4 text-red-600">{error}</p>
          <button 
            onClick={fetchSeances}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestion des Séances</h1>
          <p className="text-gray-600">
            Consultez et gérez toutes les séances d'audience du tribunal
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une séance..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtre Statut */}
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={filters.statut}
              onChange={(e) => setFilters({...filters, statut: e.target.value})}
            >
              <option value="TOUS">Tous les statuts</option>
              <option value="PLANIFIEE">Planifiée</option>
              <option value="CONFIRMEE">Confirmée</option>
              <option value="EN_COURS">En cours</option>
              <option value="TERMINEE">Terminée</option>
              <option value="ANNULEE">Annulée</option>
              <option value="REPORTEE">Reportée</option>
            </select>

            {/* Filtre Date */}
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={filters.date}
              onChange={(e) => setFilters({...filters, date: e.target.value})}
            />

            {/* Filtre Salle */}
            <input
              type="text"
              placeholder="Filtrer par salle..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={filters.salle}
              onChange={(e) => setFilters({...filters, salle: e.target.value})}
            />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              {filteredSeances.length} séance{filteredSeances.length !== 1 ? 's' : ''} trouvée{filteredSeances.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={fetchSeances}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </button>
          </div>
        </div>

        {/* Tableau des séances */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('dateSeance')}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      {sortConfig.key === 'dateSeance' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('heure')}
                  >
                    <div className="flex items-center gap-1">
                      Heure
                      {sortConfig.key === 'heure' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Affaire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avocat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Juge
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSeances.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg">Aucune séance trouvée</p>
                        <p className="text-sm mt-2">Ajustez vos filtres ou créez une nouvelle séance</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSeances.map((seance) => (
                    <tr key={seance.seanceId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(seance.dateSeance)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{seance.heure || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{seance.affaireId || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{seance.avocatId || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{seance.jugeId || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{seance.salle || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatutBadge(seance.statut)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {canChangeStatus(seance.statut) ? (
                            <button
                              onClick={() => openStatutModal(seance)}
                              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition"
                              title="Modifier le statut"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              className="p-2 text-gray-400 cursor-not-allowed"
                              title={`Impossible de modifier une séance ${seance.statut.toLowerCase()}`}
                            >
                              <Lock className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de changement de statut */}
      {showModal && selectedSeance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Modifier le statut de la séance
              </h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Séance: {selectedSeance.seanceId}</p>
                <p className="text-sm text-gray-600">Date: {formatDate(selectedSeance.dateSeance)} à {selectedSeance.heure}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau statut
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={newStatut}
                  onChange={(e) => setNewStatut(e.target.value)}
                >
                  <option value="PLANIFIEE">Planifiée</option>
                  <option value="CONFIRMEE">Confirmée</option>
                  <option value="EN_COURS">En cours</option>
                  <option value="TERMINEE">Terminée</option>
                  <option value="ANNULEE">Annulée</option>
                  <option value="REPORTEE">Reportée</option>
                </select>
                {['ANNULEE', 'TERMINEE'].includes(newStatut) && (
                  <p className="text-sm text-red-600 mt-2">
                    ⚠️ Attention: Cette action est irréversible
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedSeance(null);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Annuler
                </button>
                <button
                  onClick={() => changerStatutSeance(selectedSeance.seanceId, newStatut)}
                  className={`px-4 py-2 rounded-lg transition ${
                    ['ANNULEE', 'TERMINEE'].includes(newStatut)
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListerSeancesSecretaire;