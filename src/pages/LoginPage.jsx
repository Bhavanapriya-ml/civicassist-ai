import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, ArrowRight, User, Mail, Lock, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AlertBanner, Input, Button } from '../components/UI';
import { DEMO_USERS } from '../data/demoData';

function DemoCredentials() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
      <p className="font-semibold text-blue-800 text-xs uppercase tracking-wide mb-2">🔑 Demo Credentials</p>
      <div className="space-y-1.5">
        {DEMO_USERS.map(u => (
          <div key={u.id} className="flex items-center gap-2 text-xs text-blue-700">
            <span className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
              {u.avatar}
            </span>
            <div>
              <span className="font-medium">{u.role === 'admin' ? '[Admin]' : '[Citizen]'}</span>
              {' '}{u.email} / <span className="font-mono">demo1234</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (isRegister) {
        setError('');
        // Demo: just show success and switch to login
        setIsRegister(false);
        setForm(f => ({ ...f, password: '' }));
        return;
      }
      const result = login(form.email, form.password);
      if (result.success) {
        navigate(result.user.role === 'admin' ? '/admin' : '/my-grievances');
      } else {
        setError(result.error);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2 text-white no-underline">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield size={15} />
          </div>
          <span className="font-bold text-base">CivicAssist<span className="text-blue-300">AI</span></span>
        </Link>
        <div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Your gateway to
            <br />
            <span className="text-blue-300">government services</span>
          </h2>
          <p className="text-blue-200 text-base mb-8">
            Sign in to track your grievances, access personalized service recommendations, and manage your complaints.
          </p>
          <div className="space-y-3">
            {['Track complaint status in real-time', 'Get AI-powered service guidance', 'Manage all your grievances in one place'].map(f => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-blue-100">
                <div className="w-5 h-5 bg-blue-500/40 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs">✓</span>
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="text-blue-400 text-xs">© 2024 CivicAssist AI — Hackathon Prototype</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield size={15} className="text-white" />
            </div>
            <span className="font-bold text-[#0a1628]">CivicAssist<span className="text-blue-600">AI</span></span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="flex gap-1 mb-6 bg-slate-100 rounded-xl p-1">
              {['Sign In', 'Register'].map((tab, i) => (
                <button
                  key={tab}
                  id={i === 0 ? 'login-tab' : 'register-tab'}
                  onClick={() => { setIsRegister(i === 1); setError(''); }}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isRegister === (i === 1)
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Full Name *</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="register-name"
                      type="text"
                      value={form.name}
                      onChange={e => update('name', e.target.value)}
                      placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Email Address *</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-email"
                    type="email"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Password *</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    placeholder={isRegister ? 'Create a password' : 'Enter your password'}
                    className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertTriangle size={14} className="flex-shrink-0" /> {error}
                </div>
              )}

              <Button
                type="submit"
                id="auth-submit-btn"
                variant="navy"
                size="lg"
                className="w-full"
                loading={loading}
              >
                {isRegister ? 'Create Account' : 'Sign In'} <ArrowRight size={16} />
              </Button>
            </form>

            <div className="mt-6">
              <DemoCredentials />
            </div>

            <div className="mt-5">
              <AlertBanner type="warning">
                <strong>Demo Only:</strong> Registration does not create real accounts. Authentication is simulated for demo purposes.
              </AlertBanner>
            </div>

            <div className="mt-5 text-center">
              <Link to="/" className="text-xs text-slate-400 hover:text-slate-600 no-underline">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
