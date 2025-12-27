import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Target, Flame, Clock, HelpCircle } from 'lucide-react';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'all';

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty, timerEnabled: boolean) => void;
  subjectName: string;
  questionCounts: {
    easy: number;
    medium: number;
    hard: number;
    total: number;
  };
}

const difficultyConfig = {
  easy: {
    label: 'Easy',
    labelBangla: 'সহজ',
    description: 'Start with the basics',
    icon: Zap,
    color: 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20',
    badgeColor: 'bg-green-500',
    timerSeconds: 45,
  },
  medium: {
    label: 'Medium',
    labelBangla: 'মাঝারি',
    description: 'Balanced challenge',
    icon: Target,
    color: 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20',
    badgeColor: 'bg-yellow-500',
    timerSeconds: 30,
  },
  hard: {
    label: 'Hard',
    labelBangla: 'কঠিন',
    description: 'Test your mastery',
    icon: Flame,
    color: 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20',
    badgeColor: 'bg-red-500',
    timerSeconds: 20,
  },
  all: {
    label: 'Mixed',
    labelBangla: 'মিশ্র',
    description: 'All difficulty levels',
    icon: HelpCircle,
    color: 'bg-primary/10 border-primary/30 hover:bg-primary/20',
    badgeColor: 'bg-primary',
    timerSeconds: 30,
  },
};

export function DifficultySelector({ onSelect, subjectName, questionCounts }: DifficultySelectorProps) {
  const handleSelect = (difficulty: Difficulty, withTimer: boolean) => {
    onSelect(difficulty, withTimer);
  };

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold">Choose Difficulty</CardTitle>
          <CardDescription className="text-muted-foreground">
            {subjectName} Quiz • {questionCounts.total} questions available
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(['easy', 'medium', 'hard', 'all'] as Difficulty[]).map((difficulty) => {
              const config = difficultyConfig[difficulty];
              const Icon = config.icon;
              const count = difficulty === 'all' ? questionCounts.total : questionCounts[difficulty];

              return (
                <div
                  key={difficulty}
                  className={`relative rounded-xl border-2 p-4 transition-all cursor-pointer ${config.color}`}
                  onClick={() => handleSelect(difficulty, false)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${config.badgeColor}/20`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{config.label}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {count} Q
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{config.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 mb-3 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Or try Timed Mode</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['easy', 'medium', 'hard', 'all'] as Difficulty[]).map((difficulty) => {
                const config = difficultyConfig[difficulty];
                const count = difficulty === 'all' ? questionCounts.total : questionCounts[difficulty];

                return (
                  <Button
                    key={`timed-${difficulty}`}
                    variant="outline"
                    size="sm"
                    className="flex-col h-auto py-2 gap-1"
                    onClick={() => handleSelect(difficulty, true)}
                    disabled={count === 0}
                  >
                    <span className="text-xs font-medium">{config.label}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {config.timerSeconds}s
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { difficultyConfig };
