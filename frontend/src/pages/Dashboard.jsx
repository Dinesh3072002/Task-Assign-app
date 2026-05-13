import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Plus, ListChecks, Loader2, ClipboardList, CheckCircle2, Circle, AlertCircle, User, Briefcase, Trash2 } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [title, setTitle] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTasks();
        if (user?.role === 'Manager') {
            fetchEmployees();
        }
    }, [user]);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/auth/employees');
            setEmployees(res.data);
        } catch (err) {
            console.error('Failed to fetch employees');
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        setError('');
        if (!title.trim()) return;
        if (user?.role === 'Manager' && !selectedEmployee) {
            setError('Please select an employee to assign this task');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                title,
                employeeId: user?.role === 'Manager' ? selectedEmployee : null
            };
            const res = await api.post('/tasks', payload);

            fetchTasks();
            setTitle('');
            setSelectedEmployee('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add task');
        } finally {
            setSubmitting(false);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        if (user?.role !== 'Employee') return;

        const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
        const previousTasks = [...tasks];
        setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));

        try {
            await api.patch(`/tasks/${id}/status`, { status: newStatus });
        } catch (err) {
            setTasks(previousTasks);
            alert('Failed to update status');
        }
    };

    const handleDeleteTask = async (id) => {
        if (user?.role !== 'Manager') return;
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t.id !== id));
        } catch (err) {
            alert('Failed to delete task');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
                <div className="mb-6">
                    <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                        {user?.role === 'Manager' ? <Briefcase className="text-primary-600" /> : <User className="text-primary-600" />}
                        {user?.role} Dashboard
                    </h1>
                </div>

                {/* Add Task Section - ONLY FOR MANAGERS */}
                {user?.role === 'Manager' && (
                    <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 mb-10 transition-all hover:shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
                                <div className="p-2 bg-primary-100 rounded-xl text-primary-600 shadow-sm">
                                    <Plus size={20} />
                                </div>
                                <span className="hidden xs:inline">Assign New Task</span>
                                <span className="xs:hidden">New Task</span>
                            </h2>
                        </div>

                        {error && (
                            <div className="mb-5 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-xl flex items-center gap-2 text-sm font-bold animate-shake">
                                <AlertCircle size={18} className="flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleAddTask} className="flex flex-col gap-4">
                            <div className="w-full">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Task Description</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Design the home page mockup"
                                    className="w-full px-5 py-4 border-2 border-slate-50 bg-slate-50 rounded-2xl focus:bg-white focus:border-primary-500 outline-none transition-all placeholder:text-slate-300 font-bold text-slate-700"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="w-full">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Assign To</label>
                                    <select
                                        className="w-full px-5 py-4 border-2 border-slate-50 bg-slate-50 rounded-2xl focus:bg-white focus:border-primary-500 outline-none transition-all font-bold text-slate-700 cursor-pointer appearance-none"
                                        value={selectedEmployee}
                                        onChange={(e) => setSelectedEmployee(e.target.value)}
                                    >
                                        <option value="">Select Employee...</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.name || emp.email}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="w-full flex items-end">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 shadow-xl shadow-slate-300"
                                    >
                                        {submitting ? <Loader2 className="animate-spin" size={24} /> : (
                                            <>
                                                <Plus size={20} />
                                                <span>Deploy Task</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {/* Tasks List Section */}
                <div className="space-y-4">
                    <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mb-4 px-2">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <ListChecks size={20} className="text-primary-600" />
                            <span className="truncate">
                                {user?.role === 'Manager' ? 'Tasks Assigned' : 'My Tasks'}
                            </span>
                        </h2>
                        <div className="w-fit bg-white border border-slate-200 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                            {tasks.length} Total
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <Loader2 className="animate-spin mb-4" size={32} />
                            <p className="font-medium">Loading tasks...</p>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border-2 border-slate-100 border-dashed">
                            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                <ClipboardList size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">No tasks found</h3>
                            <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                                {user?.role === 'Manager'
                                    ? 'You haven\'t assigned any tasks to employees yet.'
                                    : 'You don\'t have any tasks assigned to you right now.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {tasks.map(task => (
                                <div
                                    key={task.id}
                                    className={`group bg-white p-4 sm:p-5 rounded-2xl shadow-sm border transition-all flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 ${
                                        task.status === 'Completed' ? 'border-emerald-100 bg-emerald-50/10' : 'border-slate-100 hover:border-primary-100'
                                    }`}
                                >
                                    <div className="flex items-start gap-3 w-full sm:w-auto sm:flex-grow min-w-0">
                                        <button
                                            onClick={() => toggleStatus(task.id, task.status)}
                                            disabled={user?.role !== 'Employee'}
                                            className={`mt-1 flex-shrink-0 transition-all transform ${user?.role === 'Employee' ? 'hover:scale-110 active:scale-95 text-slate-300 hover:text-primary-500' : 'cursor-default opacity-80'} ${
                                                task.status === 'Completed' ? 'text-emerald-500' : ''
                                            }`}
                                        >
                                            {task.status === 'Completed' ? <CheckCircle2 size={26} className="sm:w-[28px] sm:h-[28px]" /> : <Circle size={26} className="sm:w-[28px] sm:h-[28px]" />}
                                        </button>

                                        <div className="min-w-0 flex-grow">
                                            <p className={`font-bold text-slate-800 leading-tight sm:text-lg break-words ${
                                                task.status === 'Completed' ? 'line-through text-slate-400' : ''
                                            }`}>
                                                {task.title}
                                            </p>

                                            {user?.role === 'Manager' ? (
                                                <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                                                    <div className="w-4 h-4 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center">
                                                        <User size={10} className="text-slate-500" />
                                                    </div>
                                                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide truncate">To: {task.employee_name || task.employee_email}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                                                    <div className="w-4 h-4 rounded-full bg-primary-50 flex-shrink-0 flex items-center justify-center">
                                                        <User size={10} className="text-primary-500" />
                                                    </div>
                                                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide truncate">By: {task.manager_name || task.manager_email || 'System'}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-2 sm:mt-0 flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100/50">
                                        <div className={`flex-shrink-0 text-[10px] uppercase font-black px-3 py-1.5 rounded-full tracking-wider shadow-sm border ${
                                            task.status === 'Completed'
                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                            : 'bg-amber-100 text-amber-700 border-amber-200'
                                        }`}>
                                            {task.status}
                                        </div>

                                        {user?.role === 'Manager' && (
                                            <button
                                                onClick={() => handleDeleteTask(task.id)}
                                                className="bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all p-2.5 rounded-xl flex items-center justify-center border border-slate-200/50 hover:border-red-200 shadow-sm"
                                                title="Delete Task"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
