import { Link } from 'react-router-dom';
import { Headphones, BookOpen, Mic, Trophy, ArrowRight, Play, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Headphones,
    title: 'Podcast Lessons',
    description: 'Learn through engaging audio content designed for language learners at every level.',
  },
  {
    icon: BookOpen,
    title: 'Interactive Transcripts',
    description: 'Follow along with synchronized transcripts and tap any word for instant definitions.',
  },
  {
    icon: Mic,
    title: 'Speaking Practice',
    description: 'Improve pronunciation with AI-powered speech recognition and feedback.',
  },
  {
    icon: Trophy,
    title: 'Track Progress',
    description: 'Earn XP, maintain streaks, and watch your language skills grow over time.',
  },
];

const testimonials = [
  { name: 'Sarah M.', text: 'Finally, a way to learn English that fits my commute!', rating: 5 },
  { name: 'Carlos R.', text: 'The transcripts make it so easy to follow along.', rating: 5 },
  { name: 'Yuki T.', text: 'My listening skills improved dramatically in just 2 months.', rating: 5 },
];

const Index = () => {
  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary animate-fade-in">
              <Headphones className="h-4 w-4" />
              Learn English Through Podcasts
            </div>

            <h1 className="mb-6 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl animate-slide-up">
              Master English
              <span className="block text-primary">One Episode at a Time</span>
            </h1>

            <p className="mb-10 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Transform your commute, workout, or downtime into powerful learning sessions. 
              Engaging podcasts, interactive transcripts, and personalized lessons await.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/signup">
                <Button variant="hero" size="xl" className="group">
                  Start Learning Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/library">
                <Button variant="outline" size="xl">
                  <Play className="mr-2 h-5 w-5" />
                  Browse Episodes
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div>
                <p className="font-display text-3xl font-bold text-foreground md:text-4xl">50+</p>
                <p className="text-sm text-muted-foreground">Episodes</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-foreground md:text-4xl">10K+</p>
                <p className="text-sm text-muted-foreground">Learners</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-foreground md:text-4xl">3</p>
                <p className="text-sm text-muted-foreground">Levels</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl mb-4">
              Everything You Need to Learn
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our comprehensive platform combines the best of audio learning with interactive features.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative p-6 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-display text-xl font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl mb-4">
              Loved by Learners
            </h2>
            <p className="text-muted-foreground text-lg">
              Join thousands who are already improving their English
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="p-6 rounded-2xl bg-card border border-border animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground mb-4">"{testimonial.text}"</p>
                <p className="text-sm font-medium text-muted-foreground">— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join LinguaCast today and discover the joy of learning English through podcasts.
          </p>
          <Link to="/signup">
            <Button variant="hero" size="xl">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 LinguaCast. Learn English, One Episode at a Time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
