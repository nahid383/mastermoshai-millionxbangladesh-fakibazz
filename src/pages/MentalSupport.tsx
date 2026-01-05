import React, { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStudent } from '@/context/StudentContext';
import { Heart, Send, Sparkles, Smile, Frown, Meh, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const moodEmojis = [
  { emoji: '😢', label: 'Very Stressed', value: 1 },
  { emoji: '😟', label: 'Stressed', value: 3 },
  { emoji: '😐', label: 'Okay', value: 5 },
  { emoji: '🙂', label: 'Good', value: 7 },
  { emoji: '😊', label: 'Great', value: 9 },
];

export const MentalSupport: React.FC = () => {
  const { profile } = useStudent();
  const useBangla = profile.medium === 'bangla';
  
  const [mood, setMood] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startSession = async (selectedMood: number) => {
    setMood(selectedMood);
    setShowChat(true);
    setIsLoading(true);
    
    const moodLabel = moodEmojis.find(m => m.value === selectedMood)?.label || 'Unknown';
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mental-support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [],
          moodLevel: selectedMood,
          moodLabel,
          isInitial: true,
        }),
      });

      if (!response.ok) throw new Error('Failed to start session');
      
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
                  setMessages([{ role: 'assistant', content: assistantMessage }]);
                }
              } catch {}
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages([{
        role: 'assistant',
        content: useBangla 
          ? 'আসসালামু আলাইকুম! আমি তোমার সাথে কথা বলতে এখানে আছি। তুমি কেমন অনুভব করছো?'
          : 'Assalamu Alaikum! I\'m here to talk with you. How are you feeling?'
      }]);
    }
    setIsLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mental-support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages,
          moodLevel: mood,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
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

  const quickPrompts = useBangla 
    ? ['পরীক্ষার ভয় লাগছে', 'পড়ায় মন বসছে না', 'অনেক চাপ অনুভব করছি', 'ঘুম হচ্ছে না']
    : ['Exam anxiety', 'Can\'t focus on studies', 'Feeling overwhelmed', 'Can\'t sleep'];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-6 flex flex-col">
        {!showChat ? (
          /* Mood Selection */
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="glass-card rounded-3xl p-8 max-w-md w-full text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {useBangla ? 'মানসিক সহায়তা' : 'Mental Support'}
              </h1>
              <p className="text-muted-foreground mb-8">
                {useBangla 
                  ? 'আজ তুমি কেমন অনুভব করছো?' 
                  : 'How are you feeling today?'}
              </p>
              
              <div className="flex justify-center gap-4 mb-6">
                {moodEmojis.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => startSession(m.value)}
                    className={cn(
                      "w-14 h-14 rounded-2xl text-3xl flex items-center justify-center transition-all hover:scale-110",
                      "bg-card border border-border hover:border-primary hover:shadow-lg"
                    )}
                    title={m.label}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
              
              <p className="text-xs text-muted-foreground">
                {useBangla 
                  ? 'তোমার কথা সম্পূর্ণ গোপন থাকবে' 
                  : 'Your conversation is completely private'}
              </p>
            </div>
          </div>
        ) : (
          /* Chat Interface */
          <>
            {/* Mood Badge */}
            <div className="flex items-center justify-center gap-2 py-3 mb-4">
              <span className="text-2xl">
                {moodEmojis.find(m => m.value === mood)?.emoji}
              </span>
              <span className="text-sm text-muted-foreground">
                {moodEmojis.find(m => m.value === mood)?.label}
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
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

            {/* Quick Prompts */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => {
                      setInput(prompt);
                    }}
                    className="px-3 py-1.5 rounded-full bg-card border border-border text-sm hover:border-primary transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={useBangla ? 'তোমার কথা বলো...' : 'Share your thoughts...'}
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

            {/* Disclaimer */}
            <p className="text-xs text-center text-muted-foreground mt-3">
              {useBangla 
                ? 'এটি পেশাদার মানসিক স্বাস্থ্য পরামর্শের বিকল্প নয়। জরুরি সাহায্যের জন্য 16789 কল করুন।'
                : 'This is not a substitute for professional mental health care. For emergencies, call 16789.'}
            </p>
          </>
        )}
      </main>
    </div>
  );
};
