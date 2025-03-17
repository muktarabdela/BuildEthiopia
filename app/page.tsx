'use client';
import { useAuth } from "@/components/AuthProvider";
import FeaturedDevelopers from "@/components/FeaturedDevelopers";
import FeaturedProjects from "@/components/FeaturedProjects";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { ArrowRight, Clock, Code, Search, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

async function getProjects(setIsFeatureProjectsLoading: (loading: boolean) => void) {
  try {
    setIsFeatureProjectsLoading(true); // Set loading state before fetching
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        developer:profiles!projects_developer_id_fkey(id, name, profile_picture, username)
      `)
      .order('upvotes_count', { ascending: false })
      .limit(6);

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }

    return projects || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  } finally {
    setIsFeatureProjectsLoading(false); // Clear loading state after fetching
  }
}

async function getFeaturedDevelopers(setIsFeatureDeveloperLoading: (loading: boolean) => void) {
  setIsFeatureDeveloperLoading(true); // Set loading state before fetching
  try {
    const { data: developers, error } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        profile_picture,
        username,
        projects:projects!projects_developer_id_fkey(id)
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching developers:', error);
      return [];
    }

    // Transform the data to include project count
    return developers.map(dev => ({
      ...dev,
      projects_count: dev.projects ? dev.projects.length : 0
    })) || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  } finally {
    setIsFeatureDeveloperLoading(false); // Clear loading state after fetching
  }
}

export default function Home() {
  const { user, loading } = useAuth();
  // console.log("User from page:", user);
  const [trendingProjects, setTrendingProjects] = useState([]);
  const [featuredDevelopers, setFeaturedDevelopers] = useState([]);
  const [isFeatureProjectsLoading, setIsFeatureProjectsLoading] = useState(true);
  const [isFeatureDeveloperLoading, setIsFeatureDeveloperLoading] = useState(true);

  // Redirect immediately if no user
  useEffect(() => {
    if (!loading && !user) {
      // router.push('/login');
    }
  }, [user, loading]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsFeatureProjectsLoading(true); // Set loading state before fetching
        setIsFeatureDeveloperLoading(true); // Set loading state before fetching
        const [projects, developers] = await Promise.all([
          getProjects(setIsFeatureProjectsLoading),
          getFeaturedDevelopers(setIsFeatureDeveloperLoading)
        ]);
        setTrendingProjects(projects);
        setFeaturedDevelopers(developers);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsFeatureProjectsLoading(false); // Clear loading state after fetching
        setIsFeatureDeveloperLoading(false); // Clear loading state after fetching
      }
    }

    fetchData();
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* <Navbar /> */}


      {/* Hero Section */}
      <section className={`relative py-20 md:py-28 overflow-hidden ${user ? 'hidden' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 z-0"></div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary/20 to-transparent z-0 opacity-70"></div>

        {/* Decorative Elements */}
        <div className="absolute left-10 top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl z-0"></div>
        <div className="absolute right-10 bottom-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl z-0"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Showcase Your Projects.{' '}
              <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">Get Hired!</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
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
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-gray-700 w-full md:w-auto">
                  <Search className="mr-2 h-5 w-5" />
                  Explore Projects
                </Button>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="flex items-center bg-gray-800 rounded-full shadow-md p-1 pl-6 border border-gray-700">
                <Search className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search for projects or developers..."
                  className="flex-1 py-3 outline-none text-gray-300 bg-transparent"
                />
                <Button className="rounded-full bg-primary hover:bg-primary-dark">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-10 bg-gray-800 border-y border-gray-700 ${user ? 'hidden' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">200+</p>
              <p className="text-gray-300">Projects Showcased</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</p>
              <p className="text-gray-300">Active Developers</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">1,000+</p>
              <p className="text-gray-300">Community Members</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">50+</p>
              <p className="text-gray-300">Hiring Companies</p>
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
              {/* Week Featured Projects */}
              <div>
                <div className="flex items-center mb-8">
                  <TrendingUp className="h-6 w-6 text-primary mr-2" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-100">This Week Featured Projects</h2>
                </div>
                <FeaturedProjects
                  projects={trendingProjects}
                  title=""
                  showHeader={false}
                  isLoading={isFeatureProjectsLoading}
                />
              </div>

              {/* Recent Projects */}
              <div>
                <div className="flex items-center mb-8">
                  <Clock className="h-6 w-6 text-primary mr-2" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-100">Last Week Top Projects</h2>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-[30%] space-y-8">
              {/* Featured Developers */}
              <FeaturedDevelopers isLoading={isFeatureDeveloperLoading} developers={featuredDevelopers} />

              {/* Join Community Card */}
              <div className="bg-gradient-to-br from-primary/80 to-primary rounded-xl p-6 text-white shadow-lg">
                <h3 className="text-xl font-bold mb-3">Join Our Community</h3>
                <p className="mb-4 text-white/90">
                  Connect with other Ethiopian developers, share ideas, and grow together.
                </p>
                <Link href={`${user ? "/projects/new" : "/login"}`}>
                  <Button variant="secondary" className="w-full bg-white text-primary hover:bg-gray-100">
                    {user ? 'Add project' : 'Sign Up'}
                  </Button>
                </Link>
              </div>

              {/* How It Works */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-gray-100">How It Works</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5">1</div>
                    <div>
                      <h4 className="font-medium text-gray-100">Create an account</h4>
                      <p className="text-sm text-gray-300">Sign up as a developer or regular user</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5">2</div>
                    <div>
                      <h4 className="font-medium text-gray-100">Showcase your projects</h4>
                      <p className="text-sm text-gray-300">Upload details, screenshots, and links</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5">3</div>
                    <div>
                      <h4 className="font-medium text-gray-100">Get feedback & connect</h4>
                      <p className="text-sm text-gray-300">Receive upvotes, comments, and job offers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
