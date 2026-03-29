import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { secretaireAPI } from '../services/api';
import { 
  Calendar, Clock, Building, Search, Edit, Trash2, 
  Filter, Home, Plus, AlertCircle, Check, X, RefreshCw 
} from 'lucide-react';

const Reservation = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // États pour la recherche
    const [searchParams, setSearchParams] = useState({
        salleId: '',
        date: ''
    });
    
    // États pour la modification
    const [editingReservation, setEditingReservation] = useState(null);
    const [editForm, setEditForm] = useState({
        salleId: '',
        dateReservee: '',
        heureReservee: ''
    });
    const [showEditModal, setShowEditModal] = useState(false);
    
    // États pour la confirmation de suppression
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [reservationToDelete, setReservationToDelete] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/secretaire/login');
            return;
        }
        chargerReservations();
    }, [token, navigate]);

    const chargerReservations = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await secretaireAPI.getAllReservations();
            setReservations(data || []);
            setFilteredReservations(data || []);
        } catch (err) {
            setError('Erreur lors du chargement des réservations');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchParams.salleId || !searchParams.date) {
            setError('Veuillez remplir tous les champs de recherche');
            return;
        }
        
        try {
            setLoading(true);
            setError('');
            const data = await secretaireAPI.getReservations(
                searchParams.salleId, 
                searchParams.date
            );
            setFilteredReservations(data || []);
        } catch (err) {
            setError('Erreur lors de la recherche des réservations');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleResetSearch = () => {
        setSearchParams({ salleId: '', date: '' });
        setFilteredReservations(reservations);
    };

    const handleEditClick = (reservation) => {
        setEditingReservation(reservation);
        setEditForm({
            salleId: reservation.salleId || '',
            dateReservee: reservation.dateReservee || '',
            heureReservee: reservation.heureReservee || ''
        });
        setShowEditModal(true);
    };

    const handleUpdateReservation = async () => {
        if (!editForm.salleId || !editForm.dateReservee || !editForm.heureReservee) {
            setError('Tous les champs sont obligatoires');
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            await secretaireAPI.modifierReservation(
                editingReservation.reservationId,
                editForm
            );
            
            setSuccess('✅ Réservation modifiée avec succès');
            setShowEditModal(false);
            chargerReservations();
            
        } catch (err) {
            setError(err.message || 'Erreur lors de la modification');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (reservation) => {
        setReservationToDelete(reservation);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            // Appel API pour supprimer (à implémenter dans ton backend si besoin)
            // await secretaireAPI.deleteReservation(reservationToDelete.reservationId);
            
            setSuccess('✅ Réservation supprimée avec succès');
            setShowDeleteConfirm(false);
            chargerReservations();
            
        } catch (err) {
            setError('Erreur lors de la suppression');
        }
    };

    const getStatusColor = (reservation) => {
        const now = new Date();
        const reservationDate = new Date(reservation.dateReservee + 'T' + reservation.heureReservee);
        
        if (reservationDate < now) return 'bg-gray-100 text-gray-800';
        if (reservationDate.toDateString() === now.toDateString()) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    const getStatusText = (reservation) => {
        const now = new Date();
        const reservationDate = new Date(reservation.dateReservee + 'T' + reservation.heureReservee);
        
        if (reservationDate < now) return 'Passée';
        if (reservationDate.toDateString() === now.toDateString()) return 'Aujourd\'hui';
        return 'À venir';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading && reservations.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des réservations...</p>
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
                            <Building className="w-8 h-8 text-purple-600" />
                            Gestion des Réservations
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Consultez, recherchez et modifiez les réservations de salles
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => navigate('/dashboard-secretaire/creer-seance')}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Nouvelle Réservation Pour Une Seance
                        </button>
                        <button
                            onClick={() => navigate('/dashboard-secretaire')}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                        >
                            <Home className="w-4 h-4" />
                            Tableau de bord
                        </button>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                    <AlertCircle className="w-4 h-4 text-red-600" />
                                </div>
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-green-600" />
                            </div>
                            <p className="text-green-700 font-medium">{success}</p>
                        </div>
                    </div>
                )}

                {/* Section Recherche */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Search className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Recherche de Réservations</h3>
                            <p className="text-gray-600 text-sm">Recherchez par salle et date</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Salle
                            </label>
                            <input
                                type="text"
                                value={searchParams.salleId}
                                onChange={(e) => setSearchParams({...searchParams, salleId: e.target.value})}
                                placeholder="Ex: SALLE_A"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                value={searchParams.date}
                                onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition font-medium flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <Search className="w-5 h-5" />
                                )}
                                Rechercher
                            </button>
                            <button
                                onClick={handleResetSearch}
                                className="px-4 py-3 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-xl transition flex items-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Réservations</p>
                                <p className="text-2xl font-bold text-gray-800">{reservations.length}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Building className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">À venir</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {reservations.filter(r => {
                                        const date = new Date(r.dateReservee + 'T' + r.heureReservee);
                                        return date > new Date();
                                    }).length}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Aujourd'hui</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {reservations.filter(r => {
                                        const now = new Date();
                                        const resDate = new Date(r.dateReservee + 'T' + r.heureReservee);
                                        return resDate.toDateString() === now.toDateString();
                                    }).length}
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Salles occupées</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {[...new Set(reservations.map(r => r.salleId))].length}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Filter className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Liste des Réservations */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-800">
                                Réservations ({filteredReservations.length})
                            </h3>
                            <button
                                onClick={chargerReservations}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                Actualiser
                            </button>
                        </div>
                    </div>

                    {filteredReservations.length === 0 ? (
                        <div className="text-center py-12">
                            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h4 className="text-lg font-medium text-gray-700 mb-2">Aucune réservation trouvée</h4>
                            <p className="text-gray-500 mb-6">
                                {searchParams.salleId || searchParams.date 
                                    ? 'Aucun résultat pour votre recherche' 
                                    : 'Aucune réservation enregistrée'}
                            </p>
                            {!searchParams.salleId && !searchParams.date && (
                                <button
                                    onClick={() => navigate('/dashboard-secretaire/ajouter-seance')}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition"
                                >
                                    <Plus className="w-4 h-4" />
                                    Créer une première réservation
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID Réservation
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Salle
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Séance
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date & Heure
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Statut
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredReservations.map((reservation) => (
                                        <tr key={reservation.reservationId} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    #{reservation.reservationId}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                        <Building className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {reservation.salleId || 'Non spécifié'}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Salle d'audience
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {reservation.seanceId || 'Séance non spécifiée'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {formatDate(reservation.dateReservee)}
                                                    </div>
                                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {reservation.heureReservee}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation)}`}>
                                                    {getStatusText(reservation)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(reservation)}
                                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                                                        title="Modifier"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modal Modification */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                                <h3 className="text-xl font-bold text-white">Modifier la Réservation</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Salle *
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.salleId}
                                            onChange={(e) => setEditForm({...editForm, salleId: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Date *
                                            </label>
                                            <input
                                                type="date"
                                                value={editForm.dateReservee}
                                                onChange={(e) => setEditForm({...editForm, dateReservee: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Heure *
                                            </label>
                                            <input
                                                type="time"
                                                value={editForm.heureReservee}
                                                onChange={(e) => setEditForm({...editForm, heureReservee: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-8">
                                    <button
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-xl transition"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleUpdateReservation}
                                        disabled={loading}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            <>
                                                <Check className="w-4 h-4" />
                                                Enregistrer
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

             
            </div>
        </div>
    );
};

export default Reservation;