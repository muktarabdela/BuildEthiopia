'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    Bell,
    Menu,
    X,
    LogOut,
    Code,
    Search,
    Users,
    Home,
    UserRound
} from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthProvider';
import { Skeleton } from './ui/skeleton';

export function Navbar() {
    const { user, session, requireProfileCompletion, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [profile, setProfile] = useState<any>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        async function getSession() {
            setIsLoading(true);
            try {
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user?.id)
                        .single();
                    setProfile(profile);

                    // If user is a developer, check for unread contact requests
                    if (profile?.role === 'developer') {
                        const { count, error } = await supabase
                            .from('contact_requests')
                            .select('*', { count: 'exact', head: true })
                            .eq('developer_id', user.id)
                            .eq('is_read', false);

                        if (!error) {
                            setUnreadCount(count || 0);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching session data:', error);
            } finally {
                setIsLoading(false);
            }
        }

        getSession();
    }, [session, user]);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    const isActive = (path: string) => {
        return pathname === path;
    };
    // create function lo sign out  and clear the local storage
    const signOut = async () => {

        await supabase.auth.signOut();
        setProfile(null);
        setUnreadCount(0);
        window.location.href = '/';
    }
    // console.log(profile)

    // Handler for Add Project button (desktop and mobile)
    const handleAddProject = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        const complete = await requireProfileCompletion();
        if (complete) {
            router.push('/projects/new');
        }
        // If not complete, dialog will show automatically
    };

    if (isLoading) {
        // Skeleton Navbar
        return (
            <header className="sticky top-0 z-50 bg-gradient-to-br from-gray-900 to-gray-800 border-b border-gray-700 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo Skeleton */}
                        <div className="flex items-center space-x-2">
                            <Skeleton className="w-8 h-8 rounded-md bg-primary" />
                            <Skeleton className="h-6 w-32 rounded bg-gray-700" />
                        </div>
                        {/* Desktop Nav Skeleton */}
                        <div className="hidden md:flex items-center space-x-2 flex-1 justify-center">
                            <Skeleton className="h-8 w-20 rounded bg-gray-700" />
                            <Skeleton className="h-8 w-20 rounded bg-gray-700" />
                            <Skeleton className="h-8 w-24 rounded bg-gray-700" />
                            <Skeleton className="h-8 w-28 rounded bg-gray-700" />
                        </div>
                        {/* User Actions Skeleton */}
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />
                            <Skeleton className="h-8 w-20 rounded bg-gray-700" />
                        </div>
                        {/* Mobile Menu Button Skeleton */}
                        <div className="md:hidden flex items-center">
                            <Skeleton className="h-10 w-10 rounded-md bg-gray-700" />
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-br from-gray-900 to-gray-800 border-b border-gray-700 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo - Add hover animation */}
                    <Link href="/" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200" onClick={closeMobileMenu}>
                        <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                            <Code className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-100">BuildEthiopia</span>
                    </Link>

                    {/* Desktop Navigation - Add smooth transitions */}
                    <nav className="hidden md:flex items-center space-x-1">
                        <Link
                            href="/"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive('/')
                                ? 'text-primary bg-gray-800'
                                : 'text-gray-300 hover:text-primary hover:bg-gray-700 text-white'
                                }`}
                        >
                            <div className="flex items-center space-x-1">
                                <Home className="h-4 w-4" />
                                <span>Home</span>
                            </div>
                        </Link>
                        <Link
                            href="/projects"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive('/projects')
                                ? 'text-primary bg-gray-800'
                                : 'text-gray-300 hover:text-primary hover:bg-gray-700 text-white'
                                }`}
                        >
                            <div className="flex items-center space-x-1">
                                <Search className="h-4 w-4" />
                                <span>Explore</span>
                            </div>
                        </Link>
                        {profile?.role === 'developer' && (
                            <Button
                                onClick={handleAddProject}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${isActive('/projects/new')
                                    ? 'text-primary bg-gray-800'
                                    : 'text-gray-300 hover:text-primary hover:bg-gray-700 text-white'
                                    }`}
                                variant="ghost"
                            >
                                <Code className="h-4 w-4" />
                                <span>Post Project</span>
                            </Button>
                        )}
                        <Link
                            href="/developers"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive('/developers')
                                ? 'text-primary bg-gray-800'
                                : 'text-gray-300 hover:text-primary hover:bg-gray-700 text-white'
                                }`}
                        >
                            <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span>Developers</span>
                            </div>
                        </Link>
                    </nav>

                    {/* User Actions - Add focus states for accessibility */}
                    <div className="flex items-center space-x-2">
                        {user ? (
                            <>
                                <Link
                                    href="/profile/notifications"
                                    className="relative p-2 text-gray-300 hover:text-primary rounded-full hover:bg-gray-700 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                                >
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </Link>

                                <Link
                                    href={`/${profile?.username}`}
                                    className="hidden md:flex items-center space-x-2 p-2 text-gray-300 hover:text-primary rounded-md hover:bg-gray-700 text-white"
                                >
                                    <UserRound className="h-5 w-5" />
                                    <span className="text-sm font-medium">Profile</span>
                                </Link>
                                <div onClick={signOut} className="hidden md:block">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-gray-600 text-gray-300 hover:bg-gray-700 text-white"
                                    >
                                        <LogOut className="h-4 w-4 mr-1" />
                                        Log Out
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="hidden md:block focus:ring-2 focus:ring-primary focus:outline-none">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-center bg-primary hover:bg-primary text-white cursor-pointer transition-colors duration-200"
                                    >
                                        Log In
                                    </Button>
                                </Link>
                                {/* <Link href="/register" className="hidden md:block">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-primary hover:bg-primary-dark text-white"
                                    >
                                        Sign Up
                                    </Button>
                                </Link> */}
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-md text-gray-300 hover:text-primary hover:bg-gray-700 text-white"
                            onClick={toggleMobileMenu}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Add backdrop blur */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-gray-900/95 backdrop-blur-sm border-t border-gray-700">
                    <div className="container mx-auto px-4 py-3 space-y-1">
                        <Link
                            href="/"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/')
                                ? 'text-primary bg-gray-800'
                                : 'text-gray-300 hover:text-primary hover:bg-gray-700 text-white'
                                }`}
                            onClick={closeMobileMenu}
                        >
                            <div className="flex items-center space-x-2">
                                <Home className="h-5 w-5" />
                                <span>Home</span>
                            </div>
                        </Link>
                        <Link
                            href="/projects"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/projects')
                                ? 'text-primary bg-gray-800'
                                : 'text-gray-300 hover:text-primary hover:bg-gray-700 text-white'
                                }`}
                            onClick={closeMobileMenu}
                        >
                            <div className="flex items-center space-x-2">
                                <Search className="h-5 w-5" />
                                <span>Explore</span>
                            </div>
                        </Link>
                        {profile?.role === 'developer' && (
                            <button
                                onClick={() => { handleAddProject(); closeMobileMenu(); }}
                                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${isActive('/projects/new')
                                    ? 'text-primary bg-gray-800'
                                    : 'hover:text-primary hover:bg-gray-700 text-white'
                                    } flex items-center space-x-2`}
                                type="button"
                            >
                                <Code className="h-5 w-5" />
                                <span>Post Project</span>
                            </button>
                        )}
                        <Link
                            href="/developers"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/developers')
                                ? 'text-primary bg-gray-800'
                                : 'hover:text-primary hover:bg-gray-700 text-white'
                                }`}
                            onClick={closeMobileMenu}
                        >
                            <div className="flex items-center space-x-2">
                                <Users className="h-5 w-5" />
                                <span>Developers</span>
                            </div>
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    href={`/${profile?.username}`}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/profile')
                                        ? 'text-primary bg-gray-800'
                                        : 'hover:text-primary hover:bg-gray-700 text-white'
                                        }`}
                                    onClick={closeMobileMenu}
                                >
                                    <div className="flex items-center space-x-2">
                                        <UserRound className="h-5 w-5" />
                                        <span>Profile</span>
                                    </div>
                                </Link>
                                <div className="px-3 py-2">
                                    <Button onClick={signOut}
                                        variant="outline"
                                        className="w-full justify-center bg-primary hover:bg-primary- text-white
                                     cursor-pointer">
                                        <LogOut className="h-5 w-5 mr-2" />
                                        log Out
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col space-y-2 px-3 py-2">
                                <Link href="/login" onClick={closeMobileMenu}>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-center bg-primary hover:bg-primary-dark text-white"
                                    >
                                        Login
                                    </Button>
                                </Link>
                                {/* <Link href="/register" onClick={closeMobileMenu}>
                                    <Button
                                        variant="default"
                                        className="w-full justify-center bg-primary hover:bg-primary-dark text-white"
                                    >
                                        Sign Up
                                    </Button>
                                </Link> */}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}