import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Github, Linkedin, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  color: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Rayed',
    role: 'Team Leader',
    image: '/team/rayed.jpg',
    color: 'from-primary to-accent',
  },
  {
    name: 'Nahid',
    role: 'Full-Stack Developer',
    image: '/team/nahid.jpg',
    color: 'from-accent to-success',
  },
  {
    name: 'Saleh',
    role: 'Education Domain Expert',
    image: '/team/saleh.jpg',
    color: 'from-success to-warning',
  },
  {
    name: 'Ankit',
    role: 'Video Editor',
    image: '/team/ankit.jpg',
    color: 'from-warning to-primary',
  },
  {
    name: 'Upoma',
    role: 'Script Writer',
    image: '/team/upoma.jpg',
    color: 'from-primary to-warning',
  },
];

export const Team: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl font-bold mb-3">
            <span className="gradient-text">Meet Team Fakibazz</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            The brilliant minds behind Master-Moshai, your AI-powered learning companion for SSC & HSC students.
          </p>
        </div>

        {/* Team Photo */}
        <div className="glass-card rounded-2xl p-4 mb-12 animate-scale-in">
          <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <img 
              src="/team/team.jpg" 
              alt="Team Fakibazz" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<div class="text-center p-8"><span class="text-6xl">👥</span><p class="text-muted-foreground mt-4">Team Fakibazz</p></div>';
              }}
            />
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className="glass-card rounded-2xl p-4 text-center animate-slide-up hover:scale-105 transition-transform"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn(
                'w-20 h-20 mx-auto mb-3 rounded-2xl bg-gradient-to-br flex items-center justify-center overflow-hidden',
                member.color
              )}>
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = `<span class="text-3xl">👤</span>`;
                  }}
                />
              </div>
              <h3 className="font-semibold text-foreground">{member.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{member.role}</p>
            </div>
          ))}
        </div>

        {/* About Section */}
        <div className="glass-card rounded-2xl p-6 mb-8 animate-slide-up" style={{ animationDelay: '500ms' }}>
          <h2 className="font-semibold text-foreground mb-4 text-center">About Master-Moshai</h2>
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            Master-Moshai is an AI-powered adaptive learning platform designed specifically for Bangladeshi 
            SSC and HSC students. Our mission is to make quality education accessible to everyone, 
            whether in urban or rural areas, through personalized learning experiences in both 
            Bangla and English mediums.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p className="font-medium">MillionX Bangladesh AI Buildathon 2024</p>
          <p className="mt-1">Built with ❤️ by Team Fakibazz</p>
        </div>
      </main>
    </div>
  );
};
