import React, { useState } from "react";
import { 
  Scale, UserPlus, FileText, Users, 
  LogOut, Menu, X, User, Home,
  Calendar, Clock, Shield, Award
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const DashboardAvocat = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const menuItems = [
    {
      title: "Accueil",
      path: "/dashboard-avocat",
      icon: <Home className="w-5 h-5" />,
    },
    {
      title: "Mon Profil",
      path: "/dashboard-avocat/mon-profile",
      icon: <User className="w-5 h-5" />,
    },
    {
      title: "Mes Clients",
      path: "/dashboard-avocat/mes-clients",
      icon: <Users className="w-5 h-5" />,
    },
    {
      title: "Mes Affaires",
      path: "/dashboard-avocat/mes-affaires",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      title: "Nouveau Client",
      path: "/dashboard-avocat/ajouter-client",
      icon: <UserPlus className="w-5 h-5" />,
    },
    {
      title: "Nouvelle Affaire",
      path: "/dashboard-avocat/ajouter-affaire",
      icon: <FileText className="w-5 h-5" />,
    },     {
      title: "Mes Seances",
      path: "/dashboard-avocat/mes-seances",
      icon: <FileText className="w-5 h-5" />,
    },
        {
      title: "Mes Archives",
      path: "/dashboard-avocat/mes-archives",
      icon: <FileText className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex">
      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Barre latérale */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        flex flex-col h-screen shadow-2xl
      `}>
        {/* Logo et titre */}
        <div className="p-6 border-b border-blue-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Scale className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">JusticeDZ</h1>
              <p className="text-blue-300/80 text-sm font-light">Avocat Connecté</p>
            </div>
          </div>
        </div>

        {/* Profil utilisateur */}
        <div className="p-6 border-b border-blue-700/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-7 h-7" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-blue-900"></div>
            </div>
            <div>
              <h2 className="font-bold text-lg">Maître Avocat</h2>
              <p className="text-blue-300/80 text-sm">Cabinet de Justice</p>
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
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-white/20 text-white shadow-lg shadow-blue-900/30' 
                        : 'hover:bg-white/10 text-blue-100 hover:shadow-md'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className={`${isActive ? 'text-white' : 'text-blue-300'}`}>
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
        <div className="p-4 border-t border-blue-700/50">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 overflow-x-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-800">Tableau de Bord Avocat</h2>
              <p className="text-gray-600 text-sm mt-1">Gérez votre cabinet efficacement</p>
            </div>
          </div>
        </header>

        {/* Contenu */}
        <div className="p-6">
          {/* Message de bienvenue */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Bonjour, Maître Avocat</h1>
                <p className="text-blue-100 text-lg">
                  Bienvenue dans votre espace de gestion juridique
                </p>
              </div>
              <div className="hidden md:block">
              </div>
            </div>
          </div>

          {/* Cartes d'actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {menuItems.filter(item => item.title !== "Accueil").map((item) => (
              <Link key={item.title} to={item.path}>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-blue-600">
                        {item.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">
                       <p className="text-gray-600">
  {item.title.includes("Client") 
    ? "Gérez vos clients et dossiers" 
    : item.title.includes("Affaire") 
      ? "Suivez vos procédures en cours" 
      : item.title.includes("Archives")
        ? "Consultez vos archives juridiques"
        : item.title.includes("Seances")
          ? "Consultez vos séances à venir"
        : "Accédez à vos informations personnelles"
        
        }
</p>
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

      
        </div>
      </main>
    </div>
  );
};

export default DashboardAvocat;