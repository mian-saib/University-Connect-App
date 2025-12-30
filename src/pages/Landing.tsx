import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, GraduationCap, Clock, Users, Sparkles } from "lucide-react";
import universityLogo from "@/assets/university-logo.jfif";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-university-gold/5" />
        <div className="absolute inset-0 hero-pattern opacity-30" />
        
        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12">
          <div className="flex items-center gap-3">
            <img
              src={universityLogo}
              alt="University Logo"
              className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
            />
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                University Assistant
              </h1>
              <p className="text-xs text-muted-foreground">Your 24/7 Campus Guide</p>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <main className="relative z-10 flex flex-col items-center justify-center px-6 py-20 md:py-32">
          <div className="animate-float mb-8">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-primary/20 blur-2xl animate-pulse-glow" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-university-gold shadow-glow">
                <MessageCircle className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
          </div>

          <h2 className="mb-4 text-center font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Get Instant Answers
            <span className="block bg-gradient-to-r from-primary to-university-gold bg-clip-text text-transparent">
              About Your University
            </span>
          </h2>

          <p className="mb-10 max-w-xl text-center text-lg text-muted-foreground md:text-xl">
            Have questions about admissions, fees, academics, or campus life? 
            Our AI-powered assistant is here to help you 24/7.
          </p>

          <Link to="/chat">
            <Button size="lg" className="group gap-3 rounded-full px-8 py-6 text-lg shadow-glow transition-all hover:scale-105 hover:shadow-xl">
              <MessageCircle className="h-5 w-5 transition-transform group-hover:rotate-12" />
              Chat with the Assistant
              <Sparkles className="h-4 w-4 animate-pulse" />
            </Button>
          </Link>
        </main>
      </div>

      {/* Features Section */}
      <section className="relative z-10 bg-muted/30 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h3 className="mb-12 text-center font-display text-2xl font-semibold text-foreground md:text-3xl">
            Why Use Our Assistant?
          </h3>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<Clock className="h-8 w-8" />}
              title="Available 24/7"
              description="Get answers anytime, day or night. No waiting for office hours."
            />
            <FeatureCard
              icon={<GraduationCap className="h-8 w-8" />}
              title="Campus Expert"
              description="From admissions to academics, hostel to IT support - we've got you covered."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Student-Focused"
              description="Designed specifically for students, by understanding what you need."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-background px-6 py-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} University Assistant. Powered by AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lg">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
      {icon}
    </div>
    <h4 className="mb-2 font-display text-lg font-semibold text-foreground">{title}</h4>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default Landing;
