import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a1628] text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield size={15} className="text-white" />
              </div>
              <span className="text-white font-bold">CivicAssist<span className="text-blue-400">AI</span></span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              An AI-powered public service assistant helping citizens navigate government services with ease and transparency.
            </p>
            <div className="mt-4 inline-block px-2 py-1 bg-amber-500/20 border border-amber-500/30 rounded text-amber-400 text-xs font-medium">
              ⚠ Demo / Prototype
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              {['Service Directory', 'AI Assistant', 'File Grievance', 'Track Complaint'].map(item => (
                <li key={item}>
                  <Link
                    to={
                      item === 'Service Directory' ? '/services'
                      : item === 'AI Assistant'    ? '/ai-assistant'
                      : item === 'File Grievance'  ? '/grievance/new'
                      : '/my-grievances'
                    }
                    className="text-slate-400 hover:text-blue-300 transition-colors no-underline"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Government Portals</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'India.gov.in', href: 'https://india.gov.in' },
                { label: 'DigiLocker', href: 'https://digilocker.gov.in' },
                { label: 'UMANG App', href: 'https://umang.gov.in' },
                { label: 'Passport Seva', href: 'https://passportindia.gov.in' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-slate-400 hover:text-blue-300 transition-colors no-underline"
                  >
                    {label} <ExternalLink size={10} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Support</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-slate-400">
                <Mail size={14} className="mt-0.5 flex-shrink-0" />
                <span>support@civicassist.demo.in</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <Phone size={14} className="mt-0.5 flex-shrink-0" />
                <span>1800-XXX-XXXX (Demo)</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                <span>Ministry of Electronics & IT, New Delhi</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p>© 2024 CivicAssist AI — Hackathon Demo. Not an official government service.</p>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-slate-300 no-underline">Privacy Policy</Link>
            <Link to="/login" className="hover:text-slate-300 no-underline">Terms of Use</Link>
            <Link to="/login" className="hover:text-slate-300 no-underline">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
