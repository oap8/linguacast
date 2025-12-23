import { useState } from 'react';
import { User, Mail, Award, Settings, Camera, Edit2, Check, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import StatsCard from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockUser, getLevelColor } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const { toast } = useToast();

  const levelColorClass = getLevelColor(mockUser.level);

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: 'Profile updated',
      description: 'Your changes have been saved successfully.',
    });
  };

  const handleCancel = () => {
    setName(mockUser.name);
    setEmail(mockUser.email);
    setIsEditing(false);
  };

  const levelProgress = {
    beginner: { current: 0, next: 'intermediate', xpNeeded: 1000 },
    intermediate: { current: 1000, next: 'advanced', xpNeeded: 3000 },
    advanced: { current: 3000, next: 'master', xpNeeded: 5000 },
  };

  const currentLevelInfo = levelProgress[mockUser.level];
  const progressToNext = ((mockUser.progress.xp - currentLevelInfo.current) / (currentLevelInfo.xpNeeded - currentLevelInfo.current)) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn onLogout={() => {}} />

      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-10 animate-slide-up">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-soft">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="h-24 w-24 rounded-full gradient-primary flex items-center justify-center shadow-glow">
                  <span className="text-3xl font-bold text-primary-foreground">
                    {mockUser.name.charAt(0)}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-muted transition-colors">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                {isEditing ? (
                  <div className="space-y-4 max-w-sm">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSave}>
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="font-display text-2xl font-bold text-foreground mb-1">
                      {name}
                    </h1>
                    <p className="text-muted-foreground mb-3">{email}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                      <span className={cn('text-sm px-3 py-1 rounded-full border capitalize font-medium', levelColorClass)}>
                        {mockUser.level} Level
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit Profile
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <section className="mb-10 animate-fade-in">
          <h2 className="font-display text-xl font-bold text-foreground mb-4">
            Level Progress
          </h2>
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-foreground capitalize">
                {mockUser.level}
              </span>
              <span className="font-medium text-foreground capitalize">
                {currentLevelInfo.next}
              </span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden mb-2">
              <div
                className="h-full gradient-primary rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressToNext, 100)}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {mockUser.progress.xp.toLocaleString()} / {currentLevelInfo.xpNeeded.toLocaleString()} XP to reach {currentLevelInfo.next} level
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-10">
          <h2 className="font-display text-xl font-bold text-foreground mb-4">
            Your Statistics
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              icon={Award}
              label="Total XP"
              value={mockUser.progress.xp.toLocaleString()}
              variant="primary"
            />
            <StatsCard
              icon={User}
              label="Episodes Completed"
              value={mockUser.progress.episodesCompleted}
              variant="success"
            />
            <StatsCard
              icon={Settings}
              label="Day Streak"
              value={mockUser.progress.streak}
              subtext="days"
              variant="accent"
            />
            <StatsCard
              icon={Mail}
              label="Learning Time"
              value={`${Math.floor(mockUser.progress.totalMinutes / 60)}h ${mockUser.progress.totalMinutes % 60}m`}
            />
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-10">
          <h2 className="font-display text-xl font-bold text-foreground mb-4">
            Achievements
          </h2>
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { emoji: '🎯', title: 'First Lesson', desc: 'Complete your first episode' },
                { emoji: '🔥', title: '7-Day Streak', desc: 'Learn for 7 days in a row' },
                { emoji: '📚', title: 'Bookworm', desc: 'Complete 10 episodes' },
                { emoji: '⭐', title: 'Rising Star', desc: 'Earn 1,000 XP' },
              ].map((achievement, index) => (
                <div
                  key={achievement.title}
                  className="text-center p-4 rounded-xl bg-secondary/50 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="text-4xl mb-2 block">{achievement.emoji}</span>
                  <h3 className="font-display font-bold text-foreground text-sm mb-1">
                    {achievement.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{achievement.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Account Settings */}
        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-4">
            Account Settings
          </h2>
          <div className="bg-card border border-border rounded-2xl divide-y divide-border">
            <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors first:rounded-t-2xl">
              <span className="text-foreground">Notification Preferences</span>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
              <span className="text-foreground">Language Settings</span>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors last:rounded-b-2xl">
              <span className="text-destructive">Delete Account</span>
              <Settings className="h-4 w-4 text-destructive" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
