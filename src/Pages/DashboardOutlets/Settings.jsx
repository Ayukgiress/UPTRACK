import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { User, Bell, Shield, Palette, Globe, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { currentUser } = useAuth();
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      taskReminders: true,
      weeklyReports: false
    },
    privacy: {
      profileVisibility: 'public',
      dataSharing: false
    },
    appearance: {
      theme: 'light',
      language: i18n.language || 'en'
    }
  });

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));

    // Handle theme change
    if (category === 'appearance' && setting === 'theme') {
      applyTheme(value);
    }

    // Handle language change
    if (category === 'appearance' && setting === 'language') {
      i18n.changeLanguage(value);
    }
  };

  const applyTheme = (theme) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      if (systemTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  useEffect(() => {
    // Apply initial theme
    applyTheme(settings.appearance.theme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (settings.appearance.theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [settings.appearance.theme]);

  const handleSave = () => {
    // Here you would typically save to backend
    toast.success(t('Settings saved successfully!'));
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('Settings')}</h1>
          <p className="text-muted-foreground mt-1">{t('Manage your account and preferences')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Section */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-muted-foreground" />
            <h2 className="text-xl font-bold text-card-foreground">{t('Profile')}</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">{t('Name')}</label>
              <input
                type="text"
                value={currentUser?.name || ''}
                className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-colors bg-background text-foreground"
                placeholder={t('Your name')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">{t('Email')}</label>
              <input
                type="email"
                value={currentUser?.email || ''}
                className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-colors bg-background text-foreground"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">{t('Bio')}</label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-colors resize-none bg-background text-foreground"
                placeholder={t('Tell us about yourself...')}
              />
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-muted-foreground" />
            <h2 className="text-xl font-bold text-card-foreground">{t('Notifications')}</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">{t('Email Notifications')}</p>
                <p className="text-sm text-muted-foreground">{t('Receive updates via email')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900 dark:peer-checked:bg-gray-700"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">{t('Push Notifications')}</p>
                <p className="text-sm text-muted-foreground">{t('Get instant notifications')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900 dark:peer-checked:bg-gray-700"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">{t('Task Reminders')}</p>
                <p className="text-sm text-muted-foreground">{t('Remind me about due tasks')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.taskReminders}
                  onChange={(e) => handleSettingChange('notifications', 'taskReminders', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900 dark:peer-checked:bg-gray-700"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-muted-foreground" />
            <h2 className="text-xl font-bold text-card-foreground">{t('Privacy')}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">{t('Profile Visibility')}</label>
              <select
                value={settings.privacy.profileVisibility}
                onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-colors bg-background text-foreground"
              >
                <option value="public">{t('Public')}</option>
                <option value="friends">{t('Friends Only')}</option>
                <option value="private">{t('Private')}</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">{t('Data Sharing')}</p>
                <p className="text-sm text-muted-foreground">{t('Allow anonymous usage data')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.dataSharing}
                  onChange={(e) => handleSettingChange('privacy', 'dataSharing', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900 dark:peer-checked:bg-gray-700"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-6 h-6 text-muted-foreground" />
            <h2 className="text-xl font-bold text-card-foreground">{t('Appearance')}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">{t('Theme')}</label>
              <select
                value={settings.appearance.theme}
                onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-colors bg-background text-foreground"
              >
                <option value="light">{t('Light')}</option>
                <option value="dark">{t('Dark')}</option>
                <option value="system">{t('System')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">{t('Language')}</label>
              <select
                value={settings.appearance.language}
                onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-colors bg-background text-foreground"
              >
                <option value="en">{t('English')}</option>
                <option value="fr">{t('Français')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          {t('Save Changes')}
        </button>
      </div>
    </div>
  );
};

export default Settings;
