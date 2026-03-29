import React, { useState } from "react";
import { 
  Shield, Users, Scale, Gavel, 
  LogOut, Menu, X, User, Home,
  FileText, UserPlus, History
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const DashboardAdmin = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const menuItems = [
    {
      title: "Accueil",
      path: "/dashboard-admin",
      icon: <Home className="w-5 h-5" />,
    },
    {
      title: "Ajouter Avocat",
      path: "/dashboard-admin/ajouter-avocat",
      icon: <UserPlus className="w-5 h-5" />,
    },
    {
      title: "Ajouter Juge",
      path: "/dashboard-admin/ajouter-juge",
      icon: <UserPlus className="w-5 h-5" />,
    },
    {
      title: "Lister Avocats",
      path: "/dashboard-admin/lister-avocat",
      icon: <Users className="w-5 h-5" />,
    },
    {
      title: "Lister Juges",
      path: "/dashboard-admin/lister-juge",
      icon: <Gavel className="w-5 h-5" />,
    },
    {
      title: "Historique Juridique",
      path: "/dashboard-admin/historique-juridique",
      icon: <History className="w-5 h-5" />,
    },

      {
      title: "Les Archives",
      path: "/dashboard-admin/archives-seances",
      icon: <History className="w-5 h-5" />,
    },
  ];

  const quickActions = [
    {
      title: "Ajouter Un Avocat",
      path: "/dashboard-admin/ajouter-avocat",
      icon: <Scale className="w-8 h-8" />,
      color: "blue",
      description: "Gérer les avocats"
    },
    {
      title: "Ajouter Un Juge",
      path: "/dashboard-admin/ajouter-juge",
      icon: <Gavel className="w-8 h-8" />,
      color: "green",
      description: "Gérer les juges"
    },
    {
      title: "Lister Les Avocats",
      path: "/dashboard-admin/lister-avocat",
      icon: <Users className="w-8 h-8" />,
      color: "purple",
      description: "Voir tous les avocats"
    },
    {
      title: "Lister Les Juges",
      path: "/dashboard-admin/lister-juge",
      icon: <Gavel className="w-8 h-8" />,
      color: "orange",
      description: "Voir tous les juges"
    },
    {
      title: "Historique",
      path: "/dashboard-admin/historique-juridique",
      icon: <History className="w-8 h-8" />,
      color: "indigo",
      description: "Consultation de l'historique"
    },
        {
      title: "Les Archives",
      path: "/dashboard-admin/archives-seances",
      icon: <History className="w-5 h-5" />,
       color: "indigo",
      description: "Consultation de l'Archivage"
    },
  ];

  const colorClasses = {
    blue: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-500" },
    green: { bg: "bg-green-100", text: "text-green-600", border: "border-green-500" },
    purple: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-500" },
    orange: { bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-500" },
    indigo: { bg: "bg-indigo-100", text: "text-indigo-600", border: "border-indigo-500" },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Barre latérale */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-blue-900 text-white
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        flex flex-col h-screen
      `}>
        {/* Logo et titre */}
        <div className="p-6 border-b border-blue-700">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">JusticeDz</h1>
              <p className="text-blue-300 text-sm">Administrateur</p>
            </div>
          </div>
        </div>

        {/* Profil utilisateur */}
        <div className="p-6 border-b border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-semibold">{user.nom || "Administrateur"}</h2>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.title}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition
                      ${isActive 
                        ? 'bg-blue-700 text-white' 
                        : 'hover:bg-blue-700/50 text-blue-100'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.icon}
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Déconnexion */}
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 overflow-x-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-800">Panneau d'Administrateur</h2>
              <p className="text-gray-600">Gestion complète du système</p>
            </div>
          </div>
        </header>

        {/* Contenu */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bonjour, {user.nom || "Administrateur"}
          </h1>
          <p className="text-gray-600 mb-8">
            Gérez l'ensemble du système juridique depuis ce tableau de bord.
          </p>

        
          {/* Actions rapides */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const colors = colorClasses[action.color];
              
              return (
                <Link key={action.title} to={action.path}>
                  <div className={`
                    bg-white p-6 rounded-xl shadow-md border-l-4 ${colors.border}
                    hover:shadow-lg transition-all duration-300 cursor-pointer
                    hover:-translate-y-0.5
                  `}>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 ${colors.bg} rounded-lg`}>
                        <div className={colors.text}>
                          {action.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {action.title}
                        </h3>
                        <p className="text-gray-600">
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

export default DashboardAdmin;