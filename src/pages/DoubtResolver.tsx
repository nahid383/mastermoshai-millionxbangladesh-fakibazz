import React, { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStudent } from '@/context/StudentContext';
import { getSubjectsByLevel } from '@/lib/data';
import { MessageCircle, Send, Loader2, Sparkles, BookOpen, Camera, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const DoubtResolver: React.FC = () => {
  const { profile } = useStudent();
  const useBangla = profile.medium === 'bangla';
  const subjects = getSubjectsByLevel(profile.level as 'ssc' | 'hsc');
  
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/doubt-resolver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages,
          subject: selectedSubject,
          level: profile.level,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      
      let assistantMessage = '';
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const json = JSON.parse(line.slice(6));
                const content = json.choices?.[0]?.delta?.content;
                if (content) {
                  assistantMessage += content;
                  setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
                }
              } catch {}
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages([...newMessages, {
        role: 'assistant',
        content: useBangla 
          ? 'দুঃখিত, এই মুহূর্তে সমস্যা হচ্ছে। আবার চেষ্টা করো।'
          : 'Sorry, there was an issue. Please try again.'
      }]);
    }
    setIsLoading(false);
  };

  const quickQuestions = useBangla
    ? [
        'এই সূত্রটি ব্যাখ্যা করো',
        'এই সমস্যাটি সমাধান করো',
        'এই বিষয়টি বুঝতে পারছি না',
        'উদাহরণ দিয়ে বোঝাও',
      ]
    : [
        'Explain this formula',
        'Solve this problem',
        'I don\'t understand this topic',
        'Give me an example',
      ];

  if (!selectedSubject) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container max-w-4xl mx-auto px-4 py-6">
          {/* Hero */}
          <div className="glass-card rounded-2xl p-6 mb-6 bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {useBangla ? 'স্মার্ট ডাউট সলভার' : 'Smart Doubt Resolver'}
                </h1>
                <p className="text-muted-foreground">
                  {useBangla ? '২৪/৭ যেকোনো সময় প্রশ্ন করো' : '24/7 Ask any question anytime'}
                </p>
              </div>
            </div>
          </div>

          {/* Subject Selection */}
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {useBangla ? 'বিষয় বেছে নাও' : 'Choose Subject'}
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {subjects.map((subject, index) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id)}
                className="glass-card rounded-xl p-5 hover:border-primary transition-all animate-slide-up text-left"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-3xl mb-3 block">{subject.icon}</span>
                <h3 className="font-semibold text-foreground">
                  {useBangla ? subject.nameBn : subject.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {subject.topics.length} {useBangla ? 'টি টপিক' : 'topics'}
                </p>
              </button>
            ))}
          </div>

          {/* General Chat Option */}
          <button
            onClick={() => setSelectedSubject('general')}
            className="w-full mt-4 glass-card rounded-xl p-5 hover:border-primary transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground">
                {useBangla ? 'সাধারণ প্রশ্ন' : 'General Question'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {useBangla ? 'যেকোনো বিষয়ে প্রশ্ন করো' : 'Ask about anything'}
              </p>
            </div>
          </button>
        </main>
      </div>
    );
  }

  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Subject Badge */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-2">
        <div className="container max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => { setSelectedSubject(null); setMessages([]); }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            ← {useBangla ? 'বিষয় পরিবর্তন' : 'Change Subject'}
          </button>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
            <span>{selectedSubjectData?.icon || '📚'}</span>
            <span>{useBangla ? (selectedSubjectData?.nameBn || 'সাধারণ') : (selectedSubjectData?.name || 'General')}</span>
          </div>
        </div>
      </div>
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-4 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">
                {useBangla ? 'তোমার প্রশ্ন কী?' : 'What\'s your question?'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {useBangla 
                  ? 'যেকোনো কনসেপ্ট, সমস্যা বা টপিক নিয়ে প্রশ্ন করো'
                  : 'Ask about any concept, problem, or topic'}
              </p>
              
              {/* Quick Questions */}
              <div className="flex flex-wrap justify-center gap-2">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="px-3 py-1.5 rounded-full bg-card border border-border text-sm hover:border-primary transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                "flex",
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3",
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-card border border-border rounded-bl-sm'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          {/* Quick Topics */}
          {selectedSubjectData && messages.length === 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {selectedSubjectData.topics.slice(0, 4).map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setInput(`${useBangla ? topic.nameBn : topic.name} ${useBangla ? 'সম্পর্কে বলো' : 'explain'}`)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80"
                >
                  {useBangla ? topic.nameBn : topic.name}
                </button>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={useBangla ? 'তোমার প্রশ্ন লেখো...' : 'Type your question...'}
              className="flex-1 rounded-full"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="rounded-full"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            {useBangla 
              ? 'মাস্টার মশাই AI তোমার সব প্রশ্নের উত্তর দিতে প্রস্তুত'
              : 'Master Moshai AI is ready to answer all your questions'}
          </p>
        </div>
      </main>
    </div>
  );
};
