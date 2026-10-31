import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MessageSquare, FileText, ArrowRight,
  CheckCircle, Users, Shield, Zap, ChevronRight
} from 'lucide-react';
import { DEMO_SERVICES } from '../data/demoData';
import ServiceCard from '../components/ServiceCard';
import { AlertBanner } from '../components/UI';

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Search,
    title: 'Find Your Service',
    description: 'Search our comprehensive directory of government services. Filter by category, department, or keyword to find exactly what you need.',
    color: 'bg-blue-600',
  },
  {
    step: '02',
    icon: MessageSquare,
    title: 'Ask AI Assistant',
    description: 'Have questions? Our AI assistant can explain procedures, required documents, and guide you through the process step by step.',
    color: 'bg-purple-600',
  },
  {
    step: '03',
    icon: FileText,
    title: 'File & Track',
    description: 'Submit grievances about public services online. Track your complaint status in real-time with your unique reference number.',
    color: 'bg-emerald-600',
  },
];

const STATS = [
  { label: 'Services Listed', value: '12+', icon: Shield },
  { label: 'Categories', value: '11', icon: Zap },
  { label: 'Citizens Served', value: '1M+', icon: Users },
  { label: 'Resolution Rate', value: '94%', icon: CheckCircle },
];

const POPULAR_SERVICES = DEMO_SERVICES.slice(0, 6);

export default function HomePage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/services?q=${encodeURIComponent(searchQuery)}`);
  };


  return (
    <div className="min-h-screen">
      {/* Demo Banner */}
      <div className="bg-amber-500 text-amber-900 text-xs font-medium text-center py-2 px-4">
        🔬 <strong>Demo Mode:</strong> This is a prototype built for a hackathon. No real data is submitted to any government department.
      </div>

      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-200 text-sm mb-6 animate-fade-in">
            <Zap size={14} className="text-blue-300" />
            AI-Powered Public Service Assistant
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
            Your Government Services,
            <br />
            <span className="text-blue-300">Simplified</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10 animate-fade-in-up">
            Discover public services, understand procedures, get AI guidance, and track your complaints — all in one place.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8 animate-fade-in-up">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-2">
              <Search size={18} className="text-blue-300 ml-3 flex-shrink-0" />
              <input
                id="hero-search"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for any government service (e.g. passport, ration card)..."
                className="flex-1 bg-transparent text-white placeholder-blue-300 text-sm outline-none py-1"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium rounded-xl transition-colors flex-shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up">
            <Link
              to="/services"
              id="hero-find-services-btn"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0a1628] font-semibold rounded-xl hover:bg-blue-50 transition-colors no-underline shadow-lg"
            >
              <Search size={16} /> Find Services
            </Link>
            <Link
              to="/ai-assistant"
              id="hero-ask-ai-btn"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600/80 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors no-underline border border-blue-400/30"
            >
              <MessageSquare size={16} /> Ask AI Assistant
            </Link>
            <Link
              to="/grievance/new"
              id="hero-file-grievance-btn"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors no-underline border border-white/20"
            >
              <FileText size={16} /> File a Grievance
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="flex justify-center mb-2">
                  <Icon size={20} className="text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-slate-800">{value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Popular Services</h2>
              <p className="text-slate-500 text-sm mt-1">Most frequently accessed government services</p>
            </div>
            <Link
              to="/services"
              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium no-underline"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="mb-4">
            <AlertBanner type="demo">
              <strong>Demo Data:</strong> The services below are sample entries for demonstration purposes.
            </AlertBanner>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_SERVICES.map(service => (
              <ServiceCard key={service.id} service={service} compact />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-800">How CivicAssist AI Works</h2>
            <p className="text-slate-500 text-sm mt-2 max-w-lg mx-auto">
              A simple three-step process to navigate government services efficiently
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, description, color }) => (
              <div key={step} className="relative text-center">
                <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-5xl font-black text-slate-100 select-none">
                  {step}
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
                {step !== '03' && (
                  <div className="hidden md:block absolute top-7 left-[65%] w-[70%] border-t-2 border-dashed border-slate-200" />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0a1628] hover:bg-[#1a3260] text-white font-semibold rounded-xl transition-colors no-underline"
            >
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="hero-gradient py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Have a complaint about a public service?
          </h2>
          <p className="text-blue-200 mb-7 text-base">
            File your grievance online and track its resolution status in real-time.
          </p>
          <Link
            to="/grievance/new"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#0a1628] font-bold rounded-xl hover:bg-blue-50 transition-colors no-underline shadow-xl"
          >
            File a Grievance <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
