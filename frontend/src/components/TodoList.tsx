

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { Pencil, Trash2, Plus, Filter, Calendar, AlertCircle, ArrowUpDown, Clock, Search, X } from 'lucide-react';
import { TaskCard } from './TaskCard';

interface ITodo {
    _id: string;
    title: string;
    description: string;
    status: 'Todo' | 'InProgress' | 'Completed';
    dueDate?: string;
    userId: string;
    createdAt?: string;
}

function TodoList() {
    const [inputValue, setInputValue] = useState<string>('');
    const [inputDesc, setInputDesc] = useState<string>('');
    const [status, setStatus] = useState<'Todo' | 'InProgress' | 'Completed'>('Todo');
    const [editingId, setEditingId] = useState<string>('');
    const [todos, setTodos] = useState<ITodo[]>([]);
    const [dueDate, setDueDate] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'Todo' | 'InProgress' | 'Completed'>('all');
    const [showForm, setShowForm] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<'dueDate-asc' | 'dueDate-desc' | 'createdAt-asc' | 'createdAt-desc'>('dueDate-asc');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            const { data } = await axios.patch(`${BACKEND_URL}/api/tasks/${editingId}`, {
                title: inputValue,
                description: inputDesc,
                status,
                dueDate
            }, { withCredentials: true });

            console.log(data);

            setTodos(todos.map(todo =>
                todo._id === editingId ? { ...todo, title: inputValue, description: inputDesc, status, dueDate } : todo
            ));
        } else {
            const { data } = await axios.post(`${BACKEND_URL}/api/tasks`, {
                title: inputValue,
                description: inputDesc,
                status,
                dueDate
            }, { withCredentials: true });

            const newTodo = {
                _id: data.data._id || Math.random().toString(),
                title: inputValue,
                description: inputDesc,
                status,
                userId: data.data.userId || '34234',
                dueDate,
                createdAt: new Date().toISOString()
            };
            setTodos([...todos, newTodo]);
        }

        setInputValue('');
        setInputDesc('');
        setStatus('Todo');
        setEditingId('');
        setDueDate('');
        setShowForm(false);
    };

    const handleEdit = (id: string, title: string, desc: string, status: ITodo['status'], dueDate = '') => {
        setInputValue(title);
        setInputDesc(desc);
        setStatus(status);
        setEditingId(id);
        setDueDate(dueDate?.split('T')[0]);
        setShowForm(true);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        await axios.delete(`${BACKEND_URL}/api/tasks/${id}`, { withCredentials: true });
        setTodos(todos.filter(todo => todo._id !== id));
    };

    useEffect(() => {
        const fetchTodos = async () => {
            const { data } = await axios.get(`${BACKEND_URL}/api/tasks`, { withCredentials: true });
            setTodos(data.data);
        };
        fetchTodos();
    }, []);

    // Filter todos based on status and search query
    const filteredTodos = todos.filter(todo => {
        // Filter by status
        const statusMatch = filterStatus === 'all' || todo.status === filterStatus;

        // Filter by search query
        const titleMatch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());

        return statusMatch && titleMatch;
    });

    // Sort todos based on sorting selection
    const sortedTodos = [...filteredTodos].sort((a, b) => {
        if (sortBy === 'dueDate-asc') {
            return new Date(a.dueDate || '9999-12-31').getTime() - new Date(b.dueDate || '9999-12-31').getTime();
        } else if (sortBy === 'dueDate-desc') {
            return new Date(b.dueDate || '9999-12-31').getTime() - new Date(a.dueDate || '9999-12-31').getTime();
        } else if (sortBy === 'createdAt-asc') {
            return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
        } else {
            return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
        }
    });

    const getStatusColor = (status: ITodo['status']) => {
        switch (status) {
            case 'Todo':
                return 'bg-gray-100 text-gray-800';
            case 'InProgress':
                return 'bg-blue-100 text-blue-800';
            case 'Completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Format date to include time
    const formatDateTime = (dateString?: string) => {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className='bg-black text-white mt-8 w-full min-h-screen p-4 md:p-6'>
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Task Manager</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1 px-3 py-2 rounded-lg text-sm md:text-base transition-colors"
                    >
                        {showForm ? 'Hide Form' : <><Plus size={18} /> Add Task</>}
                    </button>
                </div>

                {showForm && (
                    <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-800">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Task Title</label>
                                <input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Enter task title"
                                    required
                                    className='w-full py-2 px-4 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none'
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={inputDesc}
                                    onChange={(e) => setInputDesc(e.target.value)}
                                    placeholder="Enter task description"
                                    required
                                    className='w-full py-2 px-4 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none'
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as ITodo['status'])}
                                        className='w-full py-2 px-4 bg-gray-800 border border-gray-700 rounded text-white focus:border-blue-500 focus:outline-none'
                                    >
                                        <option value="Todo">Todo</option>
                                        <option value="InProgress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        required
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className='w-full py-2 px-4 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none'
                                    />


                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors'
                                >
                                    {editingId ? 'Update Task' : 'Add Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Search bar */}
                <div className="mb-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search tasks by title..."
                            className="w-full py-2 pl-10 pr-10 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                                <X size={18} className="text-gray-400 hover:text-white" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="flex flex-wrap gap-2 items-center">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Filter size={16} />
                            <span>Filter:</span>
                        </div>
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-3 py-1 rounded-full text-sm ${filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterStatus('Todo')}
                            className={`px-3 py-1 rounded-full text-sm ${filterStatus === 'Todo' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                        >
                            Todo
                        </button>
                        <button
                            onClick={() => setFilterStatus('InProgress')}
                            className={`px-3 py-1 rounded-full text-sm ${filterStatus === 'InProgress' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                        >
                            In Progress
                        </button>
                        <button
                            onClick={() => setFilterStatus('Completed')}
                            className={`px-3 py-1 rounded-full text-sm ${filterStatus === 'Completed' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                        >
                            Completed
                        </button>
                    </div>

                    {/* Sorting options */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 text-gray-400">
                            <ArrowUpDown size={16} />
                            <span>Sort by:</span>
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                            className="bg-gray-800 border border-gray-700 rounded text-white px-3 py-1 text-sm focus:border-blue-500 focus:outline-none"
                        >
                            <option value="dueDate-asc">Due Date (Earliest)</option>
                            <option value="dueDate-desc">Due Date (Latest)</option>
                            <option value="createdAt-asc">Created (Oldest)</option>
                            <option value="createdAt-desc">Created (Newest)</option>
                        </select>
                    </div>
                </div>

                {/* Results count */}
                <div className="mb-4 text-sm text-gray-400">
                    {sortedTodos.length === 0 ? 'No tasks found' : `Showing ${sortedTodos.length} ${sortedTodos.length === 1 ? 'task' : 'tasks'}`}
                    {searchQuery && ` matching "${searchQuery}"`}
                </div>

                {sortedTodos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <AlertCircle size={48} className="mb-4 opacity-50" />
                        <p className="text-center">
                            {searchQuery
                                ? `No tasks matching "${searchQuery}". Try a different search term.`
                                : `No ${filterStatus !== 'all' ? filterStatus : ''} tasks found. ${filterStatus !== 'all' ? 'Try changing the filter or ' : ''} Add a new task to get started.`}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sortedTodos.map(todo => (
                            <div key={todo._id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3
                                            className="font-medium text-lg"
                                            title={todo.title} // shows full title on hover
                                        >
                                            {todo.title.length > 15 ? `${todo.title.slice(0, 15)}...` : todo.title}
                                        </h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(todo.status)}`}>
                                            {todo.status}
                                        </span>
                                    </div>

                                    <p
                                        className="text-gray-400 text-sm mb-3 line-clamp-2"
                                        title={todo.description} // hover pe full description dikhega
                                    >
                                        {todo.description && todo.description.length > 100
                                            ? `${todo.description.slice(0, 100)}...`
                                            : todo.description || 'No description provided'}
                                    </p>

                                    <div className="flex flex-col gap-1 text-gray-500 text-xs mb-4">
                                        <div className="flex items-center">
                                            <Calendar size={12} className="mr-1" />
                                            <span className="mr-1">Due:</span>
                                            {todo.dueDate ? formatDateTime(todo.dueDate).split(',')[0] : 'No due date'}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock size={12} className="mr-1" />
                                            <span className="mr-1">Created:</span>
                                            {todo.createdAt ? formatDateTime(todo.createdAt) : 'Unknown'}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => handleEdit(todo._id, todo.title, todo.description, todo.status, todo.dueDate)}
                                                className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(todo._id)}
                                                className="p-1.5 rounded-full bg-gray-700 hover:bg-red-800 text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <TaskCard task={{
                                            //@ts-ignore
                                            title: todo.title, description: todo.description, dueDate: todo.dueDate
                                        }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TodoList;