import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { subjects } from '@/lib/data';
import { useAllQuestions, useAddQuestion, useUpdateQuestion, useDeleteQuestion, DatabaseQuestion, QuestionInput } from '@/hooks/useQuestions';
import { ArrowLeft, Plus, Pencil, Trash2, Search, BookOpen, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const QuestionBank: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: questions = [], isLoading } = useAllQuestions();
  const addQuestion = useAddQuestion();
  const updateQuestion = useUpdateQuestion();
  const deleteQuestion = useDeleteQuestion();

  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<DatabaseQuestion | null>(null);

  // Form state
  const [formData, setFormData] = useState<QuestionInput>({
    subject_id: '',
    question: '',
    question_bangla: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    explanation: '',
    explanation_bangla: '',
    topic: '',
    difficulty: 'medium',
  });

  const filteredQuestions = questions.filter(q => {
    const matchesSubject = selectedSubject === 'all' || q.subject_id === selectedSubject;
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (q.question_bangla?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  const resetForm = () => {
    setFormData({
      subject_id: '',
      question: '',
      question_bangla: '',
      options: ['', '', '', ''],
      correct_answer: 0,
      explanation: '',
      explanation_bangla: '',
      topic: '',
      difficulty: 'medium',
    });
    setEditingQuestion(null);
  };

  const openEditDialog = (question: DatabaseQuestion) => {
    setEditingQuestion(question);
    setFormData({
      subject_id: question.subject_id,
      question: question.question,
      question_bangla: question.question_bangla || '',
      options: Array.isArray(question.options) ? question.options : ['', '', '', ''],
      correct_answer: question.correct_answer,
      explanation: question.explanation || '',
      explanation_bangla: question.explanation_bangla || '',
      topic: question.topic || '',
      difficulty: question.difficulty || 'medium',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject_id || !formData.question || formData.options.some(o => !o.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingQuestion) {
        await updateQuestion.mutateAsync({ id: editingQuestion.id, ...formData });
        toast({ title: "Success", description: "Question updated successfully" });
      } else {
        await addQuestion.mutateAsync(formData);
        toast({ title: "Success", description: "Question added successfully" });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save question. Please make sure you're logged in.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    try {
      await deleteQuestion.mutateAsync(id);
      toast({ title: "Success", description: "Question deleted successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    }
  };

  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.name || subjectId;
  };

  const getSubjectColor = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.color || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 h-16">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">Question Bank</h1>
                <p className="text-xs text-muted-foreground">{questions.length} questions</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Subject *</label>
                    <Select value={formData.subject_id} onValueChange={(v) => setFormData(p => ({ ...p, subject_id: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(s => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Difficulty</label>
                    <Select value={formData.difficulty} onValueChange={(v) => setFormData(p => ({ ...p, difficulty: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Topic</label>
                  <Input
                    value={formData.topic}
                    onChange={(e) => setFormData(p => ({ ...p, topic: e.target.value }))}
                    placeholder="e.g., algebra, trigonometry"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Question (English) *</label>
                  <Textarea
                    value={formData.question}
                    onChange={(e) => setFormData(p => ({ ...p, question: e.target.value }))}
                    placeholder="Enter the question"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Question (Bangla)</label>
                  <Textarea
                    value={formData.question_bangla}
                    onChange={(e) => setFormData(p => ({ ...p, question_bangla: e.target.value }))}
                    placeholder="প্রশ্ন লিখুন"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Options *</label>
                  <div className="space-y-2 mt-2">
                    {formData.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                          formData.correct_answer === i ? "bg-success text-success-foreground" : "bg-muted"
                        )}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <Input
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...formData.options];
                            newOptions[i] = e.target.value;
                            setFormData(p => ({ ...p, options: newOptions }));
                          }}
                          placeholder={`Option ${String.fromCharCode(65 + i)}`}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant={formData.correct_answer === i ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFormData(p => ({ ...p, correct_answer: i }))}
                        >
                          {formData.correct_answer === i ? 'Correct' : 'Set'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Explanation (English)</label>
                  <Textarea
                    value={formData.explanation}
                    onChange={(e) => setFormData(p => ({ ...p, explanation: e.target.value }))}
                    placeholder="Explain the correct answer"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Explanation (Bangla)</label>
                  <Textarea
                    value={formData.explanation_bangla}
                    onChange={(e) => setFormData(p => ({ ...p, explanation_bangla: e.target.value }))}
                    placeholder="সঠিক উত্তরের ব্যাখ্যা"
                    rows={2}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="hero" className="flex-1" disabled={addQuestion.isPending || updateQuestion.isPending}>
                    {(addQuestion.isPending || updateQuestion.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingQuestion ? 'Update Question' : 'Add Question'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Questions List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredQuestions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No questions found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedSubject !== 'all' 
                  ? 'Try adjusting your filters'
                  : 'Start by adding your first question'}
              </p>
              <Button variant="hero" onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredQuestions.map((q) => (
              <Card key={q.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={cn("bg-gradient-to-r text-white border-0", getSubjectColor(q.subject_id))}>
                          {getSubjectName(q.subject_id)}
                        </Badge>
                        {q.difficulty && (
                          <Badge variant="secondary" className={cn(
                            q.difficulty === 'easy' && 'bg-success/20 text-success',
                            q.difficulty === 'medium' && 'bg-warning/20 text-warning',
                            q.difficulty === 'hard' && 'bg-destructive/20 text-destructive'
                          )}>
                            {q.difficulty}
                          </Badge>
                        )}
                        {q.topic && (
                          <Badge variant="outline">{q.topic}</Badge>
                        )}
                      </div>
                      <CardTitle className="text-base font-medium leading-relaxed">
                        {q.question}
                      </CardTitle>
                      {q.question_bangla && (
                        <p className="text-sm text-muted-foreground mt-1">{q.question_bangla}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(q)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(q.id)}
                        disabled={deleteQuestion.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {(Array.isArray(q.options) ? q.options : []).map((opt, i) => (
                      <div
                        key={i}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm border",
                          i === q.correct_answer 
                            ? "bg-success/10 border-success text-success" 
                            : "bg-muted/50 border-transparent"
                        )}
                      >
                        <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <p className="text-sm text-muted-foreground mt-3 p-3 bg-muted/30 rounded-lg">
                      <strong>Explanation:</strong> {q.explanation}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
