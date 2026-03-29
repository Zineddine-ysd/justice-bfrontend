import React, { useState } from "react";
import { adminAPI } from "../services/api.js";

const AjouterJuge = () => {
  const [formData, setFormData] = useState({
    jugeId: "",
    password: "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    specialite: "",
    tribunalId: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await adminAPI.createJuge(formData);
      setMessage({ text: " Juge ajouté avec succès !", type: "success" });
      
      // Réinitialiser le formulaire
      setFormData({
        jugeId: "",
        password: "",
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        specialite: "",
        tribunalId: ""
      });

    } catch (err) {
      setMessage({ text: "Erreur lors de l'ajout : " + err.message, type: "error" });
      console.error(err);
    }

    setLoading(false);
  };

  const specialites = [
    "Droit Pénal",
    "Droit Civil",
    "Droit Commercial",
    "Droit Administratif",
    "Droit du Travail",
    "Droit de la Famille",
    "Droit Immobilier",
    "Droit International"
  ];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <span style={styles.icon}>⚖️</span>
          </div>
          <h2 style={styles.title}>Ajouter un Juge</h2>
          <p style={styles.subtitle}>Complétez les informations du nouveau juge</p>
        </div>

        {message.text && (
          <div style={{
            ...styles.message,
            backgroundColor: message.type === "success" ? "#d1fae5" : "#fee2e2",
            color: message.type === "success" ? "#065f46" : "#991b1b",
            border: `1px solid ${message.type === "success" ? "#a7f3d0" : "#fecaca"}`
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>ID Juge *</label>
              <input
                type="text"
                name="jugeId"
                value={formData.jugeId}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="JGE-2024-001"
pattern="[A-Za-z0-9\-]+"
                title="ID unique du juge"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Mot de passe *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="●●●●●●●●"
                minLength="6"
              />
            </div>
          </div>

          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nom *</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Entrez le nom"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Prénom *</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Entrez le prénom"
              />
            </div>
          </div>

          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="juge@tribunal.fr"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Téléphone *</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="+213 1 23 45 67 89"
pattern="[A-Za-z0-9\-]+"
              />
            </div>
          </div>

          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Spécialité *</label>
              <select
                name="specialite"
                value={formData.specialite}
                onChange={handleChange}
                required
                style={styles.select}
              >
                <option value="">Sélectionnez une spécialité</option>
                {specialites.map((spec, index) => (
                  <option key={index} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>ID Tribunal *</label>
              <input
                type="text"
                name="tribunalId"
                value={formData.tribunalId}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="TRI-75001"
pattern="[A-Za-z0-9\-]+"
              />
            </div>
          </div>

          <div style={styles.buttonContainer}>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : styles.buttonActive)
              }}
            >
              {loading ? (
                <div style={styles.loadingContent}>
                  <div style={styles.spinner}></div>
                  <span>Ajout en cours...</span>
                </div>
              ) : (
                "⚖️ Ajouter le Juge"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f766e 0%, #134e4a 100%)",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  card: {
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
    width: "100%",
    maxWidth: "700px",
    margin: "20px"
  },
  header: {
    textAlign: "center",
    marginBottom: "35px"
  },
  iconContainer: {
    marginBottom: "15px"
  },
  icon: {
    fontSize: "48px"
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 8px 0",
    background: "linear-gradient(135deg, #0f766e, #134e4a)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  subtitle: {
    fontSize: "16px",
    color: "#64748b",
    margin: "0",
    fontWeight: "500"
  },
  message: {
    padding: "14px 18px",
    borderRadius: "12px",
    marginBottom: "25px",
    fontSize: "15px",
    fontWeight: "500",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "25px"
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column"
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center"
  },
  input: {
    padding: "14px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "16px",
    transition: "all 0.3s ease",
    outline: "none",
    backgroundColor: "#f8fafc"
  },
  select: {
    padding: "14px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "16px",
    transition: "all 0.3s ease",
    outline: "none",
    backgroundColor: "#f8fafc",
    cursor: "pointer"
  },
  buttonContainer: {
    marginTop: "15px"
  },
  button: {
    padding: "18px 30px",
    border: "none",
    borderRadius: "12px",
    fontSize: "17px",
    fontWeight: "600",
    color: "white",
    transition: "all 0.3s ease",
    width: "100%",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
  },
  buttonActive: {
    background: "linear-gradient(135deg, #0f766e, #14b8a6)",
  },
  buttonDisabled: {
    backgroundColor: "#94a3b8",
    cursor: "not-allowed"
  },
  loadingContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px"
  },
  spinner: {
    width: "18px",
    height: "18px",
    border: "2px solid transparent",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  }
};

// Styles CSS dynamiques
if (typeof document !== 'undefined') {
  const styleSheet = document.styleSheets[0];
  
  const stylesToInsert = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    input:focus, select:focus {
      border-color: #0f766e !important;
      box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1) !important;
      background-color: white !important;
    }
    
    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `;
  
  const styleElement = document.createElement('style');
  styleElement.textContent = stylesToInsert;
  document.head.appendChild(styleElement);
}

export default AjouterJuge;