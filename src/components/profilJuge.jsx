import React, { useEffect, useState } from "react";
import { Gavel, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { jugeAPI } from "../services/api.js"; // chemin selon ton projet


const ProfilJuge = () => {
  const [profil, setProfil] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const data = await jugeAPI.getMonProfil();
        setProfil(data);
      } catch (error) {
        console.error("Erreur chargement profil", error);
      }
    };

    fetchProfil();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-amber-700 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">

            {/* GAUCHE */}
            <div className="flex items-center gap-3">
              <Gavel className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Mon Profil</h1>
            </div>

            {/* BOUTON RETOUR */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-white text-amber-700 hover:bg-gray-200 px-4 py-2 rounded-lg transition font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>

          </div>
        </div>
      </header>

      {/* PROFIL */}
      <div className="container mx-auto p-6">
        {profil ? (
          <div className="bg-white shadow-lg rounded-xl p-6 space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <p className="text-gray-600 font-semibold">Nom :</p>
                <p className="text-lg">{profil.nom}</p>
              </div>

              <div>
                <p className="text-gray-600 font-semibold">Prénom :</p>
                <p className="text-lg">{profil.prenom}</p>
              </div>

              <div>
                <p className="text-gray-600 font-semibold">Email :</p>
                <p className="text-lg">{profil.email}</p>
              </div>

              <div>
                <p className="text-gray-600 font-semibold">Téléphone :</p>
                <p className="text-lg">{profil.telephone}</p>
              </div>

              <div>
                <p className="text-gray-600 font-semibold">Adresse :</p>
                <p className="text-lg">{profil.adresse}</p>
              </div>

              <div>
                <p className="text-gray-600 font-semibold">Spécialité :</p>
                <p className="text-lg">{profil.specialite}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">Chargement...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilJuge;
