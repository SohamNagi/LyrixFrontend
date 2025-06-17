import { Button } from "@/components/ui/button";
import {
  Music,
  Globe,
  Sparkles,
  Users,
  Library,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router";
import AuthorAvatar from "@/components/AuthorAvatar";

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

  const featuredArtists = [
    {
      id: 20,
      name: "Mirza Ghalib",
      description:
        "Timeless poetry that captures love, loss, and existential depth with unmatched elegance.",
    },
    {
      id: 1,
      name: "Ahmad Faraz",
      description:
        "Rebellious and romantic verses that echo resistance and tender longing.",
    },
    {
      id: 30,
      name: "Waseem Barelvi",
      description:
        "Graceful ghazals that reflect human dignity, social insight, and emotional nuance.",
    },
  ];

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features-section");
    if (featuresSection) {
      const headerHeight = 80; // Approximate header height
      const elementPosition = featuresSection.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

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
                  variant="ghost"
                  size="lg"
                  className="text-lg border-2 px-8 py-4"
                  asChild
                >
                  <Link to="/authors">
                    <Users className="mr-3 h-6 w-6" />
                    Explore Authors
                  </Link>
                </Button>
              </div>

              <div
                className="flex flex-col mt-24 animate-bounce items-center text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={scrollToFeatures}
              >
                <span className="text-sm mb-2">Scroll to explore</span>
                <ChevronDown className="h-6 w-6" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features-section" className="w-full">
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

        {/* Featured Artists Spotlight */}
        <section className="w-full py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">My Favourite Artists</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredArtists.map((artist) => (
                <Card
                  key={artist.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AuthorAvatar
                        author={artist}
                        size="lg"
                        className="w-12 h-12"
                      />
                    </div>
                    <CardTitle>{artist.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {artist.description}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Link to={`/authors/${artist.id}`}>Browse All Songs</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* About Me Section */}
        <section className="w-full py-16">
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Text Content */}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold mb-4">About Me</h2>
                      <div className="w-12 h-1 bg-primary rounded-full mb-2"></div>
                    </div>
                    <div className="text-muted-foreground leading-relaxed">
                      <p>
                        I'm a passionate full stack developer
                        and lover of South Asian poetry and music. I created
                        Lyrix to bridge the gap between beautiful traditional
                        poetry and modern technology.
                      </p>
                      <p>
                        Growing up listening to beautiful Urdu and Hindi songs,
                        I often found myself wondering about the deeper meanings
                        behind the poetic lyrics. While I could understand some
                        words, the full beauty and cultural context often
                        remained elusive.
                      </p>
                      <p>
                        Lyrix is my attempt to make this rich literary tradition
                        accessible to everyone - whether you're learning the
                        language, rediscovering your roots, or simply curious
                        about the profound poetry in South Asian music.
                      </p>
                    </div>
                  </div>

                  {/* Photo */}
                  <div className="relative h-64 md:h-full min-h-[400px] bg-gradient-to-br from-primary/10 to-primary/5">
                    <img
                      src="/src/images/soham.jpeg"
                      alt="Soham"
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image doesn't exist
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement!.innerHTML = `
                          <div class="absolute inset-0 flex items-center justify-center">
                            <div class="text-center">
                              <div class="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span class="text-2xl font-bold text-primary">SN</span>
                              </div>
                              <p class="text-muted-foreground">Soham Nagi</p>
                            </div>
                          </div>
                        `;
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
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
                  <Button size="lg" className="border-2" variant="outline" asChild>
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
