import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, FileText, ArrowRight, CheckCircle } from 'lucide-react';

export default function ServiceCard({ service, compact = false }) {
  const [expanded, setExpanded] = React.useState(false);

  if (compact) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 p-5 card-hover cursor-pointer shadow-sm">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{service.categoryIcon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-800 text-sm leading-tight">{service.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{service.department}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium">{service.category}</span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock size={11} /> {service.processingTime}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm card-hover overflow-hidden">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
            {service.categoryIcon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-slate-800 text-base leading-tight">{service.name}</h3>
              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium whitespace-nowrap flex-shrink-0">
                {service.category}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{service.department}</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>

        {/* Meta */}
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Clock size={12} className="text-blue-500" />
            <span className="font-medium">Time:</span> {service.processingTime}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <FileText size={12} className="text-blue-500" />
            <span className="font-medium">Fee:</span> {service.fee}
          </div>
        </div>
      </div>

      {/* Expandable section */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-slate-50 pt-4 animate-fade-in">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Steps</h4>
              <ol className="space-y-1.5">
                {service.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle size={13} className="text-green-500 mt-0.5 flex-shrink-0" />
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Required Documents</h4>
              <ul className="space-y-1.5">
                {service.requiredDocs.map((doc, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Link
              to="/ai-assistant"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors no-underline"
            >
              Ask AI Assistant <ArrowRight size={12} />
            </Link>
            <Link
              to="/grievance/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-blue-300 text-slate-600 hover:text-blue-600 text-xs font-medium rounded-lg transition-colors no-underline"
            >
              File Grievance
            </Link>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-blue-600 hover:bg-blue-50 border-t border-slate-100 transition-colors"
      >
        {expanded ? 'Show Less' : 'View Details & Steps'}
        <ArrowRight size={12} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>
    </div>
  );
}
