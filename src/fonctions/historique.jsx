import React, { useState, useEffect } from "react";
import { adminAPI } from "../services/api.js";

const historique = () => {
  const [activeTab, setActiveTab] = useState("affaires"); // "affaires" ou "seances"
  const [affaires, setAffaires] = useState([]);
  const [seances, setSeances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("");

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    try {
      setLoading(true);
      const [affairesData, seancesData] = await Promise.all([
        adminAPI.getAffaires(),
        adminAPI.getSeances()
      ]);
      setAffaires(affairesData);
      setSeances(seancesData);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les affaires
  const affairesFiltrees = affaires.filter(affaire => {
    const matchesSearch = affaire.idAffaire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affaire.typeAffaire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affaire.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !selectedType || affaire.typeAffaire === selectedType;
    const matchesStatut = !selectedStatut || affaire.statut === selectedStatut;
    
    return matchesSearch && matchesType && matchesStatut;
  });

  // Filtrer les séances
  const seancesFiltrees = seances.filter(seance => {
    const matchesSearch = seance.idSeance?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seance.typeSeance?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seance.affaireId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !selectedType || seance.typeSeance === selectedType;
    const matchesStatut = !selectedStatut || seance.statut === selectedStatut;
    
    return matchesSearch && matchesType && matchesStatut;
  });

  // Extraire les types et statuts uniques selon l'onglet actif
  const typesAffaire = [...new Set(affaires.map(affaire => affaire.typeAffaire).filter(Boolean))];
  const typesSeance = [...new Set(seances.map(seance => seance.typeSeance).filter(Boolean))];
  const statutsAffaire = [...new Set(affaires.map(affaire => affaire.statut).filter(Boolean))];
  const statutsSeance = [...new Set(seances.map(seance => seance.statut).filter(Boolean))];

  const types = activeTab === "affaires" ? typesAffaire : typesSeance;
  const statuts = activeTab === "affaires" ? statutsAffaire : statutsSeance;

  // Formater la date
  const formaterDate = (date) => {
    if (!date) return "Non définie";
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Formater l'heure
  const formaterHeure = (heure) => {
    if (!heure) return "Non définie";
    return new Date(`2000-01-01T${heure}`).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculer les jours restants
  const calculerJoursRestants = (dateJugement) => {
    if (!dateJugement) return null;
    const aujourdhui = new Date();
    const jugement = new Date(dateJugement);
    const diffTime = jugement - aujourdhui;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Couleur du statut
  const getStatutColor = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'en cours': return { background: '#fef3c7', color: '#92400e', border: '#fcd34d' };
      case 'terminée': return { background: '#d1fae5', color: '#065f46', border: '#a7f3d0' };
      case 'annulée': return { background: '#fee2e2', color: '#991b1b', border: '#fca5a5' };
      case 'planifiée': return { background: '#dbeafe', color: '#1e40af' };
      case 'reportée': return { background: '#f3e8ff', color: '#6b21a8' };
      default: return { background: '#f1f5f9', color: '#475569', border: '#cbd5e1' };
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Chargement des données...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📊 Historique</h1>
        <p style={styles.subtitle}>
          Vue Admin - {activeTab === "affaires" ? `${affairesFiltrees.length} affaire(s)` : `${seancesFiltrees.length} séance(s)`}
        </p>
      </div>

      {/* Onglets */}
      <div style={styles.tabsContainer}>
        <button
          onClick={() => setActiveTab("affaires")}
          style={{
            ...styles.tab,
            ...(activeTab === "affaires" ? styles.tabActive : styles.tabInactive)
          }}
        >
          📋 Affaires ({affaires.length})
        </button>
        <button
          onClick={() => setActiveTab("seances")}
          style={{
            ...styles.tab,
            ...(activeTab === "seances" ? styles.tabActive : styles.tabInactive)
          }}
        >
          ⚖️ Séances ({seances.length})
        </button>
      </div>

      {/* Barre de recherche et filtres */}
      <div style={styles.filtersContainer}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder={`🔍 Rechercher une ${activeTab === "affaires" ? "affaire" : "séance"}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">Tous les types</option>
          {types.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>

        <select
          value={selectedStatut}
          onChange={(e) => setSelectedStatut(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">Tous les statuts</option>
          {statuts.map((statut, index) => (
            <option key={index} value={statut}>{statut}</option>
          ))}
        </select>

        <button onClick={chargerDonnees} style={styles.refreshButton}>
          🔄 Actualiser
        </button>
      </div>

      {/* Contenu selon l'onglet actif */}
      <div style={styles.content}>
        {activeTab === "affaires" ? (
          /* AFFAIRES */
          <div style={styles.cardsContainer}>
            {affairesFiltrees.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📋</div>
                <h3>Aucune affaire trouvée</h3>
                <p>Aucune affaire ne correspond à vos critères de recherche.</p>
              </div>
            ) : (
              affairesFiltrees.map((affaire) => {
                const joursRestants = calculerJoursRestants(affaire.dateJugement);
                const statutStyle = getStatutColor(affaire.statut);
                
                return (
                  <div key={affaire.idAffaire} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <div style={styles.cardTitle}>
                        <h3 style={styles.itemId}>{affaire.idAffaire}</h3>
                        <div style={styles.badges}>
                          <span style={styles.typeBadge}>{affaire.typeAffaire}</span>
                          <span style={{
                            ...styles.statutBadge,
                            backgroundColor: statutStyle.background,
                            color: statutStyle.color,
                            border: `1px solid ${statutStyle.border}`
                          }}>
                            {affaire.statut}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={styles.cardBody}>
                      <div style={styles.description}>
                        {affaire.description || "Aucune description disponible"}
                      </div>

                      <div style={styles.datesGrid}>
                        <div style={styles.dateItem}>
                          <span style={styles.dateLabel}>📅 Création:</span>
                          <span style={styles.dateValue}>{formaterDate(affaire.dateCreation)}</span>
                        </div>
                        <div style={styles.dateItem}>
                          <span style={styles.dateLabel}>⚖️ Jugement:</span>
                          <span style={styles.dateValue}>{formaterDate(affaire.dateJugement)}</span>
                          {joursRestants !== null && joursRestants > 0 && (
                            <span style={styles.joursRestants}>
                              ({joursRestants} jour{joursRestants > 1 ? 's' : ''})
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={styles.infosSupplementaires}>
                        <div style={styles.infoItem}>
                          <span style={styles.infoLabel}>🏛️ Tribunal:</span>
                          <span style={styles.infoValue}>{affaire.tribunalId || "Non assigné"}</span>
                        </div>
                        <div style={styles.infoItem}>
                          <span style={styles.infoLabel}>👨‍⚖️ Avocat:</span>
                          <span style={styles.infoValue}>{affaire.avocatId || "Non assigné"}</span>
                        </div>
                        <div style={styles.infoItem}>
                          <span style={styles.infoLabel}>📝 Secrétaire:</span>
                          <span style={styles.infoValue}>{affaire.secretaireId || "Non assigné"}</span>
                        </div>
                      </div>
                    </div>

                    {joursRestants !== null && joursRestants <= 7 && joursRestants > 0 && (
                      <div style={styles.alerte}>
                        ⚠️ Jugement dans {joursRestants} jour{joursRestants > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* SEANCES */
          <div style={styles.cardsContainer}>
            {seancesFiltrees.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>⚖️</div>
                <h3>Aucune séance trouvée</h3>
                <p>Aucune séance ne correspond à vos critères de recherche.</p>
              </div>
            ) : (
              seancesFiltrees.map((seance) => {
                const statutStyle = getStatutColor(seance.statut);
                
                return (
                  <div key={seance.idSeance} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <div style={styles.cardTitle}>
                        <h3 style={styles.itemId}>{seance.idSeance}</h3>
                        <div style={styles.badges}>
                          <span style={styles.typeBadge}>{seance.typeSeance}</span>
                          <span style={{
                            ...styles.statutBadge,
                            backgroundColor: statutStyle.background,
                            color: statutStyle.color
                          }}>
                            {seance.statut}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={styles.cardBody}>
                      <div style={styles.datetime}>
                        <div style={styles.dateTimeItem}>
                          <span style={styles.dateTimeLabel}>📅 Date:</span>
                          <span style={styles.dateTimeValue}>
                            {formaterDate(seance.dateSeance)}
                          </span>
                        </div>
                        <div style={styles.dateTimeItem}>
                          <span style={styles.dateTimeLabel}>⏰ Heure:</span>
                          <span style={styles.dateTimeValue}>
                            {formaterHeure(seance.heure)}
                          </span>
                        </div>
                      </div>

                      <div style={styles.infos}>
                        <div style={styles.infoRow}>
                          <span style={styles.infoLabel}>🏛️ Salle:</span>
                          <span style={styles.infoValue}>{seance.salle || "Non assignée"}</span>
                        </div>
                        <div style={styles.infoRow}>
                          <span style={styles.infoLabel}>📋 Affaire:</span>
                          <span style={styles.infoValue}>{seance.affaireId || "Non assignée"}</span>
                        </div>
                        <div style={styles.infoRow}>
                          <span style={styles.infoLabel}>👨‍⚖️ Juge:</span>
                          <span style={styles.infoValue}>{seance.jugeId || "Non assigné"}</span>
                        </div>
                        <div style={styles.infoRow}>
                          <span style={styles.infoLabel}>⚖️ Avocat:</span>
                          <span style={styles.infoValue}>{seance.avocatId || "Non assigné"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
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
    marginBottom: "30px"
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 10px 0",
    background: "linear-gradient(135deg, #7c3aed, #0ea5e9)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#64748b",
    margin: "0"
  },
  tabsContainer: {
    display: "flex",
    gap: "0",
    marginBottom: "30px",
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "4px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    margin: "0 auto"
  },
  tab: {
    flex: "1",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  tabActive: {
    backgroundColor: "#7c3aed",
    color: "white"
  },
  tabInactive: {
    backgroundColor: "transparent",
    color: "#64748b"
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
    transition: "all 0.3s ease",
    backgroundColor: "white"
  },
  filterSelect: {
    padding: "12px 20px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "16px",
    backgroundColor: "white",
    cursor: "pointer",
    minWidth: "180px"
  },
  refreshButton: {
    padding: "12px 20px",
    backgroundColor: "#7c3aed",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease"
  },
  content: {
    minHeight: "400px"
  },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))",
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
    cursor: "pointer",
    position: "relative"
  },
  cardHeader: {
    marginBottom: "20px"
  },
  cardTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px"
  },
  itemId: {
    margin: "0",
    fontSize: "1.3rem",
    color: "#1e293b",
    fontWeight: "700",
    fontFamily: "monospace"
  },
  badges: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  },
  typeBadge: {
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "600"
  },
  statutBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "600"
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  description: {
    color: "#475569",
    fontSize: "0.95rem",
    lineHeight: "1.5",
    fontStyle: "italic"
  },
  datesGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px"
  },
  dateItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  dateLabel: {
    fontWeight: "600",
    color: "#64748b",
    fontSize: "0.85rem"
  },
  dateValue: {
    color: "#1e293b",
    fontSize: "0.9rem",
    fontWeight: "500"
  },
  datetime: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px"
  },
  dateTimeItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  dateTimeLabel: {
    fontWeight: "600",
    color: "#64748b",
    fontSize: "0.85rem"
  },
  dateTimeValue: {
    color: "#1e293b",
    fontSize: "0.9rem",
    fontWeight: "500"
  },
  joursRestants: {
    fontSize: "0.8rem",
    color: "#dc2626",
    fontWeight: "600",
    marginLeft: "5px"
  },
  infosSupplementaires: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  infos: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  infoItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  infoLabel: {
    fontWeight: "600",
    color: "#64748b",
    fontSize: "0.85rem"
  },
  infoValue: {
    color: "#1e293b",
    fontSize: "0.85rem",
    fontWeight: "500",
    fontFamily: "monospace"
  },
  alerte: {
    position: "absolute",
    top: "15px",
    right: "15px",
    backgroundColor: "#fef3c7",
    color: "#92400e",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: "600"
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
    borderTop: "4px solid #7c3aed",
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

export default historique;