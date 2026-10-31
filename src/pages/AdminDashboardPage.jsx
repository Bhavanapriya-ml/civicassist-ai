import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Search, Filter, ChevronDown, Calendar, MapPin,
  Eye, CheckCircle, AlertTriangle, BarChart3, FileText, Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { AlertBanner, Button, Select } from '../components/UI';
import { STATUS_CONFIG } from '../data/demoData';

const NEW_STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed', 'Rejected'];

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-800">{value}</div>
        <div className="text-xs text-slate-500">{label}</div>
      </div>
    </div>
  );
}

function GrievanceDetailModal({ grievance, onClose, onUpdateStatus }) {
  const [newStatus, setNewStatus] = useState(grievance.status);

  if (!grievance) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-slate-400">{grievance.id}</span>
              <h2 className="text-lg font-bold text-slate-800 mt-0.5">{grievance.subject}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">✕</button>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex flex-wrap gap-3">
            <StatusBadge status={grievance.status} />
            <PriorityBadge priority={grievance.priority} />
            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{grievance.category}</span>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Description</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{grievance.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><MapPin size={10} /> Location</p>
              <p className="text-sm font-medium text-slate-700">{grievance.location}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Calendar size={10} /> Filed</p>
              <p className="text-sm font-medium text-slate-700">{grievance.submittedAt}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Activity Timeline</h3>
            <div className="space-y-3">
              {[...grievance.timeline].reverse().map((event, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{event.event} <span className="font-normal text-slate-400">— {event.date}</span></p>
                    <p className="text-xs text-slate-500 mt-0.5">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Update */}
          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Update Status</h3>
            <div className="flex gap-3">
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {NEW_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <Button
                onClick={() => { onUpdateStatus(grievance.id, newStatus); onClose(); }}
                variant="primary"
                id={`update-status-${grievance.id}`}
              >
                <CheckCircle size={14} /> Update
              </Button>
            </div>
            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
              <AlertTriangle size={10} /> This is a demo — no real notifications will be sent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const STATUS_FILTER_OPTIONS = ['All', 'Open', 'In Progress', 'Resolved', 'Closed', 'Rejected'];

export default function AdminDashboardPage() {
  const { grievances, updateGrievanceStatus } = useApp();
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrievance, setSelectedGrievance] = useState(null);

  const filtered = grievances.filter(g => {
    const matchesStatus = statusFilter === 'All' || g.status === statusFilter;
    const matchesSearch = !searchQuery ||
      g.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = [
    { label: 'Total Complaints', value: grievances.length, icon: FileText, color: 'bg-blue-600' },
    { label: 'Open', value: grievances.filter(g => g.status === 'Open').length, icon: AlertTriangle, color: 'bg-amber-500' },
    { label: 'In Progress', value: grievances.filter(g => g.status === 'In Progress').length, icon: Clock, color: 'bg-purple-600' },
    { label: 'Resolved', value: grievances.filter(g => g.status === 'Resolved').length, icon: CheckCircle, color: 'bg-emerald-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-[#0a1628] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 border border-amber-400/30 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-blue-300 text-sm">Complaint Management System</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Security Warning */}
        <AlertBanner type="warning">
          <strong>⚠ Security Notice:</strong> This Admin Dashboard is a UI prototype only. It does not include authentication or authorization. In production, this page must be protected by role-based access control (RBAC) and proper server-side authorization. <strong>Do not deploy this without implementing proper security controls.</strong>
        </AlertBanner>
        <AlertBanner type="demo">
          <strong>Demo Mode:</strong> Data shown is sample data. Status updates are stored in browser session only.
        </AlertBanner>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Analytics summary */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={16} className="text-slate-500" />
              <h3 className="font-semibold text-slate-700 text-sm">Status Distribution</h3>
            </div>
            <div className="space-y-2.5">
              {Object.entries(STATUS_CONFIG).map(([status, config]) => {
                const count = grievances.filter(g => g.status === status).length;
                const pct = grievances.length ? Math.round((count / grievances.length) * 100) : 0;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 w-20 flex-shrink-0">{status}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: config.color }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-700 text-sm mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'View Open Complaints', action: () => setStatusFilter('Open') },
                { label: 'View In Progress', action: () => setStatusFilter('In Progress') },
                { label: 'View All', action: () => setStatusFilter('All') },
              ].map(({ label, action }) => (
                <button key={label} onClick={action} className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-700 transition-colors">
                  → {label}
                </button>
              ))}
              <Link
                to="/grievance/new"
                className="block text-sm px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors no-underline"
              >
                → Test: File a Grievance
              </Link>
            </div>
          </div>
        </div>

        {/* Complaint Table */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1 border border-slate-200 rounded-xl px-3 py-2">
              <Search size={14} className="text-slate-400" />
              <input
                id="admin-search-input"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search complaints..."
                className="flex-1 text-sm outline-none text-slate-700 placeholder-slate-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
              <select
                id="admin-status-filter"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUS_FILTER_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Reference', 'Subject', 'Category', 'Location', 'Status', 'Priority', 'Filed', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(g => (
                  <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">{g.id}</td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="text-sm font-medium text-slate-800 truncate">{g.subject}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{g.category}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{g.location}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={g.status} /></td>
                    <td className="px-4 py-3 whitespace-nowrap"><PriorityBadge priority={g.priority} /></td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{g.submittedAt}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedGrievance(g)}
                        id={`view-grievance-${g.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg transition-colors"
                      >
                        <Eye size={12} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-sm">No complaints match your filters.</div>
            )}
          </div>

          <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-500">
            Showing {filtered.length} of {grievances.length} complaints
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedGrievance && (
        <GrievanceDetailModal
          grievance={selectedGrievance}
          onClose={() => setSelectedGrievance(null)}
          onUpdateStatus={updateGrievanceStatus}
        />
      )}
    </div>
  );
}
