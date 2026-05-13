import { useAuth } from '../context/AuthContext';
import { LogOut, CheckSquare, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
            <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0 flex-shrink">
                    <div className="bg-primary-600 p-1.5 sm:p-2 rounded-lg text-white flex-shrink-0">
                        <CheckSquare size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-base sm:text-lg lg:text-xl font-black text-slate-800 tracking-tight truncate">
                        <span className="xs:inline hidden">Dinu Task App</span>
                        <span className="xs:hidden inline">DinuApp</span>
                    </span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-4 ml-2 flex-shrink-0">
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-slate-600">
                        <User size={14} className="flex-shrink-0" />
                        <span className="text-xs font-bold truncate max-w-[100px]">{user?.email}</span>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-1.5 sm:gap-2 text-slate-600 hover:text-red-600 font-black transition-all px-2.5 py-2 rounded-xl hover:bg-red-50"
                    >
                        <LogOut size={18} />
                        <span className="text-xs sm:text-sm">Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
