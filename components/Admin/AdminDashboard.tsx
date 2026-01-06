import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Save, RotateCcw, X, Edit, LayoutDashboard, 
  Type, Image as ImageIcon, Briefcase, Gamepad, 
  DollarSign, HelpCircle, Share2, Layers, Cpu, 
  Quote, Wrench, User, List, Plus, Trash2, Settings, Shield, Palette, Check
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PortfolioData } from '../../types';

type TabType = 'personal' | 'socials' | 'skills' | 'experience' | 'projects' | 'games' | 'process' | 'pricing' | 'testimonials' | 'faq' | 'json' | 'settings';

const THEME_PRESETS = [
  { name: 'Deep Orange', primary: '249 115 22', secondary: '253 186 116', hex: '#F97316' }, 
  { name: 'Galaxy Purple', primary: '167 139 250', secondary: '56 189 248', hex: '#A78BFA' }, 
  { name: 'Emerald Green', primary: '52 211 153', secondary: '110 231 183', hex: '#34D399' }, 
  { name: 'Crimson Red', primary: '251 113 133', secondary: '253 164 175', hex: '#FB7185' }, 
  { name: 'Royal Blue', primary: '96 165 250', secondary: '147 197 253', hex: '#60A5FA' }, 
];

export const AdminDashboard: React.FC = () => {
  const { data, updateData, resetData, isAdmin, login, changePassword, logout, isDashboardOpen, closeDashboard } = usePortfolio();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [jsonInput, setJsonInput] = useState('');

  // Password Change States
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMessage, setPassMessage] = useState('');

  // Sync data to JSON input when opening
  React.useEffect(() => {
    if (isDashboardOpen) {
      setJsonInput(JSON.stringify(data, null, 2));
    }
  }, [isDashboardOpen, data]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleSaveJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      updateData(parsed);
      alert('Data updated successfully!');
    } catch (e) {
      alert('Invalid JSON format. Please check your syntax.');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
        setPassMessage('Passwords do not match');
        return;
    }
    if (newPass.length < 4) {
        setPassMessage('Password must be at least 4 characters');
        return;
    }
    changePassword(newPass);
    setPassMessage('Password updated successfully!');
    setNewPass('');
    setConfirmPass('');
    setTimeout(() => setPassMessage(''), 3000);
  };

  const handleThemeChange = (preset: typeof THEME_PRESETS[0]) => {
    const newData = { ...data };
    newData.theme = {
        name: preset.name,
        primary: preset.primary,
        secondary: preset.secondary,
        hex: preset.hex
    };
    updateData(newData);
  };

  const handleCustomTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const rgb = `${r} ${g} ${b}`;
    const secondaryRgb = `${Math.min(r + 40, 255)} ${Math.min(g + 40, 255)} ${Math.min(b + 40, 255)}`;
    
    const newData = { ...data };
    newData.theme = {
        name: 'Custom',
        primary: rgb,
        secondary: secondaryRgb,
        hex: hex
    };
    updateData(newData);
  };

  // --- CRUD Operations ---

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleAddItem = (section: keyof PortfolioData, template: any) => {
    const newData = { ...data };
    if (Array.isArray(newData[section])) {
      const newItem = { ...template };
      // Assign ID if the template has one (even if empty string)
      if (newItem.hasOwnProperty('id')) {
        newItem.id = generateId();
      }
      (newData[section] as any[]).push(newItem);
    }
    updateData(newData);
  };

  const handleDeleteItem = (section: keyof PortfolioData, index: number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const newData = { ...data };
    if (Array.isArray(newData[section])) {
      (newData[section] as any[]).splice(index, 1);
    }
    updateData(newData);
  };

  // Special handler for Game Settings arrays
  const handleAddGameSetting = (game: 'freeFire' | 'valorant') => {
    const newData = { ...data };
    newData.gameSettings[game].settings.push({ label: 'New Setting', value: 'Value' });
    updateData(newData);
  };

  const handleDeleteGameSetting = (game: 'freeFire' | 'valorant', index: number) => {
    const newData = { ...data };
    newData.gameSettings[game].settings.splice(index, 1);
    updateData(newData);
  };

  // --- Change Handlers ---

  const handleNestedChange = (section: keyof PortfolioData, index: number, field: string, value: any) => {
    const newData = { ...data };
    if (Array.isArray(newData[section])) {
      (newData[section] as any)[index][field] = value;
    }
    updateData(newData);
  };

  const handlePersonalChange = (field: string, value: string) => {
    const newData = { ...data };
    (newData.personal as any)[field] = value;
    updateData(newData);
  };

  const handleArrayStringChange = (section: 'stack' | 'services', value: string) => {
    const newData = { ...data };
    // Split by comma and trim
    newData[section] = value.split(',').map(s => s.trim());
    updateData(newData);
  };

  const handleGameSettingChange = (game: 'freeFire' | 'valorant', index: number, field: 'label' | 'value', value: string) => {
    const newData = { ...data };
    newData.gameSettings[game].settings[index][field] = value;
    updateData(newData);
  };

  const handleGameInfoChange = (game: 'freeFire' | 'valorant', field: 'game' | 'experience', value: string) => {
    const newData = { ...data };
    newData.gameSettings[game][field] = value;
    updateData(newData);
  };

  const handlePricingFeatureChange = (planIndex: number, value: string) => {
     const newData = { ...data };
     // Split by newline for features
     newData.pricing[planIndex].features = value.split('\n').filter(s => s.trim() !== '');
     updateData(newData);
  };

  const handleProjectTagsChange = (projectIndex: number, value: string) => {
    const newData = { ...data };
    newData.projects[projectIndex].tags = value.split(',').map(s => s.trim());
    updateData(newData);
  };

  // --- Templates ---
  const TEMPLATES = {
    social: { platform: 'Platform', url: 'https://', icon: 'Link', username: '@username' },
    experience: { id: '', role: 'New Role', company: 'Company', period: '2024 - Present', description: 'Job description...' },
    project: { id: '', title: 'New Project', description: 'Description...', tags: ['Tag1'], imageUrl: 'https://via.placeholder.com/800', link: '#', featured: false, year: '2024' },
    process: { id: '', title: 'Step Title', description: 'Step description...', icon: 'Circle' },
    pricing: { id: '', title: 'Plan Name', price: '$0', period: '/ project', features: ['Feature 1', 'Feature 2'], highlight: false },
    faq: { id: '', question: 'New Question?', answer: 'Answer here.' },
    testimonial: { id: '', name: 'Client Name', role: 'Role', quote: 'Great work!', avatarUrl: 'https://via.placeholder.com/150' },
  };

  // --- Sidebar Component ---
  const SidebarItem = ({ id, icon: Icon, label }: { id: TabType, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)} 
      className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors mb-1 ${activeTab === id ? 'bg-primary text-white' : 'text-textMuted hover:bg-white/5'}`}
    >
      <Icon size={18} /> <span className="text-sm font-medium">{label}</span>
    </button>
  );

  if (!isDashboardOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface border border-white/10 w-full max-w-6xl h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-surfaceHighlight/20">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/20 rounded-lg text-primary">
               {isAdmin ? <LayoutDashboard size={20} /> : <Lock size={20} />}
             </div>
             <div>
               <h2 className="text-lg font-bold text-white">
                 {isAdmin ? "CMS Dashboard" : "Admin Access"}
               </h2>
             </div>
          </div>
          <button onClick={closeDashboard} className="p-2 hover:bg-white/10 rounded-full text-textMuted hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {!isAdmin ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
               <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
                  <div>
                    <label className="block text-sm text-textDim mb-2">Password</label>
                    <input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="w-full bg-surfaceHighlight border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                      placeholder="Enter admin password (default: admin123)"
                    />
                  </div>
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/80 transition-colors">
                    Login
                  </button>
               </form>
            </div>
          ) : (
            <div className="flex flex-1 overflow-hidden">
               {/* Sidebar */}
               <div className="w-64 flex-shrink-0 border-r border-white/10 p-4 bg-surfaceHighlight/5 overflow-y-auto custom-scrollbar">
                  <div className="space-y-1 mb-6">
                    <p className="px-4 py-2 text-xs font-bold text-textDim uppercase tracking-wider">General</p>
                    <SidebarItem id="personal" icon={User} label="Profile" />
                    <SidebarItem id="socials" icon={Share2} label="Social Links" />
                    <SidebarItem id="skills" icon={Wrench} label="Skills & Services" />
                  </div>
                  
                  <div className="space-y-1 mb-6">
                    <p className="px-4 py-2 text-xs font-bold text-textDim uppercase tracking-wider">Portfolio</p>
                    <SidebarItem id="experience" icon={Briefcase} label="Experience" />
                    <SidebarItem id="projects" icon={Layers} label="Projects" />
                    <SidebarItem id="process" icon={Cpu} label="Process" />
                  </div>

                  <div className="space-y-1 mb-6">
                    <p className="px-4 py-2 text-xs font-bold text-textDim uppercase tracking-wider">Content</p>
                    <SidebarItem id="games" icon={Gamepad} label="Game Config" />
                    <SidebarItem id="pricing" icon={DollarSign} label="Pricing" />
                    <SidebarItem id="testimonials" icon={Quote} label="Testimonials" />
                    <SidebarItem id="faq" icon={HelpCircle} label="FAQ" />
                  </div>

                  <div className="space-y-1 mb-6">
                    <p className="px-4 py-2 text-xs font-bold text-textDim uppercase tracking-wider">System</p>
                    <SidebarItem id="settings" icon={Settings} label="Settings" />
                    <SidebarItem id="json" icon={Edit} label="Raw JSON" />
                  </div>

                  <div className="pt-4 mt-auto border-t border-white/10">
                     <button onClick={resetData} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-red-400 hover:bg-red-500/10 transition-colors mb-2 text-sm">
                        <RotateCcw size={16} /> Reset All Data
                     </button>
                     <button onClick={logout} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-textDim hover:text-white hover:bg-white/5 transition-colors text-sm">
                        Logout
                     </button>
                  </div>
               </div>

               {/* Editor Area */}
               <div className="flex-1 overflow-y-auto p-8 bg-black/20 custom-scrollbar">
                  <div className="max-w-4xl mx-auto pb-20">
                    
                    {/* --- PERSONAL --- */}
                    {activeTab === 'personal' && (
                        <div className="space-y-6">
                           <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Personal Information</h3>
                           <div className="grid grid-cols-2 gap-4">
                              <InputGroup label="First Name" value={data.personal.firstName} onChange={(v) => handlePersonalChange('firstName', v)} />
                              <InputGroup label="Last Name" value={data.personal.lastName} onChange={(v) => handlePersonalChange('lastName', v)} />
                           </div>
                           <InputGroup label="Role / Title" value={data.personal.role} onChange={(v) => handlePersonalChange('role', v)} />
                           <InputGroup label="Tagline" value={data.personal.tagline} onChange={(v) => handlePersonalChange('tagline', v)} />
                           <InputGroup label="Email" value={data.personal.email} onChange={(v) => handlePersonalChange('email', v)} />
                           <InputGroup label="Location" value={data.personal.location} onChange={(v) => handlePersonalChange('location', v)} />
                           <div>
                                <label className="text-xs text-textDim uppercase mb-1 block">Profile Picture URL</label>
                                <div className="flex gap-4 items-start">
                                    <input 
                                      value={data.personal.avatarUrl} 
                                      onChange={(e) => handlePersonalChange('avatarUrl', e.target.value)}
                                      className="flex-1 bg-surface border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none text-sm font-mono" 
                                    />
                                    <div className="w-16 h-16 rounded overflow-hidden border border-white/10 flex-shrink-0 bg-surfaceHighlight">
                                       <img src={data.personal.avatarUrl} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                           <TextAreaGroup label="Bio" value={data.personal.bio} onChange={(v) => handlePersonalChange('bio', v)} rows={6} />
                           
                           <h4 className="text-lg font-bold text-white mt-8 mb-4">Stats</h4>
                           <div className="grid grid-cols-2 gap-4">
                              {data.personal.stats.map((stat, i) => (
                                <div key={i} className="p-4 bg-surface rounded-xl border border-white/10">
                                   <InputGroup label={`Label ${i+1}`} value={stat.label} onChange={(v) => {
                                      const newStats = [...data.personal.stats];
                                      newStats[i].label = v;
                                      handlePersonalChange('stats', newStats as any);
                                   }} />
                                   <div className="h-2" />
                                   <InputGroup label={`Value ${i+1}`} value={stat.value} onChange={(v) => {
                                      const newStats = [...data.personal.stats];
                                      newStats[i].value = v;
                                      handlePersonalChange('stats', newStats as any);
                                   }} />
                                </div>
                              ))}
                           </div>
                        </div>
                    )}

                    {/* --- SOCIALS --- */}
                    {activeTab === 'socials' && (
                       <div className="space-y-6">
                          <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Social Media Links</h3>
                          {data.socials.map((social, i) => (
                             <div key={i} className="bg-surface p-4 rounded-xl border border-white/10 relative group">
                                <DeleteButton onClick={() => handleDeleteItem('socials', i)} />
                                <h4 className="font-bold text-white mb-3 flex items-center gap-2"><Share2 size={16} /> {social.platform}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <InputGroup label="URL" value={social.url} onChange={(v) => handleNestedChange('socials', i, 'url', v)} />
                                   <InputGroup label="Username (Display)" value={social.username} onChange={(v) => handleNestedChange('socials', i, 'username', v)} />
                                </div>
                                <div className="mt-2">
                                   <InputGroup label="Platform Name (for Icon mapping)" value={social.platform} onChange={(v) => handleNestedChange('socials', i, 'platform', v)} />
                                </div>
                             </div>
                          ))}
                          <AddButton onClick={() => handleAddItem('socials', TEMPLATES.social)} label="Add Social Link" />
                       </div>
                    )}

                    {/* --- SKILLS & SERVICES --- */}
                    {activeTab === 'skills' && (
                        <div className="space-y-8">
                           <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Skills & Services</h3>
                           <div>
                              <label className="text-sm font-bold text-white mb-2 block">Tech Stack / Skills (Comma Separated)</label>
                              <textarea 
                                rows={4}
                                value={data.stack.join(', ')} 
                                onChange={(e) => handleArrayStringChange('stack', e.target.value)}
                                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" 
                              />
                              <p className="text-xs text-textDim mt-2">Example: HTML, CSS, React, Photoshop</p>
                           </div>
                           <div>
                              <label className="text-sm font-bold text-white mb-2 block">Services Offered (Comma Separated)</label>
                              <textarea 
                                rows={4}
                                value={data.services.join(', ')} 
                                onChange={(e) => handleArrayStringChange('services', e.target.value)}
                                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" 
                              />
                           </div>
                        </div>
                    )}

                    {/* --- EXPERIENCE --- */}
                    {activeTab === 'experience' && (
                        <div className="space-y-6">
                           <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Work Experience</h3>
                           {data.experience.map((exp, i) => (
                              <div key={exp.id} className="bg-surface p-6 rounded-xl border border-white/10 relative group">
                                 <DeleteButton onClick={() => handleDeleteItem('experience', i)} />
                                 <div className="absolute top-4 right-12 text-xs font-mono text-textDim bg-surfaceHighlight px-2 py-1 rounded">ID: {exp.id}</div>
                                 <div className="grid grid-cols-2 gap-4 mb-4">
                                    <InputGroup label="Role" value={exp.role} onChange={(v) => handleNestedChange('experience', i, 'role', v)} />
                                    <InputGroup label="Company" value={exp.company} onChange={(v) => handleNestedChange('experience', i, 'company', v)} />
                                 </div>
                                 <InputGroup label="Period" value={exp.period} onChange={(v) => handleNestedChange('experience', i, 'period', v)} />
                                 <div className="h-4" />
                                 <TextAreaGroup label="Description" value={exp.description} onChange={(v) => handleNestedChange('experience', i, 'description', v)} />
                              </div>
                           ))}
                           <AddButton onClick={() => handleAddItem('experience', TEMPLATES.experience)} label="Add Experience" />
                        </div>
                    )}

                    {/* --- PROJECTS --- */}
                    {activeTab === 'projects' && (
                        <div className="space-y-8">
                           <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Projects</h3>
                           {data.projects.map((project, i) => (
                              <div key={project.id} className="bg-surface p-6 rounded-xl border border-white/10 relative group">
                                 <DeleteButton onClick={() => handleDeleteItem('projects', i)} />
                                 <div className="flex gap-6 flex-col md:flex-row">
                                    <div className="w-full md:w-48 flex-shrink-0 space-y-2">
                                       <div className="aspect-square rounded-lg overflow-hidden bg-black/50 border border-white/10">
                                          <img src={project.imageUrl} className="w-full h-full object-cover" />
                                       </div>
                                       <InputGroup label="Image URL" value={project.imageUrl} onChange={(v) => handleNestedChange('projects', i, 'imageUrl', v)} />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                       <div className="grid grid-cols-2 gap-4">
                                          <InputGroup label="Title" value={project.title} onChange={(v) => handleNestedChange('projects', i, 'title', v)} />
                                          <InputGroup label="Year" value={project.year} onChange={(v) => handleNestedChange('projects', i, 'year', v)} />
                                       </div>
                                       <InputGroup label="Link" value={project.link} onChange={(v) => handleNestedChange('projects', i, 'link', v)} />
                                       <TextAreaGroup label="Description" value={project.description} onChange={(v) => handleNestedChange('projects', i, 'description', v)} rows={3} />
                                       
                                       <div>
                                          <label className="text-xs text-textDim uppercase mb-1 block">Tags (Comma Separated)</label>
                                          <input 
                                            value={project.tags.join(', ')} 
                                            onChange={(e) => handleProjectTagsChange(i, e.target.value)}
                                            className="w-full bg-surfaceHighlight border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none" 
                                          />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ))}
                           <AddButton onClick={() => handleAddItem('projects', TEMPLATES.project)} label="Add Project" />
                        </div>
                    )}

                    {/* --- GAMES --- */}
                    {activeTab === 'games' && (
                       <div className="space-y-8">
                          <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Game Configurations</h3>
                          
                          {/* Free Fire */}
                          <div className="bg-surface p-6 rounded-xl border border-white/10">
                             <h4 className="text-lg font-bold text-primary mb-4">Free Fire</h4>
                             <div className="grid grid-cols-2 gap-4 mb-6">
                                <InputGroup label="Game Name" value={data.gameSettings.freeFire.game} onChange={(v) => handleGameInfoChange('freeFire', 'game', v)} />
                                <InputGroup label="Experience" value={data.gameSettings.freeFire.experience} onChange={(v) => handleGameInfoChange('freeFire', 'experience', v)} />
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.gameSettings.freeFire.settings.map((s, i) => (
                                   <div key={i} className="flex gap-2 items-center group">
                                      <input className="w-1/3 bg-surfaceHighlight/50 border border-white/10 rounded p-2 text-xs text-textDim" value={s.label} onChange={(e) => handleGameSettingChange('freeFire', i, 'label', e.target.value)} />
                                      <input className="flex-1 bg-surfaceHighlight border border-white/10 rounded p-2 text-xs text-white" value={s.value} onChange={(e) => handleGameSettingChange('freeFire', i, 'value', e.target.value)} />
                                      <button onClick={() => handleDeleteGameSetting('freeFire', i)} className="text-red-500 opacity-0 group-hover:opacity-100"><X size={14} /></button>
                                   </div>
                                ))}
                             </div>
                             <button onClick={() => handleAddGameSetting('freeFire')} className="mt-4 text-xs flex items-center gap-1 text-primary hover:text-white transition-colors"><Plus size={14} /> Add Setting</button>
                          </div>

                          {/* Valorant */}
                          <div className="bg-surface p-6 rounded-xl border border-white/10">
                             <h4 className="text-lg font-bold text-red-400 mb-4">Valorant</h4>
                             <div className="grid grid-cols-2 gap-4 mb-6">
                                <InputGroup label="Game Name" value={data.gameSettings.valorant.game} onChange={(v) => handleGameInfoChange('valorant', 'game', v)} />
                                <InputGroup label="Experience" value={data.gameSettings.valorant.experience} onChange={(v) => handleGameInfoChange('valorant', 'experience', v)} />
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.gameSettings.valorant.settings.map((s, i) => (
                                   <div key={i} className="flex gap-2 items-center group">
                                      <input className="w-1/3 bg-surfaceHighlight/50 border border-white/10 rounded p-2 text-xs text-textDim" value={s.label} onChange={(e) => handleGameSettingChange('valorant', i, 'label', e.target.value)} />
                                      <input className="flex-1 bg-surfaceHighlight border border-white/10 rounded p-2 text-xs text-white" value={s.value} onChange={(e) => handleGameSettingChange('valorant', i, 'value', e.target.value)} />
                                      <button onClick={() => handleDeleteGameSetting('valorant', i)} className="text-red-500 opacity-0 group-hover:opacity-100"><X size={14} /></button>
                                   </div>
                                ))}
                             </div>
                             <button onClick={() => handleAddGameSetting('valorant')} className="mt-4 text-xs flex items-center gap-1 text-primary hover:text-white transition-colors"><Plus size={14} /> Add Setting</button>
                          </div>
                       </div>
                    )}

                    {/* --- PRICING --- */}
                    {activeTab === 'pricing' && (
                        <div className="space-y-8">
                           <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Pricing Plans</h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {data.pricing.map((plan, i) => (
                                 <div key={plan.id} className="bg-surface p-6 rounded-xl border border-white/10 relative group">
                                    <DeleteButton onClick={() => handleDeleteItem('pricing', i)} />
                                    <div className="mb-4">
                                       <InputGroup label="Plan Title" value={plan.title} onChange={(v) => handleNestedChange('pricing', i, 'title', v)} />
                                    </div>
                                    <div className="flex gap-4 mb-4">
                                       <InputGroup label="Price" value={plan.price} onChange={(v) => handleNestedChange('pricing', i, 'price', v)} />
                                       <InputGroup label="Period" value={plan.period} onChange={(v) => handleNestedChange('pricing', i, 'period', v)} />
                                    </div>
                                    <div>
                                       <label className="text-xs text-textDim uppercase mb-1 block">Features (One per line)</label>
                                       <textarea 
                                          rows={6}
                                          value={plan.features.join('\n')}
                                          onChange={(e) => handlePricingFeatureChange(i, e.target.value)}
                                          className="w-full bg-surfaceHighlight border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none text-sm"
                                       />
                                    </div>
                                 </div>
                              ))}
                           </div>
                           <AddButton onClick={() => handleAddItem('pricing', TEMPLATES.pricing)} label="Add Pricing Plan" />
                        </div>
                    )}

                    {/* --- FAQ --- */}
                    {activeTab === 'faq' && (
                        <div className="space-y-6">
                           <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Frequently Asked Questions</h3>
                           {data.faqs.map((faq, i) => (
                              <div key={faq.id} className="bg-surface p-4 rounded-xl border border-white/10 relative group">
                                 <DeleteButton onClick={() => handleDeleteItem('faqs', i)} />
                                 <InputGroup label="Question" value={faq.question} onChange={(v) => handleNestedChange('faqs', i, 'question', v)} />
                                 <div className="h-4" />
                                 <TextAreaGroup label="Answer" value={faq.answer} onChange={(v) => handleNestedChange('faqs', i, 'answer', v)} rows={2} />
                              </div>
                           ))}
                           <AddButton onClick={() => handleAddItem('faqs', TEMPLATES.faq)} label="Add FAQ" />
                        </div>
                    )}

                    {/* --- PROCESS --- */}
                    {activeTab === 'process' && (
                        <div className="space-y-6">
                           <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Work Process</h3>
                           {data.process.map((step, i) => (
                              <div key={step.id} className="bg-surface p-4 rounded-xl border border-white/10 flex items-center gap-4 relative group">
                                 <DeleteButton onClick={() => handleDeleteItem('process', i)} />
                                 <div className="w-12 h-12 bg-surfaceHighlight rounded-full flex items-center justify-center text-white font-bold text-lg border border-white/10">
                                    {i + 1}
                                 </div>
                                 <div className="flex-1">
                                    <InputGroup label="Title" value={step.title} onChange={(v) => handleNestedChange('process', i, 'title', v)} />
                                    <div className="h-2" />
                                    <InputGroup label="Description" value={step.description} onChange={(v) => handleNestedChange('process', i, 'description', v)} />
                                 </div>
                              </div>
                           ))}
                           <AddButton onClick={() => handleAddItem('process', TEMPLATES.process)} label="Add Step" />
                        </div>
                    )}

                    {/* --- TESTIMONIALS --- */}
                    {activeTab === 'testimonials' && (
                        <div className="space-y-6">
                           <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Testimonials</h3>
                           {data.testimonials.map((t, i) => (
                              <div key={t.id} className="bg-surface p-6 rounded-xl border border-white/10 relative group">
                                 <DeleteButton onClick={() => handleDeleteItem('testimonials', i)} />
                                 <div className="flex gap-4 mb-4">
                                    <div className="flex-1">
                                       <InputGroup label="Client Name" value={t.name} onChange={(v) => handleNestedChange('testimonials', i, 'name', v)} />
                                    </div>
                                    <div className="flex-1">
                                       <InputGroup label="Role" value={t.role} onChange={(v) => handleNestedChange('testimonials', i, 'role', v)} />
                                    </div>
                                 </div>
                                 <TextAreaGroup label="Quote" value={t.quote} onChange={(v) => handleNestedChange('testimonials', i, 'quote', v)} rows={3} />
                                 <div className="h-4" />
                                 <label className="text-xs text-textDim uppercase mb-1 block">Avatar URL</label>
                                 <div className="flex gap-4 items-center">
                                    <input 
                                       value={t.avatarUrl} 
                                       onChange={(e) => handleNestedChange('testimonials', i, 'avatarUrl', e.target.value)}
                                       className="flex-1 bg-surfaceHighlight border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none text-xs font-mono" 
                                    />
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-black/50">
                                       <img src={t.avatarUrl} className="w-full h-full object-cover" />
                                    </div>
                                 </div>
                              </div>
                           ))}
                           <AddButton onClick={() => handleAddItem('testimonials', TEMPLATES.testimonial)} label="Add Testimonial" />
                        </div>
                    )}

                    {/* --- SETTINGS (THEME & SECURITY) --- */}
                    {activeTab === 'settings' && (
                        <div className="space-y-10">
                            
                            {/* Theme Settings */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-4 flex items-center gap-2">
                                    <Palette className="text-primary" size={24} /> Theme Appearance
                                </h3>
                                <div className="grid grid-cols-5 gap-4 mb-4">
                                    {THEME_PRESETS.map((preset) => (
                                        <button
                                        key={preset.name}
                                        onClick={() => handleThemeChange(preset)}
                                        className="w-12 h-12 rounded-full relative flex items-center justify-center transition-transform hover:scale-110 shadow-lg border border-white/10"
                                        style={{ backgroundColor: preset.hex }}
                                        title={preset.name}
                                        >
                                        {(data.theme?.name === preset.name) && (
                                            <Check size={20} className="text-white drop-shadow-md" />
                                        )}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-white/10 max-w-md">
                                    <span className="text-sm font-bold text-white">Custom Primary Color</span>
                                    <input 
                                        type="color" 
                                        onChange={handleCustomTheme}
                                        value={data.theme?.hex || '#F97316'}
                                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                                    />
                                    <span className="text-xs text-textDim font-mono">{data.theme?.hex}</span>
                                </div>
                            </div>

                            {/* Security Settings */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-4 flex items-center gap-2">
                                    <Shield className="text-green-400" size={24} /> Admin Security
                                </h3>
                                <form onSubmit={handleChangePassword} className="bg-surface p-6 rounded-xl border border-white/10 max-w-md">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs text-textDim uppercase mb-1 block">New Password</label>
                                            <input 
                                                type="password"
                                                value={newPass}
                                                onChange={(e) => setNewPass(e.target.value)}
                                                className="w-full bg-surfaceHighlight border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-textDim uppercase mb-1 block">Confirm Password</label>
                                            <input 
                                                type="password"
                                                value={confirmPass}
                                                onChange={(e) => setConfirmPass(e.target.value)}
                                                className="w-full bg-surfaceHighlight border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                                            />
                                        </div>
                                        {passMessage && (
                                            <p className={`text-sm ${passMessage.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                                                {passMessage}
                                            </p>
                                        )}
                                        <button 
                                            type="submit"
                                            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-colors"
                                        >
                                            Update Password
                                        </button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    )}

                    {/* --- JSON --- */}
                    {activeTab === 'json' && (
                       <div className="h-full flex flex-col min-h-[500px]">
                          <div className="flex justify-between items-center mb-4">
                             <h3 className="text-lg font-bold text-white flex items-center gap-2"><Edit size={18} /> Raw Data Editor</h3>
                             <button 
                               onClick={handleSaveJson}
                               className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                             >
                                <Save size={16} /> Save Changes
                             </button>
                          </div>
                          <p className="text-textDim text-sm mb-4">
                            Use this for advanced edits, adding new items to lists, or deleting items.
                          </p>
                          <textarea 
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            className="flex-1 w-full bg-[#0d1117] text-gray-300 font-mono text-sm p-4 rounded-xl border border-white/10 focus:border-primary outline-none resize-none leading-relaxed"
                            spellCheck={false}
                          />
                       </div>
                    )}
                  </div>
               </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// --- Helper Components ---

const InputGroup = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div>
     <label className="text-xs text-textDim uppercase mb-1 block">{label}</label>
     <input 
       value={value} 
       onChange={(e) => onChange(e.target.value)}
       className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none transition-all focus:bg-surfaceHighlight" 
     />
  </div>
);

const TextAreaGroup = ({ label, value, onChange, rows = 4 }: { label: string, value: string, onChange: (v: string) => void, rows?: number }) => (
  <div>
     <label className="text-xs text-textDim uppercase mb-1 block">{label}</label>
     <textarea 
       rows={rows}
       value={value} 
       onChange={(e) => onChange(e.target.value)}
       className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none transition-all focus:bg-surfaceHighlight" 
     />
  </div>
);

const DeleteButton = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
    title="Delete Item"
  >
    <Trash2 size={16} />
  </button>
);

const AddButton = ({ onClick, label }: { onClick: () => void, label: string }) => (
  <button 
    onClick={onClick}
    className="w-full py-4 rounded-xl border-2 border-dashed border-white/10 text-textDim hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 font-medium"
  >
    <Plus size={20} /> {label}
  </button>
);