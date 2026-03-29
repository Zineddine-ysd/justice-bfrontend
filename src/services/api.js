const API_BASE_URL = 'https://justice-backend-gxvf.onrender.com/api';

// Fonction générique pour les appels API
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur API');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// === ADMIN ===
export const adminAPI = {
  login: (credentials) => apiCall('/admins/login', { 
    method: 'POST', 
    body: JSON.stringify(credentials) 
  }),
  
  createAvocat: (avocatData) => apiCall('/admins/avocats/creer', {
    method: 'POST',
    body: JSON.stringify(avocatData)
  }),
  
  getAvocats: () => apiCall('/admins/avocats/lister'),
  
  createJuge: (jugeData) => apiCall('/admins/juges/creer', {
    method: 'POST', 
    body: JSON.stringify(jugeData)
  }),
  
  getJuges: () => apiCall('/admins/juges/lister'),
  getSeances :()=>apiCall('/admins/seances'),
  getAffaires :()=>apiCall('/admins/affaires'),


  
};

// === AVOCAT ===
export const avocatAPI = {
  getMesSeances: () => apiCall('/avocats/mes-seances'),
  getArchives :()=>apiCall('/avocats/mes-archives'),
  login: (credentials) => apiCall('/avocats/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  createClient: (clientData) => apiCall('/avocats/clients/creer', {
    method: 'POST',
    body: JSON.stringify(clientData)
  }),
  
  createAffaire: (affaireData) => apiCall('/avocats/affaires/creer', {
    method: 'POST',
    body: JSON.stringify(affaireData)
  }),
  
  getMesAffaires: () => apiCall('/avocats/mes-affaires'),
  
  getMesClients: () => apiCall('/avocats/mes-clients'),
  
  getMonProfil: () => apiCall('/avocats/mon-profil'),
   
  changerStatutAffaire: (affaireId, statutData) => 
    apiCall(`/avocats/affaires/${affaireId}/statut`, {
      method: 'PUT',
      body: JSON.stringify(statutData)
    }),
  archiverAffaire: (affaireId) => 
    apiCall(`/archives/manuel/${affaireId}`, {
      method: 'POST'
    }),  
};

// === SECRETAIRE ===
export const secretaireAPI = {
    getSallesDisponibles: (date, heure) => 
        apiCall(`/secretaires/salles/disponibles?date=${date}${heure ? `&heure=${heure}` : ''}`),

  login: (credentials) => apiCall('/secretaires/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
    getJuges: () => apiCall('/secretaires/juges'),
    
  getClients: () => apiCall('/secretaires/clients'),
  
  getAvocats: () => apiCall('/secretaires/avocats'),
  
  getAffaires: () => apiCall('/secretaires/affaires'),
  getSeances :()=>apiCall('/secretaires/seances'),
  getSalles: () => apiCall('/secretaires/salles'),
 
 ajouterReservation: (reservationData) => apiCall('/secretaires/reservations/ajouter', {
    method: 'POST',
    body: JSON.stringify(reservationData)
  }),
  
  modifierReservation: (reservationId, reservationData) => apiCall(`/secretaires/reservations/${reservationId}`, {
    method: 'PUT',
    body: JSON.stringify(reservationData)
  }),
  getReservations: () => apiCall('/secretaires/reservations/recherche'),
  getAllReservations: () => apiCall('/secretaires/reservations'),



  creerSeance: (seanceData) => apiCall('/secretaires/seances/creer', {
    method: 'POST',
    body: JSON.stringify(seanceData)
  }),
  
  
  changerStatutSeance: (seanceId, statutData) => 
    apiCall(`/secretaires/seances/${seanceId}/statut`, {
      method: 'PUT',
      body: JSON.stringify(statutData)
    }),
   
    changerDateHeureSeance: (seanceId, dateHeureData) => 
    apiCall(`/secretaires/seances/${seanceId}/date-heure`, {
      method: 'PUT',
      body: JSON.stringify(dateHeureData)
    }),
  getMonProfil: () => apiCall('/secretaires/mon-profil'),

};

// === JUGE ===
export const jugeAPI = {
  login: (credentials) => apiCall('/juges/login', {
    method: 'POST', 
    body: JSON.stringify(credentials)
  }),
  
  getMesSeances: () => apiCall('/juges/mes-seances'),
  
  getMonProfil: () => apiCall('/juges/mon-profil'),
};

export const rechercheAPI = {
  getAffaireById: (id) => apiCall(`/affaires-seances/affaires/${id}`),
  getSeanceById: (id) => apiCall(`/affaires-seances/seances/${id}`),
  getAllArchives :()=>apiCall('/archives/all'),
  getArchives :()=>apiCall('/archives-seances/all'),

};
