import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ZenMode = () => {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState(null);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale'); // inhale, hold, exhale
  const [sessionDuration, setSessionDuration] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);

  const breathingModes = [
    {
      id: 'box',
      title: 'Box Breathing',
      description: '4-4-4-4 pattern for calm focus',
      icon: '🔲',
      pattern: { inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 }
    },
    {
      id: '478',
      title: '4-7-8 Technique',
      description: 'Relaxing pattern for sleep',
      icon: '😴',
      pattern: { inhale: 4, holdIn: 7, exhale: 8, holdOut: 0 }
    },
    {
      id: 'equal',
      title: 'Equal Breathing',
      description: 'Balanced 6-6 pattern',
      icon: '⚖️',
      pattern: { inhale: 6, holdIn: 0, exhale: 6, holdOut: 0 }
    }
  ];

  useEffect(() => {
    let interval;
    if (sessionActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setSessionActive(false);
            setIsBreathing(false);
            saveSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive, timeRemaining]);

  const startBreathingSession = (mode) => {
    setActiveMode(mode);
    setTimeRemaining(sessionDuration * 60);
    setSessionActive(true);
    setIsBreathing(true);
    setBreathingPhase('inhale');
    
    // Start breathing animation cycle
    startBreathingCycle(mode.pattern);
  };

  const startBreathingCycle = (pattern) => {
    const cycle = [
      { phase: 'inhale', duration: pattern.inhale },
      ...(pattern.holdIn > 0 ? [{ phase: 'hold', duration: pattern.holdIn }] : []),
      { phase: 'exhale', duration: pattern.exhale },
      ...(pattern.holdOut > 0 ? [{ phase: 'holdOut', duration: pattern.holdOut }] : [])
    ];
    
    let currentPhaseIndex = 0;
    
    const runPhase = () => {
      if (!sessionActive) return;
      
      const currentPhase = cycle[currentPhaseIndex];
      setBreathingPhase(currentPhase.phase);
      
      setTimeout(() => {
        currentPhaseIndex = (currentPhaseIndex + 1) % cycle.length;
        if (sessionActive) runPhase();
      }, currentPhase.duration * 1000);
    };
    
    runPhase();
  };

  const stopSession = () => {
    setSessionActive(false);
    setIsBreathing(false);
    setActiveMode(null);
    setTimeRemaining(0);
  };

  const saveSession = async () => {
    try {
      await fetch(`${API}/zen-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_type: 'breathing',
          duration: sessionDuration,
          completed: timeRemaining === 0
        })
      });
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'holdOut': return 'Hold';
      default: return 'Breathe';
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isBreathing && activeMode) {
    return (
      <div className="zen-mode-container" style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        padding: '2rem'
      }}>
        <motion.div
          style={{
            fontSize: '1.5rem',
            color: '#E2E8F0',
            marginBottom: '2rem',
            textAlign: 'center'
          }}
        >
          {activeMode.title}
        </motion.div>
        
        <motion.div
          className="breathing-circle"
          style={{
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            color: 'white',
            fontWeight: '600',
            marginBottom: '2rem'
          }}
          animate={{
            scale: breathingPhase === 'inhale' ? 1.2 : breathingPhase === 'exhale' ? 0.8 : 1,
            opacity: breathingPhase === 'hold' || breathingPhase === 'holdOut' ? 0.9 : 1
          }}
          transition={{
            duration: activeMode.pattern[breathingPhase] || 1,
            ease: "easeInOut"
          }}
        >
          {getBreathingInstruction()}
        </motion.div>
        
        <div style={{ 
          fontSize: '1.2rem', 
          color: '#A0AEC0',
          marginBottom: '2rem'
        }}>
          {formatTime(timeRemaining)}
        </div>
        
        <button
          onClick={stopSession}
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '0.75rem 2rem',
            color: '#F87171',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Stop Session
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="zen-mode-container"
      style={{
        padding: '3rem',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <motion.div
          style={{ textAlign: 'center', marginBottom: '3rem' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            color: '#E2E8F0', 
            marginBottom: '1rem' 
          }}>
            🧘‍♀️ Zen Breathing
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#A0AEC0',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Choose a breathing technique to center yourself and find inner calm
          </p>
        </motion.div>

        <motion.div
          style={{ marginBottom: '3rem', textAlign: 'center' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label style={{ 
            display: 'block', 
            fontSize: '1.1rem', 
            color: '#E2E8F0', 
            marginBottom: '1rem' 
          }}>
            Session Duration: {sessionDuration} minutes
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={sessionDuration}
            onChange={(e) => setSessionDuration(parseInt(e.target.value))}
            style={{
              width: '200px',
              margin: '0 1rem'
            }}
          />
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {breathingModes.map((mode, index) => (
            <motion.div
              key={mode.id}
              style={{
                background: 'rgba(45, 55, 72, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                borderColor: 'rgba(102, 126, 234, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startBreathingSession(mode)}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {mode.icon}
              </div>
              <h3 style={{ 
                fontSize: '1.4rem', 
                fontWeight: '600', 
                color: '#E2E8F0', 
                marginBottom: '0.5rem' 
              }}>
                {mode.title}
              </h3>
              <p style={{ 
                color: '#A0AEC0', 
                marginBottom: '1.5rem' 
              }}>
                {mode.description}
              </p>
              <button style={{
                background: 'linear-gradient(135deg, #667EEA, #764BA2)',
                border: 'none',
                borderRadius: '12px',
                padding: '0.75rem 2rem',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                Start Practice
              </button>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'rgba(45, 55, 72, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '0.75rem 2rem',
              color: '#A0AEC0',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ZenMode;