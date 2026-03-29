import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { secretaireAPI } from '../services/api';

const affairesecr = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    const [affaires, setAffaires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statistiques, setStatistiques] = useState({
        total: 0,
        actives: 0,
        cloturees: 0,
        enCours: 0
    });

    useEffect(() => {
        if (!token) {
            navigate('/secretaire/login');
            return;
        }
        chargerAffaires();
    }, [token, navigate]);

    const chargerAffaires = async () => {
        try {
            setLoading(true);
            const affairesData = await secretaireAPI.getAffaires();
            setAffaires(affairesData || []);
            
            // Calculer les statistiques
            const total = affairesData?.length || 0;
            const actives = affairesData?.filter(a => a.statut === 'ACTIVE').length || 0;
            const cloturees = affairesData?.filter(a => a.statut === 'CLOTUREE').length || 0;
            const enCours = affairesData?.filter(a => a.statut === 'EN_COURS').length || 0;
            
            setStatistiques({ total, actives, cloturees, enCours });
            
        } catch (err) {
            setError('Erreur lors du chargement des affaires');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatutColor = (statut) => {
        switch(statut) {
            case 'ACTIVE': return '#27ae60';
            case 'CLOTUREE': return '#e74c3c';
            case 'EN_COURS': return '#3498db';
            case 'EN_ATTENTE': return '#f39c12';
            default: return '#7f8c8d';
        }
    };

    const getStatutLabel = (statut) => {
        switch(statut) {
            case 'ACTIVE': return 'Active';
            case 'CLOTUREE': return 'Clôturée';
            case 'EN_COURS': return 'En cours';
            case 'EN_ATTENTE': return 'En attente';
            default: return statut;
        }
    };

    const handleViewDetails = (affaireId) => {
        navigate(`/secretaire/affaires/${affaireId}`);
    };

    

    const handleCreerSeance = (affaireId) => {
        navigate(`/secretaire/seances/creer?affaireId=${affaireId}`);
    };

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        border: '5px solid #f3f3f3',
                        borderTop: '5px solid #3498db',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <p>Chargement des affaires...</p>
                </div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{ 
            padding: '20px', 
            maxWidth: '1400px', 
            margin: '0 auto',
            backgroundColor: '#f8fafc',
            minHeight: '100vh'
        }}>
            {/* En-tête */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '30px',
                paddingBottom: '15px',
                borderBottom: '2px solid #2c3e50'
            }}>
                <div>
                    <h1 style={{ color: '#2c3e50', margin: 0 }}>
                        <span style={{ marginRight: '10px' }}>📂</span>
                        Liste des Affaires
                    </h1>
                    <p style={{ color: '#7f8c8d', margin: '5px 0 0 0' }}>
                        Gestion des affaires judiciaires
                    </p>
                </div>
                <button
                    onClick={() => navigate('/dashboard-secretaire')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#34495e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    ← Retour
                </button>
            </div>

            {/* Messages d'erreur */}
            {error && (
                <div style={{
                    padding: '15px',
                    backgroundColor: '#ffeaea',
                    color: '#c0392b',
                    border: '1px solid #ffcccc',
                    borderRadius: '5px',
                    marginBottom: '20px'
                }}>
                    ❌ {error}
                </div>
            )}

            {/* Statistiques */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
            }}>
                <div style={{
                    backgroundColor: '#e8f4fd',
                    border: '1px solid #3498db',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3498db' }}>
                        {statistiques.total}
                    </div>
                    <div style={{ color: '#2c3e50', marginTop: '10px' }}>Affaires totales</div>
                </div>
                
                <div style={{
                    backgroundColor: '#e8f6e8',
                    border: '1px solid #27ae60',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#27ae60' }}>
                        {statistiques.actives}
                    </div>
                    <div style={{ color: '#2c3e50', marginTop: '10px' }}>Affaires actives</div>
                </div>
                
                <div style={{
                    backgroundColor: '#fef5e7',
                    border: '1px solid #f39c12',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f39c12' }}>
                        {statistiques.enCours}
                    </div>
                    <div style={{ color: '#2c3e50', marginTop: '10px' }}>Affaires en cours</div>
                </div>
                
                <div style={{
                    backgroundColor: '#fdeaea',
                    border: '1px solid #e74c3c',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e74c3c' }}>
                        {statistiques.cloturees}
                    </div>
                    <div style={{ color: '#2c3e50', marginTop: '10px' }}>Affaires clôturées</div>
                </div>
            </div>

            {/* Tableau des affaires */}
            {affaires.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '50px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ fontSize: '60px', marginBottom: '20px' }}>📭</div>
                    <h3 style={{ color: '#7f8c8d' }}>Aucune affaire trouvée</h3>
                    <p style={{ color: '#95a5a6' }}>La liste des affaires est vide.</p>
                </div>
            ) : (
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 2fr 2fr 2fr 2fr 1.5fr 2fr',
                        backgroundColor: '#3498db',
                        color: 'white',
                        padding: '15px',
                        fontWeight: 'bold'
                    }}>
                        <div>ID</div>
                        <div>Type</div>
                        <div>Client</div>
                        <div>Avocat</div>
                        <div>Date création</div>
                        <div>Statut</div>
                    </div>
                    
                    <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                        {affaires.map((affaire, index) => (
                            <div 
                                key={affaire.affaireId || index}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 2fr 2fr 2fr 2fr 1.5fr 2fr',
                                    padding: '15px',
                                    borderBottom: '1px solid #e0e0e0',
                                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white'
                                }}
                            >
                                <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                                    {affaire.affaireId || 'N/A'}
                                </div>
                                <div>{affaire.typeAffaire || 'Non spécifié'}</div>
                                <div>{affaire.clientId || 'Non spécifié'}</div>
                                <div>{affaire.avocatId || 'Non assigné'}</div>
                                <div>
                                    {affaire.dateCreation ? 
                                        new Date(affaire.dateCreation).toLocaleDateString() : 
                                        'Non spécifié'
                                    }
                                </div>
                                <div>
                                    <span style={{
                                        padding: '5px 10px',
                                        borderRadius: '4px',
                                        backgroundColor: getStatutColor(affaire.statut),
                                        color: 'white',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}>
                                        {getStatutLabel(affaire.statut)}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                   
                                  
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Style */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default affairesecr;