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
      title: 'Floating Lotus',
      description: 'Gentle floating petals of tranquility',
      icon: '🪷',
      component: FlowingOrbs
    },
    {
      id: 'particle-rain', 
      title: 'Stardust Cascade',
      description: 'Peaceful falling stardust particles',
      icon: '✨',
      component: ParticleRain
    },
    {
      id: 'breathing-circle',
      title: 'Meditation Pulse',
      description: 'Synchronized breathing visualization',
      icon: '🔮',
      component: BreathingCircle
    },
    {
      id: 'wave-pattern',
      title: 'Zen Garden Waves',
      description: 'Flowing water ripples for peace',
      icon: '🌊',
      component: WavePattern
    },
    {
      id: 'aurora',
      title: 'Aurora Dreams',
      description: 'Soft northern lights display',
      icon: '🌌',
      component: AuroraEffect
    },
    {
      id: 'mandala',
      title: 'Sacred Mandala',
      description: 'Rotating spiritual geometry',
      icon: '🕸️',
      component: MandalaEffect
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
        
        {/* Controls overlay with glassmorphism */}
        <div className="glass-modal" style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          borderRadius: '16px',
          padding: '1.5rem',
          color: '#E2E8F0',
          minWidth: '220px'
        }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: '600' }}>
            {activeEffect.title}
          </h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#A0AEC0' }}>
              Intensity: {intensity}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              style={{ 
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#A0AEC0' }}>
              Speed: {speed}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              style={{ 
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <button
            onClick={() => setActiveEffect(null)}
            className="glass-button"
            style={{
              width: '100%',
              borderRadius: '8px',
              padding: '0.5rem',
              cursor: 'pointer',
              color: '#F87171'
            }}
          >
            ✕ Exit Visual
          </button>
        </div>

        {/* Breathing instruction overlay for breathing circle */}
        {activeEffect.id === 'breathing-circle' && (
          <div style={{
            position: 'fixed',
            bottom: '3rem',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            color: '#E2E8F0'
          }}>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 6 - speed * 0.4, repeat: Infinity }}
              style={{ fontSize: '1.2rem', fontWeight: '500' }}
            >
              Breathe with the circle
            </motion.div>
            <div style={{ fontSize: '0.9rem', color: '#A0AEC0', marginTop: '0.5rem' }}>
              Inhale as it grows • Exhale as it shrinks
            </div>
          </div>
        )}
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
            🌸 Visual Meditation
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#A0AEC0',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Immerse yourself in soothing visual experiences designed to calm your mind and enhance focus
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
              className="glass-card"
              style={{
                borderRadius: '20px',
                padding: '2.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                y: -4,
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
                marginBottom: '1.5rem',
                fontSize: '0.95rem',
                lineHeight: '1.5'
              }}>
                {effect.description}
              </p>
              <button 
                className="glass-button"
                style={{
                  borderRadius: '12px',
                  padding: '0.75rem 2rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Begin Experience
              </button>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/dashboard')}
            className="glass-button"
            style={{
              borderRadius: '12px',
              padding: '0.75rem 2rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              color: '#A0AEC0'
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