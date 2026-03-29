import React, { useState } from 'react'
import accueil1 from '../assets/accueil1.png'
import { rechercheAPI } from '../services/api'

const Home = () => {
  const [searchId, setSearchId] = useState("")
  const [searchType, setSearchType] = useState("affaire")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError("Veuillez entrer un identifiant")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      if (searchType === "affaire") {
        const response = await rechercheAPI.getAffaireById(searchId)
        setResult({ type: "affaire", data: response })
      } else {
        const response = await rechercheAPI.getSeanceById(searchId)
        setResult({ type: "seance", data: response })
      }
    } catch (err) {
      setError(err.response?.data || "Erreur lors de la recherche")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const renderAffaire = (affaire) => (
    <div className="mt-8 p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-blue-200 w-full max-w-4xl mx-auto">
      <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4">📋 Détails de l'Affaire</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="break-words">
            <span className="font-semibold text-blue-700">ID : </span>
            <span className="text-blue-900">{affaire.affaireId}</span>
          </div>
          <div>
            <span className="font-semibold text-blue-700">Type : </span>
            <span className="text-blue-900">{affaire.typeAffaire}</span>
          </div>
          <div>
            <span className="font-semibold text-blue-700">Statut : </span>
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${
              affaire.statut === 'TERMINEE' ? 'bg-green-100 text-green-800' :
              affaire.statut === 'EN_COURS' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {affaire.statut}
            </span>
          </div>
          <div>
            <span className="font-semibold text-blue-700">Date création : </span>
            <span className="text-blue-900">{new Date(affaire.dateCreation).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <span className="font-semibold text-blue-700">Tribunal ID : </span>
            <span className="text-blue-900">{affaire.tribunalId}</span>
          </div>
          <div>
            <span className="font-semibold text-blue-700">Avocat ID : </span>
            <span className="text-blue-900">{affaire.avocatId}</span>
          </div>
          <div>
            <span className="font-semibold text-blue-700">Client ID : </span>
            <span className="text-blue-900">{affaire.clientId || 'Non spécifié'}</span>
          </div>
          {affaire.dateJugement && (
            <div>
              <span className="font-semibold text-blue-700">Date jugement : </span>
              <span className="text-blue-900">{new Date(affaire.dateJugement).toLocaleDateString('fr-FR')}</span>
            </div>
          )}
        </div>
      </div>
      
      {affaire.description && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg break-words">
          <span className="font-semibold text-blue-700">Description : </span>
          <p className="text-blue-900 mt-1">{affaire.description}</p>
        </div>
      )}
    </div>
  )

  const renderSeance = (seanceData) => (
    <div className="mt-8 space-y-6 w-full">
      {/* Section Séance */}
      <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-blue-200 max-w-4xl mx-auto">
        <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4">⚖️ Détails de la Séance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="break-words">
              <span className="font-semibold text-blue-700">ID Séance : </span>
              <span className="text-blue-900">{seanceData.seance.seanceId}</span>
            </div>
            <div>
              <span className="font-semibold text-blue-700">Type : </span>
              <span className="text-blue-900">{seanceData.seance.typeSeance}</span>
            </div>
            <div>
              <span className="font-semibold text-blue-700">Statut : </span>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                seanceData.seance.statut === 'ANNULEE' ? 'bg-red-100 text-red-800' :
                seanceData.seance.statut === 'TERMINEE' ? 'bg-green-100 text-green-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {seanceData.seance.statut}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-blue-700">Affaire ID : </span>
              <span className="text-blue-900">{seanceData.seance.affaireId}</span>
            </div>
            <div>
              <span className="font-semibold text-blue-700">Juge ID : </span>
              <span className="text-blue-900">{seanceData.seance.jugeId}</span>
            </div>
            <div>
              <span className="font-semibold text-blue-700">Avocat ID : </span>
              <span className="text-blue-900">{seanceData.seance.avocatId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Réservations */}
      {seanceData.reservations && seanceData.reservations.length > 0 && (
        <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-amber-100 max-w-4xl mx-auto">
          <h4 className="text-lg sm:text-xl font-bold text-amber-700 mb-4">📅 Réservations ({seanceData.reservations.length})</h4>
          
          {seanceData.reservations.map((reservation, index) => (
            <div key={reservation.reservationId || index} className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold text-amber-700">Salle : </span>
                    <span className="text-amber-900">{reservation.salleId}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-amber-700">Date : </span>
                    <span className="text-amber-900">{new Date(reservation.dateReservee).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-amber-700">Heure : </span>
                    <span className="text-amber-900">{reservation.heureReservee?.substring(0, 5)}</span>
                  </div>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className="text-xs sm:text-sm text-amber-600 break-words">Réservation ID: {reservation.reservationId}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div id="Accueil1" className="flex flex-col items-center justify-center mt-10 mb-20 space-y-8 text-center px-4 sm:px-6">
      {/* Texte d'introduction */}
      <div className="max-w-3xl w-full">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">
          Justice<span className="text-amber-500">DZ</span> — La voix du droit, au service du citoyen
        </h2>
        <p className="text-blue-800 text-justify text-base sm:text-lg leading-relaxed mb-3">
          Dans un monde où la justice est souvent perçue comme complexe, <span className="text-amber-600 font-semibold">JusticeDZ </span> 
          se donne pour mission de la rendre accessible, compréhensible et humaine.  
        </p>
        <p className="text-blue-800 text-base sm:text-lg text-justify leading-relaxed mb-3">
          Parce que chaque citoyen mérite d'être entendu, conseillé et accompagné, notre plateforme réunit 
          les outils nécessaires pour vous orienter dans vos démarches juridiques — qu'il s'agisse de droits civils, pénaux ou administratifs.
        </p>
        <p className="text-blue-800 text-base sm:text-lg text-justify leading-relaxed">
          La loi n'est pas qu'un texte : c'est une promesse d'équité. Et nous, nous veillons à ce qu'elle reste vivante, 
          claire et à portée de tous. ⚖️
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="w-full max-w-2xl mt-6 space-y-4">
        {/* Boutons de sélection */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={() => setSearchType("affaire")}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-colors text-sm sm:text-base ${
              searchType === "affaire" 
                ? "bg-blue-600 text-white" 
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            🔍 Rechercher une Affaire
          </button>
          <button
            onClick={() => setSearchType("seance")}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-colors text-sm sm:text-base ${
              searchType === "seance" 
                ? "bg-amber-600 text-white" 
                : "bg-amber-100 text-amber-700 hover:bg-amber-200"
            }`}
          >
            ⚖️ Rechercher une Séance
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <input
            type="text"
            placeholder={searchType === "affaire" ? "ID affaire..." : "ID séance..."}
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full sm:flex-1 px-4 sm:px-5 py-3 border-2 border-blue-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 text-blue-900 placeholder-blue-400 text-base sm:text-lg"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-amber-500 text-white rounded-full font-semibold hover:from-blue-700 hover:to-amber-600 disabled:opacity-50 transition-all whitespace-nowrap"
          >
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm sm:text-base">
            ❌ {error}
          </div>
        )}
      </div>

      {/* Résultats */}
      {result && (
        result.type === "affaire" 
          ? renderAffaire(result.data)
          : renderSeance(result.data)
      )}

      {/* Image principale */}
      <img
        src={accueil1}
        alt="Illustration juridique"
        className="w-full max-w-[90%] sm:max-w-[85%] md:max-w-[75%] h-auto rounded-2xl shadow-2xl object-contain border-4 border-amber-400 mt-8"
      />
    </div>
  )
}

export default Home