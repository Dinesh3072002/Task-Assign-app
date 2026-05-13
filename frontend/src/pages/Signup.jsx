import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, AlertCircle, Loader2, Users, User } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Employee');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signup(name, email, password, role);
            navigate('/login', { state: { message: 'Account created! Please log in.' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
            <div className="max-w-md w-full glass p-6 sm:p-10 rounded-3xl shadow-2xl space-y-8 border border-white/50">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-600 text-white mb-6 shadow-xl shadow-primary-200 rotate-3 transition-transform hover:rotate-0">
                        <UserPlus size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Create Account</h2>
                    <p className="text-slate-500 mt-2 font-medium">Join as a Manager or Employee</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-xl flex items-center gap-3 animate-shake">
                        <AlertCircle size={20} className="flex-shrink-0" />
                        <span className="text-sm font-semibold">{error}</span>
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 ml-1">Account Type</label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setRole('Employee')}
                                className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2 ${
                                    role === 'Employee'
                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                                }`}
                            >
                                Employee
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('Manager')}
                                className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2 ${
                                    role === 'Manager'
                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                                }`}
                            >
                                Manager
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                            <input
                                type="text"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all outline-none font-medium"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

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
                                minLength={6}
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
                        {loading ? <Loader2 className="animate-spin" size={24} /> : 'Get Started'}
                    </button>
                </form>

                <p className="text-center text-slate-600 text-sm font-medium">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-600 font-black hover:underline underline-offset-8">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
