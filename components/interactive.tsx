"use client";

import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { bookingSlots } from "@/lib/content";
import { WarpBackground } from "@/components/ui/warp-background";

export type AssessmentPayload = {
  website: string;
  industry: string;
  objective: string;
  name: string;
  email: string;
};

export type BookingSelection = { date: string; time: string };

const fields = [
  ["Business context", "Website and category"],
  ["GEO goals", "What you want to be known for"],
  ["Your details", "Where to send the next steps"],
];

export function AssessmentForm() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState<AssessmentPayload>({ website: "", industry: "", objective: "", name: "", email: "" });
  const update = (key: keyof AssessmentPayload, value: string) => setData((current) => ({ ...current, [key]: value }));
  const validate = () => {
    const next: Record<string, string> = {};
    if (step === 0 && !data.website.trim()) next.website = "Add a website or primary domain.";
    if (step === 0 && !data.industry.trim()) next.industry = "Tell us your category.";
    if (step === 1 && !data.objective.trim()) next.objective = "Tell us the outcome you want to improve.";
    if (step === 2 && !data.name.trim()) next.name = "Add your name.";
    if (step === 2 && !/^\S+@\S+\.\S+$/.test(data.email)) next.email = "Add a valid email address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const next = () => { if (validate()) setStep((current) => Math.min(current + 1, 2)); };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    window.setTimeout(() => { setLoading(false); setComplete(true); }, 850);
  };
  if (complete) {
    return (
      <WarpBackground
        className="assessment-success p-[clamp(2rem,6vw,4.5rem)]"
        gridColor="color-mix(in oklch, var(--color-paper) 20%, transparent)"
        aria-live="polite"
      >
        <div className="assessment-success-copy">
          <p className="eyebrow">Signal received</p>
          <h2 className="display section-title">Your demo assessment is complete.</h2>
          <p className="lede">
            This v1 experience does not send data externally. In the live workflow, your selected contact route will receive a tailored next-step summary.
          </p>
          <a className="button button-signal" href="/book">
            Choose a demo call time <ArrowRight size={16} />
          </a>
        </div>
      </WarpBackground>
    );
  }
  return <form className="metric-card" noValidate onSubmit={submit}>
    <div className="stepper" aria-label={`Step ${step + 1} of 3`}>
      {fields.map(([label, detail], index) => <div className={`step ${index <= step ? "is-active" : ""}`} key={label}><span>{index < step ? <Check size={14} /> : index + 1}</span><div><strong>{label}</strong><small>{detail}</small></div></div>)}
    </div>
    {step === 0 && <div className="form-fields"><label>Website or primary domain<input value={data.website} onChange={(event) => update("website", event.target.value)} placeholder="yourcompany.com" aria-invalid={Boolean(errors.website)} /></label>{errors.website && <p className="form-error">{errors.website}</p>}<label>Industry / category<input value={data.industry} onChange={(event) => update("industry", event.target.value)} placeholder="e.g. B2B SaaS, healthcare, retail" aria-invalid={Boolean(errors.industry)} /></label>{errors.industry && <p className="form-error">{errors.industry}</p>}</div>}
    {step === 1 && <div className="form-fields"><label>Where do you want AI search to better understand your expertise?<textarea value={data.objective} onChange={(event) => update("objective", event.target.value)} placeholder="Describe the questions, offers, or expertise that matter most." aria-invalid={Boolean(errors.objective)} /></label>{errors.objective && <p className="form-error">{errors.objective}</p>}</div>}
    {step === 2 && <div className="form-fields"><label>Your name<input value={data.name} onChange={(event) => update("name", event.target.value)} placeholder="Name" aria-invalid={Boolean(errors.name)} /></label>{errors.name && <p className="form-error">{errors.name}</p>}<label>Work email<input type="email" value={data.email} onChange={(event) => update("email", event.target.value)} placeholder="name@company.com" aria-invalid={Boolean(errors.email)} /></label>{errors.email && <p className="form-error">{errors.email}</p>}</div>}
    <div className="form-actions">{step > 0 && <button className="button button-ghost" type="button" onClick={() => setStep((current) => current - 1)}><ArrowLeft size={16} /> Back</button>}<span style={{ flex: 1 }} />{step < 2 ? <button className="button button-primary" type="button" onClick={next}>Continue <ArrowRight size={16} /></button> : <button className="button button-signal" type="submit" disabled={loading}>{loading ? <><LoaderCircle size={16} className="spin" /> Sending</> : <>Complete demo assessment <ArrowRight size={16} /></>}</button>}</div>
  </form>;
}

export function BookingDemo() {
  const [month, setMonth] = useState(6);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const year = 2026;
  const days = useMemo(() => new Date(year, month + 1, 0).getDate(), [month]);
  const firstDay = useMemo(() => new Date(year, month, 1).getDay(), [month]);
  const dateLabel = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date(year, month, 1));
  if (confirmed && selectedDate) return <div className="cta-panel" aria-live="polite"><p className="eyebrow">Demo booking confirmed</p><h2 className="display section-title">We have held your sample slot.</h2><p className="lede">{dateLabel} {selectedDate} at {selectedTime}. This is a front-end demonstration; connect your scheduler when the live workflow is ready.</p><button className="button button-signal" type="button" onClick={() => setConfirmed(false)}>Choose another time</button></div>;
  return <div className="booking-shell">
    <div className="calendar-head"><div><p className="eyebrow">Demo availability</p><h2>{dateLabel}</h2></div><div className="calendar-controls"><button aria-label="Previous month" className="icon-button" onClick={() => setMonth((current) => Math.max(0, current - 1))} disabled={month === 0}><ChevronLeft size={18} /></button><button aria-label="Next month" className="icon-button" onClick={() => setMonth((current) => Math.min(11, current + 1))} disabled={month === 11}><ChevronRight size={18} /></button></div></div>
    <div className="calendar-grid" role="grid" aria-label={dateLabel}><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>{Array.from({ length: firstDay }, (_, index) => <i key={`empty-${index}`} aria-hidden="true" />)}{Array.from({ length: days }, (_, index) => { const day = index + 1; const enabled = day >= 6 && day <= 26 && day % 6 !== 0; return <button key={day} type="button" disabled={!enabled} className={selectedDate === day ? "is-selected" : ""} onClick={() => { setSelectedDate(day); setSelectedTime(""); }}>{day}</button>; })}</div>
    <div className="slot-panel"><div><p className="meta">Select a time</p><p>{selectedDate ? `${dateLabel} ${selectedDate}` : "Choose an available date to continue."}</p></div><div className="slot-list">{bookingSlots.map((time) => <button key={time} type="button" disabled={!selectedDate} className={selectedTime === time ? "is-selected" : ""} onClick={() => setSelectedTime(time)}>{time}</button>)}</div></div>
    <button className="button button-signal" type="button" disabled={!selectedDate || !selectedTime} onClick={() => setConfirmed(true)}>Confirm demo booking <ArrowRight size={16} /></button>
  </div>;
}
