import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronRight, Upload, AlertTriangle, ArrowLeft } from 'lucide-react';
import { GRIEVANCE_CATEGORIES } from '../data/demoData';
import { useApp } from '../context/AppContext';
import { AlertBanner, Button, Input, Textarea, Select } from '../components/UI';

const STEPS = ['Details', 'Review', 'Submitted'];

function ProgressBar({ currentStep }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              i < currentStep ? 'bg-green-500 text-white'
              : i === currentStep ? 'bg-blue-600 text-white'
              : 'bg-slate-200 text-slate-500'
            }`}>
              {i < currentStep ? <CheckCircle size={14} /> : i + 1}
            </div>
            <span className={`text-xs mt-1 ${i === currentStep ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>{step}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 w-16 mx-2 mb-4 transition-colors ${i < currentStep ? 'bg-green-500' : 'bg-slate-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

const INITIAL_FORM = {
  category: '',
  subject: '',
  description: '',
  location: '',
  attachment: null,
};

const INITIAL_ERRORS = {};

export default function GrievancePage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [submitted, setSubmitted] = useState(null);
  const { submitGrievance, currentUser } = useApp();
  const navigate = useNavigate();

  const update = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.category) errs.category = 'Please select a category';
    if (!form.subject.trim() || form.subject.length < 10) errs.subject = 'Subject must be at least 10 characters';
    if (!form.description.trim() || form.description.length < 30) errs.description = 'Description must be at least 30 characters';
    if (!form.location.trim()) errs.location = 'Please enter a location';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (validate()) setStep(1);
  };

  const handleSubmit = () => {
    const grievance = submitGrievance({
      ...form,
      submittedBy: currentUser?.name || 'Anonymous Citizen',
    });
    setSubmitted(grievance);
    setStep(2);
  };

  if (step === 2 && submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Grievance Submitted!</h2>
          <p className="text-slate-500 text-sm mb-5">
            Your complaint has been registered. Track its status using the reference number below.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
            <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">Reference Number</p>
            <p className="text-2xl font-bold text-blue-800 font-mono">{submitted.id}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-left mb-6">
            <p className="text-xs text-amber-700 flex items-start gap-2">
              <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
              <span><strong>Demo Mode:</strong> This grievance is stored locally in your browser session only. It is not submitted to any real government department.</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate('/my-grievances')} variant="primary" id="view-grievances-btn">
              View My Grievances
            </Button>
            <Button
              onClick={() => { setStep(0); setForm(INITIAL_FORM); setSubmitted(null); }}
              variant="secondary"
            >
              File Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0a1628] text-white py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-1">File a Grievance</h1>
          <p className="text-blue-300 text-sm">Submit a complaint about a government service or official</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AlertBanner type="demo" className="mb-6">
          <strong>Demo Mode:</strong> Submissions in this prototype are stored locally only and are not forwarded to any government authority.
        </AlertBanner>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
          <ProgressBar currentStep={step} />

          {step === 0 && (
            <div className="space-y-5 animate-fade-in">
              <Select
                id="grievance-category"
                label="Category *"
                value={form.category}
                onChange={e => update('category', e.target.value)}
                error={errors.category}
              >
                <option value="">Select a category...</option>
                {GRIEVANCE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>

              <Input
                id="grievance-subject"
                label="Subject *"
                value={form.subject}
                onChange={e => update('subject', e.target.value)}
                placeholder="Brief description of your complaint (min. 10 characters)"
                error={errors.subject}
                maxLength={200}
              />
              <p className="text-xs text-slate-400 -mt-3 text-right">{form.subject.length}/200</p>

              <Textarea
                id="grievance-description"
                label="Detailed Description *"
                value={form.description}
                onChange={e => update('description', e.target.value)}
                placeholder="Describe your grievance in detail. Include dates, reference numbers, names of offices visited, and any prior communication. (min. 30 characters)"
                rows={6}
                error={errors.description}
                maxLength={2000}
              />
              <p className="text-xs text-slate-400 -mt-3 text-right">{form.description.length}/2000</p>

              <Input
                id="grievance-location"
                label="Location *"
                value={form.location}
                onChange={e => update('location', e.target.value)}
                placeholder="City, State (e.g. New Delhi, Delhi)"
                error={errors.location}
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Attachment (Optional)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors cursor-pointer">
                  <Upload size={20} className="text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 5MB (Demo: files are not actually uploaded)</p>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => update('attachment', e.target.files[0]?.name)} />
                </div>
                {form.attachment && <p className="text-xs text-green-600">📎 {form.attachment} selected</p>}
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={handleNextStep} variant="primary" size="lg" id="grievance-next-btn">
                  Review Complaint <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="text-base font-semibold text-slate-800 mb-4">Review Your Complaint</h3>
              <div className="space-y-3 bg-slate-50 rounded-xl p-4 mb-6">
                {[
                  { label: 'Category', value: form.category },
                  { label: 'Subject', value: form.subject },
                  { label: 'Location', value: form.location },
                  { label: 'Attachment', value: form.attachment || 'None' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-3">
                    <span className="text-xs font-medium text-slate-500 w-24 flex-shrink-0 pt-0.5">{label}</span>
                    <span className="text-sm text-slate-800">{value}</span>
                  </div>
                ))}
                <div className="flex gap-3">
                  <span className="text-xs font-medium text-slate-500 w-24 flex-shrink-0 pt-0.5">Description</span>
                  <span className="text-sm text-slate-800 leading-relaxed">{form.description}</span>
                </div>
              </div>
              <AlertBanner type="warning">
                Please verify all details before submitting. Once submitted, you cannot edit this complaint.
              </AlertBanner>
              <div className="flex gap-3 justify-between mt-6">
                <Button onClick={() => setStep(0)} variant="secondary" id="grievance-back-btn">
                  <ArrowLeft size={14} /> Edit
                </Button>
                <Button onClick={handleSubmit} variant="primary" size="lg" id="grievance-submit-btn">
                  Submit Grievance <CheckCircle size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
