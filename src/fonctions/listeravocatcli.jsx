import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { secretaireAPI } from '../services/api';

const listeravocatcli = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    const [avocats, setAvocats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            navigate('/secretaire/login');
            return;
        }
        chargerAvocats();
    }, [token, navigate]);

    const chargerAvocats = async () => {
        try {
            setLoading(true);
            const avocatsData = await secretaireAPI.getAvocats();
            setAvocats(avocatsData || []);
        } catch (err) {
            setError('Erreur lors du chargement des avocats');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '50px', textAlign: 'center' }}>Chargement...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Liste des Avocats</h1>
            
            {error && <div style={{ color: 'red' }}>{error}</div>}
            
            {avocats.length === 0 ? (
                <p>Aucun avocat trouvé</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Nom</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Prénom</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Téléphone</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Spécialité</th>
                        </tr>
                    </thead>
                    <tbody>
                        {avocats.map((avocat, index) => (
                            <tr key={avocat.avocatId || index} 
                                style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{avocat.avocatId}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{avocat.nom}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{avocat.prenom}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{avocat.email}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{avocat.telephone}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{avocat.specialite}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default listeravocatcli;