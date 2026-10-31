import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, FileText, Plus, ChevronDown, ChevronUp, Calendar, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { AlertBanner, EmptyState } from '../components/UI';

function TimelineItem({ event, isLast }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0 mt-0.5" />
        {!isLast && <div className="w-0.5 bg-slate-200 flex-1 mt-1" />}
      </div>
      <div className={`pb-4 ${isLast ? '' : ''}`}>
        <p className="text-xs font-semibold text-slate-700">{event.event}</p>
        <p className="text-xs text-slate-500 mt-0.5">{event.description}</p>
        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
          <Calendar size={9} /> {event.date}
        </p>
      </div>
    </div>
  );
}

function GrievanceRow({ g }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mb-3">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-mono text-slate-500">{g.id}</span>
              <StatusBadge status={g.status} />
              <PriorityBadge priority={g.priority} />
            </div>
            <h3 className="font-semibold text-slate-800 text-sm leading-tight mb-1">{g.subject}</h3>
            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
              <span className="bg-slate-100 px-2 py-0.5 rounded">{g.category}</span>
              <span className="flex items-center gap-1"><MapPin size={10} /> {g.location}</span>
              <span className="flex items-center gap-1"><Calendar size={10} /> Filed: {g.submittedAt}</span>
              <span className="text-slate-400">Updated: {g.updatedAt}</span>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-shrink-0 p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 p-4 bg-slate-50 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Description</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{g.description}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">Status Timeline</h4>
              <div className="space-y-0">
                {[...g.timeline].reverse().map((event, i) => (
                  <TimelineItem key={i} event={event} isLast={i === g.timeline.length - 1} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const STATUS_FILTERS = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];

export default function MyGrievancesPage() {
  const { grievances } = useApp();
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = grievances.filter(g => {
    const matchesStatus = statusFilter === 'All' || g.status === statusFilter;
    const matchesSearch = !searchQuery || 
      g.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = STATUS_FILTERS.slice(1).reduce((acc, s) => {
    acc[s] = grievances.filter(g => g.status === s).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0a1628] text-white py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">My Grievances</h1>
              <p className="text-blue-300 text-sm">{grievances.length} total complaints on record</p>
            </div>
            <Link
              to="/grievance/new"
              id="new-grievance-btn"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors no-underline"
            >
              <Plus size={16} /> New Complaint
            </Link>
          </div>

          {/* Status summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {STATUS_FILTERS.slice(1).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s === statusFilter ? 'All' : s)}
                className={`p-3 rounded-xl text-left transition-colors ${
                  statusFilter === s ? 'bg-white/20 border border-white/30' : 'bg-white/10 hover:bg-white/15'
                }`}
              >
                <div className="text-lg font-bold">{statusCounts[s] || 0}</div>
                <div className="text-xs text-blue-200 mt-0.5">{s}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AlertBanner type="demo">
          <strong>Demo Data:</strong> Grievances shown include sample records and any you filed in this session. They are not submitted to real government systems.
        </AlertBanner>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-5 mb-5">
          <div className="flex items-center gap-2 flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5">
            <Search size={14} className="text-slate-400" />
            <input
              id="grievance-search"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by ID, subject or category..."
              className="flex-1 text-sm outline-none text-slate-700 placeholder-slate-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <div className="flex gap-1.5">
              {STATUS_FILTERS.map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    statusFilter === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No complaints found"
            description={statusFilter !== 'All' ? `No ${statusFilter} complaints found.` : "You haven't filed any complaints yet."}
            action={
              <Link
                to="/grievance/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 no-underline"
              >
                <Plus size={14} /> File a Grievance
              </Link>
            }
          />
        ) : (
          <div>
            <p className="text-xs text-slate-500 mb-3">Showing {filtered.length} complaint{filtered.length !== 1 ? 's' : ''}</p>
            {filtered.map(g => <GrievanceRow key={g.id} g={g} />)}
          </div>
        )}
      </div>
    </div>
  );
}
