import { Link } from "react-router-dom";
import { ArrowLeft, Headphones } from "lucide-react";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow">
          <Headphones className="h-8 w-8 text-primary-foreground" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">404</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-foreground sm:text-5xl">
          Lost in Translation
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back to learning.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/dashboard">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost">Go to Home</Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
