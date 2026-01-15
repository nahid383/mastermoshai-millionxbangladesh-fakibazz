import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStudent } from '@/context/StudentContext';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  ListTodo,
  Clock,
  Star,
  Filter
} from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'study' | 'revision' | 'practice' | 'other';
  createdAt: string;
  dueDate?: string;
}

const priorityColors = {
  low: 'text-muted-foreground',
  medium: 'text-warning',
  high: 'text-destructive',
};

const categoryLabels = {
  study: { en: 'Study', bn: 'পড়া', icon: '📚' },
  revision: { en: 'Revision', bn: 'রিভিশন', icon: '🔄' },
  practice: { en: 'Practice', bn: 'অনুশীলন', icon: '✏️' },
  other: { en: 'Other', bn: 'অন্যান্য', icon: '📌' },
};

export const TodoList: React.FC = () => {
  const { profile } = useStudent();
  const useBangla = profile.medium === 'bangla';

  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todoItems');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Complete Physics Chapter 5', completed: false, priority: 'high' as const, category: 'study' as const, createdAt: new Date().toISOString() },
      { id: '2', text: 'Solve 20 Math MCQs', completed: true, priority: 'medium' as const, category: 'practice' as const, createdAt: new Date().toISOString() },
      { id: '3', text: 'Review Chemistry formulas', completed: false, priority: 'medium' as const, category: 'revision' as const, createdAt: new Date().toISOString() },
    ];
  });
  const [newTodo, setNewTodo] = useState('');
  const [newPriority, setNewPriority] = useState<Todo['priority']>('medium');
  const [newCategory, setNewCategory] = useState<Todo['category']>('study');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    localStorage.setItem('todoItems', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      priority: newPriority,
      category: newCategory,
      createdAt: new Date().toISOString(),
    };
    setTodos([todo, ...todos]);
    setNewTodo('');
    setShowAddForm(false);
  };

  const handleToggle = (id: string) => {
    setTodos(todos.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const handleDelete = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <ListTodo className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {useBangla ? 'টু-ডু লিস্ট' : 'To-Do List'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {useBangla ? 'আজকের কাজ পরিচালনা করুন' : 'Manage your daily tasks'}
              </p>
            </div>
          </div>
          <Button 
            variant="hero" 
            size="sm"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-4 h-4" />
            {useBangla ? 'নতুন' : 'New'}
          </Button>
        </div>

        {/* Progress Card */}
        <div className="glass-card rounded-2xl p-5 mb-6 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-foreground">
                {useBangla ? 'আজকের অগ্রগতি' : "Today's Progress"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {completedCount}/{totalCount} {useBangla ? 'সম্পন্ন' : 'completed'}
              </p>
            </div>
            <div className="text-3xl font-bold text-primary">{progressPercent}%</div>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Add Todo Form */}
        {showAddForm && (
          <div className="glass-card rounded-2xl p-5 mb-6 animate-slide-up">
            <div className="space-y-4">
              <Input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder={useBangla ? 'নতুন কাজ লিখুন...' : 'Enter new task...'}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                autoFocus
              />
              
              <div className="flex flex-wrap gap-4">
                {/* Priority */}
                <div className="flex-1 min-w-[120px]">
                  <p className="text-xs text-muted-foreground mb-2">{useBangla ? 'অগ্রাধিকার' : 'Priority'}</p>
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setNewPriority(p)}
                        className={cn(
                          'flex-1 py-2 rounded-lg text-xs font-medium border-2 transition-all',
                          newPriority === p
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        {p === 'low' ? '🟢' : p === 'medium' ? '🟡' : '🔴'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div className="flex-1 min-w-[200px]">
                  <p className="text-xs text-muted-foreground mb-2">{useBangla ? 'বিভাগ' : 'Category'}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {(Object.entries(categoryLabels) as [Todo['category'], typeof categoryLabels.study][]).map(([cat, labels]) => (
                      <button
                        key={cat}
                        onClick={() => setNewCategory(cat)}
                        className={cn(
                          'py-2 rounded-lg text-xs font-medium border-2 transition-all',
                          newCategory === cat
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        {labels.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddTodo} disabled={!newTodo.trim()} className="flex-1">
                  {useBangla ? 'যোগ করুন' : 'Add Task'}
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  {useBangla ? 'বাতিল' : 'Cancel'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {f === 'all' 
                ? (useBangla ? 'সব' : 'All')
                : f === 'active' 
                  ? (useBangla ? 'বাকি' : 'Active')
                  : (useBangla ? 'সম্পন্ন' : 'Completed')}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ListTodo className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{useBangla ? 'কোন কাজ নেই' : 'No tasks found'}</p>
            </div>
          ) : (
            filteredTodos.map((todo, index) => (
              <div
                key={todo.id}
                className={cn(
                  'glass-card rounded-xl p-4 flex items-center gap-4 animate-slide-up',
                  todo.completed && 'opacity-60'
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <button
                  onClick={() => handleToggle(todo.id)}
                  className="shrink-0"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  ) : (
                    <Circle className={cn('w-6 h-6', priorityColors[todo.priority])} />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'font-medium text-foreground',
                    todo.completed && 'line-through'
                  )}>
                    {todo.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs">
                      {categoryLabels[todo.category].icon}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {useBangla 
                        ? categoryLabels[todo.category].bn 
                        : categoryLabels[todo.category].en}
                    </span>
                    <span className={cn('text-xs', priorityColors[todo.priority])}>
                      • {todo.priority === 'high' ? '⚡' : todo.priority === 'medium' ? '○' : '·'} 
                      {todo.priority}
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 opacity-50 hover:opacity-100"
                  onClick={() => handleDelete(todo.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Quick Add Button (Fixed) */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        )}
      </main>
    </div>
  );
};