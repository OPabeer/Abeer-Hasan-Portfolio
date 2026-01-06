import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants, useInView, useMotionValue, useSpring } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { ICON_MAP } from '../constants';
import { Card } from './ui/Card';
import { Lightbox, LightboxContent } from './ui/Lightbox';
import { 
  ArrowUpRight, 
  Send, 
  Plus, 
  Minus, 
  CheckCircle2, 
  Copy, 
  Gamepad2,
  Lock,
  Sparkles,
  Code2,
  Figma,
  Terminal,
  Cpu,
  Monitor
} from 'lucide-react';

// --- Animation Variants ---

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 20 
    }
  }
};

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
};

// --- Helper Components ---

const CountUp = ({ value, label }: { value: string, label: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  // Check if the value contains any numbers to decide if we should animate counting
  const hasNumbers = /\d/.test(value);
  
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 50, stiffness: 100 });
  const [displayValue, setDisplayValue] = useState(0);

  // Extract number from string (e.g., "100%" -> 100, "5+" -> 5)
  // Only processed if hasNumbers is true
  const numericValue = hasNumbers ? parseInt(value.replace(/[^0-9]/g, '')) || 0 : 0;
  // Suffix is everything that isn't a number (naive but works for "100%" or "5+")
  const suffix = hasNumbers ? value.replace(/[0-9]/g, '') : '';

  useEffect(() => {
    if (isInView && hasNumbers) {
      motionValue.set(numericValue);
    }
  }, [isInView, numericValue, motionValue, hasNumbers]);

  useEffect(() => {
    if (hasNumbers) {
      return springValue.on("change", (latest) => {
        setDisplayValue(Math.floor(latest));
      });
    }
  }, [springValue, hasNumbers]);

  return (
    <Card className="flex flex-col justify-center items-center py-8 relative overflow-hidden group">
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <motion.h3 
        ref={ref}
        className="text-4xl md:text-5xl font-bold text-white mb-2 relative z-10 font-sans tracking-tight"
      >
        {hasNumbers 
          ? <>{isInView ? displayValue : 0}{suffix}</> 
          : value
        }
      </motion.h3>
      <p className="text-textMuted text-xs font-bold uppercase tracking-widest relative z-10 opacity-70">{label}</p>
      <div className="flex mt-4 relative z-10 gap-1">
        {[1,2,3,4,5].map(i => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 + (i * 0.1) }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        ))}
      </div>
    </Card>
  );
};

