import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Settings = () => {
  const navigate = useNavigate();
  const { theme, updateTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');
  const [settings, setSettings] = useState({
    theme: 'dark',
    soundEnabled: true,
    notificationsEnabled: true,
    autoplay: true,
    defaultVolume: 70,
    breathingReminders: false,
    dataExport: false
  });
  const [usageStats, setUsageStats] = useState({
    feature_stats: [],
    recent_activity: [],
    total_sessions: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
    loadUsageAnalytics();
  }, []);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('serenity_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const saveSettings = (newSettings) => {
    localStorage.setItem('serenity_settings', JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  const loadUsageAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/analytics/summary?user_id=anonymous`);
      if (response.ok) {
        const data = await response.json();
        setUsageStats(data);
      }
    } catch (error) {
      console.error('Error loading usage analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const predefinedThemes = [
    {
      name: 'Calm Ocean',
      colors: {
        primary: '#06B6D4',
        secondary: '#22D3EE', 
        accent: '#67E8F9',
        background: '#1A1E1E',
        surface: '#273333',
        text: '#E2E8F0'
      }
    },
    {
      name: 'Serene Forest',
      colors: {
        primary: '#10B981',
        secondary: '#34D399',
        accent: '#6EE7B7', 
        background: '#1A1E1A',
        surface: '#273229',
        text: '#E2E8F0'
      }
    },
    {
      name: 'Peaceful Sunset',
      colors: {
        primary: '#F59E0B',
        secondary: '#FBBF24',
        accent: '#FCD34D',
        background: '#1E1B17', 
        surface: '#322A20',
        text: '#E2E8F0'
      }
    },
    {
      name: 'Deep Space',
      colors: {
        primary: '#6B73FF',
        secondary: '#9BB5FF',
        accent: '#C1D3FE',
        background: '#1A1B23',
        surface: '#2A2D37', 
        text: '#E2E8F0'
      }
    }
  ];

  const exportData = () => {
    const userData = {
      settings: settings,
      preferences: localStorage.getItem('serenity_user_preferences'),
      cbtSessions: localStorage.getItem('serenity_cbt_sessions'),
      favorites: localStorage.getItem('serenity_favorites'),
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `serenity-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
      localStorage.removeItem('serenity_user_preferences');
      localStorage.removeItem('serenity_cbt_sessions');
      localStorage.removeItem('serenity_favorites');
      localStorage.removeItem('serenity_settings');
      alert('All data has been cleared.');
      setSettings({
        theme: 'dark',
        soundEnabled: true,
        notificationsEnabled: true,
        autoplay: true,
        defaultVolume: 70,
        breathingReminders: false,
        dataExport: false
      });
    }
  };

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Theme Colors</h3>
        <div className="grid grid-cols-2 gap-3">
          {predefinedThemes.map((themeOption) => (
            <motion.div
              key={themeOption.name}
              className="glass-card cursor-pointer p-4 rounded-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateTheme(themeOption.colors)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: themeOption.colors.primary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: themeOption.colors.secondary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: themeOption.colors.accent }}
                  />
                </div>
                <span className="text-gray-200 font-medium">{themeOption.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAudioSettings = () => (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Audio Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-gray-300">Sound Effects</label>
            <button
              onClick={() => handleSettingChange('soundEnabled', !settings.soundEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.soundEnabled ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-gray-300">Autoplay Music</label>
            <button
              onClick={() => handleSettingChange('autoplay', !settings.autoplay)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoplay ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoplay ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="text-gray-300 block mb-2">Default Volume: {settings.defaultVolume}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.defaultVolume}
              onChange={(e) => handleSettingChange('defaultVolume', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {loading ? (
        <div className="glass-card p-8 rounded-xl text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your usage statistics...</p>
        </div>
      ) : (
        <>
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Usage Overview</h3>
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-blue-400 mb-2">{usageStats.total_sessions}</div>
              <div className="text-gray-400">Total Sessions This Week</div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Feature Usage</h3>
            <div className="space-y-3">
              {usageStats.feature_stats.length > 0 ? (
                usageStats.feature_stats.map((stat) => (
                  <div key={stat._id} className="flex items-center justify-between p-3 bg-gray-800 bg-opacity-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-200 capitalize">{stat._id}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-200 font-medium">{stat.total_sessions} sessions</div>
                      {stat.total_duration && (
                        <div className="text-gray-400 text-sm">{Math.round(stat.total_duration / 60)} min total</div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center">No usage data available yet. Start using the app to see your statistics!</p>
              )}
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Recent Activity</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {usageStats.recent_activity.length > 0 ? (
                usageStats.recent_activity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-800 bg-opacity-30 rounded">
                    <span className="text-gray-300 capitalize">{activity.feature} - {activity.action}</span>
                    <span className="text-gray-500">{new Date(activity.created_at).toLocaleDateString()}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center">No recent activity to display.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Data Management</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-gray-300 font-medium mb-2">Export Your Data</h4>
            <p className="text-gray-400 text-sm mb-3">Download all your app data including preferences, sessions, and settings.</p>
            <button
              onClick={exportData}
              className="glass-button px-4 py-2 rounded-lg text-blue-400 hover:text-blue-300"
            >
              📁 Export Data
            </button>
          </div>

          <div className="border-t border-gray-600 pt-4">
            <h4 className="text-gray-300 font-medium mb-2">Clear All Data</h4>
            <p className="text-gray-400 text-sm mb-3">Remove all stored data from this device. This action cannot be undone.</p>
            <button
              onClick={clearAllData}
              className="glass-button px-4 py-2 rounded-lg text-red-400 hover:text-red-300"
            >
              🗑️ Clear All Data
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Privacy Notice</h3>
        <div className="text-gray-400 text-sm space-y-2">
          <p>• All your personal data is stored locally on your device</p>
          <p>• We do not collect or share any personal information</p>
          <p>• Your CBT sessions and preferences remain completely private</p>
          <p>• You have full control over your data export and deletion</p>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'audio', label: 'Audio', icon: '🔊' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' }
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
            ⚙️ Settings
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#A0AEC0',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Customize your wellness experience and manage your data privacy
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="glass-card rounded-xl p-2 mb-6">
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'glass-button text-blue-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'appearance' && renderAppearanceSettings()}
          {activeTab === 'audio' && renderAudioSettings()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'privacy' && renderPrivacySettings()}
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

export default Settings;