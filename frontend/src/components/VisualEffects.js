import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const VisualEffects = () => {
  const navigate = useNavigate();
  const [activeEffect, setActiveEffect] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [speed, setSpeed] = useState(3);

  const visualEffects = [
    {
      id: 'flowing-orbs',
      title: 'Flowing Orbs',
      description: 'Gentle floating spheres',
      icon: '⭕',
      component: FlowingOrbs
    },
    {
      id: 'particle-rain',
      title: 'Particle Rain',
      description: 'Soothing falling particles',
      icon: '🌧️',
      component: ParticleRain
    },
    {
      id: 'breathing-circle',
      title: 'Breathing Circle',
      description: 'Pulsing meditation visual',
      icon: '🔵',
      component: BreathingCircle
    },
    {
      id: 'wave-pattern',
      title: 'Wave Pattern',
      description: 'Calming wave motions',
      icon: '🌊',
      component: WavePattern
    }
  ];

  if (activeEffect) {
    const EffectComponent = activeEffect.component;
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        zIndex: 1000
      }}>
        <EffectComponent intensity={intensity} speed={speed} />
        
        {/* Controls overlay */}
        <div style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          background: 'rgba(26, 32, 44, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '1.5rem',
          color: '#E2E8F0',
          minWidth: '200px'
        }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
            {activeEffect.title}
          </h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Intensity: {intensity}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Speed: {speed}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          
          <button
            onClick={() => setActiveEffect(null)}
            style={{
              width: '100%',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '0.5rem',
              color: '#F87171',
              cursor: 'pointer'
            }}
          >
            Exit Visual
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      style={{
        padding: '3rem',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
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
            🌸 Visual Effects
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#A0AEC0',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Immerse yourself in calming visual experiences designed to soothe your mind
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {visualEffects.map((effect, index) => (
            <motion.div
              key={effect.id}
              style={{
                background: 'rgba(45, 55, 72, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '2.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                borderColor: 'rgba(102, 126, 234, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveEffect(effect)}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
                {effect.icon}
              </div>
              <h3 style={{ 
                fontSize: '1.4rem', 
                fontWeight: '600', 
                color: '#E2E8F0', 
                marginBottom: '0.5rem' 
              }}>
                {effect.title}
              </h3>
              <p style={{ 
                color: '#A0AEC0', 
                marginBottom: '1.5rem' 
              }}>
                {effect.description}
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
                Start Visual
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

// Visual Effect Components
const FlowingOrbs = ({ intensity, speed }) => {
  const orbCount = Math.max(3, intensity);
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {[...Array(orbCount)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: `${60 + intensity * 10}px`,
            height: `${60 + intensity * 10}px`,
            borderRadius: '50%',
            background: `linear-gradient(45deg, 
              rgba(102, 126, 234, 0.${intensity}), 
              rgba(118, 75, 162, 0.${Math.max(2, intensity - 2)})
            )`,
            filter: 'blur(20px)',
            left: `${(i * 15) % 80}%`,
            top: `${(i * 20) % 60 + 20}%`
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 60, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{
            duration: 15 - speed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2
          }}
        />
      ))}
    </div>
  );
};

const ParticleRain = ({ intensity, speed }) => {
  const particleCount = intensity * 15;
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {[...Array(particleCount)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            background: `rgba(102, 126, 234, ${0.3 + (intensity / 20)})`,
            left: `${Math.random() * 100}%`,
            top: '-10px'
          }}
          animate={{
            y: [0, window.innerHeight + 20],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: 8 - speed * 0.6,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  );
};

const BreathingCircle = ({ intensity, speed }) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <motion.div
        style={{
          width: `${200 + intensity * 30}px`,
          height: `${200 + intensity * 30}px`,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.6), rgba(118, 75, 162, 0.4))',
          filter: 'blur(30px)'
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 6 - speed * 0.4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

const WavePattern = ({ intensity, speed }) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            bottom: `${i * 15}%`,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, 
              transparent, 
              rgba(102, 126, 234, ${0.2 + intensity * 0.05}), 
              transparent
            )`,
            transformOrigin: 'left center'
          }}
          animate={{
            scaleX: [1, 2, 1],
            x: [-200, 200, -200]
          }}
          transition={{
            duration: 8 - speed * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
          }}
        />
      ))}
    </div>
  );
};

export default VisualEffects;