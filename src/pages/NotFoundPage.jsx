import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, FileText } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 p-6">
      <div className="text-center max-w-md animate-fade-in-up">
        <div className="text-8xl font-black text-slate-100 mb-4">404</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-3">Page Not Found</h1>
        <p className="text-slate-500 text-sm mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors no-underline"
          >
            <Home size={15} /> Go Home
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 hover:border-blue-300 text-slate-600 hover:text-blue-600 text-sm font-medium rounded-xl transition-colors no-underline"
          >
            <Search size={15} /> Browse Services
          </Link>
          <Link
            to="/grievance/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 hover:border-blue-300 text-slate-600 hover:text-blue-600 text-sm font-medium rounded-xl transition-colors no-underline"
          >
            <FileText size={15} /> File Grievance
          </Link>
        </div>
      </div>
    </div>
  );
}
