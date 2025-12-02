import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, Lock, Code, Activity, Search, Bell, Settings, 
  Menu, X, Cloud, FileText, Download, Copy, Eye, Zap, Moon, Sun
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { NavItem, FileItem, PasswordItem, SnippetItem, AnalyticData } from '../types';
import { generateAiResponse } from '../services/geminiService';

// --- Mock Data ---
const filesData: FileItem[] = [
  { id: '1', name: 'Project_Alpha_Docs', size: '2.4 MB', type: 'folder', date: 'Сьогодні' },
  { id: '2', name: 'main_v2.tsx', size: '14 KB', type: 'file', date: 'Вчора' },
  { id: '3', name: 'styles_dark.css', size: '8 KB', type: 'file', date: '12 Вер' },
  { id: '4', name: 'Analytics_Report_Q3.pdf', size: '4.1 MB', type: 'file', date: '10 Вер' },
];

const passwordsData: PasswordItem[] = [
  { id: '1', site: 'github.com', username: 'aprotsko_dev', strength: 'strong' },
  { id: '2', site: 'aws.amazon.com', username: 'root_admin_ua', strength: 'strong' },
  { id: '3', site: 'dribbble.com', username: 'artem_design', strength: 'medium' },
];

const snippetsData: SnippetItem[] = [
  { id: '1', title: 'React Hook Form', language: 'typescript', code: 'const { register, handleSubmit } = useForm();' },
  { id: '2', title: 'Tailwind Grid', language: 'css', code: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
];

const analyticsData: AnalyticData[] = [
  { name: 'Пн', value: 4000 },
  { name: 'Вт', value: 3000 },
  { name: 'Ср', value: 2000 },
  { name: 'Чт', value: 2780 },
  { name: 'Пт', value: 1890 },
  { name: 'Сб', value: 2390 },
  { name: 'Нд', value: 3490 },
];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('files');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [geminiPrompt, setGeminiPrompt] = useState('');
  const [geminiResponse, setGeminiResponse] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const navItems: NavItem[] = [
    { id: 'files', label: 'Файли', icon: Folder },
    { id: 'passwords', label: 'Сейф', icon: Lock },
    { id: 'snippets', label: 'Код', icon: Code },
    { id: 'analytics', label: 'Аналітика', icon: Activity },
    { id: 'ai', label: 'Gemini AI', icon: Zap },
  ];

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!geminiPrompt.trim()) return;
    
    setLoadingAi(true);
    setGeminiResponse(null);
    const result = await generateAiResponse(geminiPrompt);
    setGeminiResponse(result);
    setLoadingAi(false);
  };

  // Content Components
  const FileView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {filesData.map((file) => (
        <div key={file.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors group cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-full ${file.type === 'folder' ? 'bg-ua-blue/20 text-ua-blue' : 'bg-slate-700/50 text-slate-300'}`}>
              {file.type === 'folder' ? <Folder size={24} /> : <FileText size={24} />}
            </div>
            <button className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
               <Settings size={16} />
            </button>
          </div>
          <h3 className="font-medium truncate">{file.name}</h3>
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>{file.size}</span>
            <span>{file.date}</span>
          </div>
        </div>
      ))}
      <div className="border-2 border-dashed border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:border-ua-blue/50 hover:text-ua-blue transition-colors cursor-pointer min-h-[140px]">
        <Cloud size={32} className="mb-2" />
        <span className="text-sm">Завантажити файл</span>
      </div>
    </div>
  );

  const PasswordsView = () => (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {passwordsData.map((item) => (
        <div key={item.id} className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl hover:border-ua-yellow/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg font-bold text-white">
              {item.site[0].toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-white">{item.site}</div>
              <div className="text-xs text-slate-400">{item.username}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className={`h-2 w-24 rounded-full bg-slate-700 overflow-hidden`}>
                <div className={`h-full ${item.strength === 'strong' ? 'bg-green-500 w-full' : 'bg-yellow-500 w-2/3'}`}></div>
             </div>
             <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white">
               <Copy size={16} />
             </button>
          </div>
        </div>
      ))}
    </div>
  );

  const SnippetsView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {snippetsData.map((snip) => (
        <div key={snip.id} className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
          <div className="bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-slate-700">
            <span className="text-sm font-mono text-ua-blue">{snip.title}</span>
            <span className="text-xs text-slate-500 uppercase">{snip.language}</span>
          </div>
          <div className="p-4 font-mono text-xs text-slate-300 overflow-x-auto">
            <pre>{snip.code}</pre>
          </div>
        </div>
      ))}
    </div>
  );

  const AnalyticsView = () => (
    <div className="h-[400px] w-full bg-white/5 border border-white/10 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-lg font-medium mb-6">Активність проектів</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={analyticsData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0057B8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#0057B8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} 
            itemStyle={{ color: '#fff' }}
          />
          <Area type="monotone" dataKey="value" stroke="#0057B8" fillOpacity={1} fill="url(#colorValue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  const GeminiView = () => (
     <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-ua-blue to-purple-600 rounded-lg">
                 <Zap className="text-white" size={24} />
              </div>
              <div>
                 <h2 className="text-xl font-bold">Gemini AI Assistant</h2>
                 <p className="text-xs text-slate-400">Powered by Google Gemini 2.5 Flash</p>
              </div>
           </div>

           <div className="bg-slate-900/50 rounded-xl p-4 min-h-[200px] mb-4 border border-slate-700/50">
              {geminiResponse ? (
                <div className="prose prose-invert prose-sm max-w-none">
                   <p className="whitespace-pre-wrap font-mono text-sm">{geminiResponse}</p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                   <Activity size={32} className="opacity-50" />
                   <p>Запитайте щось про ваш код...</p>
                </div>
              )}
           </div>

           <form onSubmit={handleAiSubmit} className="relative">
              <input 
                 type="text"
                 value={geminiPrompt}
                 onChange={(e) => setGeminiPrompt(e.target.value)}
                 placeholder="Як оптимізувати React useEffect?"
                 className="w-full bg-slate-800 border border-slate-600 rounded-xl py-3 pl-4 pr-12 text-white focus:outline-none focus:border-ua-blue transition-colors"
              />
              <button 
                type="submit" 
                disabled={loadingAi}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-ua-blue rounded-lg text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                 {loadingAi ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div> : <Download className="rotate-90" size={16} />}
              </button>
           </form>
        </div>
     </div>
  );

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'} transition-colors duration-500`}>
      
      {/* Sidebar - Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed lg:static z-30 h-screen w-64 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-r flex flex-col transition-all duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ua-blue to-ua-yellow flex items-center justify-center text-white font-bold text-lg">
            U
          </div>
          <span className="font-display font-bold text-xl tracking-tight">UaDev</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-ua-blue text-white shadow-lg shadow-ua-blue/20' 
                    : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-slate-700 bg-[url('https://picsum.photos/200/200')] bg-cover border-2 border-ua-blue"></div>
              <div className="flex-1">
                 <p className="text-sm font-bold">Артем Процко</p>
                 <p className="text-xs text-slate-500">Pro Developer</p>
              </div>
           </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Topbar */}
        <header className={`h-16 flex items-center justify-between px-6 border-b ${isDarkMode ? 'border-slate-800/50 bg-slate-950/80' : 'border-slate-200 bg-white/80'} backdrop-blur-md sticky top-0 z-10`}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500">
             <Menu size={24} />
          </button>
          
          <div className="flex-1 px-4 lg:px-8">
             <div className="relative max-w-md hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Пошук..." 
                  className={`w-full ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-200'} border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-ua-blue transition-all`}
                />
             </div>
          </div>

          <div className="flex items-center gap-4">
             <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-slate-500 hover:text-ua-yellow transition-colors">
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <button className="p-2 text-slate-500 hover:text-ua-blue transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-slate-950"></span>
             </button>
          </div>
        </header>

        {/* View Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
           {/* Header of Section */}
           <div className="mb-8 flex justify-between items-end">
             <div>
               <h1 className="text-3xl font-display font-bold mb-2">
                 {navItems.find(n => n.id === activeTab)?.label}
               </h1>
               <p className="text-slate-500">Ласкаво просимо назад, Артем.</p>
             </div>
             <button className="hidden sm:flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-slate-700">
                <Settings size={16} />
                <span>Налаштування</span>
             </button>
           </div>

           {activeTab === 'files' && <FileView />}
           {activeTab === 'passwords' && <PasswordsView />}
           {activeTab === 'snippets' && <SnippetsView />}
           {activeTab === 'analytics' && <AnalyticsView />}
           {activeTab === 'ai' && <GeminiView />}
        </div>

      </main>
    </div>
  );
};

export default Dashboard;