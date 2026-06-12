import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/context/StudentContext';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Loader2, ChevronDown, ChevronUp, Trash2, CheckCircle, AlertCircle, Sparkles, Camera, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CQPart { label: string; text: string; marks: number; }
interface CQQuestion { stimulus: string; parts: CQPart[]; totalMarks: number; }
interface PartScore { label: string; score: number; max: number; feedback: string; }
interface Evaluation {
  ocrText?: string;
  totalScore: number;
  maxScore: number;
  partScores?: PartScore[];
  overallFeedback?: string;
  strengths?: string[];
  improvements?: string[];
  modelAnswer?: string;
}
interface Submission {
  id: string;
  subject_id: string;
  subject_name: string | null;
  level: string | null;
  medium: string | null;
  mode: string;
  question: CQQuestion;
  answer_text: string | null;
  evaluation: Evaluation;
  total_score: number;
  max_score: number;
  created_at: string;
}

export const CQHistory: React.FC = () => {
  const { profile } = useStudent();
  const useBangla = profile.medium === 'bangla';
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cq_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast.error(useBangla ? 'ইতিহাস লোড হয়নি' : 'Could not load history');
    } else {
      setItems((data as unknown as Submission[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    const { error } = await supabase.from('cq_submissions').delete().eq('id', id);
    if (error) return toast.error(useBangla ? 'মুছে ফেলা যায়নি' : 'Could not delete');
    setItems(prev => prev.filter(i => i.id !== id));
    toast.success(useBangla ? 'মুছে ফেলা হয়েছে' : 'Deleted');
  };

  const avgPct = items.length
    ? Math.round((items.reduce((s, i) => s + (i.total_score / i.max_score), 0) / items.length) * 100)
    : 0;
  const bestPct = items.length
    ? Math.round(Math.max(...items.map(i => (i.total_score / i.max_score) * 100)))
    : 0;

  const fmtDate = (d: string) =>
    new Date(d).toLocaleString(useBangla ? 'bn-BD' : 'en-GB', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-6">
        <div className="glass-card rounded-2xl p-6 mb-6 bg-gradient-to-br from-orange-500/10 to-red-500/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">
                {useBangla ? 'CQ পরীক্ষার ইতিহাস' : 'CQ Exam History'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {useBangla ? 'তোমার পূর্ববর্তী জমা, নম্বর ও পরীক্ষকের মতামত' : 'Your past submissions, scores & feedback'}
              </p>
            </div>
          </div>
        </div>

        {!loading && items.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground">{useBangla ? 'মোট' : 'Total'}</p>
              <p className="text-2xl font-bold text-foreground">{items.length}</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground">{useBangla ? 'গড়' : 'Average'}</p>
              <p className="text-2xl font-bold text-primary">{avgPct}%</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground">{useBangla ? 'সর্বোচ্চ' : 'Best'}</p>
              <p className="text-2xl font-bold text-success">{bestPct}%</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-foreground font-medium mb-1">
              {useBangla ? 'কোনো জমা নেই' : 'No submissions yet'}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {useBangla ? 'প্রথম CQ পরীক্ষা দাও' : 'Take your first CQ exam'}
            </p>
            <Link to="/cq-exam">
              <Button variant="hero">{useBangla ? 'শুরু করো' : 'Start CQ Exam'}</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(it => {
              const pct = (it.total_score / it.max_score) * 100;
              const color = pct >= 80 ? 'text-success' : pct >= 60 ? 'text-primary' : pct >= 40 ? 'text-warning' : 'text-destructive';
              const isOpen = openId === it.id;
              return (
                <div key={it.id} className="glass-card rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenId(isOpen ? null : it.id)}
                    className="w-full p-4 flex items-center gap-3 text-left hover:bg-muted/20 transition-colors"
                  >
                    <div className={cn('w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0',
                      pct >= 80 ? 'from-success to-success/70' : pct >= 60 ? 'from-primary to-primary/70' : pct >= 40 ? 'from-warning to-warning/70' : 'from-destructive to-destructive/70'
                    )}>
                      <span className="text-white font-bold text-sm">{it.total_score}/{it.max_score}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground truncate">{it.subject_name || it.subject_id}</p>
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {it.mode === 'photo' ? <><Camera className="w-3 h-3" />OCR</> : <><Pencil className="w-3 h-3" />Text</>}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{fmtDate(it.created_at)}</p>
                    </div>
                    <span className={cn('text-sm font-semibold', color)}>{Math.round(pct)}%</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">{useBangla ? 'উদ্দীপক' : 'Stimulus'}</p>
                        <p className="text-sm text-foreground bg-muted/30 rounded-lg p-3">{it.question.stimulus}</p>
                        <div className="mt-2 space-y-1">
                          {it.question.parts?.map(p => (
                            <div key={p.label} className="flex gap-2 text-xs">
                              <span className="font-semibold text-primary shrink-0">({p.label}) [{p.marks}]</span>
                              <span className="text-foreground">{p.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {it.answer_text && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">
                            {it.mode === 'photo'
                              ? (useBangla ? 'OCR — পঠিত লেখা' : 'OCR — Detected Text')
                              : (useBangla ? 'তোমার উত্তর' : 'Your Answer')}
                          </p>
                          <p className="text-sm text-foreground whitespace-pre-wrap bg-muted/30 rounded-lg p-3 max-h-48 overflow-y-auto">{it.answer_text}</p>
                        </div>
                      )}

                      {it.evaluation.partScores && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-2">{useBangla ? 'অংশভিত্তিক নম্বর' : 'Part-wise Marks'}</p>
                          <div className="space-y-2">
                            {it.evaluation.partScores.map(ps => (
                              <div key={ps.label} className="border border-border rounded-lg p-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold text-sm text-foreground">({ps.label})</span>
                                  <span className={cn('font-bold text-sm', ps.score / ps.max >= 0.6 ? 'text-success' : 'text-warning')}>
                                    {ps.score}/{ps.max}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground">{ps.feedback}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {it.evaluation.overallFeedback && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">{useBangla ? 'পরীক্ষকের মন্তব্য' : 'Examiner Feedback'}</p>
                          <p className="text-sm text-foreground">{it.evaluation.overallFeedback}</p>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-3">
                        {it.evaluation.strengths && it.evaluation.strengths.length > 0 && (
                          <div className="rounded-lg p-3 bg-success/5 border border-success/20">
                            <h4 className="text-sm font-semibold text-success mb-2 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />{useBangla ? 'ভালো দিক' : 'Strengths'}
                            </h4>
                            <ul className="text-xs space-y-1">
                              {it.evaluation.strengths.map((s, i) => <li key={i} className="text-foreground">• {s}</li>)}
                            </ul>
                          </div>
                        )}
                        {it.evaluation.improvements && it.evaluation.improvements.length > 0 && (
                          <div className="rounded-lg p-3 bg-warning/5 border border-warning/20">
                            <h4 className="text-sm font-semibold text-warning mb-2 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />{useBangla ? 'উন্নতির জায়গা' : 'Areas to Improve'}
                            </h4>
                            <ul className="text-xs space-y-1">
                              {it.evaluation.improvements.map((s, i) => <li key={i} className="text-foreground">• {s}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>

                      {it.evaluation.modelAnswer && (
                        <div className="rounded-lg p-3 bg-primary/5 border border-primary/20">
                          <h4 className="text-sm font-semibold text-primary mb-1 flex items-center gap-1">
                            <Sparkles className="w-4 h-4" />{useBangla ? 'আদর্শ উত্তর' : 'Model Answer'}
                          </h4>
                          <p className="text-sm text-foreground whitespace-pre-wrap">{it.evaluation.modelAnswer}</p>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm" onClick={() => remove(it.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4 mr-1" />{useBangla ? 'মুছে ফেলো' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default CQHistory;