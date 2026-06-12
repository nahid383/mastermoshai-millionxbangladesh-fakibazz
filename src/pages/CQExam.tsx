import React, { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useStudent } from '@/context/StudentContext';
import { getSubjectsByLevel } from '@/lib/data';
import { FileText, Loader2, Upload, Camera, Send, CheckCircle, AlertCircle, RotateCcw, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CQPart { label: string; text: string; marks: number; }
interface CQQuestion { stimulus: string; parts: CQPart[]; totalMarks: number; }
interface PartScore { label: string; score: number; max: number; feedback: string; }
interface Evaluation {
  ocrText: string;
  totalScore: number;
  maxScore: number;
  partScores: PartScore[];
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  modelAnswer: string;
}

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cq-checker`;
const AUTH = `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`;

const fileToBase64 = (file: File): Promise<{ data: string; mime: string }> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const result = r.result as string;
      const [, data] = result.split(',');
      resolve({ data, mime: file.type || 'image/jpeg' });
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });

export const CQExam: React.FC = () => {
  const { profile } = useStudent();
  const useBangla = profile.medium === 'bangla';
  const subjects = getSubjectsByLevel(profile.level as 'ssc' | 'hsc');

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [cq, setCq] = useState<CQQuestion | null>(null);
  const [loadingQ, setLoadingQ] = useState(false);

  const [mode, setMode] = useState<'text' | 'photo'>('text');
  const [answerText, setAnswerText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<Evaluation | null>(null);

  const generateQuestion = async (subjectId: string) => {
    setSelectedSubject(subjectId);
    setLoadingQ(true);
    setCq(null);
    setResult(null);
    setAnswerText('');
    setImageFile(null);
    setImagePreview('');
    try {
      const subj = subjects.find(s => s.id === subjectId);
      const r = await fetch(FN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: AUTH },
        body: JSON.stringify({
          mode: 'generate',
          subject: useBangla ? subj?.nameBn : subj?.name,
          level: profile.level,
          medium: profile.medium,
        }),
      });
      if (!r.ok) throw new Error('Failed');
      const data = await r.json();
      setCq(data);
    } catch (e) {
      toast.error(useBangla ? 'প্রশ্ন তৈরি করতে সমস্যা' : 'Could not generate question');
    }
    setLoadingQ(false);
  };

  const onFile = async (f: File | null) => {
    if (!f) return;
    if (f.size > 8 * 1024 * 1024) {
      toast.error(useBangla ? 'ছবি ৮ MB এর কম হতে হবে' : 'Image must be under 8 MB');
      return;
    }
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const submit = async () => {
    if (!cq) return;
    if (mode === 'text' && !answerText.trim()) {
      toast.error(useBangla ? 'উত্তর লেখো' : 'Write your answer');
      return;
    }
    if (mode === 'photo' && !imageFile) {
      toast.error(useBangla ? 'ছবি আপলোড করো' : 'Upload a photo');
      return;
    }
    setEvaluating(true);
    setResult(null);
    try {
      const subj = subjects.find(s => s.id === selectedSubject);
      let imageBase64: string | undefined;
      let imageMime: string | undefined;
      if (mode === 'photo' && imageFile) {
        const enc = await fileToBase64(imageFile);
        imageBase64 = enc.data;
        imageMime = enc.mime;
      }
      const questionText = `Stimulus: ${cq.stimulus}\n\n` +
        cq.parts.map(p => `(${p.label}) [${p.marks}] ${p.text}`).join('\n');

      const r = await fetch(FN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: AUTH },
        body: JSON.stringify({
          mode: 'evaluate',
          subject: useBangla ? subj?.nameBn : subj?.name,
          level: profile.level,
          medium: profile.medium,
          question: questionText,
          answerText: mode === 'text' ? answerText : '',
          imageBase64,
          imageMime,
        }),
      });
      if (!r.ok) throw new Error('eval failed');
      const data = await r.json();
      setResult(data);
    } catch (e) {
      toast.error(useBangla ? 'মূল্যায়নে সমস্যা' : 'Evaluation failed');
    }
    setEvaluating(false);
  };

  const reset = () => {
    setCq(null);
    setResult(null);
    setAnswerText('');
    setImageFile(null);
    setImagePreview('');
    setSelectedSubject(null);
  };

  const pct = result ? (result.totalScore / result.maxScore) * 100 : 0;
  const scoreColor = pct >= 80 ? 'text-success' : pct >= 60 ? 'text-primary' : pct >= 40 ? 'text-warning' : 'text-destructive';
  const scoreBg = pct >= 80 ? 'from-success to-success/80' : pct >= 60 ? 'from-primary to-primary/80' : pct >= 40 ? 'from-warning to-warning/80' : 'from-destructive to-destructive/80';

  // ============= Subject selection =============
  if (!selectedSubject) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container max-w-4xl mx-auto px-4 py-6">
          <div className="glass-card rounded-2xl p-6 mb-6 bg-gradient-to-br from-orange-500/10 to-red-500/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {useBangla ? 'সৃজনশীল প্রশ্ন (CQ) পরীক্ষা' : 'Creative Question (CQ) Exam'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {useBangla ? 'উত্তর লেখো বা হাতের লেখা ছবি আপলোড করো — AI OCR দিয়ে যাচাই করবে' : 'Write answer or upload a photo of your handwritten script — AI will OCR & grade it'}
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-foreground mb-4">
            {useBangla ? 'বিষয় বেছে নাও' : 'Choose Subject'}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {subjects.map((s, i) => (
              <button
                key={s.id}
                onClick={() => generateQuestion(s.id)}
                className="glass-card rounded-xl p-5 hover:border-primary transition-all animate-slide-up text-left"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="text-3xl mb-3 block">{s.icon}</span>
                <h3 className="font-semibold text-foreground">{useBangla ? s.nameBn : s.name}</h3>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={reset} className="text-sm text-muted-foreground hover:text-foreground">
            ← {useBangla ? 'বিষয় পরিবর্তন' : 'Change Subject'}
          </button>
          <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
            {useBangla ? 'সৃজনশীল প্রশ্ন' : 'CQ'}
          </div>
        </div>

        {loadingQ && (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">{useBangla ? 'প্রশ্ন তৈরি হচ্ছে...' : 'Generating question...'}</p>
          </div>
        )}

        {cq && !result && (
          <div className="space-y-6 animate-slide-up">
            {/* Question Card */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">
                  {useBangla ? 'উদ্দীপক' : 'Stimulus'}
                </h3>
                <button
                  onClick={() => generateQuestion(selectedSubject)}
                  className="text-xs text-primary flex items-center gap-1 hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  {useBangla ? 'নতুন প্রশ্ন' : 'New Question'}
                </button>
              </div>
              <p className="text-foreground bg-muted/30 rounded-lg p-3 mb-4 leading-relaxed">{cq.stimulus}</p>
              <div className="space-y-2">
                {cq.parts.map(p => (
                  <div key={p.label} className="flex gap-3 text-sm">
                    <span className="font-semibold text-primary shrink-0">({p.label}) [{p.marks}]</span>
                    <span className="text-foreground">{p.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mode toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setMode('text')}
                className={cn(
                  'flex-1 p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 text-sm font-medium',
                  mode === 'text' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'
                )}
              >
                <FileText className="w-4 h-4" />
                {useBangla ? 'টাইপ করো' : 'Type Answer'}
              </button>
              <button
                onClick={() => setMode('photo')}
                className={cn(
                  'flex-1 p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 text-sm font-medium',
                  mode === 'photo' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'
                )}
              >
                <Camera className="w-4 h-4" />
                {useBangla ? 'ছবি আপলোড' : 'Upload Photo'}
              </button>
            </div>

            {mode === 'text' ? (
              <Textarea
                value={answerText}
                onChange={e => setAnswerText(e.target.value)}
                placeholder={useBangla ? 'এখানে চারটি অংশের (ক, খ, গ, ঘ) উত্তর লেখো...' : 'Write your answers to all 4 parts (a, b, c, d) here...'}
                className="min-h-[280px]"
              />
            ) : (
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={e => onFile(e.target.files?.[0] || null)}
                />
                {!imagePreview ? (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full border-2 border-dashed border-border hover:border-primary rounded-2xl p-10 flex flex-col items-center gap-3 transition-colors"
                  >
                    <Upload className="w-10 h-10 text-muted-foreground" />
                    <div className="text-center">
                      <p className="font-medium text-foreground">
                        {useBangla ? 'উত্তরপত্রের ছবি তোলো বা আপলোড করো' : 'Take or upload a photo of your answer script'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {useBangla ? 'JPG / PNG · সর্বোচ্চ ৮ MB' : 'JPG / PNG · max 8 MB'}
                      </p>
                    </div>
                  </button>
                ) : (
                  <div className="relative">
                    <img src={imagePreview} alt="answer script" className="w-full rounded-2xl border border-border" />
                    <button
                      onClick={() => { setImageFile(null); setImagePreview(''); }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/90 backdrop-blur flex items-center justify-center border border-border hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {useBangla ? 'AI স্বয়ংক্রিয়ভাবে হাতের লেখা পড়বে (OCR)' : 'AI will OCR the handwriting automatically'}
                    </p>
                  </div>
                )}
              </div>
            )}

            <Button variant="hero" size="lg" className="w-full" onClick={submit} disabled={evaluating}>
              {evaluating ? (
                <><Loader2 className="w-5 h-5 animate-spin" />{useBangla ? 'মূল্যায়ন হচ্ছে...' : 'Evaluating...'}</>
              ) : (
                <><Send className="w-5 h-5" />{useBangla ? 'জমা দাও' : 'Submit'}</>
              )}
            </Button>
          </div>
        )}

        {result && (
          <div className="space-y-6 animate-slide-up">
            <div className="glass-card rounded-2xl p-6 text-center">
              <div className={cn('w-28 h-28 rounded-full bg-gradient-to-br flex items-center justify-center mx-auto mb-4', scoreBg)}>
                <span className="text-3xl font-bold text-white">{result.totalScore}/{result.maxScore}</span>
              </div>
              <p className={cn('text-lg font-semibold', scoreColor)}>
                {pct >= 80 ? (useBangla ? 'চমৎকার!' : 'Excellent!') : pct >= 60 ? (useBangla ? 'ভালো!' : 'Good!') : (useBangla ? 'উন্নতি প্রয়োজন' : 'Needs Improvement')}
              </p>
            </div>

            {result.ocrText && (
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  {useBangla ? 'OCR — পঠিত লেখা' : 'OCR — Detected Text'}
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/30 rounded-lg p-3 max-h-64 overflow-y-auto">{result.ocrText}</p>
              </div>
            )}

            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-3">{useBangla ? 'অংশভিত্তিক নম্বর' : 'Part-wise Marks'}</h3>
              <div className="space-y-3">
                {result.partScores?.map(ps => (
                  <div key={ps.label} className="border border-border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-foreground">({ps.label})</span>
                      <span className={cn('font-bold', ps.score / ps.max >= 0.6 ? 'text-success' : 'text-warning')}>
                        {ps.score}/{ps.max}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{ps.feedback}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-2">{useBangla ? 'পরীক্ষকের মন্তব্য' : 'Examiner Feedback'}</h3>
              <p className="text-sm text-muted-foreground">{result.overallFeedback}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass-card rounded-xl p-5 bg-success/5 border-success/20">
                <h3 className="font-semibold text-success mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />{useBangla ? 'ভালো দিক' : 'Strengths'}
                </h3>
                <ul className="space-y-1 text-sm">
                  {result.strengths?.map((s, i) => <li key={i} className="text-foreground">• {s}</li>)}
                </ul>
              </div>
              <div className="glass-card rounded-xl p-5 bg-warning/5 border-warning/20">
                <h3 className="font-semibold text-warning mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />{useBangla ? 'উন্নতির জায়গা' : 'Areas to Improve'}
                </h3>
                <ul className="space-y-1 text-sm">
                  {result.improvements?.map((s, i) => <li key={i} className="text-foreground">• {s}</li>)}
                </ul>
              </div>
            </div>

            {result.modelAnswer && (
              <div className="glass-card rounded-2xl p-5 bg-primary/5 border-primary/20">
                <h3 className="font-semibold text-primary mb-2">{useBangla ? 'আদর্শ উত্তর' : 'Model Answer'}</h3>
                <p className="text-sm text-foreground whitespace-pre-wrap">{result.modelAnswer}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setResult(null); setAnswerText(''); setImageFile(null); setImagePreview(''); }} className="flex-1">
                {useBangla ? 'আবার চেষ্টা' : 'Try Again'}
              </Button>
              <Button variant="hero" onClick={() => generateQuestion(selectedSubject)} className="flex-1">
                {useBangla ? 'নতুন প্রশ্ন' : 'New Question'}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};