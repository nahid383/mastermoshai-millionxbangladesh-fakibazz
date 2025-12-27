import React from 'react';
import { Header } from '@/components/Header';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Flame, Zap, Medal, Crown, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface LeaderboardUser {
  id: string;
  name: string | null;
  total_points: number;
  streak: number;
  correct_answers: number;
  questions_answered: number;
}

export const Leaderboard: React.FC = () => {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, total_points, streak, correct_answers, questions_answered')
        .order('total_points', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as LeaderboardUser[];
    },
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-gray-400/30';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30';
    return 'bg-card border-border/50';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
          <p className="text-muted-foreground mt-1">Top quiz performers</p>
        </div>

        {/* YouTube Channel Card */}
        <a
          href="https://www.youtube.com/@teamfakibazzofsust"
          target="_blank"
          rel="noopener noreferrer"
          className="block glass-card rounded-2xl p-5 mb-6 animate-slide-up bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 hover:border-red-500/40 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center">
              <Youtube className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Team FakiBazz</h3>
              <p className="text-sm text-muted-foreground">Watch our tutorials on YouTube</p>
            </div>
            <Button variant="outline" size="sm" className="border-red-500/30 text-red-500 hover:bg-red-500/10">
              Subscribe
            </Button>
          </div>
        </a>

        {/* Leaderboard List */}
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))
          ) : leaderboard && leaderboard.length > 0 ? (
            leaderboard.map((user, index) => {
              const rank = index + 1;
              const accuracy = user.questions_answered > 0 
                ? Math.round((user.correct_answers / user.questions_answered) * 100) 
                : 0;
              
              return (
                <div
                  key={user.id}
                  className={cn(
                    'rounded-xl p-4 border transition-all animate-slide-up',
                    getRankBg(rank)
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="w-10 flex justify-center">
                      {getRankIcon(rank)}
                    </div>
                    
                    {/* Avatar & Name */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                          {(user.name || 'A')[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            {user.name || 'Anonymous'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {accuracy}% accuracy
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-warning">
                        <Flame className="w-4 h-4" />
                        <span className="text-sm font-semibold">{user.streak}</span>
                      </div>
                      <div className="flex items-center gap-1 text-primary">
                        <Zap className="w-4 h-4" />
                        <span className="text-sm font-semibold">{user.total_points}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No participants yet</p>
              <p className="text-sm text-muted-foreground/70">Be the first to take a quiz!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
