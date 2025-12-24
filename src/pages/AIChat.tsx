import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStudent } from '@/context/StudentContext';
import { ArrowLeft, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

export const AIChat: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useStudent();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const useBangla = profile.medium === 'bangla';

  useEffect(() => {
    // Add welcome message
    setMessages([{
      role: 'assistant',
      content: useBangla 
        ? 'আসসালামু আলাইকুম! আমি মাস্টার মশাই, আপনার AI শিক্ষা সঙ্গী। SSC, HSC বা ভর্তি পরীক্ষা সম্পর্কে যেকোনো প্রশ্ন করুন! 📚'
        : 'Assalamu Alaikum! I\'m Master Moshai, your AI learning companion. Ask me anything about SSC, HSC, or admission exams! 📚'
    }]);
  }, [useBangla]);

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
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
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

      // Add empty assistant message that we'll update
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
            // Incomplete JSON, put it back
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
      // Remove the empty assistant message if there was an error
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
    'নিউটনের গতিসূত্র ব্যাখ্যা কর',
    'কোষ বিভাজন কী?',
    'জৈব যৌগ কী?',
    'ভর্তি পরীক্ষার টিপস দাও'
  ] : [
    'Explain Newton\'s laws of motion',
    'What is cell division?',
    'What are organic compounds?',
    'Give tips for admission exams'
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 h-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">
                  {useBangla ? 'মাস্টার মশাই AI' : 'Master Moshai AI'}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {useBangla ? 'আপনার শিক্ষা সঙ্গী' : 'Your Learning Companion'}
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
                  ? 'bg-gradient-to-br from-primary to-accent text-white'
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

          {/* Suggested questions for empty chat */}
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
