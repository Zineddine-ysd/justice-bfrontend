import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jugeAPI } from '../services/api';
import { 
  Calendar, Clock, Building, FileText, Gavel, Home, 
  Users, MapPin, Search, Filter, ChevronUp, ChevronDown,
  RefreshCw, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';

const MesSeancesJuge = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    const [seances, setSeances] = useState([]);
    const [filteredSeances, setFilteredSeances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSeance, setSelectedSeance] = useState(null);
    
    // États pour filtrage
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        statut: 'TOUS',
        date: '',
        type: ''
    });
    const [sortConfig, setSortConfig] = useState({
        key: 'dateReservee',
        direction: 'asc'
    });
    
    useEffect(() => {
        if (!token) {
            navigate('/juge/login');
            return;
        }
        chargerMesSeances();
    }, [token, navigate]);
    
    // Appliquer filtres et recherche
    useEffect(() => {
        let result = seances;
        
        // Recherche
        if (searchTerm) {
            result = result.filter(item =>
                item.seance?.seanceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.seance?.affaireId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.seance?.avocatId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.seance?.typeSeance?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.reservation?.salle?.salleId?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Filtre par statut
        if (filters.statut !== 'TOUS') {
            result = result.filter(item => item.seance?.statut === filters.statut);
        }
        
        // Filtre par date
        if (filters.date) {
            result = result.filter(item => {
                const reservationDate = new Date(item.reservation?.dateReservee);
                const filterDate = new Date(filters.date);
                return reservationDate.toDateString() === filterDate.toDateString();
            });
        }
        
        // Filtre par type
        if (filters.type) {
            result = result.filter(item => item.seance?.typeSeance === filters.type);
        }
        
        // Tri
        result.sort((a, b) => {
            if (!a.reservation || !b.reservation) return 0;
            
            if (sortConfig.key === 'dateReservee') {
                const dateA = new Date(a.reservation.dateReservee);
                const dateB = new Date(b.reservation.dateReservee);
                
                if (dateA.getTime() === dateB.getTime()) {
                    return sortConfig.direction === 'asc'
                        ? a.reservation.heureReservee?.localeCompare(b.reservation.heureReservee)
                        : b.reservation.heureReservee?.localeCompare(a.reservation.heureReservee);
                }
                
                return sortConfig.direction === 'asc'
                    ? dateA - dateB
                    : dateB - dateA;
            }
            
            if (sortConfig.key === 'statut') {
                return sortConfig.direction === 'asc'
                    ? a.seance?.statut?.localeCompare(b.seance?.statut)
                    : b.seance?.statut?.localeCompare(a.seance?.statut);
            }
            
            return 0;
        });
        
        setFilteredSeances(result);
    }, [seances, searchTerm, filters, sortConfig]);
    
    const chargerMesSeances = async () => {
        try {
            setLoading(true);
            const data = await jugeAPI.getMesSeances();
            setSeances(data || []);
            setFilteredSeances(data || []);
        } catch (err) {
            setError('Erreur lors du chargement des séances');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    const getStatutColor = (statut) => {
        switch(statut) {
            case 'PLANIFIEE': return 'bg-blue-100 text-blue-800';
            case 'CONFIRMEE': return 'bg-green-100 text-green-800';
            case 'EN_COURS': return 'bg-yellow-100 text-yellow-800';
            case 'TERMINEE': return 'bg-gray-100 text-gray-800';
            case 'ANNULEE': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    const getStatutIcon = (statut) => {
        switch(statut) {
            case 'PLANIFIEE': return <Calendar className="w-4 h-4" />;
            case 'CONFIRMEE': return <CheckCircle className="w-4 h-4" />;
            case 'EN_COURS': return <Clock className="w-4 h-4" />;
            case 'TERMINEE': return <CheckCircle className="w-4 h-4" />;
            case 'ANNULEE': return <XCircle className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return 'Date non définie';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };
    
    const getUniqueTypes = () => {
        const types = seances
            .map(item => item.seance?.typeSeance)
            .filter(Boolean)
            .filter((value, index, self) => self.indexOf(value) === index);
        return types;
    };
    
    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };
    
    const resetFilters = () => {
        setSearchTerm('');
        setFilters({
            statut: 'TOUS',
            date: '',
            type: ''
        });
    };
    
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement de vos séances...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                            <Gavel className="w-8 h-8 text-purple-600" />
                            Mes Séances Programmées
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Consultez vos audiences et leurs détails
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard-juge')}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                        <Home className="w-4 h-4" />
                        Tableau de bord
                    </button>
                </div>
                
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Barre de recherche et filtres */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Filter className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Filtrer et Rechercher</h3>
                            <p className="text-gray-600 text-sm">Trouvez facilement vos séances</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        {/* Recherche globale */}
                        <div className="relative ">
                            <Search className="absolute left-3 top-14 transform -translate-y-1/2 text-gray-400 w-5 h-7 " />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className="w-full mt-7 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        {/* Filtre Statut */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Statut
                            </label>
                            <select
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={filters.statut}
                                onChange={(e) => setFilters({...filters, statut: e.target.value})}
                            >
                                <option value="TOUS">Tous les statuts</option>
                                <option value="PLANIFIEE">Planifiée</option>
                                <option value="CONFIRMEE">Confirmée</option>
                                <option value="EN_COURS">En cours</option>
                                <option value="TERMINEE">Terminée</option>
                                <option value="ANNULEE">Annulée</option>
                            </select>
                        </div>
                        
                        {/* Filtre Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={filters.date}
                                onChange={(e) => setFilters({...filters, date: e.target.value})}
                            />
                        </div>
                        
                        {/* Filtre Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type de séance
                            </label>
                            <select
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={filters.type}
                                onChange={(e) => setFilters({...filters, type: e.target.value})}
                            >
                                <option value="">Tous les types</option>
                                {getUniqueTypes().map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <div className="text-gray-600">
                            {filteredSeances.length} séance{filteredSeances.length !== 1 ? 's' : ''} trouvée{filteredSeances.length !== 1 ? 's' : ''}
                            {searchTerm || filters.statut !== 'TOUS' || filters.date || filters.type ? ' (filtrée)' : ''}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={resetFilters}
                                className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition flex items-center gap-2"
                            >
                                Réinitialiser
                            </button>
                            <button
                                onClick={chargerMesSeances}
                                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Actualiser
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Liste des séances */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Colonne gauche - Liste */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800">
                                    Séances ({filteredSeances.length})
                                </h2>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="cursor-pointer hover:text-blue-600" onClick={() => handleSort('dateReservee')}>
                                        Trier par date
                                        {sortConfig.key === 'dateReservee' && (
                                            sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4 inline ml-1" /> : <ChevronDown className="w-4 h-4 inline ml-1" />
                                        )}
                                    </span>
                                    <span className="mx-2">•</span>
                                    <span className="cursor-pointer hover:text-blue-600" onClick={() => handleSort('statut')}>
                                        Trier par statut
                                        {sortConfig.key === 'statut' && (
                                            sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4 inline ml-1" /> : <ChevronDown className="w-4 h-4 inline ml-1" />
                                        )}
                                    </span>
                                </div>
                            </div>
                            
                            {filteredSeances.length === 0 ? (
                                <div className="text-center py-12">
                                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                                        {seances.length === 0 ? 'Aucune séance programmée' : 'Aucun résultat trouvé'}
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        {seances.length === 0 
                                            ? 'Vous n\'avez pas de séances assignées pour le moment'
                                            : 'Essayez de modifier vos critères de recherche'
                                        }
                                    </p>
                                    {(searchTerm || filters.statut !== 'TOUS' || filters.date || filters.type) && (
                                        <button
                                            onClick={resetFilters}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
                                        >
                                            Afficher toutes les séances
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredSeances.map((item, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedSeance(item)}
                                            className={`p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md ${
                                                selectedSeance?.seance?.seanceId === item.seance?.seanceId
                                                    ? 'border-purple-500 bg-purple-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                        <Calendar className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800">
                                                            {item.seance?.seanceId}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {item.seance?.typeSeance}
                                                        </p>
                                                        {item.seance?.affaireId && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Affaire: {item.seance.affaireId}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(item.seance?.statut)}`}>
                                                    {getStatutIcon(item.seance?.statut)}
                                                    {item.seance?.statut}
                                                </span>
                                            </div>
                                            
                                            {item.reservation ? (
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100">
                                                    <div className="flex items-center gap-1">
                                                        <Building className="w-4 h-4 text-gray-400" />
                                                        <span className="font-medium">{item.reservation.salle?.salleId}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <span>{formatDate(item.reservation.dateReservee)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4 text-gray-400" />
                                                        <span>{item.reservation.heureReservee}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-gray-400 italic mt-3 pt-3 border-t border-gray-100">
                                                    Aucune réservation de salle associée
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Colonne droite - Détails */}
                    <div>
                        <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">
                                Détails de la séance
                            </h2>
                            
                            {selectedSeance ? (
                                <div className="space-y-6">
                                    {/* Informations séance */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                            Séance
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">ID:</span>
                                                <span className="font-medium">{selectedSeance.seance?.seanceId}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Type:</span>
                                                <span>{selectedSeance.seance?.typeSeance}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Statut:</span>
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getStatutColor(selectedSeance.seance?.statut)}`}>
                                                    {getStatutIcon(selectedSeance.seance?.statut)}
                                                    {selectedSeance.seance?.statut}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Affaire:</span>
                                                <span>{selectedSeance.seance?.affaireId}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Réservation */}
                                    {selectedSeance.reservation ? (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                <MapPin className="w-5 h-5 text-green-600" />
                                                Réservation
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Salle:</span>
                                                    <span className="font-medium">{selectedSeance.reservation.salle?.salleId}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Date:</span>
                                                    <span>{formatDate(selectedSeance.reservation.dateReservee)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Heure:</span>
                                                    <span>{selectedSeance.reservation.heureReservee}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                            <div className="flex items-center gap-2">
                                                <AlertCircle className="w-5 h-5 text-yellow-600" />
                                                <h3 className="text-sm font-medium text-yellow-800">
                                                    Aucune réservation de salle
                                                </h3>
                                            </div>
                                            <p className="text-xs text-yellow-600 mt-1">
                                                Cette séance n'a pas encore de salle assignée
                                            </p>
                                        </div>
                                    )}
                                    
                                    {/* Participants */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                            <Users className="w-5 h-5 text-purple-600" />
                                            Participants
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Juge:</span>
                                                <span className="font-medium">Vous</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Avocat:</span>
                                                <span>{selectedSeance.seance?.avocatId || 'Non assigné'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">
                                        Sélectionnez une séance pour voir les détails
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MesSeancesJuge;