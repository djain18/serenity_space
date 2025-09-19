import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const practiceModules = [
    {
      id: 'zen',
      title: 'Zen Breathing',
      icon: '🧘‍♀️',
      description: 'Guided breathing exercises',
      color: 'from-green-500 to-emerald-600',
      path: '/zen'
    },
    {
      id: 'visual',
      title: 'Visual Effects',
      icon: '🌸',
      description: 'Calming visual patterns',
      color: 'from-purple-500 to-pink-600',
      path: '/visual'
    },
    {
      id: 'music',
      title: 'Relaxing Music',
      icon: '🎵',
      description: 'Soothing soundscapes',
      color: 'from-blue-500 to-cyan-600',
      path: '/music'
    }
  ];

  const wellnessTools = [
    {
      id: 'reframe',
      title: 'Journal',
      icon: '📝',
      description: 'Cognitive reframing tool',
      color: 'from-orange-500 to-red-600',
      path: '/reframe'
    },
    {
      id: 'articles',
      title: 'Articles',
      icon: '📖',
      description: 'Wellness resources',
      color: 'from-teal-500 to-blue-600',
      path: '/journal'
    }
  ];

  const handleModuleClick = (modulePath) => {
    navigate(modulePath);
  };

  const getGreeting = () => {
    if (!user.identity) return "Welcome to Serenity Space";
    
    const identity = user.identity.toLowerCase();
    const greetings = {
      student: "Ready to find your focus?",
      creative: "Let's nurture your creativity",
      professional: "Time to recharge and refocus",
      other: "Your wellness journey continues"
    };
    
    return greetings[identity] || "Welcome to your sanctuary";
  };

  const getMoodMessage = () => {
    if (!user.currentMood) return "Your wellness journey starts here.";
    
    const messages = {
      Anxious: "Let's find some calm together",
      Unfocused: "Time to center your thoughts",
      Sad: "Here to support you gently",
      Stressed: "Let's ease that tension",
      Calm: "Wonderful to see you in this space"
    };
    
    return messages[user.currentMood] || "We're here to support you";
  };

  return (
    <motion.div
      className="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Elements */}
      <div className="bg-element bg-element-1" />
      <div className="bg-element bg-element-2" />
      
      <div className="dashboard-header">
        <motion.div
          className="dashboard-welcome"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className="dashboard-welcome-icon">🌸</span>
          <h1 className="dashboard-title">Welcome to Serenity</h1>
        </motion.div>
        
        <motion.div
          className="dashboard-subtitle"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {getMoodMessage()}
        </motion.div>
      </div>

      <div className="practice-section">
        <h2 className="section-title">Choose Your Practice</h2>
        <div className="practice-modules">
          {practiceModules.map((module, index) => (
            <motion.div
              key={module.id}
              className="practice-module"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleModuleClick(module.path)}
            >
              <div className="module-icon">
                {module.icon}
              </div>
              <h3 className="module-title">{module.title}</h3>
              <button className="module-action">Start</button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="wellness-tools">
        <h2 className="section-title">More Wellness Tools</h2>
        <div className="wellness-modules">
          {wellnessTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              className="wellness-module"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModuleClick(tool.path)}
            >
              <div className="module-icon" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                {tool.icon}
              </div>
              <h3 className="module-title">{tool.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;