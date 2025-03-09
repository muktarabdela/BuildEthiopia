import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Code, Search, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 z-0"></div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary/20 to-transparent z-0 opacity-70"></div>

        {/* Decorative Elements */}
        <div className="absolute left-10 top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl z-0"></div>
        <div className="absolute right-10 bottom-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl z-0"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Showcase Your Projects.{' '}
              <span className="text-primary">Get Hired!</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Join Ethiopia's premier platform for developers to showcase their work,
              connect with peers, and get discovered by potential employers.
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
              <Link href="/projects/new">
                <Button size="lg" className="bg-primary text-white hover:bg-primary-dark w-full md:w-auto">
                  <Code className="mr-2 h-5 w-5" />
                  Post Your Project
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5 w-full md:w-auto">
                  <Search className="mr-2 h-5 w-5" />
                  Explore Projects
                </Button>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="flex items-center bg-white rounded-full shadow-md p-1 pl-6 border border-gray-200">
                <Search className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search for projects or developers..."
                  className="flex-1 py-3 outline-none text-gray-700"
                />
                <Button className="rounded-full">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">200+</p>
              <p className="text-gray-500">Projects Showcased</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</p>
              <p className="text-gray-500">Active Developers</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">1,000+</p>
              <p className="text-gray-500">Community Members</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">50+</p>
              <p className="text-gray-500">Hiring Companies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Projects Column */}
            <div className="w-full lg:w-[70%] space-y-16">
              {/* Trending Projects */}
              <div>
                <div className="flex items-center mb-8">
                  <TrendingUp className="h-6 w-6 text-primary mr-2" />
                  <h2 className="text-2xl md:text-3xl font-bold">Trending Projects</h2>
                </div>
                {/* <FeaturedProjects
                  projects={trendingProjects}
                  title=""
                  showHeader={false}
                /> */}
              </div>

              {/* Recent Projects */}
              <div>
                <div className="flex items-center mb-8">
                  <Clock className="h-6 w-6 text-primary mr-2" />
                  <h2 className="text-2xl md:text-3xl font-bold">Recent Projects</h2>
                </div>
                {/* <FeaturedProjects
                  projects={recentProjects}
                  title=""
                  showHeader={false}
                /> */}
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-[30%] space-y-8">
              {/* Featured Developers */}
              {/* <FeaturedDevelopers developers={featuredDevelopers} /> */}

              {/* Join Community Card */}
              <div className="bg-gradient-to-br from-primary/80 to-primary rounded-xl p-6 text-white shadow-lg">
                <h3 className="text-xl font-bold mb-3">Join Our Community</h3>
                <p className="mb-4 text-white/90">
                  Connect with other Ethiopian developers, share ideas, and grow together.
                </p>
                <Link href="/register">
                  <Button variant="secondary" className="w-full bg-white text-primary hover:bg-gray-100">
                    Sign Up Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* How It Works */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold mb-4">How It Works</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5">1</div>
                    <div>
                      <h4 className="font-medium">Create an account</h4>
                      <p className="text-sm text-gray-500">Sign up as a developer or regular user</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5">2</div>
                    <div>
                      <h4 className="font-medium">Showcase your projects</h4>
                      <p className="text-sm text-gray-500">Upload details, screenshots, and links</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5">3</div>
                    <div>
                      <h4 className="font-medium">Get feedback & connect</h4>
                      <p className="text-sm text-gray-500">Receive upvotes, comments, and job offers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">EthioDev Hub</h3>
              <p className="text-gray-400 mb-4">
                The premier platform for Ethiopian developers to showcase their work and connect with opportunities.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Explore</h4>
              <ul className="space-y-2">
                <li><Link href="/projects" className="text-gray-400 hover:text-white">Projects</Link></li>
                <li><Link href="/developers" className="text-gray-400 hover:text-white">Developers</Link></li>
                <li><Link href="/projects/new" className="text-gray-400 hover:text-white">Post a Project</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} EthioDev Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
