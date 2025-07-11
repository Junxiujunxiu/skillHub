import { useClerk, useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import React from 'react'
import { useSidebar } from '@/components/ui/sidebar';
import { BookOpen, Briefcase, DollarSign, Settings, User } from 'lucide-react';
import Loading from './Loading';

const AppSidebar = () => {
    const {user, isLoaded} = useUser();
    const {signOut} = useClerk();
    const pathname = usePathname();
    const { toggleSidebar } = useSidebar();

    const navLinks = {
        student: [
            {icon: BookOpen, label: "Courses", href: "/user/courses"},
            {icon: Briefcase, label: "Billing", href: "/user/billing"},
            {icon: User, label: "Profile", href: "/user/profile"},
            {icon: Settings, label: "Settings", href: "/user/settings"},
        ],
        teacher: [
            {icon: BookOpen, label: "Courses", href: "/teacher/courses"},
            {icon: DollarSign, label: "Billing", href: "/teacher/billing"},
            {icon: User, label: "Profile", href: "/teacher/profile"},
            {icon: Settings, label: "Settings", href: "/teacher/settings"},
        ],
    };

    if (!isLoaded) return <Loading />;
    if (!user) return <div>User not found.</div>;

  return <Sidebar 
    collapible="icon"
}

export default AppSidebar