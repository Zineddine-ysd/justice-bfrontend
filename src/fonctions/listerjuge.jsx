import React, { useState, useEffect } from "react";
import { adminAPI } from "../services/api.js";

const ListerJuge = () => {
  const [juges, setJuges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialite, setSelectedSpecialite] = useState("");

  useEffect(() => {
    chargerJuges();
  }, []);

  const chargerJuges = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getJuges();
      setJuges(data);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les juges
  const jugesFiltres = juges.filter(juge => {
    const matchesSearch = juge.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         juge.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         juge.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         juge.idJuge?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialite = !selectedSpecialite || juge.specialite === selectedSpecialite;
    
    return matchesSearch && matchesSpecialite;
  });

  const specialites = [...new Set(juges.map(juge => juge.specialite).filter(Boolean))];

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Chargement des juges...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>⚖️ Liste des Juges</h1>
        <p style={styles.subtitle}>{jugesFiltres.length} juge(s) trouvé(s)</p>
      </div>

      <div style={styles.filtersContainer}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="🔍 Rechercher un juge..."
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

        <button onClick={chargerJuges} style={styles.refreshButton}>
          🔄 Actualiser
        </button>
      </div>

      {/* Liste des juges - CORRECTION ICI */}
      <div style={styles.tableContainer}>
        {jugesFiltres.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>⚖️</div>
            <h3>Aucun juge trouvé</h3>
            <p>Aucun juge ne correspond à vos critères de recherche.</p>
          </div>
        ) : (
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={styles.th}>ID Juge</th>
                <th style={styles.th}>Nom Complet</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Téléphone</th>
                <th style={styles.th}>Spécialité</th>
                <th style={styles.th}>Tribunal</th>
              </tr>
            </thead>
            <tbody>
              {jugesFiltres.map((juge) => (
                <tr key={juge.idJuge} style={styles.tableRow}>{/* ✅ Pas d'espace ici */}
                  <td style={styles.td}>
                    <span style={styles.idBadge}>{juge.idJuge}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.nameContainer}>
                      <div style={styles.avatarSmall}>
                        {juge.prenom?.[0]}{juge.nom?.[0]}
                      </div>
                      <div>
                        <div style={styles.name}>{juge.prenom} {juge.nom}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.email}>{juge.email}</div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.phone}>{juge.telephone}</div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.specialiteBadge}>{juge.specialite}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.tribunalBadge}>{juge.tribunalId}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f0fdf4",
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
    background: "linear-gradient(135deg, #0f766e, #134e4a)",
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
    border: "2px solid #d1fae5",
    borderRadius: "12px",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s ease",
    backgroundColor: "white"
  },
  filterSelect: {
    padding: "12px 20px",
    border: "2px solid #d1fae5",
    borderRadius: "12px",
    fontSize: "16px",
    backgroundColor: "white",
    cursor: "pointer",
    minWidth: "200px"
  },
  refreshButton: {
    padding: "12px 20px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease"
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    overflowX: "auto"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  tableHeader: {
    backgroundColor: "#ecfdf5"
  },
  th: {
    padding: "18px 16px",
    textAlign: "left",
    fontWeight: "600",
    color: "#064e3b",
    fontSize: "0.9rem",
    borderBottom: "2px solid #d1fae5"
  },
  tableRow: {
    borderBottom: "1px solid #f0fdf4",
    transition: "background-color 0.2s ease",
    cursor: "pointer"
  },
  td: {
    padding: "16px",
    fontSize: "0.9rem"
  },
  idBadge: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "600",
    fontFamily: "monospace"
  },
  nameContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  avatarSmall: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "bold"
  },
  name: {
    fontWeight: "600",
    color: "#1e293b"
  },
  email: {
    color: "#64748b"
  },
  phone: {
    color: "#475569",
    fontFamily: "monospace"
  },
  specialiteBadge: {
    backgroundColor: "#f0fdf4",
    color: "#065f46",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    fontWeight: "500",
    border: "1px solid #bbf7d0"
  },
  tribunalBadge: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    fontWeight: "500",
    fontFamily: "monospace"
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
    border: "4px solid #d1fae5",
    borderTop: "4px solid #10b981",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px"
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#64748b"
  },
  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "20px"
  }
};

export default ListerJuge;