const InfiniteMarquee = ({ items }: { items: string[] }) => {
  return (
    <div className="flex overflow-hidden w-full mask-gradient-x">
      <motion.div 
        className="flex gap-4 py-2 whitespace-nowrap"
        animate={{ x: [0, -500] }} // Adjust based on content width
        transition={{ 
          repeat: Infinity, 
          ease: "linear", 
          duration: 20 
        }}
      >
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <div key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-textMuted flex items-center gap-2 backdrop-blur-sm">
            <Sparkles size={12} className="text-primary" /> {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 50); // Speed of typing

    return () => clearInterval(timer);
  }, [text]);

  return (
    <span className="text-primary font-semibold">
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// --- Sub-Components ---

const HeroSection = ({ onImageClick }: { onImageClick: (content: LightboxContent) => void }) => {
  const { data: DATA } = usePortfolio();
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <Card className="flex flex-col justify-center items-center text-center relative overflow-hidden min-h-[85vh] w-full border-none bg-surface/40" enableTilt={true}>
      {/* Removed the internal blur div here to let the global background shine through */}
      
      <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto px-4">
        
        {/* Avatar */}
        <motion.div 
          variants={popIn}
          whileHover={{ 
              scale: 1.05, 
              rotate: 2, 
              boxShadow: "0px 0px 60px rgba(var(--color-primary), 0.5)",
          }}
          onClick={(e) => {
              e.stopPropagation();
              onImageClick({ 
                src: DATA.personal.avatarUrl, 
                title: `${DATA.personal.firstName} ${DATA.personal.lastName}`,
                description: DATA.personal.role
              });
          }}
          className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-surfaceHighlight mb-10 shadow-2xl cursor-zoom-in relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
          <img src={DATA.personal.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
        </motion.div>
  
        {/* Name with Gradient */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-script font-bold text-7xl md:text-9xl lg:text-[10rem] mb-6 leading-none"
        >
          <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">{DATA.personal.firstName}</span>
          <span className="text-primary">.</span>
        </motion.h1>
  
        {/* Role Typewriter */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-12 text-xl md:text-2xl leading-relaxed text-textMuted max-w-2xl font-light"
        >
          I'm {DATA.personal.firstName}, a <TypewriterText text={DATA.personal.role} />
        </motion.div>
  
        {/* Social Icons */}
        <motion.div 
          variants={containerVariants}
          className="flex gap-4 mb-12 flex-wrap justify-center"
        >
          {DATA.socials.map((social) => {
            const Icon = ICON_MAP[social.icon] || Send;
            return (
              <motion.a 
                key={social.platform} 
                variants={popIn}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={social.platform}
                whileHover={{ 
                    scale: 1.15,
                    y: -4, 
                    color: '#fff', 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-surfaceHighlight/30 backdrop-blur-md rounded-2xl text-textMuted transition-all border border-white/5 shadow-lg"
              >
                <Icon size={22} />
              </motion.a>
            );
          })}
        </motion.div>
  
        {/* CTA Buttons with Magnetic Feel */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto px-4"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('contact')}
            className="px-10 py-4 bg-primary text-white rounded-full font-bold text-lg hover:shadow-[0_0_40px_rgba(var(--color-primary),0.6)] transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2 group"
          >
            Get Started <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('work')}
            className="px-10 py-4 bg-surfaceHighlight/50 backdrop-blur text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all border border-white/10 w-full sm:w-auto flex items-center justify-center gap-2"
          >
            View Work
          </motion.button>
        </motion.div>
      </div>
    </Card>
  );
};

const ExperienceList = () => {
  const { data: DATA } = usePortfolio();
  return (
    <Card className="col-span-1 md:col-span-2 row-span-1 overflow-y-auto h-full min-h-[300px] scrollbar-hide">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary/20 rounded-lg text-primary">
            <BriefcaseIcon />
        </div>
        <h3 className="text-xl font-bold text-white">Experience</h3>
      </div>
      
      <div className="space-y-4">
        {DATA.experience.map((job, idx) => (
          <motion.div 
            key={job.id} 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, type: "spring" }}
            className="group flex flex-col md:flex-row justify-between items-start md:items-center border border-white/5 hover:border-white/10 bg-white/5 hover:bg-white/10 p-5 rounded-2xl transition-all hover:scale-[1.02] cursor-default"
          >
            <div className="mb-2 md:mb-0">
              <div className="text-xs text-primary mb-1 uppercase tracking-wider font-bold">{job.company}</div>
              <div className="text-white font-bold text-lg">{job.role}</div>
            </div>
            <div className="px-4 py-1.5 rounded-full bg-surfaceHighlight/50 backdrop-blur-sm text-xs text-textMuted border border-white/10 whitespace-nowrap font-mono">
              {job.period}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

const BriefcaseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
)

const BrandDesignCard = () => {
    const { data: DATA } = usePortfolio();
    return (
      <Card className="col-span-1 md:col-span-1 flex flex-col justify-between bg-gradient-to-br from-surface to-surfaceHighlight/30 overflow-hidden">
        <div>
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6 shadow-lg shadow-primary/10"
            >
              <Cpu size={24} />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">Tech Stack</h3>
            <p className="text-textDim text-sm mb-8 leading-relaxed">The tools and technologies I use to bring ideas to life.</p>
        </div>
        
        {/* Infinite Marquee for Skills */}
        <div className="-mx-8 mask-gradient-x">
            <div className="mb-3">
                 <InfiniteMarquee items={DATA.stack.slice(0, Math.ceil(DATA.stack.length / 2))} />
            </div>
            <div>
                 <InfiniteMarquee items={DATA.stack.slice(Math.ceil(DATA.stack.length / 2))} />
            </div>
        </div>
      </Card>
    );
};

const AboutCard = ({ onImageClick }: { onImageClick: (content: LightboxContent) => void }) => {
  const { data: DATA } = usePortfolio();
  return (
    <Card className="col-span-1 md:col-span-2 bg-surfaceHighlight/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex flex-col h-full justify-between gap-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
             <div className="w-2 h-2 rounded-full bg-primary" />
             <p className="text-xs font-bold uppercase tracking-widest text-textDim">About Me</p>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-6 text-white max-w-lg">
            Blending creativity with technical precision to build digital experiences.
          </h3>
          <div className="space-y-4 text-textMuted leading-relaxed max-w-2xl text-sm md:text-base line-clamp-4 hover:line-clamp-none transition-all duration-300">
            {DATA.personal.bio.split('\n\n')[0]}
            <br/><br/>
            {DATA.personal.bio.split('\n\n')[1]}
          </div>
        </div>
        
        {/* Mini Gallery */}
        <div className="flex gap-4 overflow-x-auto pb-2 pt-2 scrollbar-hide -mx-2 px-2">
           {DATA.projects.map((p, i) => (
             <motion.div 
               key={p.id} 
               initial={{ opacity: 0, scale: 0.8, x: 20 }}
               whileInView={{ opacity: 1, scale: 1, x: 0 }}
               whileHover={{ 
                  scale: 1.1, 
                  y: -5,
                  zIndex: 10,
                  rotate: Math.random() * 4 - 2
               }}
               onClick={(e) => {
                   e.stopPropagation();
                   onImageClick({
                     src: p.imageUrl,
                     title: p.title,
                     description: p.description,
                     tags: p.tags
                   });
               }}
               transition={{ type: "spring", stiffness: 300, damping: 20 }}
               className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white/5 cursor-zoom-in relative bg-surface group shadow-lg"
             >
               <img src={p.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
             </motion.div>
           ))}
        </div>
      </div>
    </Card>
  );
};

const TestimonialCard = ({ onImageClick }: { onImageClick: (content: LightboxContent) => void }) => {
  const { data: DATA } = usePortfolio();
  const t = DATA.testimonials[0];
  return (
    <Card className="col-span-1 md:col-span-1 bg-surfaceHighlight/20 flex flex-col justify-between">
      <div>
          <div className="text-primary text-6xl font-serif leading-none opacity-20 mb-2 font-italic">"</div>
          <p className="text-base text-white font-medium mb-6 relative z-10 leading-relaxed">
            {t.quote}
          </p>
      </div>
      <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/5">
        <motion.div 
            whileHover={{ scale: 1.1 }}
            onClick={(e) => {
                e.stopPropagation();
                onImageClick({
                   src: t.avatarUrl,
                   title: t.name,
                   description: t.role,
                   tags: ["Testimonial"]
                });
            }}
            className="rounded-full overflow-hidden w-12 h-12 border-2 border-surfaceHighlight cursor-zoom-in ring-2 ring-transparent hover:ring-primary transition-all shadow-lg"
        >
            <img src={t.avatarUrl} alt={t.name} className="w-full h-full object-cover" />
        </motion.div>
        <div>
          <h4 className="text-white text-sm font-bold">{t.name}</h4>
          <p className="text-textDim text-xs font-mono">{t.role}</p>
        </div>
      </div>
    </Card>
  );
};

const ProcessSection = () => {
  const { data: DATA } = usePortfolio();
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="col-span-1 md:col-span-3 lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {DATA.process.map((step, idx) => {
        const Icon = ICON_MAP[step.icon] || CheckCircle2;
        return (
          <motion.div
            key={step.id}
            variants={itemVariants}
          >
            <Card className="relative overflow-hidden h-full group bg-surface hover:bg-surfaceHighlight/10 transition-colors p-8">
              <div className="flex justify-between items-start mb-6">
                  <div className="text-textDim text-sm font-mono border border-white/10 px-3 py-1 rounded-lg bg-surfaceHighlight/30">0{idx + 1}</div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                    <Icon size={24} />
                  </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
              <p className="text-textMuted text-sm leading-relaxed">{step.description}</p>
              
              <div className="absolute -bottom-12 -right-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500 rotate-12">
                <Icon size={200} />
              </div>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

const GameSettingsSection = () => {
  const { data: DATA } = usePortfolio();
  return (
    <Card className="col-span-1 md:col-span-3 lg:col-span-4 relative overflow-hidden" enableTilt={false}>
      <div className="flex items-center gap-4 mb-8 relative z-10">
         <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl text-white shadow-lg shadow-primary/20">
           <Gamepad2 size={28} />
         </div>
         <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white">Gaming Config</h3>
            <p className="text-textDim text-sm mt-1">Professional e-sports settings & sensitivity</p>
         </div>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
         {/* Free Fire */}
         <motion.div 
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.2 }}
            className="bg-black/40 rounded-3xl p-6 border border-white/10 hover:border-primary/50 transition-all group backdrop-blur-md"
         >
            <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
               <div>
                  <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{DATA.gameSettings.freeFire.game}</h4>
                  <p className="text-sm text-textDim mt-1">Emulator Configuration</p>
               </div>
               <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold border border-primary/20 whitespace-nowrap h-fit">
                 {DATA.gameSettings.freeFire.experience}
               </span>
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-4">
               {DATA.gameSettings.freeFire.settings.map((s, i) => (
                  <div key={i} className="flex flex-col">
                     <span className="text-[10px] text-textDim uppercase tracking-wider mb-1 font-bold">{s.label}</span>
                     <span className="text-white font-medium font-mono text-sm bg-white/5 p-2 rounded-lg w-full border border-white/5">{s.value}</span>
                  </div>
               ))}
            </div>
         </motion.div>
  
         {/* Valorant */}
         <motion.div 
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.3 }}
            className="bg-black/40 rounded-3xl p-6 border border-white/10 hover:border-red-500/50 transition-all group backdrop-blur-md"
         >
            <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
               <div>
                  <h4 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">{DATA.gameSettings.valorant.game}</h4>
                  <p className="text-sm text-textDim mt-1">Competitive Settings</p>
               </div>
               <span className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20 whitespace-nowrap h-fit">
                 {DATA.gameSettings.valorant.experience}
               </span>
            </div>
             <div className="grid grid-cols-2 gap-y-4 gap-x-4">
               {DATA.gameSettings.valorant.settings.map((s, i) => (
                  <div key={i} className="flex flex-col">
                     <span className="text-[10px] text-textDim uppercase tracking-wider mb-1 font-bold">{s.label}</span>
                     <span className="text-white font-medium font-mono text-sm bg-white/5 p-2 rounded-lg w-full border border-white/5">{s.value}</span>
                  </div>
               ))}
            </div>
         </motion.div>
      </div>
      
      <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
    </Card>
  );
};

const PricingSection = () => {
  const { data: DATA } = usePortfolio();
  const [activePlan, setActivePlan] = useState('standard');
  const plan = DATA.pricing.find(p => p.id === activePlan) || DATA.pricing[0];

  return (
    <Card className="col-span-1 md:col-span-2 flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-3xl font-bold text-white">Pricing</h3>
        <div className="flex bg-surfaceHighlight/50 rounded-xl p-1 border border-white/5 backdrop-blur">
          {DATA.pricing.map(p => (
            <button
              key={p.id}
              onClick={() => setActivePlan(p.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activePlan === p.id ? 'bg-primary text-white shadow-lg' : 'text-textMuted hover:text-white'}`}
            >
              {p.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
      
      <AnimatePresence mode='wait'>
        <motion.div 
           key={activePlan}
           initial={{ opacity: 0, scale: 0.95, y: 10 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: -10 }}
           transition={{ duration: 0.3 }}
           className="bg-gradient-to-br from-surfaceHighlight/30 to-transparent rounded-3xl p-8 border border-white/10 mb-6 flex-grow relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px]" />
           <div className="flex items-baseline gap-1 mb-8 relative z-10">
              <span className="text-6xl font-bold text-white tracking-tight">{plan.price}</span>
              <span className="text-textMuted text-lg font-medium">{plan.period}</span>
           </div>
           <ul className="space-y-4 relative z-10">
             {plan.features.map((feat, i) => (
               <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                 <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                    <CheckCircle2 size={14} />
                 </div>
                 {feat}
               </li>
             ))}
           </ul>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};

const FAQSection = () => {
  const { data: DATA } = usePortfolio();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Card className="col-span-1 md:col-span-2 overflow-y-auto h-full scrollbar-hide">
      <h3 className="text-xl font-bold text-white mb-6">Common Questions</h3>
      <div className="space-y-2">
        {DATA.faqs.map((faq, idx) => (
          <div key={faq.id} className="border border-white/5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors overflow-hidden">
            <button 
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="flex justify-between items-center w-full text-left p-4"
            >
              <span className={`font-medium transition-colors ${openIndex === idx ? 'text-primary' : 'text-white'}`}>{faq.question}</span>
              <div className={`transition-transform duration-300 ${openIndex === idx ? 'rotate-180 text-primary' : 'text-textMuted'}`}>
                  {openIndex === idx ? <Minus size={16} /> : <Plus size={16} />}
              </div>
            </button>
            <AnimatePresence>
              {openIndex === idx && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 text-sm text-textMuted leading-relaxed">
                     <div className="w-full h-px bg-white/5 mb-3" />
                     {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4">
        <button className="text-primary text-sm font-bold flex items-center gap-2 hover:underline group">
          Ask me directly <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </Card>
  );
};

const ContactForm = ({ onImageClick }: { onImageClick: (content: LightboxContent) => void }) => {
  const { data: DATA } = usePortfolio();
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setTimeout(() => {
        setFormState('success');
        setTimeout(() => setFormState('idle'), 3000);
    }, 1500);
  };

  return (
    <Card className="col-span-1 md:col-span-3 lg:col-span-4 bg-gradient-to-br from-[#0a0a0a] to-[#121212] border-primary/20 overflow-hidden relative">
       {/* Background Noise/Gradient */}
       <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
       <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/3" />

       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="pl-4 md:pl-8"
          >
             <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                Let's build something <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">extraordinary.</span>
             </h2>
             <p className="text-textMuted mb-10 text-lg leading-relaxed max-w-md">
                Ready to take your project to the next level? I'm currently available for new opportunities and collaborations.
             </p>
             
             {/* Open to Work Badge */}
             <motion.div 
                whileHover={{ scale: 1.02 }}
                className="inline-flex items-center gap-4 bg-[#1A1A1A]/80 backdrop-blur-md p-4 pr-8 rounded-2xl border border-white/5 cursor-pointer transition-colors hover:bg-[#202020] group shadow-xl"
                onClick={(e) => {
                      e.stopPropagation();
                      onImageClick({ 
                        src: DATA.personal.avatarUrl,
                        title: `${DATA.personal.firstName} ${DATA.personal.lastName}`,
                        description: "Available for new projects"
                      });
                  }}
             >
                <div className="relative">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-primary/50 transition-colors">
                        <img src={DATA.personal.avatarUrl} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-[3px] border-[#1A1A1A] rounded-full animate-pulse"></div>
                </div>
                <div>
                   <h4 className="text-white font-bold text-lg">{DATA.personal.firstName}</h4>
                   <p className="text-green-400 text-sm font-medium flex items-center gap-1.5">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                     Open for Work
                   </p>
                </div>
             </motion.div>
          </motion.div>
          
          <div className="relative">
              <motion.form 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4 bg-white/[0.03] backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl" 
                onSubmit={handleSubmit}
              >
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <input type="text" placeholder="Your Name" className="w-full bg-[#151515] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 focus:bg-[#1A1A1A] transition-all placeholder:text-textDim/40 text-sm" required />
                    </div>
                    <div className="space-y-2">
                        <input type="email" placeholder="Your Email" className="w-full bg-[#151515] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 focus:bg-[#1A1A1A] transition-all placeholder:text-textDim/40 text-sm" required />
                    </div>
                 </div>
                 <input type="text" placeholder="Your Budget (e.g. $5k - $10k)" className="w-full bg-[#151515] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 focus:bg-[#1A1A1A] transition-all placeholder:text-textDim/40 text-sm" />
                 <textarea rows={4} placeholder="Tell me about your project..." className="w-full bg-[#151515] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 focus:bg-[#1A1A1A] transition-all placeholder:text-textDim/40 resize-none text-sm"></textarea>
                 
                 <button 
                    disabled={formState !== 'idle'}
                    className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all flex justify-center items-center gap-2 group active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                 >
                    {formState === 'idle' && (
                        <>Send Request <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                    )}
                    {formState === 'submitting' && (
                        <>Sending...</>
                    )}
                    {formState === 'success' && (
                        <>Message Sent! <CheckCircle2 size={18} className="text-green-600" /></>
                    )}
                 </button>
              </motion.form>
          </div>
       </div>
    </Card>
  );
};

const FooterSignature = () => {
  const { data: DATA, openDashboard } = usePortfolio();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(DATA.personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="col-span-1 md:col-span-3 lg:col-span-4 flex flex-col items-center justify-center py-24 relative overflow-hidden">
      {/* Background decorative text */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 0.03, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none"
      >
          <span className="text-[18vw] font-bold leading-none whitespace-nowrap text-white font-sans tracking-tighter">LET'S TALK</span>
      </motion.div>

      <div className="relative z-10 text-center">
          <motion.h2 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ type: "spring" }}
            className="font-script text-8xl md:text-9xl text-white mb-10 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent"
          >
            {DATA.personal.firstName}
          </motion.h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            {/* WhatsApp Link */}
            <a 
              href="https://wa.me/8801868995304"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all text-textMuted flex items-center gap-2 group backdrop-blur-md bg-white/5 font-medium"
            >
                Book A Call <ArrowUpRight size={18} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            {/* Copy Email Button */}
            <button 
              onClick={handleCopyEmail}
              className="px-10 py-5 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all text-textMuted flex items-center gap-2 group backdrop-blur-md bg-white/5 font-medium"
            >
                {copied ? "Copied!" : "Copy Email"} <Copy size={18} />
            </button>
          </div>
          
          <div className="mt-16 flex gap-8 text-textDim text-sm justify-center flex-wrap px-4">
            {DATA.socials.map((s, i) => (
              <motion.a 
                key={s.platform} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                href={s.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors hover:-translate-y-1 transform duration-200"
              >
                {s.platform}
              </motion.a>
            ))}
          </div>
          <div className="mt-16 flex flex-col items-center gap-4">
             <p className="text-xs text-textDim/30 font-mono tracking-widest">DESIGNED & BUILT BY {DATA.personal.firstName.toUpperCase()}</p>
             <button onClick={openDashboard} className="opacity-10 hover:opacity-50 transition-opacity text-white p-2">
                <Lock size={12} />
             </button>
          </div>
      </div>
    </div>
  );
};

// --- Main Grid ---

export const BentoGrid: React.FC = () => {
  const { data: DATA } = usePortfolio(); // Use dynamic data from context
  const [lightboxContent, setLightboxContent] = useState<LightboxContent | null>(null);

  const handleOpenLightbox = (content: LightboxContent) => {
    setLightboxContent(content);
  };

  return (
    <>
      <Lightbox content={lightboxContent} onClose={() => setLightboxContent(null)} />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32"
      >
        {/* Row 1: Hero */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 md:col-span-3 lg:col-span-4"
        >
          <HeroSection onImageClick={handleOpenLightbox} />
        </motion.div>

        {/* Row 2: Experience */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 md:col-span-1 lg:col-span-2"
        >
           <ExperienceList />
        </motion.div>

        {/* Row 2: Projects Teaser */}
        <div id="work" className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 grid grid-cols-2 gap-6">
           {DATA.projects.slice(0, 2).map((p, idx) => (
              <motion.div
                 key={p.id}
                 variants={itemVariants}
                 className="h-full"
              >
                <Card className="p-0 overflow-hidden relative group h-full" noPadding>
                   <div className="absolute inset-0 bg-gray-900 animate-pulse z-0" /> {/* Loading Skeleton Placeholder */}
                   <img 
                      src={p.imageUrl} 
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1 relative z-10" 
                      loading="lazy"
                      onClick={(e) => {
                          e.stopPropagation();
                          handleOpenLightbox({
                            src: p.imageUrl,
                            title: p.title,
                            description: p.description,
                            tags: p.tags
                          });
                      }}
                   />
                   {/* Hover Overlay */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8 cursor-zoom-in z-20">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-primary text-xs font-bold uppercase tracking-wider mb-2">{p.tags[0]}</p>
                        <h4 className="text-white font-bold text-2xl leading-tight">{p.title}</h4>
                      </div>
                   </div>
                   
                   <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20 border border-white/10">
                      <ArrowUpRight size={20} />
                   </div>
                </Card>
              </motion.div>
           ))}
        </div>

        {/* Row 3: Stats */}
        {DATA.personal.stats.slice(0, 2).map((stat, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            className="col-span-1"
          >
             <CountUp label={stat.label} value={stat.value} />
          </motion.div>
        ))}

        {/* Row 3: Brand Design / Skills */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 md:col-span-1 lg:col-span-1"
        >
           <BrandDesignCard />
        </motion.div>

        {/* Row 3: Testimonial */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1"
        >
           <TestimonialCard onImageClick={handleOpenLightbox} />
        </motion.div>

        {/* Row 4: About */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 md:col-span-2"
        >
           <AboutCard onImageClick={handleOpenLightbox} />
        </motion.div>

        {/* Row 5: Process */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 md:col-span-3 lg:col-span-4 mt-16 mb-8"
        >
           <h2 className="text-4xl md:text-5xl font-bold text-white text-center tracking-tight">Work Process</h2>
        </motion.div>
        <ProcessSection />

        {/* Row 6: Gaming */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 md:col-span-3 lg:col-span-4 mt-12"
        >
          <GameSettingsSection />
        </motion.div>

        {/* Row 7: Pricing & FAQ */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          <motion.div
             variants={itemVariants}
             className="col-span-1 md:col-span-2"
          >
             <PricingSection />
          </motion.div>
          <motion.div
             variants={itemVariants}
             className="col-span-1 md:col-span-2"
          >
             <FAQSection />
          </motion.div>
        </div>

        {/* Row 8: Contact */}
        <motion.div 
          id="contact"
          variants={itemVariants}
          className="col-span-1 md:col-span-3 lg:col-span-4 mt-12"
        >
           <ContactForm onImageClick={handleOpenLightbox} />
        </motion.div>

        {/* Row 9: Footer */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 md:col-span-3 lg:col-span-4"
        >
           <FooterSignature />
        </motion.div>
      </motion.div>
    </>
  );
};