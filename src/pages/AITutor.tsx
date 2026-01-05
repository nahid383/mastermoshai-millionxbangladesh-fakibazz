import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStudent } from '@/context/StudentContext';
import { getSubjectsByLevel } from '@/lib/data';
import { ArrowLeft, Send, Bot, User, Sparkles, Loader2, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

export const AITutor: React.FC = () => {
  const { subjectId, topicId } = useParams<{ subjectId: string; topicId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useStudent();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const useBangla = profile.medium === 'bangla';
  
  const subjects = getSubjectsByLevel(profile.level);
  const subject = subjects.find(s => s.id === subjectId);
  const topic = subject?.topics.find(t => t.id === topicId);

  useEffect(() => {
    if (topic && subject) {
      const welcomeMessage = useBangla
        ? `আসসালামু আলাইকুম! আমি মাস্টার মশাই। আজ আমরা "${topic.nameBn}" সম্পর্কে শিখব (${subject.nameBn})। এই বিষয়ে যেকোনো প্রশ্ন করতে পারেন! 📚`
        : `Assalamu Alaikum! I'm Master Moshai. Today we'll learn about "${topic.name}" (${subject.name}). Feel free to ask me anything about this topic! 📚`;
      
      setMessages([{ role: 'assistant', content: welcomeMessage }]);
    }
  }, [topic, subject, useBangla]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    let assistantContent = '';

    try {
      const systemContext = `You are Master Moshai, an expert AI teacher specializing in ${subject?.name || 'academics'}, specifically the topic "${topic?.name || 'this topic'}". 
      The student is studying for ${profile.level?.toUpperCase() || 'SSC/HSC'} exams in Bangladesh.
      ${useBangla ? 'Respond in Bangla/Bengali language.' : 'Respond in English.'}
      Be encouraging, clear, and provide examples when explaining concepts.`;

      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemContext },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage.content }
          ],
          type: 'chat'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get response');
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: 'assistant',
                  content: assistantContent
                };
                return newMessages;
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: useBangla ? 'ত্রুটি' : 'Error',
        description: error instanceof Error ? error.message : 'Failed to send message',
        variant: 'destructive'
      });
      if (!assistantContent) {
        setMessages(prev => prev.slice(0, -1));
      }
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = useBangla ? [
    `${topic?.nameBn} কী?`,
    'একটি উদাহরণ দাও',
    'এটা কেন গুরুত্বপূর্ণ?',
    'পরীক্ষায় কী ধরনের প্রশ্ন আসে?'
  ] : [
    `What is ${topic?.name}?`,
    'Give me an example',
    'Why is this important?',
    'What questions come in exams?'
  ];

  if (!subject || !topic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Topic not found</h1>
          <Button onClick={() => navigate('/learn')}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 h-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/learn/chapter/${subjectId}/${topicId}`)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">
                  {useBangla ? 'AI মাস্টার' : 'AI Master'}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {useBangla ? topic.nameBn : topic.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 px-4 py-6">
        <div className="container max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex gap-3 animate-fade-in',
                message.role === 'user' && 'flex-row-reverse'
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                message.role === 'assistant' 
                  ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
                  : 'bg-muted text-muted-foreground'
              )}>
                {message.role === 'assistant' ? (
                  <Sparkles className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div className={cn(
                'max-w-[80%] rounded-2xl px-4 py-3',
                message.role === 'assistant' 
                  ? 'bg-muted text-foreground' 
                  : 'bg-primary text-primary-foreground'
              )}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.content}
                  {message.role === 'assistant' && isLoading && index === messages.length - 1 && !message.content && (
                    <span className="inline-flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      {useBangla ? 'চিন্তা করছি...' : 'Thinking...'}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}

          {/* Suggested questions */}
          {messages.length === 1 && (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-3">
                {useBangla ? 'প্রস্তাবিত প্রশ্ন:' : 'Suggested questions:'}
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(q);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm text-foreground transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="sticky bottom-0 bg-background border-t border-border p-4">
        <div className="container max-w-4xl mx-auto flex gap-3">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={useBangla ? 'আপনার প্রশ্ন লিখুন...' : 'Type your question...'}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
