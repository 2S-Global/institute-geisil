import { Link } from "react-router-dom";
import { Calendar, MessageCircle, ArrowRight, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const posts = [
  { id: 1, title: "Attract Sales And Profits", img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop&q=60", date: "August 31, 2021", comments: 12, category: "Business" },
  { id: 2, title: "5 Tips For Your Job Interviews", img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=60", date: "August 31, 2021", comments: 12, category: "Career" },
  { id: 3, title: "Overworked Newspaper Editor", img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60", date: "August 31, 2021", comments: 12, category: "Editorial" },
  { id: 4, title: "Attract Sales And Profits", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60", date: "August 31, 2021", comments: 12, category: "Business" },
  { id: 5, title: "The Future Of Remote Work", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60", date: "August 30, 2021", comments: 8, category: "Workplace" },
  { id: 6, title: "Boost Your Career In 2025", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60", date: "August 29, 2021", comments: 5, category: "Career" },
];

const categories = ["Business", "Career", "Workplace", "Editorial", "Interview", "Recruitment"];
const tags = ["Jobs", "Hiring", "Resume", "Interview", "Career", "Remote"];

export default function BlogList() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              G
            </div>
            <span className="font-bold text-lg text-foreground">GEISIL</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              Home
            </Link>
            <Link
              to="/about"
              className="text-muted-foreground hover:text-primary"
            >
              About
            </Link>
            <Link to="/blog-list" className="text-primary font-medium">
              Blog
            </Link>
            <Link
              to="/contact"
              className="text-muted-foreground hover:text-primary"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>
      {/* Page header */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 md:px-6 py-14 md:py-20">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Blog
          </h1>
          <nav className="mt-3 text-sm text-muted-foreground flex items-center gap-2">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Blog</span>
          </nav>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Posts */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {posts.map((p) => (
              <Card
                key={p.id}
                className="overflow-hidden group hover:shadow-lg transition-shadow"
              >
                <Link
                  to={`/blog-details/${p.id}`}
                  className="block overflow-hidden"
                >
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {p.date}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {p.comments} Comment
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold leading-snug mb-2">
                    <Link
                      to={`/blog-details/${p.id}`}
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      {p.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    A job ravenously while Far much that one rank beheld after
                    outside....
                  </p>
                  <Button
                    asChild
                    variant="link"
                    className="px-0 h-auto text-primary"
                  >
                    <Link to={`/blog-details/${p.id}`}>
                      Read More <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Pagination */}
            <div className="sm:col-span-2 flex justify-center gap-2 mt-4">
              {[1, 2, 3].map((n) => (
                <Button
                  key={n}
                  variant={n === 1 ? "default" : "outline"}
                  size="icon"
                  className="h-10 w-10"
                >
                  {n}
                </Button>
              ))}
              <Button variant="outline" size="icon" className="h-10 w-10">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card>
              <CardContent className="p-5">
                <h4 className="font-display font-semibold mb-3">Search</h4>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search articles…" className="pl-9" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h4 className="font-display font-semibold mb-3">Categories</h4>
                <ul className="space-y-2">
                  {categories.map((c) => (
                    <li key={c}>
                      <Link
                        to="#"
                        className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary py-1.5 border-b last:border-0"
                      >
                        <span>{c}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h4 className="font-display font-semibold mb-3">
                  Recent Posts
                </h4>
                <div className="space-y-4">
                  {posts.slice(0, 3).map((p) => (
                    <Link
                      key={p.id}
                      to={`/blog-details/${p.id}`}
                      className="flex gap-3 group"
                    >
                      <img
                        src={p.img}
                        alt={p.title}
                        className="h-16 w-16 rounded object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {p.date}
                        </p>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary line-clamp-2">
                          {p.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h4 className="font-display font-semibold mb-3 inline-flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Popular Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <Badge
                      key={t}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}
