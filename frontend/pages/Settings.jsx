import React, { useState } from 'react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    timeZone: 'Asia/Kolkata',
    dateFormat: 'YYYY-MM-DD',
    language: 'English',
    emailAlerts: true,
    smsAlerts: false,
    severityThreshold: 'HIGH',
    slackWebhook: '',
    pagerDutyKey: '',
    autoQuarantine: true,
    playbookLevel: 'CRITICAL',
    scanInterval: 10,
    sessionTimeout: 60,
    twoFactorAuth: true,
  });

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-sm font-mono text-white">
      <h1 className="text-2xl mb-4 font-bold">Obi-Watch-Kenobi</h1>

      {/* Top Tab Buttons */}
      <div className="flex gap-4 mb-6">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          General
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Alerts
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Integrations
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Automation
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Security
        </button>
        <button className="ml-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          Save Settings
        </button>
      </div>

      {/* General */}
      <section className="mb-6 border border-gray-700 p-4 rounded">
        <h2 className="mb-2 text-lg text-pink-300">GENERAL</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            Time Zone:
            <select
              className="ml-2 bg-[#ffffff1e] text-white border border-gray-600 rounded"
              value={settings.timeZone}
              onChange={e => handleChange('timeZone', e.target.value)}
            >
              <option>Asia/Kolkata</option>
              <option>UTC</option>
              <option>America/New_York</option>
            </select>
          </div>
          <div>
            Date Format:
            <select
              className="ml-2 bg-[#ffffff1e] text-white border border-gray-600 rounded"
              value={settings.dateFormat}
              onChange={e => handleChange('dateFormat', e.target.value)}
            >
              <option>YYYY-MM-DD</option>
              <option>DD-MM-YYYY</option>
            </select>
          </div>
          <div>
            Language:
            <select
              className="ml-2 bg-[#ffffff1e] text-white border border-gray-600 rounded"
              value={settings.language}
              onChange={e => handleChange('language', e.target.value)}
            >
              <option>English</option>
              <option>Hindi</option>
            </select>
          </div>
        </div>
      </section>

      {/* Alerts */}
      <section className="mb-6 border border-gray-700 p-4 rounded">
        <h2 className="mb-2 text-lg text-pink-300">ALERTS</h2>
        <div className="space-y-2">
          <div>
            Email Alerts:
            <label className="ml-4">
              <input
                type="radio"
                name="emailAlerts"
                checked={settings.emailAlerts}
                onChange={() => handleChange('emailAlerts', true)}
              />{' '}
              ON
            </label>
            <label className="ml-2">
              <input
                type="radio"
                name="emailAlerts"
                checked={!settings.emailAlerts}
                onChange={() => handleChange('emailAlerts', false)}
              />{' '}
              OFF
            </label>
          </div>
          <div>
            SMS Alerts:
            <label className="ml-4">
              <input
                type="radio"
                name="smsAlerts"
                checked={settings.smsAlerts}
                onChange={() => handleChange('smsAlerts', true)}
              />{' '}
              ON
            </label>
            <label className="ml-2">
              <input
                type="radio"
                name="smsAlerts"
                checked={!settings.smsAlerts}
                onChange={() => handleChange('smsAlerts', false)}
              />{' '}
              OFF
            </label>
          </div>
          <div>
            Severity Threshold:
            <select
              className="ml-2 bg-[#ffffff1e] text-white border border-gray-600 rounded"
              value={settings.severityThreshold}
              onChange={e => handleChange('severityThreshold', e.target.value)}
            >
              <option>LOW</option>
              <option>MEDIUM</option>
              <option>HIGH</option>
              <option>CRITICAL</option>
            </select>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="mb-6 border border-gray-700 p-4 rounded">
        <h2 className="mb-2 text-lg text-pink-300">INTEGRATIONS</h2>
        <div className="space-y-2">
          <div>
            Slack Webhook URL:
            <input
              type="text"
              className="ml-2 w-full bg-[#ffffff1e] text-white border border-gray-600 rounded"
              value={settings.slackWebhook}
              onChange={e => handleChange('slackWebhook', e.target.value)}
              placeholder="https://hooks.slack.com/…"
            />
          </div>
          <div>
            PagerDuty API Key:
            <input
              type="text"
              className="ml-2 w-full bg-[#ffffff1e] text-white border border-gray-600 rounded"
              value={settings.pagerDutyKey}
              onChange={e => handleChange('pagerDutyKey', e.target.value)}
              placeholder="PDSVC-…"
            />
          </div>
        </div>
      </section>

      {/* Automation */}
      <section className="mb-6 border border-gray-700 p-4 rounded">
        <h2 className="mb-2 text-lg text-pink-300">AUTOMATION</h2>
        <div className="space-y-2">
          <div>
            Auto-Quarantine:
            <label className="ml-4">
              <input
                type="radio"
                name="autoQuarantine"
                checked={settings.autoQuarantine}
                onChange={() => handleChange('autoQuarantine', true)}
              />{' '}
              ON
            </label>
            <label className="ml-2">
              <input
                type="radio"
                name="autoQuarantine"
                checked={!settings.autoQuarantine}
                onChange={() => handleChange('autoQuarantine', false)}
              />{' '}
              OFF
            </label>
          </div>
          <div>
            Playbook Level:
            <select
              className="ml-2 bg-[#ffffff1e] text-white border border-gray-600 rounded"
              value={settings.playbookLevel}
              onChange={e => handleChange('playbookLevel', e.target.value)}
            >
              <option>LOW</option>
              <option>MEDIUM</option>
              <option>HIGH</option>
              <option>CRITICAL</option>
            </select>
          </div>
          <div>
            Scan Interval (s):
            <input
              type="number"
              className="ml-2 w-20 bg-[#ffffff1e] text-white border border-gray-600 rounded"
              value={settings.scanInterval}
              onChange={e => handleChange('scanInterval', parseInt(e.target.value))}
            />
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="mb-6 border border-gray-700 p-4 rounded">
        <h2 className="mb-2 text-lg text-pink-300">SECURITY</h2>
        <div className="space-y-2">
          <div>
            Session Timeout (min):
            <input
              type="number"
              className="ml-2 w-20 bg-[#ffffff1e] text-white border border-gray-600 rounded"
              value={settings.sessionTimeout}
              onChange={e => handleChange('sessionTimeout', parseInt(e.target.value))}
            />
          </div>
          <div>
            Two-Factor Auth:
            <label className="ml-4">
              <input
                type="radio"
                name="twoFactorAuth"
                checked={settings.twoFactorAuth}
                onChange={() => handleChange('twoFactorAuth', true)}
              />{' '}
              Enabled
            </label>
            <label className="ml-2">
              <input
                type="radio"
                name="twoFactorAuth"
                checked={!settings.twoFactorAuth}
                onChange={() => handleChange('twoFactorAuth', false)}
              />{' '}
              Disabled
            </label>
          </div>
        </div>
      </section>

      <footer className="text-center mt-8 text-gray-400">
        <p>© 2025 Obi‑Watch‑Kenobi</p>
        <div className="flex justify-center gap-4 mt-1">
          <span>Help</span>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </footer>
    </div>
  );
};

export default SettingsPage;
