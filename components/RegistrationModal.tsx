import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ChevronRight, CheckCircle2, ShieldCheck, Globe2 } from 'lucide-react';

interface RegistrationProps {
  onComplete: () => void;
}

const RegistrationModal: React.FC<RegistrationProps> = ({ onComplete }) => {
  const [formState, setFormState] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call with a bit of delay for effect
    setTimeout(() => {
      setIsLoading(false);
      onComplete();
    }, 1500);
  };

  return (
    <motion.div 
      // Explosion expansion effect
      initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, type: "spring", stiffness: 120, damping: 15 }}
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
    >
      {/* Background Rotating Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-ua-blue/20 via-transparent to-ua-yellow/10 rounded-full blur-[100px]"
         />
      </div>

      <div className="relative w-full max-w-sm"> {/* Compact Width */}
        {/* Floating tech elements - Scaled down */}
        <motion.div 
          initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}
          className="absolute -left-8 top-0 text-slate-700 hidden md:block"
        >
          <Globe2 size={30} strokeWidth={1} />
        </motion.div>
        <motion.div 
          initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}
          className="absolute -right-8 bottom-0 text-slate-700 hidden md:block"
        >
          <ShieldCheck size={30} strokeWidth={1} />
        </motion.div>

        {/* Card - Compact Padding */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6 overflow-hidden relative group">
          
          {/* Scanning Line Effect */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-ua-blue to-transparent opacity-50 animate-[scan_3s_ease-in-out_infinite]"></div>

          <div className="mb-6 text-center relative z-10">
             <motion.div
               initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
               className="inline-block px-2 py-0.5 rounded-full bg-ua-blue/10 border border-ua-blue/30 text-ua-blue text-[9px] font-mono tracking-widest mb-2"
             >
               UA.DEV.SYSTEM
             </motion.div>
             <h1 className="text-2xl font-display font-bold text-white mb-1">
               Створити акаунт
             </h1>
             <p className="text-xs text-slate-400 font-light">
               Долучайтесь до <span className="text-ua-yellow font-medium">UaDevPlatform</span>
             </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            
            {/* Inputs with micro-interactions - Compact Height */}
            {[
              { id: 'name', type: 'text', icon: User, label: "Ваше ім'я", val: formState.name, set: (v:string)=>setFormState({...formState, name: v}) },
              { id: 'email', type: 'email', icon: Mail, label: "Email", val: formState.email, set: (v:string)=>setFormState({...formState, email: v}) },
              { id: 'password', type: 'password', icon: Lock, label: "Пароль", val: formState.password, set: (v:string)=>setFormState({...formState, password: v}) }
            ].map((field, idx) => (
              <motion.div 
                key={field.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
                className="relative group/input"
              >
                <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 transition-colors group-focus-within/input:text-ua-blue" />
                <input 
                  type={field.type} 
                  required
                  id={field.id}
                  value={field.val}
                  onChange={e => field.set(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-ua-blue focus:bg-slate-900/80 transition-all duration-300 shadow-inner peer"
                />
                {/* Manual floating label logic based on value presence */}
                <label 
                  htmlFor={field.id}
                  className={`absolute left-10 transition-all duration-200 pointer-events-none text-xs text-slate-500
                    ${field.val.length > 0 || document.activeElement?.id === field.id
                      ? '-translate-y-6 scale-90 text-ua-blue top-3.5 bg-slate-900/80 px-1 rounded' 
                      : 'translate-y-0 scale-100 top-3.5'
                    }
                  `}
                >
                  {field.label}
                </label>
              </motion.div>
            ))}

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0, 87, 184, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-ua-blue to-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-ua-blue/20 transition-all flex items-center justify-center gap-2 group relative overflow-hidden mt-3 text-sm"
            >
               <span className="relative z-10 flex items-center gap-2">
                 {isLoading ? 'Ініціалізація...' : 'Зареєструватися'} 
                 {!isLoading && <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/>}
               </span>
               {isLoading && (
                 <div className="absolute inset-0 bg-white/20 animate-pulse z-0"></div>
               )}
            </motion.button>
          </form>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="mt-5 border-t border-white/5 pt-3 flex flex-col items-center justify-center text-center gap-2"
          >
             <div className="flex items-center gap-1 text-[9px] text-slate-500 font-mono uppercase tracking-wider hover:text-ua-yellow transition-colors cursor-help">
                <CheckCircle2 size={10} className="text-ua-blue"/> Secure TLS 1.3
             </div>
             
             {/* Author Credit */}
             <div className="text-[10px] text-white/60 font-medium font-display tracking-wide mt-1">
                Зроблено в Україні — <span className="text-ua-blue">Артем Процко</span>
             </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default RegistrationModal;