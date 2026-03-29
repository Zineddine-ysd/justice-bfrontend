import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gavel, LogIn, User, Scale, Users, Shield } from "lucide-react";
import { adminAPI, avocatAPI, secretaireAPI, jugeAPI } from "../services/api";

const SeConnecter = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("admin");
  const [formData, setFormData] = useState({
    adminId: "",
    avocatId: "",
    secretaireId: "", 
    jugeId: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      const credentials = { password: formData.password };

      switch(role) {
        case "admin":
          credentials.adminId = formData.adminId;
          response = await adminAPI.login(credentials);
          break;
        case "avocat":
          credentials.avocatId = formData.avocatId;
          response = await avocatAPI.login(credentials);
          break;
        case "secretaire":
          credentials.secretaireId = formData.secretaireId;
          response = await secretaireAPI.login(credentials);
          break;
        case "juge":
          credentials.jugeId = formData.jugeId;
          response = await jugeAPI.login(credentials);
          break;
      }

      if (response.success) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", role);
        navigate(`/dashboard-${role}`);
      } else {
        alert(response.message || "Erreur de connexion");
      }
    } catch (error) {
      alert("Erreur de connexion: " + error.message);
      console.error("Erreur connexion:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORRECTION : Gérer le changement de valeur
  const handleIdChange = (value) => {
    setFormData(prev => ({
      ...prev,
      [`${role}Id`]: value  // "adminId", "avocatId", etc.
    }));
  };

  // ✅ CORRECTION : Obtenir la valeur actuelle
  const getCurrentIdValue = () => {
    return formData[`${role}Id`] || "";
  };

  const getRoleIcon = () => {
    switch(role) {
      case "admin": return <Shield className="w-6 h-6" />;
      case "avocat": return <Scale className="w-6 h-6" />;
      case "secretaire": return <Users className="w-6 h-6" />;
      case "juge": return <Gavel className="w-6 h-6" />;
      default: return <User className="w-6 h-6" />;
    }
  };

  const getRoleLabel = () => {
    switch(role) {
      case "admin": return "Administrateur";
      case "avocat": return "Avocat";
      case "secretaire": return "Secrétaire";
      case "juge": return "Juge";
      default: return "Utilisateur";
    }
  };

  const getPlaceholder = () => {
    switch(role) {
      case "admin": return "ID Admin";
      case "avocat": return "ID Avocat";
      case "secretaire": return "ID Secrétaire";
      case "juge": return "ID Juge";
      default: return "Votre identifiant";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-amber-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-amber-200">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Gavel className="text-blue-800 w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold text-blue-900 mb-2">
            Plateforme Justice
          </h1>
          <h2 className="text-lg font-semibold text-amber-600">
            {getRoleLabel()} – Connexion
          </h2>
        </div>

        {/* Sélecteur de rôle */}
        <div className="mb-6">
          <label className="block text-blue-900 font-medium mb-2">Rôle</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: "admin", label: "Admin", icon: <Shield className="w-4 h-4" /> },
              { value: "avocat", label: "Avocat", icon: <Scale className="w-4 h-4" /> },
              { value: "secretaire", label: "Secrétaire", icon: <Users className="w-4 h-4" /> },
              { value: "juge", label: "Juge", icon: <Gavel className="w-4 h-4" /> }
            ].map((roleOption) => (
              <button
                key={roleOption.value}
                type="button"
                onClick={() => setRole(roleOption.value)}
                className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
                  role === roleOption.value
                    ? "bg-blue-900 text-white border-blue-900"
                    : "bg-white text-blue-900 border-blue-200 hover:border-blue-400"
                }`}
              >
                {roleOption.icon}
                <span className="text-xs mt-1">{roleOption.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ✅ CORRECTION : Champ identifiant */}
        <div className="mb-4">
          <label className="block text-blue-900 font-medium mb-2">
            <div className="flex items-center gap-2">
              {getRoleIcon()}
              Identifiant
            </div>
          </label>
          <input
            type="text"
            required
            autoComplete="username"
            value={getCurrentIdValue()} // ✅ CORRECT
            onChange={(e) => handleIdChange(e.target.value)} // ✅ CORRECT
            className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            placeholder={getPlaceholder()}
          />
        </div>

        {/* Champ mot de passe */}
        <div className="mb-6">
          <label className="block text-blue-900 font-medium mb-2">Mot de passe</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            placeholder="Votre mot de passe"
          />
        </div>

        {/* Bouton de connexion */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-blue-900 text-amber-100 py-3 rounded-lg font-semibold hover:bg-blue-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-amber-100 border-t-transparent"></div>
          ) : (
            <LogIn className="w-5 h-5" />
          )}
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <div className="mt-4 text-center text-sm text-blue-600">
          <p>Utilisez vos identifiants fournis par l'administration</p>
        </div>
      </form>
    </div>
  );
};

export default SeConnecter;