import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Search, Music, Globe, Sparkles, Users, Library } from "lucide-react";
import { Link } from "react-router";

export default function HomePage() {
  const featuredSongs = [
    {
      id: 1,
      title: "Sample Song Title",
      artist: "Sample Artist",
      language: "Hindi",
      author: "Sample Lyricist",
    },
    {
      id: 2,
      title: "Another Song",
      artist: "Another Artist",
      language: "Urdu",
      author: "Another Lyricist",
    },
    {
      id: 3,
      title: "Third Song",
      artist: "Third Artist",
      language: "Punjabi",
      author: "Third Lyricist",
    },
  ];

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
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Discover the Poetry in
            <span className="text-primary block">South Asian Music</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Explore multilingual lyrics with interactive translations, romanized
            text, and AI-powered interpretations. Dive deep into the rich
            literary tradition of South Asian songwriting.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for songs, artists, or lyricists..."
              className="pl-12 h-14 text-lg"
            />
            <Button className="absolute right-2 top-2 h-10">Search</Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/songs">
                <Library className="mr-2 h-5 w-5" />
                Browse All Songs
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/authors">
                <Users className="mr-2 h-5 w-5" />
                Explore Authors
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose LyricVerse?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our platform offers unique features designed to enhance your
            understanding and appreciation of South Asian musical poetry.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </section>

      {/* Featured Songs */}
      <section className="py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Songs</h2>
          <Button variant="outline" asChild>
            <Link to="/songs">View All Songs</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSongs.map((song) => (
            <Card
              key={song.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg mb-1">{song.title}</CardTitle>
                    <CardDescription>by {song.artist}</CardDescription>
                  </div>
                  <Badge variant="secondary">{song.language}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Lyrics by <span className="font-medium">{song.author}</span>
                </p>
                <Button className="w-full mt-4" variant="outline" asChild>
                  <Link to={`/songs/${song.id}`}>View Lyrics</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center bg-muted/50 rounded-lg">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Start Your Journey</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of music lovers exploring the rich tapestry of South
            Asian lyrics. Discover new meanings, learn new languages, and
            connect with the poetry that moves you.
          </p>
          <Button size="lg" asChild>
            <Link to="/songs">Explore Songs Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
