import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Profile = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [profile, setProfile] = useState({
    name: '',
    identity: '',
    currentMood: '',
    moodFrequency: '',
    joinedDate: '',
    preferences: null
  });
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    streakDays: 0,
    favoriteFeature: '',
    lastActive: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    goals: ''
  });

  useEffect(() => {
    loadProfile();
    loadStats();
  }, []);

  const loadProfile = () => {
    // Load from localStorage
    const savedPrefs = localStorage.getItem('serenity_user_preferences');
    const savedProfile = localStorage.getItem('serenity_profile');
    
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setProfile(prev => ({
        ...prev,
        identity: prefs.identity || '',
        currentMood: prefs.current_mood || '',
        moodFrequency: prefs.mood_frequency || '',
        joinedDate: prefs.created_at || new Date().toISOString(),
        preferences: prefs
      }));
    }

    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      setProfile(prev => ({
        ...prev,
        name: profileData.name || '',
      }));
      setEditForm({
        name: profileData.name || '',
        bio: profileData.bio || '',
        goals: profileData.goals || ''
      });
    }
  };

  const loadStats = () => {
    // Calculate stats from stored data
    const cbtSessions = JSON.parse(localStorage.getItem('serenity_cbt_sessions') || '[]');
    const zenSessions = JSON.parse(localStorage.getItem('serenity_zen_sessions') || '[]');
    const musicSessions = JSON.parse(localStorage.getItem('serenity_music_sessions') || '[]');

    const totalSessions = cbtSessions.length + zenSessions.length + musicSessions.length;
    
    // Calculate total minutes (rough estimation)
    let totalMinutes = 0;
    totalMinutes += cbtSessions.length * 15; // Avg 15 min per CBT session
    totalMinutes += zenSessions.length * 10; // Avg 10 min per Zen session
    totalMinutes += musicSessions.length * 20; // Avg 20 min per music session

    // Simple streak calculation (days with any activity)
    const allSessions = [...cbtSessions, ...zenSessions, ...musicSessions];
    const uniqueDates = new Set(
      allSessions.map(session => 
        new Date(session.created_at || Date.now()).toDateString()
      )
    );
    
    // Find most used feature
    const featureCounts = {
      'CBT Reframing': cbtSessions.length,
      'Zen Breathing': zenSessions.length, 
      'Relaxing Music': musicSessions.length
    };
    const favoriteFeature = Object.keys(featureCounts).reduce((a, b) => 
      featureCounts[a] > featureCounts[b] ? a : b
    ) || 'None yet';

    setStats({
      totalSessions,
      totalMinutes,
      streakDays: uniqueDates.size,
      favoriteFeature,
      lastActive: allSessions.length > 0 ? 
        new Date(Math.max(...allSessions.map(s => new Date(s.created_at || Date.now())))).toLocaleDateString() :
        'Never'
    });
  };

  const saveProfile = () => {
    const profileData = {
      name: editForm.name,
      bio: editForm.bio,
      goals: editForm.goals,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('serenity_profile', JSON.stringify(profileData));
    setProfile(prev => ({ ...prev, name: editForm.name }));
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditForm({
      name: profile.name,
      bio: JSON.parse(localStorage.getItem('serenity_profile') || '{}').bio || '',
      goals: JSON.parse(localStorage.getItem('serenity_profile') || '{}').goals || ''
    });
    setIsEditing(false);
  };

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      'Anxious': '😰',
      'Unfocused': '🤔',
      'Sad': '😔',
      'Stressed': '😫',
      'Calm': '😌',
      'Happy': '😊',
      'Excited': '🤗'
    };
    return moodEmojis[mood] || '😐';
  };

  const getIdentityIcon = (identity) => {
    const identityIcons = {
      'Student': '🎓',
      'Creative': '🎨',
      'Professional': '💼',
      'Parent': '👨‍👩‍👧‍👦',
      'Other': '👤'
    };
    return identityIcons[identity] || '👤';
  };

  const achievements = [
    { 
      id: 'first_session', 
      title: 'First Steps', 
      description: 'Completed your first wellness session',
      icon: '🌱',
      unlocked: stats.totalSessions >= 1
    },
    { 
      id: 'week_streak', 
      title: 'Week Warrior', 
      description: 'Active for 7 different days',
      icon: '🔥',
      unlocked: stats.streakDays >= 7
    },
    { 
      id: 'mindful_minutes', 
      title: 'Mindful Master', 
      description: 'Spent 100+ minutes in practice',
      icon: '🧘',
      unlocked: stats.totalMinutes >= 100
    },
    { 
      id: 'cbt_expert', 
      title: 'Thought Transformer', 
      description: 'Completed 10 CBT sessions',
      icon: '💭',
      unlocked: stats.favoriteFeature === 'CBT Reframing' && stats.totalSessions >= 10
    }
  ];

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
            👤 Profile
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#A0AEC0',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Your wellness journey and personal insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Info */}
          <motion.div
            className="glass-card"
            style={{
              borderRadius: '20px',
              padding: '2rem'
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-200">Personal Info</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="glass-button px-3 py-1 rounded-lg text-sm"
              >
                {isEditing ? 'Cancel' : '✏️ Edit'}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="glass-input w-full p-3 rounded-lg text-gray-200"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="glass-input w-full p-3 rounded-lg text-gray-200 h-20 resize-none"
                    placeholder="Tell us a bit about yourself..."
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Wellness Goals</label>
                  <textarea
                    value={editForm.goals}
                    onChange={(e) => setEditForm({ ...editForm, goals: e.target.value })}
                    className="glass-input w-full p-3 rounded-lg text-gray-200 h-20 resize-none"
                    placeholder="What are your wellness aspirations?"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={saveProfile}
                    className="glass-button px-4 py-2 rounded-lg text-green-400"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="glass-button px-4 py-2 rounded-lg text-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : '👤'}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-200">
                    {profile.name || 'Anonymous User'}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-800 bg-opacity-30 rounded-lg">
                    <span className="text-xl">{getIdentityIcon(profile.identity)}</span>
                    <div>
                      <div className="text-gray-400 text-sm">Identity</div>
                      <div className="text-gray-200">{profile.identity || 'Not set'}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-800 bg-opacity-30 rounded-lg">
                    <span className="text-xl">{getMoodEmoji(profile.currentMood)}</span>
                    <div>
                      <div className="text-gray-400 text-sm">Current Mood</div>
                      <div className="text-gray-200">{profile.currentMood || 'Not set'}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-800 bg-opacity-30 rounded-lg">
                    <span className="text-xl">📅</span>
                    <div>
                      <div className="text-gray-400 text-sm">Member Since</div>
                      <div className="text-gray-200">
                        {profile.joinedDate ? new Date(profile.joinedDate).toLocaleDateString() : 'Today'}
                      </div>
                    </div>
                  </div>
                </div>

                {JSON.parse(localStorage.getItem('serenity_profile') || '{}').bio && (
                  <div className="mt-4 p-3 bg-gray-800 bg-opacity-30 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Bio</div>
                    <div className="text-gray-200">{JSON.parse(localStorage.getItem('serenity_profile') || '{}').bio}</div>
                  </div>
                )}

                {JSON.parse(localStorage.getItem('serenity_profile') || '{}').goals && (
                  <div className="mt-4 p-3 bg-gray-800 bg-opacity-30 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Wellness Goals</div>
                    <div className="text-gray-200">{JSON.parse(localStorage.getItem('serenity_profile') || '{}').goals}</div>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            className="glass-card"
            style={{
              borderRadius: '20px',
              padding: '2rem'
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-gray-200 mb-6">Wellness Stats</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <div className="text-2xl font-bold text-white">{stats.totalSessions}</div>
                <div className="text-blue-100 text-sm">Total Sessions</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                <div className="text-2xl font-bold text-white">{stats.totalMinutes}</div>
                <div className="text-green-100 text-sm">Minutes Practiced</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <div className="text-2xl font-bold text-white">{stats.streakDays}</div>
                <div className="text-purple-100 text-sm">Active Days</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                <div className="text-xl font-bold text-white">🏆</div>
                <div className="text-orange-100 text-sm">Achievements</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-800 bg-opacity-30 rounded-lg">
                <span className="text-gray-300">Favorite Feature</span>
                <span className="text-gray-200 font-medium">{stats.favoriteFeature}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800 bg-opacity-30 rounded-lg">
                <span className="text-gray-300">Last Active</span>
                <span className="text-gray-200 font-medium">{stats.lastActive}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          className="glass-card mt-6"
          style={{
            borderRadius: '20px',
            padding: '2rem'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-200 mb-6">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border ${
                  achievement.unlocked
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 border-yellow-400'
                    : 'bg-gray-800 bg-opacity-30 border-gray-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </span>
                  <div>
                    <h3 className={`font-semibold ${
                      achievement.unlocked ? 'text-yellow-900' : 'text-gray-300'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm ${
                      achievement.unlocked ? 'text-yellow-800' : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlocked && (
                    <div className="ml-auto">
                      <span className="text-yellow-900 font-bold">✓</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
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

export default Profile;