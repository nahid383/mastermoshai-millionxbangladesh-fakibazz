import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { sampleQuestions } from '@/lib/data';

export interface DatabaseQuestion {
  id: string;
  subject_id: string;
  question: string;
  question_bangla: string | null;
  options: string[];
  correct_answer: number;
  explanation: string | null;
  explanation_bangla: string | null;
  topic: string | null;
  difficulty: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuestionInput {
  subject_id: string;
  question: string;
  question_bangla?: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
  explanation_bangla?: string;
  topic?: string;
  difficulty?: string;
}

// Fetch questions for a subject with optional difficulty filter
export function useSubjectQuestions(subjectId: string | undefined, difficulty?: string) {
  return useQuery({
    queryKey: ['questions', subjectId, difficulty],
    queryFn: async () => {
      if (!subjectId) return [];
      
      let query = supabase
        .from('questions')
        .select('*')
        .eq('subject_id', subjectId);
      
      if (difficulty && difficulty !== 'all') {
        query = query.eq('difficulty', difficulty);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // If no questions in DB, fall back to sample questions
      if (!data || data.length === 0) {
        let fallback = sampleQuestions
          .filter(q => q.subjectId === subjectId);
        
        if (difficulty && difficulty !== 'all') {
          fallback = fallback.filter(q => q.difficulty === difficulty);
        }
        
        return fallback.map(q => ({
          id: q.id,
          subject_id: q.subjectId,
          question: q.question,
          question_bangla: q.questionBn || null,
          options: q.options,
          correct_answer: q.correctAnswer,
          explanation: q.explanation,
          explanation_bangla: q.explanationBn || null,
          topic: q.topicId,
          difficulty: q.difficulty,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));
      }
      
      return data as DatabaseQuestion[];
    },
    enabled: !!subjectId,
  });
}

// Fetch question counts by difficulty for a subject
export function useQuestionCounts(subjectId: string | undefined) {
  return useQuery({
    queryKey: ['question-counts', subjectId],
    queryFn: async () => {
      if (!subjectId) return { easy: 0, medium: 0, hard: 0, total: 0 };

      const { data, error } = await supabase
        .from('questions')
        .select('difficulty')
        .eq('subject_id', subjectId);

      if (error) throw error;

      const counts = {
        easy: 0,
        medium: 0,
        hard: 0,
        total: data?.length || 0,
      };

      data?.forEach((q) => {
        const diff = q.difficulty || 'medium';
        if (diff === 'easy') counts.easy++;
        else if (diff === 'hard') counts.hard++;
        else counts.medium++;
      });

      return counts;
    },
    enabled: !!subjectId,
  });
}

// Fetch all questions (for question bank)
export function useAllQuestions() {
  return useQuery({
    queryKey: ['questions', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('subject_id', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as DatabaseQuestion[];
    },
  });
}

// Add a new question
export function useAddQuestion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: QuestionInput) => {
      const { data, error } = await supabase
        .from('questions')
        .insert({
          subject_id: input.subject_id,
          question: input.question,
          question_bangla: input.question_bangla || null,
          options: input.options,
          correct_answer: input.correct_answer,
          explanation: input.explanation || null,
          explanation_bangla: input.explanation_bangla || null,
          topic: input.topic || null,
          difficulty: input.difficulty || 'medium',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

// Update a question
export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...input }: QuestionInput & { id: string }) => {
      const { data, error } = await supabase
        .from('questions')
        .update({
          subject_id: input.subject_id,
          question: input.question,
          question_bangla: input.question_bangla || null,
          options: input.options,
          correct_answer: input.correct_answer,
          explanation: input.explanation || null,
          explanation_bangla: input.explanation_bangla || null,
          topic: input.topic || null,
          difficulty: input.difficulty || 'medium',
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

// Delete a question
export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}
