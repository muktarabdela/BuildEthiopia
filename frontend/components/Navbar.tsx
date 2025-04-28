'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import logo from "../public/logo.png"

import {
    Bell,
    Menu,
    X,
    LogOut,
    Code,
    Search,
    Users,
    Home,
    UserRound,
    Settings,
    FolderPlus
} from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthProvider';
import { Skeleton } from './ui/skeleton';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function Navbar() {
    const { user, session, requireProfileCompletion, loading } = useAuth();
    console.log("user", user)
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
        if (!complete) {
            return; // If profile is not complete, dialog will show automatically
        }

        // Only navigate if user exists and profile is complete
        router.push('/projects/new');
    };

    // if (isLoading) {
    //     // Skeleton Navbar
    //     return (
    //         <header className="sticky top-0 z-50 bg-gradient-to-br from-gray-900 to-gray-800 border-b border-gray-700 shadow-sm">
    //             <div className="container mx-auto px-4">
    //                 <div className="flex items-center justify-between h-16">
    //                     {/* Logo Skeleton */}
    //                     <div className="flex items-center space-x-2">
    //                         <Skeleton className="w-8 h-8 rounded-md bg-primary" />
    //                         <Skeleton className="h-6 w-32 rounded bg-gray-700" />
    //                     </div>
    //                     {/* Desktop Nav Skeleton */}
    //                     <div className="hidden md:flex items-center space-x-2 flex-1 justify-center">
    //                         <Skeleton className="h-8 w-20 rounded bg-gray-700" />
    //                         <Skeleton className="h-8 w-20 rounded bg-gray-700" />
    //                         <Skeleton className="h-8 w-24 rounded bg-gray-700" />
    //                         <Skeleton className="h-8 w-28 rounded bg-gray-700" />
    //                     </div>
    //                     {/* User Actions Skeleton */}
    //                     <div className="flex items-center space-x-2">
    //                         <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />
    //                         <Skeleton className="h-8 w-20 rounded bg-gray-700" />
    //                     </div>
    //                     {/* Mobile Menu Button Skeleton */}
    //                     <div className="md:hidden flex items-center">
    //                         <Skeleton className="h-10 w-10 rounded-md bg-gray-700" />
    //                     </div>
    //                 </div>
    //             </div>
    //         </header>
    //     );
    // }

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-br from-gray-900 to-gray-800 border-b border-gray-700 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
                    {/* Modern Creative Logo */}
                    <Link
                        href="/"
                        className="flex items-center space-x-2 group"
                        onClick={closeMobileMenu}
                        aria-label="BuildUtopia Home"
                    >
                        {/* Creative logo mark */}
                        <span className="relative flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg shadow-lg">
                            <svg
                                className="w-6 h-6 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="3" y="3" width="7" height="7" rx="2" />
                                <rect x="14" y="3" width="7" height="7" rx="2" />
                                <rect x="14" y="14" width="7" height="7" rx="2" />
                                <rect x="3" y="14" width="7" height="7" rx="2" />
                            </svg>
                        </span>
                        {/* Logo text */}
                        <span className="text-2xl font-serif font-bold text-white tracking-tight leading-tight">
                            Build
                            <span className="italic text-xl font-light text-primary/90">Utopia</span>
                        </span>
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
                            <Link
                                href="/projects/new"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleAddProject();
                                }}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1 cursor-pointer ${isActive('/projects/new')
                                    ? 'text-primary bg-gray-800'
                                    : 'text-gray-300 hover:text-primary hover:bg-gray-700 text-white'
                                    }`}
                            >
                                <FolderPlus className="h-4 w-4 " />
                                <span>Post Project</span>
                            </Link>
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

                                {/* Dropdown Menu for Profile, Settings, and Logout */}
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild>
                                        <button
                                            className="hidden md:flex items-center space-x-2 p-2 text-gray-300 hover:text-primary rounded-full hover:bg-gray-700 text-white focus:outline-none"
                                            aria-label="Open user menu"
                                        >
                                            {user?.user_metadata?.avatar_url ? (
                                                <Image
                                                    src={user?.user_metadata?.avatar_url}
                                                    alt="User Avatar"
                                                    width={32}
                                                    height={32}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <UserRound className="h-5 w-5" />
                                            )}
                                        </button>
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Content
                                        className="min-w-[240px] bg-gray-800 border border-gray-700 rounded-xl shadow-2xl mt-2 p-2"
                                        sideOffset={8}
                                        align="end"
                                    >
                                        {/* User Info Header */}
                                        <div className="flex items-center space-x-3 px-2 py-3 border-b border-gray-700 mb-2">
                                            {user?.user_metadata?.avatar_url ? (
                                                <Image
                                                    src={user?.user_metadata?.avatar_url}
                                                    alt="User Avatar"
                                                    width={40}
                                                    height={40}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <UserRound className="h-8 w-8 text-primary" />
                                            )}
                                            <div>
                                                <div className="text-white font-semibold text-base truncate">
                                                    {profile?.full_name || profile?.username || "User"}
                                                </div>
                                                <div className="text-xs text-gray-400 truncate">
                                                    {user?.email}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Menu Items */}
                                        <DropdownMenu.Item
                                            className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-200 hover:bg-gray-700 hover:text-primary focus:bg-gray-700 focus:text-primary transition-colors cursor-pointer"
                                            onSelect={() => { router.push(`/${profile?.username}`); closeMobileMenu(); }}
                                            aria-label="Go to profile"
                                        >
                                            <UserRound className="h-5 w-5" />
                                            <span>Profile</span>
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item
                                            className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-200 hover:bg-gray-700 hover:text-primary focus:bg-gray-700 focus:text-primary transition-colors cursor-pointer"
                                            onSelect={() => { router.push(`/${profile?.username}/setting`); closeMobileMenu(); }}
                                            aria-label="Go to settings"
                                        >
                                            <Settings className="h-5 w-5" />
                                            <span>Settings</span>
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Separator className="my-2 h-px bg-gray-700" />
                                        <DropdownMenu.Item
                                            className="flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-gray-700 hover:text-red-500 focus:bg-gray-700 focus:text-red-500 transition-colors cursor-pointer"
                                            onClick={signOut}
                                            aria-label="Log out"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            <span>Log Out</span>
                                        </DropdownMenu.Item>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
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
                    <div className="container mx-auto px-4 py-3 space-y-2">
                        <Link
                            href="/"
                            className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${isActive('/')
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
                            className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${isActive('/projects')
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
                            <Link
                                href="/projects/new"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleAddProject();
                                }}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1 cursor-pointer ${isActive('/projects/new')
                                    ? 'text-primary bg-gray-800'
                                    : 'text-gray-300 hover:text-primary hover:bg-gray-700 text-white'
                                    }`}
                            >
                                <FolderPlus className="h-4 w-4 " />
                                <span>Post Project</span>
                            </Link>
                        )}
                        <Link
                            href="/developers"
                            className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${isActive('/developers')
                                ? 'text-primary bg-gray-800'
                                : 'text-gray-300 hover:text-primary hover:bg-gray-700 text-white'
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
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild>
                                        <button
                                            className="block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-all duration-200 text-gray-300 hover:text-primary hover:bg-gray-700 text-white focus:outline-none"
                                            aria-label="Open user menu"
                                        >
                                            <div className="flex items-center space-x-2">
                                                {user?.user_metadata?.avatar_url ? (
                                                    <Image
                                                        src={user?.user_metadata?.avatar_url}
                                                        alt="User Avatar"
                                                        width={32}
                                                        height={32}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <UserRound className="h-5 w-5" />
                                                )}
                                                <span>Profile</span>
                                            </div>
                                        </button>
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Content
                                        className="min-w-[240px] bg-gray-800 border border-gray-700 rounded-xl shadow-2xl mt-2 p-2"
                                        sideOffset={8}
                                        align="end"
                                    >
                                        {/* User Info Header */}
                                        <div className="flex items-center space-x-3 px-2 py-3 border-b border-gray-700 mb-2">
                                            {user?.user_metadata?.avatar_url ? (
                                                <Image
                                                    src={user?.user_metadata?.avatar_url}
                                                    alt="User Avatar"
                                                    width={40}
                                                    height={40}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <UserRound className="h-8 w-8 text-primary" />
                                            )}
                                            <div>
                                                <div className="text-white font-semibold text-base truncate">
                                                    {profile?.full_name || profile?.username || "User"}
                                                </div>
                                                <div className="text-xs text-gray-400 truncate">
                                                    {user?.email}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Menu Items */}
                                        <DropdownMenu.Item
                                            className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-200 hover:bg-gray-700 hover:text-primary focus:bg-gray-700 focus:text-primary transition-colors cursor-pointer"
                                            onSelect={() => { router.push(`/${profile?.username}`); closeMobileMenu(); }}
                                            aria-label="Go to profile"
                                        >
                                            <UserRound className="h-5 w-5" />
                                            <span>Profile</span>
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item
                                            className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-200 hover:bg-gray-700 hover:text-primary focus:bg-gray-700 focus:text-primary transition-colors cursor-pointer"
                                            onSelect={() => { router.push(`/${profile?.username}/setting`); closeMobileMenu(); }}
                                            aria-label="Go to settings"
                                        >
                                            <Settings className="h-5 w-5" />
                                            <span>Settings</span>
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Separator className="my-2 h-px bg-gray-700" />
                                        <DropdownMenu.Item
                                            className="flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-gray-700 hover:text-red-500 focus:bg-gray-700 focus:text-red-500 transition-colors cursor-pointer"
                                            onClick={signOut}
                                            aria-label="Log out"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            <span>Log Out</span>
                                        </DropdownMenu.Item>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                            </>
                        ) : (
                            <div className="flex flex-col space-y-2 px-3 py-2">
                                <Link href="/login" onClick={closeMobileMenu}>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-center bg-primary hover:bg-primary-dark text-white transition-colors duration-200"
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