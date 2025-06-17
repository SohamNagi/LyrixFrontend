import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Music,
  Sparkles,
  Users,
  Code,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";

export default function About() {
  const skills = [
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "Flask",
    "Spring Boot",
    "PostgreSQL",
    "MongoDB",
    "AWS",
    "Docker",
    "Tailwind CSS",
    "OpenAI API",
  ];

  return (
    <div className="min-h-screen">
      <div className="px-6 py-8 space-y-8">
        {/* Hero Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/5">
                <img
                  src="/src/images/soham.jpeg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.nextElementSibling?.classList.remove("hidden");
                  }}
                />
                <div className="hidden w-full h-full items-center justify-center">
                  <div className="text-center">
                    <Code className="h-16 w-16 text-primary mx-auto mb-2" />
                    <div className="text-sm text-muted-foreground">
                      Developer
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">Hi, I'm Soham! 👋</h1>
                <h2 className="text-xl text-primary mb-4">
                  Full Stack Developer & Music Enthusiast
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  I'm a passionate developer who loves building meaningful
                  applications that bridge cultures and languages. Lyrix is my
                  personal project born from a deep appreciation for South Asian
                  poetry and music.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About This Project */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-6 w-6 text-primary" />
              About Lyrix
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Growing up listening to beautiful Urdu and Hindi songs, I often
              found myself wondering about the deeper meanings behind the poetic
              lyrics. While I could understand some words, the full beauty and
              cultural context often remained elusive.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Lyrix is my attempt to make this rich literary tradition
              accessible to everyone - whether you're learning the language,
              rediscovering your roots, or simply curious about the profound
              poetry in South Asian music. Using modern AI and web technologies,
              I've created an interactive platform that provides translations,
              transliterations, and interpretations of song lyrics.
            </p>
          </CardContent>
        </Card>

        {/* Skills & Technologies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-6 w-6" />
              Skills & Technologies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              I work with modern web technologies to build scalable,
              user-friendly applications:
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Let's Connect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              I'm always interested in discussing technology, music, culture, or
              potential collaborations. Feel free to reach out!
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://github.com/sohamnagi"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://linkedin.com/in/sohamnagi"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:soham.nagi@uwaterloo.ca">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Fun Fact */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Fun Fact</h3>
            <p className="text-muted-foreground">
              This entire project started because I wanted to understand what
              "Tere Bina" really meant beyond just "without you" 🎵
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
