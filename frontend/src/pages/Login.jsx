import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [successMsg, setSuccessMsg] = useState(location.state?.message || '');

    useEffect(() => {
        if (successMsg) {
            const timer = setTimeout(() => setSuccessMsg(''), 6000);
            return () => clearTimeout(timer);
        }
    }, [successMsg]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
            <div className="max-w-md w-full glass p-6 sm:p-10 rounded-3xl shadow-2xl space-y-8 border border-white/50">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-600 text-white mb-6 shadow-xl shadow-primary-200 -rotate-3 transition-transform hover:rotate-0">
                        <LogIn size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Welcome Back</h2>
                    <p className="text-slate-500 mt-2 font-medium">Continue your productivity journey</p>
                </div>

                {successMsg && (
                    <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-4 py-3 rounded-r-xl flex items-center gap-3 animate-in fade-in zoom-in-95">
                        <CheckCircle2 size={20} className="flex-shrink-0" />
                        <span className="text-sm font-semibold">{successMsg}</span>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-xl flex items-center gap-3 animate-shake">
                        <AlertCircle size={20} className="flex-shrink-0" />
                        <span className="text-sm font-semibold">{error}</span>
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                            <input
                                type="email"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all outline-none font-medium"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                            <input
                                type="password"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all outline-none font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-4 rounded-2xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 text-lg"
                    >
                        {loading ? <Loader2 className="animate-spin" size={24} /> : 'Sign In'}
                    </button>
                </form>

                <div className="pt-4 border-t border-slate-100">
                    <p className="text-center text-slate-600 text-sm font-medium">
                        New here?{' '}
                        <Link to="/signup" className="text-primary-600 font-black hover:underline underline-offset-8">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
