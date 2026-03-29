import React, { useState, useEffect } from "react";
import { 
  Users, Calendar, FileText, Clock, LogOut, 
  Home, Building, Menu, X, User,
  List, Bell, Settings
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const DashboardSecretaire = () => {
  const [user, setUser] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const menuItems = [
    {
      title: "Accueil",
      path: "/dashboard-secretaire",
      icon: <Home className="w-5 h-5" />,
      color: "purple"
    },
    {
      title: "Clients",
      path: "/dashboard-secretaire/clients",
      icon: <Users className="w-5 h-5" />,
      color: "blue"
    },
    {
      title: "Affaires",
      path: "/dashboard-secretaire/affaires",
      icon: <FileText className="w-5 h-5" />,
      color: "amber"
    },
    {
      title: "Salles",
      path: "/dashboard-secretaire/salles",
      icon: <Building className="w-5 h-5" />,
      color: "green"
    },
    {
      title: "Créer Séance",
      path: "/dashboard-secretaire/creer-seance",
      icon: <Calendar className="w-5 h-5" />,
      color: "indigo"
    },
   
  ];

  const quickActions = [
 
    {
      title: "Clients",
      path: "/dashboard-secretaire/clients",
      icon: <Users className="w-8 h-8" />,
      color: "blue",
      description: "Gérer les clients"
    },
    
    {
      title: "Affaires",
      path: "/dashboard-secretaire/affaires",
      icon: <FileText className="w-8 h-8" />,
      color: "amber",
      description: "Gérer les dossiers"
    },

    {
      title: "Reservations",
      path: "/dashboard-secretaire/reservations",
      icon: <Calendar className="w-8 h-8" />,
      color: "red",
      description: "Voir les alertes"
    },
      {
      title: "Archive des seances",
      path: "/dashboard-secretaire/archives-seances",
      icon: <FileText className="w-8 h-8" />,
      color: "red",
      description: "Voir les alertes"
    },
     
  ];

  const colorClasses = {
    purple: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-500", hover: "hover:bg-purple-50" },
    blue: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-500", hover: "hover:bg-blue-50" },
    red: { bg: "bg-red-100", text: "text-red-600", border: "border-red-500", hover: "hover:bg-red-50" },
    green: { bg: "bg-green-100", text: "text-green-600", border: "border-green-500", hover: "hover:bg-green-50" },
    amber: { bg: "bg-amber-100", text: "text-amber-600", border: "border-amber-500", hover: "hover:bg-amber-50" },
    indigo: { bg: "bg-indigo-100", text: "text-indigo-600", border: "border-indigo-500", hover: "hover:bg-indigo-50" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Barre latérale */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-purple-800 to-purple-900 text-white
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        flex flex-col h-screen shadow-2xl 
      `}>
        <div className="p-6 border-b border-purple-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Tribunal</h1>
              <p className="text-purple-300 text-sm mt-1">Secrétariat</p>
            </div>
          </div>
        </div>

        {/* Profil utilisateur */}
        <div className="p-6 border-b border-purple-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-semibold">{user.nom || "Secrétaire"}</h2>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <h3 className="text-xs uppercase tracking-wider text-purple-400 mb-3 px-4">Navigation</h3>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const colors = colorClasses[item.color];
              
              return (
                <li key={item.title}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                      ${isActive 
                        ? `bg-white/20 ${colors.text} border-l-4 ${colors.border} shadow-md` 
                        : 'hover:bg-white/10 text-purple-100'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white/5'}`}>
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Déconnexion */}
        <div className="p-4 border-t border-purple-700/50">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 overflow-x-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition"
            >
              {sidebarOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">Tableau de bord Secrétaire</h2>
              <p className="text-gray-600">Gestion du tribunal - {user.nom} {user.prenom}</p>
            </div>
          </div>
        </header>

        {/* Contenu */}
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Bonjour, <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{user.prenom || "Secrétaire"}</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Gérez les activités quotidiennes du tribunal depuis ce tableau de bord.
            </p>
          </div>

          {/* Actions principales */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </span>
              Gestion des Audiences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/dashboard-secretaire/creer-seance">
                <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl shadow">
                      <Calendar className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Créer Séance</h3>
                      <p className="text-gray-600">Nouvelle audience</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link to="/dashboard-secretaire/seances">
                <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl shadow">
                      <Clock className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Gérer Séances</h3>
                      <p className="text-gray-600">Calendrier complet</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link to="/dashboard-secretaire/salles">
                <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl shadow">
                      <Building className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Salles</h3>
                      <p className="text-gray-600">Gestion des salles</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Toutes les actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const colors = colorClasses[action.color];
              
              return (
                <Link key={action.title} to={action.path}>
                  <div className={`
                    bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-200 
                    hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1
                    hover:border-l-4 ${colors.border}
                  `}>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 ${colors.bg} rounded-xl shadow`}>
                        <div className={colors.text}>
                          {action.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {action.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardSecretaire;