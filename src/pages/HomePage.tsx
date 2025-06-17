import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Music,
  Heart,
  Globe,
  Sparkles,
  Users,
  Mail,
  BookOpen,
  Languages,
  Star,
  TrendingUp,
  Clock,
  Library,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function HomePage() {
  const features = [
    {
      icon: Globe,
      title: "Multilingual Support",
      description:
        "Experience lyrics in original scripts with romanized transliterations and English translations",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Interpretations",
      description:
        "Discover deeper meanings with AI-generated poetic interpretations of each lyric line",
    },
    {
      icon: Music,
      title: "Interactive Lyrics",
      description:
        "Click on any line to explore translations, transliterations, and interpretations",
    },
    {
      icon: Users,
      title: "Author Profiles",
      description:
        "Learn about the lyricists and poets behind your favorite South Asian songs",
    },
  ];

  return (
    <div className="min-h-screen w-full">
      <div className="px-6 w-full">
        {/* Hero Section - Full Viewport */}
        <section className="min-h-screen flex flex-col justify-center items-center relative">
          <div className="w-full">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                Discover the Poetry in
                <span className="text-primary block">South Asian Music</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
                Explore multilingual lyrics with interactive translations,
                romanized text, and AI-powered interpretations. Dive deep into
                the rich literary tradition of South Asian songwriting.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button size="lg" className="text-lg px-8 py-4" asChild>
                  <Link to="/songs">
                    <Library className="mr-3 h-6 w-6" />
                    Browse All Songs
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4"
                  asChild
                >
                  <Link to="/authors">
                    <Users className="mr-3 h-6 w-6" />
                    Explore Authors
                  </Link>
                </Button>
              </div>

              <div className="flex flex-col mt-24 animate-bounce items-center text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                <span className="text-sm mb-2">Scroll to explore</span>
                <ChevronDown className="h-6 w-6" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full">
          <div className="w-full">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <feature.icon className="h-12 w-12 mx-auto text-primary mb-4" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Languages Section */}
        <section className="w-full py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Supported Languages</h2>
              <p className="text-muted-foreground">
                Explore lyrics in multiple South Asian languages
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <Languages className="h-12 w-12 mx-auto text-primary mb-4" />
                  <CardTitle>Hindi & Urdu</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Experience the rich poetry of Bollywood and classical music
                    with full transliterations and interpretations.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <BookOpen className="h-12 w-12 mx-auto text-primary mb-4" />
                  <CardTitle>Romanized Text</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Read along with easy-to-follow romanized versions of all
                    lyrics, perfect for learning pronunciation.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <Globe className="h-12 w-12 mx-auto text-primary mb-4" />
                  <CardTitle>English Translations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Understand the meaning behind every line with accurate
                    English translations and cultural context.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Artists Spotlight */}
        <section className="w-full py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">My Favourite Artists!</h2>
              <p className="text-muted-foreground">
                Discover the masters behind timeless poetry
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <CardTitle>Gulzar</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Known for his profound poetry and meaningful lyrics that
                    touch the soul.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Explore Works
                  </Button>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎭</span>
                  </div>
                  <CardTitle>Sahir Ludhianvi</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Bold verses that challenge society while celebrating human
                    emotions.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Explore Works
                  </Button>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌟</span>
                  </div>
                  <CardTitle>Javed Akhtar</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Modern poetry that bridges traditional themes with
                    contemporary expression.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Explore Works
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-3xl mb-2">
                  Ready to Explore?
                </CardTitle>
                <CardDescription className="text-lg">
                  Join the journey into South Asian musical poetry
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Whether you're a longtime fan of South Asian music or just
                  beginning to explore, Lyrix offers something for everyone.
                  Start discovering the stories behind the songs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link to="/songs">Browse Songs</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/authors">Meet the Poets</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
