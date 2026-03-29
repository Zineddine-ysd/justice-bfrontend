import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { secretaireAPI } from '../services/api';

const listerclientsecr = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            navigate('/secretaire/login');
            return;
        }
        chargerClients();
    }, [token, navigate]);

    const chargerClients = async () => {
        try {
            setLoading(true);
            const clientsData = await secretaireAPI.getClients();
            setClients(clientsData || []);
        } catch (err) {
            setError('Erreur lors du chargement des clients');
            console.error(err);
        } finally {
            setLoading(false);
        }
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
                    <p>Chargement des clients...</p>
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
                        <span style={{ marginRight: '10px' }}>👥</span>
                        Liste des Clients
                    </h1>
                    <p style={{ color: '#7f8c8d', margin: '5px 0 0 0' }}>
                        Total : {clients.length} client{clients.length !== 1 ? 's' : ''}
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

            {/* Tableau des clients */}
            {clients.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '50px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ fontSize: '60px', marginBottom: '20px' }}>📭</div>
                    <h3 style={{ color: '#7f8c8d' }}>Aucun client trouvé</h3>
                    <p style={{ color: '#95a5a6' }}>La liste des clients est vide.</p>
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
                        gridTemplateColumns: '1fr 2fr 2fr 2fr 1fr 1fr',
                        backgroundColor: '#3498db',
                        color: 'white',
                        padding: '15px',
                        fontWeight: 'bold'
                    }}>
                        <div>ID</div>
                        <div>Nom</div>
                        <div>Prénom</div>
                        <div>Email</div>
                        <div>Téléphone</div>
                        <div>Avocat</div>
                    </div>
                    
                    <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        {clients.map((client, index) => (
                            <div 
                                key={client.clientId || index}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 2fr 2fr 2fr 1fr 1fr',
                                    padding: '15px',
                                    borderBottom: '1px solid #e0e0e0',
                                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s'
                                }}
                                onClick={() => navigate(`/secretaire/clients/${client.clientId}`)}
                            >
                                <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                                    {client.clientId || 'N/A'}
                                </div>
                                <div>{client.nom || 'Non spécifié'}</div>
                                <div>{client.prenom || 'Non spécifié'}</div>
                                <div>{client.email || 'Non spécifié'}</div>
                                <div>{client.telephone || 'Non spécifié'}</div>
                                <div>{client.avocatId || 'Non assigné'}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Statistiques */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginTop: '30px'
            }}>
                <div style={{
                    backgroundColor: '#e8f4fd',
                    border: '1px solid #3498db',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3498db' }}>
                        {clients.length}
                    </div>
                    <div style={{ color: '#2c3e50', marginTop: '10px' }}>Clients totaux</div>
                </div>
                
               
                
                
            </div>

            {/* Style */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                div[style*="gridTemplateColumns"] > div:hover {
                    background-color: #e3f2fd !important;
                }
            `}</style>
        </div>
    );
};

export default listerclientsecr;