import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { secretaireAPI } from '../services/api';
import { Calendar, Clock, Building, Users, FileText, Gavel, Home, X, Check, ArrowLeft, Download } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const AjouterSeance = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    // ÉTAPE 1: Données pour créer la séance (sans date/heure/salle)
    const [etape1, setEtape1] = useState({
        seanceId: '',
        typeSeance: '',
        statut: 'PLANIFIEE',
        affaireId: '',
        jugeId: '',
    });
    
    // ÉTAPE 2: Données pour la réservation
    const [etape2, setEtape2] = useState({
        salleId: '',
        dateReservee: '',
        heureReservee: ''
    });
    
    const [affaires, setAffaires] = useState([]);
    const [juges, setJuges] = useState([]);
    const [salles, setSalles] = useState([]);
    const [sallesDisponibles, setSallesDisponibles] = useState([]);
    const [selectedAffaire, setSelectedAffaire] = useState(null);
    const [selectedJuge, setSelectedJuge] = useState(null);
    const [selectedSalle, setSelectedSalle] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [etapeCourante, setEtapeCourante] = useState(1);
    const [showAffaireList, setShowAffaireList] = useState(false);
    const [showJugeList, setShowJugeList] = useState(false);
    const [showSalleList, setShowSalleList] = useState(false);
    const [pdfGenerated, setPdfGenerated] = useState(false);
    
    const typesSeance = [
        { value: 'AUDIENCE_PRELIMINAIRE', label: 'Audience Préliminaire', icon: '' },
        { value: 'AUDIENCE_INSTRUCTION', label: 'Audience d\'Instruction', icon: '' },
        { value: 'AUDIENCE_PLAIDOIRIE', label: 'Audience de Plaidoirie', icon: '' },
        { value: 'AUDIENCE_JUGEMENT', label: 'Audience de Jugement', icon: '' },
        { value: 'CONCILIATION', label: 'Conciliation', icon: '' },
        { value: 'COMPARUTION', label: 'Comparution', icon: '' },
        { value: 'AUTRE', label: 'Autre', icon: '' }
    ];

    useEffect(() => {
        if (!token) {
            navigate('/secretaire/login');
            return;
        }
        chargerDonnees();
    }, [token, navigate]);

    const chargerDonnees = async () => {
        try {
            setLoadingData(true);
            const [affairesData, jugesData, sallesData] = await Promise.all([
                secretaireAPI.getAffaires(),
                secretaireAPI.getJuges(),
                secretaireAPI.getSalles()
            ]);
            
            setAffaires(affairesData || []);
            setJuges(jugesData || []);
            setSalles(sallesData || []);
            
        } catch (err) {
            console.error('Erreur lors du chargement:', err);
            setError('Erreur lors du chargement des données');
        } finally {
            setLoadingData(false);
        }
    };

    // Fonction pour vérifier si un jour est un week-end (vendredi=5, samedi=6)
    const estWeekend = (date) => {
        const jour = new Date(date).getDay(); // 0=dimanche, 1=lundi, ..., 6=samedi
        return jour === 5 || jour === 6; // Vendredi ou Samedi
    };

    const handleSelectAffaire = (affaire) => {
        setEtape1(prev => ({
            ...prev,
            affaireId: affaire.affaireId
        }));
        setSelectedAffaire(affaire);
        setShowAffaireList(false);
    };

    const handleSelectJuge = (juge) => {
        setEtape1(prev => ({
            ...prev,
            jugeId: juge.jugeId
        }));
        setSelectedJuge(juge);
        setShowJugeList(false);
    };

    // Fonction pour charger les salles disponibles
    const chargerSallesDisponibles = async (date, heure) => {
        if (!date) return;
        
        try {
            const sallesDispo = await secretaireAPI.getSallesDisponibles(date, heure);
            setSallesDisponibles(sallesDispo);
            
            // Si la salle actuellement sélectionnée n'est plus disponible, la désélectionner
            if (etape2.salleId && !sallesDispo.find(s => s.salleId === etape2.salleId)) {
                setEtape2({...etape2, salleId: ''});
                setSelectedSalle(null);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des salles disponibles:", error);
            setSallesDisponibles([]);
        }
    };

    // Quand la date change
    const handleDateChange = (date) => {
        setEtape2({...etape2, dateReservee: date, salleId: ''});
        
        // Vérifier si c'est un week-end
        if (estWeekend(date)) {
            setError("❌ Le tribunal est fermé le week-end (vendredi et samedi)");
            setSelectedSalle(null);
            setSallesDisponibles([]);
            return;
        }
        
        setError('');
        // Charger les salles disponibles pour cette date
        chargerSallesDisponibles(date, etape2.heureReservee);
    };

    // Quand l'heure change
    const handleHeureChange = (heure) => {
        setEtape2({...etape2, heureReservee: heure, salleId: ''});
        
        // Recharger les salles disponibles avec la nouvelle heure
        if (etape2.dateReservee) {
            chargerSallesDisponibles(etape2.dateReservee, heure);
        }
    };

    const handleSelectSalle = (salle) => {
        setEtape2(prev => ({
            ...prev,
            salleId: salle.salleId
        }));
        setSelectedSalle(salle);
    };

    const genererIdSeance = () => {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        const newId = `SEANCE_${timestamp}_${random}`;
        
        setEtape1(prev => ({
            ...prev,
            seanceId: newId
        }));
    };

    const genererPDFConfirmation = async () => {
        try {
            const today = new Date();
            const reservationDate = new Date(etape2.dateReservee);
            
            const content = document.createElement('div');
            content.style.cssText = `
                padding: 25px;
                background: white;
                font-family: 'Arial', sans-serif;
                max-width: 800px;
                margin: 0 auto;
            `;
            
            content.innerHTML = `
    <div style="padding: 30px; font-family: 'Helvetica', 'Arial', sans-serif; color: #333;">
        <!-- En-tête officielle -->
        <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #2C3E50;">
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                <div style="width: 60px; height: 60px; background: #2C3E50; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-right: 15px;">
                    ⚖️
                </div>
                <div>
                    <h1 style="color: #2C3E50; font-size: 24px; margin: 0; font-weight: 600;">TRIBUNAL DE JUSTICE</h1>
                    <p style="color: #7F8C8D; font-size: 14px; margin: 5px 0;">Ministère de la Justice - République Algérienne</p>
                </div>
            </div>
            <h2 style="color: #2980B9; font-size: 20px; margin: 10px 0; font-weight: 500;">CONFIRMATION DE RÉSERVATION DE SALLE</h2>
        </div>

        <!-- Informations principales -->
        <div style="margin-bottom: 30px;">
            <h3 style="color: #2C3E50; font-size: 16px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #ECF0F1;">
                INFORMATIONS GÉNÉRALES
            </h3>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                <tr>
                    <td style="padding: 12px 0; width: 40%; color: #7F8C8D; font-size: 13px;">N° de document</td>
                    <td style="padding: 12px 0; font-weight: 600; font-size: 14px;">${etape1.seanceId}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; color: #7F8C8D; font-size: 13px;">Date d'émission</td>
                    <td style="padding: 12px 0; font-size: 14px;">${today.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; color: #7F8C8D; font-size: 13px;">Type de séance</td>
                    <td style="padding: 12px 0; font-size: 14px;">${etape1.typeSeance}</td>
                </tr>
            </table>
        </div>

        <!-- Détails de l'affaire -->
        <div style="margin-bottom: 30px; background: #F8F9FA; padding: 20px; border-radius: 8px; border-left: 4px solid #3498DB;">
            <h3 style="color: #2C3E50; font-size: 16px; margin-bottom: 15px;">DÉTAILS DE L'AFFAIRE</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; width: 35%; color: #7F8C8D; font-size: 13px;">N° d'affaire</td>
                    <td style="padding: 8px 0; font-weight: 600; font-size: 14px;">${etape1.affaireId}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #7F8C8D; font-size: 13px;">Type d'affaire</td>
                    <td style="padding: 8px 0; font-size: 14px;">${selectedAffaire?.typeAffaire || 'Non spécifié'}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #7F8C8D; font-size: 13px;">Avocat assigné</td>
                    <td style="padding: 8px 0; font-size: 14px;">${selectedAffaire?.avocatId || 'Non assigné'}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #7F8C8D; font-size: 13px;">Juge</td>
                    <td style="padding: 8px 0; font-size: 14px;">
                        ${selectedJuge ? `${selectedJuge.nom} ${selectedJuge.prenom}` : 'Non assigné'}
                        ${selectedJuge?.specialite ? `<br><span style="color: #7F8C8D; font-size: 12px;">${selectedJuge.specialite}</span>` : ''}
                    </td>
                </tr>
            </table>
        </div>

        <!-- Informations de réservation -->
        <div style="margin-bottom: 30px;">
            <h3 style="color: #2C3E50; font-size: 16px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #ECF0F1;">
                INFORMATIONS DE RÉSERVATION
            </h3>
            
            <div style="display: flex; gap: 20px; margin-bottom: 25px;">
                <div style="flex: 1; background: white; border: 1px solid #ECF0F1; border-radius: 8px; padding: 15px; text-align: center;">
                    <div style="color: #7F8C8D; font-size: 12px; margin-bottom: 8px;">SALLE</div>
                    <div style="font-size: 20px; font-weight: 600; color: #2C3E50;">${etape2.salleId}</div>
                    <div style="font-size: 11px; color: #95A5A6; margin-top: 5px;">Salle d'audience</div>
                </div>
                
                <div style="flex: 1; background: white; border: 1px solid #ECF0F1; border-radius: 8px; padding: 15px; text-align: center;">
                    <div style="color: #7F8C8D; font-size: 12px; margin-bottom: 8px;">DATE</div>
                    <div style="font-size: 16px; font-weight: 600; color: #2C3E50; margin-bottom: 5px;">
                        ${reservationDate.toLocaleDateString('fr-FR', { weekday: 'long' })}
                    </div>
                    <div style="font-size: 14px; color: #2C3E50;">
                        ${reservationDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                </div>
                
                <div style="flex: 1; background: white; border: 1px solid #ECF0F1; border-radius: 8px; padding: 15px; text-align: center;">
                    <div style="color: #7F8C8D; font-size: 12px; margin-bottom: 8px;">HORAIRE</div>
                    <div style="font-size: 20px; font-weight: 600; color: #2C3E50;">${etape2.heureReservee}</div>
                    <div style="font-size: 11px; color: #95A5A6; margin-top: 5px;">Heure de début</div>
                </div>
            </div>
        </div>

        <!-- Instructions et pied de page -->
        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #ECF0F1;">
            <div style="background: #FFF8E1; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #FFA726;">
                <h4 style="color: #EF6C00; font-size: 13px; margin: 0 0 10px 0; font-weight: 500;">INSTRUCTIONS IMPORTANTES</h4>
                <ul style="margin: 0; padding-left: 18px; color: #5D4037; font-size: 11px; line-height: 1.6;">
                    <li style="margin-bottom: 5px;">Présentez ce document à l'accueil du tribunal</li>
                    <li style="margin-bottom: 5px;">Arrivez 30 minutes avant l'heure indiquée</li>
                    <li style="margin-bottom: 5px;">Pièce d'identité obligatoire</li>
                    <li>Contact secrétariat : 034 25 15 48</li>
                </ul>
            </div>
            
            <!-- Pied de page -->
            <div style="text-align: center; padding: 15px; color: #7F8C8D; font-size: 10px; line-height: 1.5;">
                <div style="margin-bottom: 10px;">
                    <strong>TRIBUNAL DE JUSTICE</strong> - Avenue de la Justice, Alger Centre
                </div>
                <div style="margin-bottom: 5px;">
                    Tél: 034 25 15 48 | Email: secretariat@tribunal-justice.dz
                </div>
                <div style="font-size: 9px;">
                    Document généré automatiquement le ${today.toLocaleDateString('fr-FR')} à ${today.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    <br>© ${today.getFullYear()} Tribunal de Justice - Tous droits réservés
                </div>
            </div>
        </div>
    </div>
`;

            // Ajouter temporairement au DOM
            document.body.appendChild(content);

            // Générer le PDF
            const canvas = await html2canvas(content, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 0;
            
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            // Télécharger le PDF
            pdf.save(`CONFIRMATION_${etape1.seanceId}_${etape2.dateReservee}.pdf`);
            
            // Nettoyer
            document.body.removeChild(content);
            
            return true;
            
        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            return false;
        }
    };

    // ÉTAPE 1: Créer la séance
    const handleEtape1Submit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!etape1.affaireId) {
            setError('L\'ID de l\'affaire est obligatoire');
            return;
        }
        
        if (!etape1.typeSeance) {
            setError('Le type de séance est obligatoire');
            return;
        }
        
        if (selectedAffaire && (selectedAffaire.statut === 'CLOTUREE' || selectedAffaire.statut === 'ARCHIVEE')) {
            setError(`Impossible de créer une séance pour une affaire ${selectedAffaire.statut.toLowerCase()}`);
            return;
        }
        
        try {
            setLoading(true);
            
            const seanceData = {
                seanceId: etape1.seanceId || `SEANCE_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                typeSeance: etape1.typeSeance,
                statut: etape1.statut,
                affaireId: etape1.affaireId,
                jugeId: etape1.jugeId || null,
                avocatId: selectedAffaire?.avocatId
            };
            
            const response = await secretaireAPI.creerSeance(seanceData);
            
            setEtape1(prev => ({ ...prev, seanceId: response.seanceId }));
            setEtapeCourante(2);
            setSuccess('✅ Séance créée avec succès ! Passez à la réservation de la salle.');
            
        } catch (err) {
            setError(err.message || 'Erreur lors de la création de la séance');
        } finally {
            setLoading(false);
        }
    };

    // ÉTAPE 2: Réserver une salle
    const handleEtape2Submit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!etape2.salleId || !etape2.dateReservee || !etape2.heureReservee) {
            setError('Tous les champs de réservation sont obligatoires');
            return;
        }
        
        if (estWeekend(etape2.dateReservee)) {
            setError('Impossible de réserver un week-end');
            return;
        }
        
        try {
            setLoading(true);
            
            const reservationData = {
                salleId: etape2.salleId,
                seanceId: etape1.seanceId,
                dateReservee: etape2.dateReservee,
                heureReservee: etape2.heureReservee
            };
            
            await secretaireAPI.ajouterReservation(reservationData);
            
            // Générer le PDF de confirmation
            const pdfGenere = await genererPDFConfirmation();
            setPdfGenerated(pdfGenere);
            
            if (pdfGenere) {
                setSuccess('✅ Réservation créée avec succès ! PDF de confirmation téléchargé.');
            } else {
                setSuccess('✅ Réservation créée avec succès ! (Erreur lors de la génération du PDF)');
            }
            
            // Redirection après 5 secondes
            setTimeout(() => {
                navigate('/dashboard-secretaire/seances');
            }, 5000);
            
        } catch (err) {
            setError(err.message || 'Erreur lors de la réservation');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            await genererPDFConfirmation();
        } catch (error) {
            setError('Erreur lors du téléchargement du PDF');
        }
    };

    if (loadingData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des données...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                            <Calendar className="w-8 h-8 text-purple-600" />
                            {etapeCourante === 1 ? 'Créer une Nouvelle Séance' : 'Réserver une Salle'}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {etapeCourante === 1 
                                ? 'Planifiez une nouvelle audience au tribunal' 
                                : 'Assignez une salle, date et heure à la séance créée'}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard-secretaire')}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                        <Home className="w-4 h-4" />
                        Tableau de bord
                    </button>
                </div>

                {/* Indicateur d'étapes */}
                <div className="flex mb-8">
                    <div className={`flex-1 text-center p-4 transition-all ${etapeCourante >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        <div className="flex items-center justify-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${etapeCourante >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`}>
                                1
                            </div>
                            <span className="font-medium">Créer Séance</span>
                        </div>
                    </div>
                    <div className={`flex-1 text-center p-4 transition-all ${etapeCourante >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        <div className="flex items-center justify-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${etapeCourante >= 2 ? 'bg-green-500' : 'bg-gray-300'}`}>
                                2
                            </div>
                            <span className="font-medium">Réserver Salle</span>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                    <X className="w-4 h-4 text-red-600" />
                                </div>
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-green-700 font-medium">{success}</p>
                                {pdfGenerated && etapeCourante === 2 && (
                                    <button
                                        onClick={handleDownloadPDF}
                                        className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
                                    >
                                        <Download className="w-4 h-4" />
                                        Télécharger à nouveau le PDF
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ÉTAPE 1: Formulaire Création Séance */}
                {etapeCourante === 1 && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                        <form onSubmit={handleEtape1Submit}>
                            <div className="p-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Colonne gauche - Affaire */}
                                    <div className="space-y-6">
                                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <FileText className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800">Affaire</h3>
                                                    <p className="text-gray-600 text-sm">Sélectionnez l'affaire concernée</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        ID de l'Affaire *
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={etape1.affaireId}
                                                            onChange={(e) => {
                                                                setEtape1({...etape1, affaireId: e.target.value});
                                                                const affaire = affaires.find(a => a.affaireId === e.target.value);
                                                                setSelectedAffaire(affaire || null);
                                                            }}
                                                            placeholder="Ex: AFF_2024_001"
                                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowAffaireList(true)}
                                                            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                                                        >
                                                            <FileText className="w-4 h-4" />
                                                            Liste
                                                        </button>
                                                    </div>
                                                </div>

                                                {selectedAffaire && (
                                                    <div className="bg-white rounded-lg border border-blue-200 p-4">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h4 className="font-semibold text-gray-800">
                                                                {selectedAffaire.affaireId}
                                                            </h4>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                                selectedAffaire.statut === 'ACTIVE' 
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : selectedAffaire.statut === 'EN_COURS'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {selectedAffaire.statut}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                                            <div>
                                                                <span className="font-medium">Type:</span> {selectedAffaire.typeAffaire}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Avocat:</span> {selectedAffaire.avocatId}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Section Juge */}
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <Gavel className="w-6 h-6 text-purple-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800">Juge Assigné</h3>
                                                    <p className="text-gray-600 text-sm">Optionnel - Sélectionnez un juge</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        ID du Juge
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={etape1.jugeId}
                                                            onChange={(e) => {
                                                                setEtape1({...etape1, jugeId: e.target.value});
                                                                const juge = juges.find(j => j.jugeId === e.target.value);
                                                                setSelectedJuge(juge || null);
                                                            }}
                                                            placeholder="Ex: JUGE_001"
                                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowJugeList(true)}
                                                            className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                                                        >
                                                            <Users className="w-4 h-4" />
                                                            Liste
                                                        </button>
                                                    </div>
                                                </div>

                                                {selectedJuge && (
                                                    <div className="bg-white rounded-lg border border-purple-200 p-4">
                                                        <h4 className="font-semibold text-gray-800 mb-2">
                                                            {selectedJuge.nom} {selectedJuge.prenom}
                                                        </h4>
                                                        <div className="text-sm text-gray-600">
                                                            <p>ID: {selectedJuge.jugeId}</p>
                                                            {selectedJuge.specialite && (
                                                                <p className="mt-1">Spécialité: {selectedJuge.specialite}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Colonne droite - Détails de la Séance */}
                                    <div className="space-y-6">
                                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 bg-amber-100 rounded-lg">
                                                    <Calendar className="w-6 h-6 text-amber-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800">Détails de la Séance</h3>
                                                    <p className="text-gray-600 text-sm">Informations sur l'audience</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Type de Séance *
                                                    </label>
                                                    <select
                                                        value={etape1.typeSeance}
                                                        onChange={(e) => setEtape1({...etape1, typeSeance: e.target.value})}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                                                        required
                                                    >
                                                        <option value="">Sélectionnez un type</option>
                                                        {typesSeance.map(type => (
                                                            <option key={type.value} value={type.value}>
                                                                {type.icon} {type.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Section ID de Séance */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        ID de Séance
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={etape1.seanceId}
                                                            onChange={(e) => setEtape1({...etape1, seanceId: e.target.value})}
                                                            placeholder="Généré automatiquement"
                                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50"
                                                            readOnly
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={genererIdSeance}
                                                            className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2 whitespace-nowrap"
                                                        >
                                                            <Calendar className="w-4 h-4" />
                                                            Générer ID
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section Résumé Avocat */}
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-green-100 rounded-lg">
                                                    <Users className="w-6 h-6 text-green-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800">Avocat Assigné</h3>
                                                    <p className="text-gray-600 text-sm">Déterminé automatiquement par l'affaire</p>
                                                </div>
                                            </div>

                                            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                                                {selectedAffaire ? (
                                                    <>
                                                        <div className="text-2xl font-bold text-gray-800 mb-2">
                                                            {selectedAffaire.avocatId || 'Non assigné'}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            Avocat principal de l'affaire {selectedAffaire.affaireId}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-gray-500 italic">
                                                        Sélectionnez d'abord une affaire
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Boutons d'action Étape 1 */}
                            <div className="border-t border-gray-200 bg-gray-50 p-8">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/dashboard-secretaire/seances')}
                                        className="px-6 py-3 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-xl transition font-medium"
                                    >
                                        Annuler
                                    </button>
                                    <div className="flex gap-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-medium flex items-center justify-center gap-2 min-w-[200px]"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                    Création...
                                                </>
                                            ) : (
                                                <>
                                                    Continuer
                                                    <ChevronRight className="w-5 h-5" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {/* ÉTAPE 2: Formulaire Réservation Salle */}
                {etapeCourante === 2 && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                        <form onSubmit={handleEtape2Submit}>
                            <div className="p-8">
                                <div className="mb-6 bg-blue-50 p-6 rounded-xl border border-blue-200">
                                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                        <Check className="w-5 h-5 text-green-600" />
                                        Séance créée avec succès
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">ID Séance</p>
                                            <p className="font-semibold text-gray-800">{etape1.seanceId}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Affaire</p>
                                            <p className="font-semibold text-gray-800">{etape1.affaireId}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Type</p>
                                            <p className="font-semibold text-gray-800">{etape1.typeSeance}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Colonne gauche - Date et Heure */}
                                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <Clock className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800">Date et Heure</h3>
                                                <p className="text-gray-600 text-sm">Définissez la date et l'heure de la séance</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Date de la séance *
                                                </label>
                                                <input
                                                    type="date"
                                                    value={etape2.dateReservee}
                                                    onChange={(e) => handleDateChange(e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                        etape2.dateReservee && estWeekend(etape2.dateReservee) 
                                                        ? 'border-red-500 bg-red-50' 
                                                        : 'border-gray-300'
                                                    }`}
                                                    required
                                                />
                                                {etape2.dateReservee && estWeekend(etape2.dateReservee) && (
                                                    <p className="text-red-600 text-sm mt-1">
                                                        ⚠️ Le tribunal est fermé le week-end. Veuillez choisir une date en semaine.
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Heure de la séance *
                                                </label>
                                                <input
                                                    type="time"
                                                    value={etape2.heureReservee}
                                                    onChange={(e) => handleHeureChange(e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Colonne droite - Salle */}
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                <Building className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800">Salle d'Audience</h3>
                                                <p className="text-gray-600 text-sm">
                                                    {etape2.dateReservee && !estWeekend(etape2.dateReservee)
                                                        ? `Salles disponibles le ${new Date(etape2.dateReservee).toLocaleDateString('fr-FR')}`
                                                        : 'Sélectionnez d\'abord une date et heure'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Salle *
                                                </label>
                                                
                                                {!etape2.dateReservee || estWeekend(etape2.dateReservee) ? (
                                                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                                        <p className="text-gray-500">Veuillez d'abord sélectionner une date en semaine</p>
                                                    </div>
                                                ) : sallesDisponibles.length === 0 ? (
                                                    <div className="text-center py-8 border-2 border-dashed border-red-300 rounded-lg bg-red-50">
                                                        <Building className="w-12 h-12 text-red-400 mx-auto mb-2" />
                                                        <p className="text-red-600 font-medium">Aucune salle disponible</p>
                                                        <p className="text-red-500 text-sm mt-1">
                                                            Toutes les salles sont réservées pour cette date/heure
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                        {sallesDisponibles.map((salle) => (
                                                            <button
                                                                key={salle.salleId}
                                                                type="button"
                                                                onClick={() => handleSelectSalle(salle)}
                                                                className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                                                                    etape2.salleId === salle.salleId
                                                                        ? 'border-purple-500 bg-purple-100'
                                                                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                                                }`}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <h4 className="font-semibold text-gray-800">
                                                                            {salle.salleId}
                                                                        </h4>
                                                                        <div className="flex items-center gap-2 mt-1">
                                                                            <span className="text-xs text-gray-500">
                                                                                Cap: {salle.capacite || '20'} pers
                                                                            </span>
                                                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                                        </div>
                                                                    </div>
                                                                    {etape2.salleId === salle.salleId && (
                                                                        <Check className="w-5 h-5 text-purple-600" />
                                                                    )}
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Afficher un compteur */}
                                            {etape2.dateReservee && !estWeekend(etape2.dateReservee) && sallesDisponibles.length > 0 && (
                                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span className="text-sm text-gray-600">Salles disponibles</span>
                                                    </div>
                                                    <div className="font-bold text-gray-800">
                                                        {sallesDisponibles.length} / 5
                                                    </div>
                                                </div>
                                            )}

                                            {selectedSalle && (
                                                <div className="bg-white rounded-lg border border-purple-200 p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-800">
                                                                {selectedSalle.salleId}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                Salle sélectionnée - {selectedSalle.capacite || '20'} places
                                                            </p>
                                                        </div>
                                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                            Disponible
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Boutons d'action Étape 2 */}
                            <div className="border-t border-gray-200 bg-gray-50 p-8">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setEtapeCourante(1)}
                                        className="px-6 py-3 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-xl transition font-medium flex items-center gap-2"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Retour
                                    </button>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => navigate('/dashboard-secretaire/seances')}
                                            className="px-6 py-3 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-xl transition font-medium"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading || !etape2.salleId}
                                            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-medium flex items-center justify-center gap-2 min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                    Réservation...
                                                </>
                                            ) : (
                                                <>
                                                    <Download className="w-5 h-5" />
                                                    Confirmer et télécharger PDF
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {/* Informations */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        Processus en 2 étapes
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500">•</span>
                            <span><strong>Étape 1:</strong> Créez d'abord la séance avec ses informations de base</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500">•</span>
                            <span><strong>Étape 2:</strong> Assignez ensuite une salle, date et heure à cette séance</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500">•</span>
                            <span>Un PDF de confirmation sera automatiquement généré et téléchargé</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500">•</span>
                            <span>Maximum 5 séances peuvent être planifiées à la même date/heure (5 salles)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500">•</span>
                            <span>⚠️ Le tribunal est fermé le week-end (vendredi et samedi)</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Modaux de sélection */}
            {showAffaireList && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
                            <h3 className="text-xl font-bold text-white">Liste des Affaires</h3>
                        </div>
                        <div className="p-6 max-h-[50vh] overflow-y-auto">
                            {affaires.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">Aucune affaire disponible</p>
                            ) : (
                                affaires.map(affaire => (
                                    <div
                                        key={affaire.affaireId}
                                        onClick={() => handleSelectAffaire(affaire)}
                                        className="p-4 border rounded-lg mb-3 cursor-pointer hover:bg-blue-50 transition"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{affaire.affaireId}</h4>
                                                <p className="text-sm text-gray-600">{affaire.typeAffaire}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs ${
                                                affaire.statut === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                                affaire.statut === 'EN_COURS' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {affaire.statut}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="border-t p-4">
                            <button
                                onClick={() => setShowAffaireList(false)}
                                className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showJugeList && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                            <h3 className="text-xl font-bold text-white">Liste des Juges</h3>
                        </div>
                        <div className="p-6 max-h-[50vh] overflow-y-auto">
                            {juges.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">Aucun juge disponible</p>
                            ) : (
                                juges.map(juge => (
                                    <div
                                        key={juge.jugeId}
                                        onClick={() => handleSelectJuge(juge)}
                                        className="p-4 border rounded-lg mb-3 cursor-pointer hover:bg-purple-50 transition"
                                    >
                                        <h4 className="font-semibold text-gray-800">{juge.jugeId}</h4>
                                        <p className="text-sm text-gray-600">{juge.nom} {juge.prenom}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="border-t p-4">
                            <button
                                onClick={() => setShowJugeList(false)}
                                className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AjouterSeance;