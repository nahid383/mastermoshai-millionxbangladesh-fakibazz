import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/context/StudentContext';
import { cn } from '@/lib/utils';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  BookOpen,
  Target,
  Clock,
  Trash2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  type: 'exam' | 'revision' | 'deadline' | 'practice';
  subject?: string;
}

const eventColors = {
  exam: 'bg-destructive/10 text-destructive border-destructive/30',
  revision: 'bg-primary/10 text-primary border-primary/30',
  deadline: 'bg-warning/10 text-warning border-warning/30',
  practice: 'bg-success/10 text-success border-success/30',
};

const eventLabels = {
  exam: { en: 'Exam', bn: 'পরীক্ষা' },
  revision: { en: 'Revision', bn: 'রিভিশন' },
  deadline: { en: 'Deadline', bn: 'ডেডলাইন' },
  practice: { en: 'Practice', bn: 'অনুশীলন' },
};

export const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useStudent();
  const useBangla = profile.medium === 'bangla';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('calendarEvents');
    return saved ? JSON.parse(saved) : [
      { id: '1', date: new Date().toISOString().split('T')[0], title: 'Physics Chapter 3', type: 'revision' as const },
      { id: '2', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], title: 'Math Mock Test', type: 'exam' as const },
      { id: '3', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], title: 'Chemistry Assignment', type: 'deadline' as const },
    ];
  });
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState<CalendarEvent['type']>('revision');

  const saveEvents = (newEvents: CalendarEvent[]) => {
    setEvents(newEvents);
    localStorage.setItem('calendarEvents', JSON.stringify(newEvents));
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    return { daysInMonth, startingDay };
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString(useBangla ? 'bn-BD' : 'en-US', { month: 'long', year: 'numeric' });
  const today = new Date().toISOString().split('T')[0];

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setAddEventOpen(true);
  };

  const handleAddEvent = () => {
    if (!selectedDate || !newEventTitle.trim()) return;
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      date: selectedDate,
      title: newEventTitle,
      type: newEventType,
    };
    saveEvents([...events, newEvent]);
    setNewEventTitle('');
    setAddEventOpen(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    saveEvents(events.filter(e => e.id !== eventId));
  };

  const upcomingEvents = events
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const weekDays = useBangla 
    ? ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {useBangla ? 'ক্যালেন্ডার' : 'Calendar'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {useBangla ? 'পরীক্ষা ও রিভিশন পরিকল্পনা' : 'Exam & revision planning'}
            </p>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="glass-card rounded-2xl p-4 mb-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="font-semibold text-foreground">{monthName}</h2>
            <Button variant="ghost" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startingDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEvents = getEventsForDate(day);
              const isToday = dateStr === today;
              
              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    'aspect-square rounded-lg flex flex-col items-center justify-center text-sm relative',
                    'hover:bg-primary/10 transition-colors',
                    isToday && 'bg-primary text-primary-foreground font-bold',
                    !isToday && 'text-foreground'
                  )}
                >
                  {day}
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-1 flex gap-0.5">
                      {dayEvents.slice(0, 3).map((event, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            event.type === 'exam' && 'bg-destructive',
                            event.type === 'revision' && 'bg-primary',
                            event.type === 'deadline' && 'bg-warning',
                            event.type === 'practice' && 'bg-success',
                          )}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-6">
          {Object.entries(eventLabels).map(([type, labels]) => (
            <div key={type} className="flex items-center gap-2">
              <div className={cn(
                'w-3 h-3 rounded-full',
                type === 'exam' && 'bg-destructive',
                type === 'revision' && 'bg-primary',
                type === 'deadline' && 'bg-warning',
                type === 'practice' && 'bg-success',
              )} />
              <span className="text-xs text-muted-foreground">
                {useBangla ? labels.bn : labels.en}
              </span>
            </div>
          ))}
        </div>

        {/* Upcoming Events */}
        <div className="glass-card rounded-2xl p-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">
              {useBangla ? 'আসন্ন ইভেন্ট' : 'Upcoming Events'}
            </h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedDate(today);
                setAddEventOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              {useBangla ? 'যোগ করুন' : 'Add'}
            </Button>
          </div>

          {upcomingEvents.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              {useBangla ? 'কোন আসন্ন ইভেন্ট নেই' : 'No upcoming events'}
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    'p-3 rounded-xl border flex items-center justify-between',
                    eventColors[event.type]
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center">
                      {event.type === 'exam' && <Target className="w-5 h-5" />}
                      {event.type === 'revision' && <BookOpen className="w-5 h-5" />}
                      {event.type === 'deadline' && <Clock className="w-5 h-5" />}
                      {event.type === 'practice' && <Target className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs opacity-70">
                        {new Date(event.date).toLocaleDateString(useBangla ? 'bn-BD' : 'en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-50 hover:opacity-100"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Event Dialog */}
      <Dialog open={addEventOpen} onOpenChange={setAddEventOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {useBangla ? 'নতুন ইভেন্ট যোগ করুন' : 'Add New Event'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{useBangla ? 'তারিখ' : 'Date'}</Label>
              <Input 
                type="date" 
                value={selectedDate || ''} 
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{useBangla ? 'শিরোনাম' : 'Title'}</Label>
              <Input 
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder={useBangla ? 'ইভেন্টের নাম' : 'Event name'}
              />
            </div>
            <div className="space-y-2">
              <Label>{useBangla ? 'ধরন' : 'Type'}</Label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(eventLabels) as [CalendarEvent['type'], typeof eventLabels.exam][]).map(([type, labels]) => (
                  <button
                    key={type}
                    onClick={() => setNewEventType(type)}
                    className={cn(
                      'p-3 rounded-xl border-2 text-sm font-medium transition-all',
                      newEventType === type
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    {useBangla ? labels.bn : labels.en}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={handleAddEvent} className="w-full" disabled={!newEventTitle.trim()}>
              {useBangla ? 'যোগ করুন' : 'Add Event'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};