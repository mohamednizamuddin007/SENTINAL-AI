import React, { useState } from 'react';
import { Server, Shield, Bell, Eye, Database, Lock, RefreshCcw, User } from 'lucide-react';

interface SettingsProps {
    userEmail: string;
}

const Settings: React.FC<SettingsProps> = ({ userEmail }) => {
    const [toggles, setToggles] = useState({
        realTimeScan: true,
        autoBlock: true,
        notifications: true,
        dataSharing: false,
        deepAnalysis: true
    });

    const handleToggle = (key: keyof typeof toggles) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
             <div>
                <h1 className="text-3xl font-bold text-slate-100">System Settings</h1>
                <p className="text-slate-400 mt-1">Configure your SentinelAI protection preferences and account links.</p>
            </div>

            {/* API Status */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Server className="text-emerald-500" size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-200">Gmail Integration Status</h3>
                        <p className="text-sm text-slate-400">OAuth2 Connection Health</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-emerald-400">CONNECTED</span>
                    </div>
                </div>
                <div className="space-y-2">
                     <div className="flex justify-between text-sm py-2 border-b border-slate-800">
                        <span className="text-slate-400">Connected Account</span>
                        <div className="flex items-center gap-2">
                             <User size={12} className="text-emerald-500" />
                             <span className="font-mono text-slate-200">{userEmail}</span>
                        </div>
                     </div>
                     <div className="flex justify-between text-sm py-2 border-b border-slate-800">
                        <span className="text-slate-400">Scope</span>
                        <span className="font-mono text-slate-200">https://www.googleapis.com/auth/gmail.readonly</span>
                     </div>
                     <div className="flex justify-between text-sm py-2">
                        <span className="text-slate-400">Last Sync</span>
                        <span className="font-mono text-slate-200">Just now</span>
                     </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                     <button className="text-sm text-emerald-500 hover:text-emerald-400 font-medium flex items-center gap-2">
                        <RefreshCcw size={14} /> Re-authenticate
                     </button>
                </div>
            </div>

            {/* Protection Toggles */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                     <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                        <Shield className="text-blue-400" size={20} />
                        Active Defense Configuration
                     </h3>
                </div>
                
                <div className="divide-y divide-slate-800">
                    <div className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                        <div className="flex items-center gap-4">
                            <Eye className="text-slate-400" size={20} />
                            <div>
                                <h4 className="text-slate-200 font-medium">Real-time Deep Scanning</h4>
                                <p className="text-xs text-slate-500">Analyze incoming emails immediately upon arrival using Gemini Pro.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleToggle('realTimeScan')}
                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${toggles.realTimeScan ? 'bg-emerald-500' : 'bg-slate-700'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${toggles.realTimeScan ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>

                    <div className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                        <div className="flex items-center gap-4">
                            <Lock className="text-slate-400" size={20} />
                            <div>
                                <h4 className="text-slate-200 font-medium">Auto-Block High Risk Senders</h4>
                                <p className="text-xs text-slate-500">Automatically move emails with >90% risk score to Spam.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleToggle('autoBlock')}
                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${toggles.autoBlock ? 'bg-emerald-500' : 'bg-slate-700'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${toggles.autoBlock ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>

                    <div className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                        <div className="flex items-center gap-4">
                            <Bell className="text-slate-400" size={20} />
                            <div>
                                <h4 className="text-slate-200 font-medium">Browser Extension Alerts</h4>
                                <p className="text-xs text-slate-500">Show desktop notifications when a threat is detected.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleToggle('notifications')}
                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${toggles.notifications ? 'bg-emerald-500' : 'bg-slate-700'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${toggles.notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>

                    <div className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                        <div className="flex items-center gap-4">
                            <Database className="text-slate-400" size={20} />
                            <div>
                                <h4 className="text-slate-200 font-medium">Share Threat Data</h4>
                                <p className="text-xs text-slate-500">Anonymously contribute to the global SentinelAI threat database.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleToggle('dataSharing')}
                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${toggles.dataSharing ? 'bg-emerald-500' : 'bg-slate-700'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${toggles.dataSharing ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="text-center pt-8">
                 <button className="text-rose-500 hover:text-rose-400 text-sm font-medium transition-colors">
                    Sign Out & Revoke Access
                 </button>
            </div>
        </div>
    );
};

export default Settings;