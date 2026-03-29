import React, { useState, useEffect } from "react";
import { adminAPI } from "../services/api.js";

const listeravocat = () => {
  const [avocats, setAvocats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialite, setSelectedSpecialite] = useState("");

  useEffect(() => {
    chargerAvocats();
  }, []);

  const chargerAvocats = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAvocats();
      setAvocats(data);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les avocats
  const avocatsFiltres = avocats.filter(avocat => {
    const matchesSearch = avocat.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         avocat.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         avocat.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialite = !selectedSpecialite || avocat.specialite === selectedSpecialite;
    
    return matchesSearch && matchesSpecialite;
  });

  // Extraire les spécialités uniques
  const specialites = [...new Set(avocats.map(avocat => avocat.specialite).filter(Boolean))];

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Chargement des avocats...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>👨‍⚖️ Liste des Avocats</h1>
        <p style={styles.subtitle}>{avocatsFiltres.length} avocat(s) trouvé(s)</p>
      </div>

      {/* Barre de recherche et filtres */}
      <div style={styles.filtersContainer}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="🔍 Rechercher un avocat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        
        <select
          value={selectedSpecialite}
          onChange={(e) => setSelectedSpecialite(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">Toutes les spécialités</option>
          {specialites.map((spec, index) => (
            <option key={index} value={spec}>{spec}</option>
          ))}
        </select>

        <button onClick={chargerAvocats} style={styles.refreshButton}>
          🔄 Actualiser
        </button>
      </div>

      {/* Liste des avocats */}
      <div style={styles.cardsContainer}>
        {avocatsFiltres.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📝</div>
            <h3>Aucun avocat trouvé</h3>
            <p>Aucun avocat ne correspond à vos critères de recherche.</p>
          </div>
        ) : (
          avocatsFiltres.map((avocat) => (
            <div key={avocat.idAvocat} style={styles.card}> 
              <div style={styles.cardHeader}>
                <div style={styles.avatar}>
                  {avocat.prenom?.[0]}{avocat.nom?.[0]}
                </div>
                <div style={styles.cardTitle}>
                  <h3 style={styles.name}>{avocat.prenom} {avocat.nom}</h3>
                  <span style={styles.specialite}>{avocat.specialite}</span>
                </div>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>📧 Email:</span>
                  <span style={styles.infoValue}>{avocat.email}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>📞 Téléphone:</span>
                  <span style={styles.infoValue}>{avocat.telephone}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>🏠 Adresse:</span>
                  <span style={styles.infoValue}>{avocat.adresse}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>🆔 ID:</span>
                  <span style={styles.infoValue}>{avocat.idAvocat}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh"
  },
  header: {
    textAlign: "center",
    marginBottom: "40px"
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 10px 0",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#64748b",
    margin: "0"
  },
  filtersContainer: {
    display: "flex",
    gap: "15px",
    marginBottom: "30px",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center"
  },
  searchBox: {
    flex: "1",
    minWidth: "300px"
  },
  searchInput: {
    width: "100%",
    padding: "12px 20px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s ease"
  },
  filterSelect: {
    padding: "12px 20px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "16px",
    backgroundColor: "white",
    cursor: "pointer",
    minWidth: "200px"
  },
  refreshButton: {
    padding: "12px 20px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease"
  },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "25px",
    maxWidth: "1400px",
    margin: "0 auto"
  },
  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "25px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    border: "1px solid #f1f5f9",
    transition: "all 0.3s ease",
    cursor: "pointer"
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    gap: "15px"
  },
  avatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#667eea",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "bold"
  },
  cardTitle: {
    flex: "1"
  },
  name: {
    margin: "0 0 5px 0",
    fontSize: "1.4rem",
    color: "#1e293b",
    fontWeight: "600"
  },
  specialite: {
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "500"
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  infoItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px"
  },
  infoLabel: {
    fontWeight: "600",
    color: "#64748b",
    fontSize: "0.9rem",
    minWidth: "80px"
  },
  infoValue: {
    color: "#1e293b",
    fontSize: "0.95rem",
    textAlign: "right",
    flex: "1"
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "50vh",
    color: "#64748b"
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #667eea",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px"
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#64748b",
    gridColumn: "1 / -1"
  },
  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "20px"
  }
};

export default listeravocat;