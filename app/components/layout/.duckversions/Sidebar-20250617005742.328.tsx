// @/app/components/layout/Sidebar.tsx
"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react"


//import { useAuth } from '@/app/context/AuthContext';
import { UserType, navigationType } from '@/app/lib/types';
import { 
  Home, Music, Mic2, Library,  Binoculars, Search, PlusSquare, 

  PlusCircle,

  Globe,
  Share,
  User,

  Users,

  Tv,

  LayoutDashboard,
  ChevronDown,
  ChevronUp,
  Heart, Settings, LogOut, LayoutGrid, Menu, X, User as UserIcon, LogIn, UserPlus, 
  Upload
} from 'lucide-react';
import { useRouter } from 'next/router';


export default function Sidebar() {


 // import { useSession } from "next-auth/react";

    const { data: session } = useSession()
   // const { user } = useAuth();
  const user:UserType|undefined = session?.user;

  const pathname = usePathname();
  //const { user, logout } = useAuth();

  //const { user, isAuthenticated, logout } = useAuth();
  const [isMyWorldOpen, setIsMyWorldOpen] = useState(false);
  const [openParent, setOpenParent] = useState <string|null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const IsArtist =user?.IsArtist==="1";
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

 
  async function handleClick(item:navigationType){

    if(item.href=="#"){


if(openParent===item.name){

  setOpenParent(null)

} else {
setOpenParent(item.name)


    }


console.log("The active is =", openParent);
 
  }

}


  const navigation: navigationType[]= user ? [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Discover', href: '/discover', icon: Binoculars },

    { name: 'Search', href: '#', icon: Search },
    { name: 'Library', href: '/library', icon: Library, childOf: 'Search'},
    { name: 'Connect', href: '/connect', icon: Share, childOf: 'Search'},
    { name: 'Playlists', href: '/playlists', icon: Music , childOf: 'Search'},
    { name: 'Artists', href: '/artists', icon: Mic2, childOf: 'Search'},
    { name: 'Distribute', href: '/distribute', icon: Library },
    { name: 'Music Upload', href: '/song/upload', icon: Upload },
    //{ name: 'My Music', href: '#', icon: Search},
    //{ name: '-Home', href: '/myjams', icon: Music, childOf: 'My Music'},
    //{ name: '-Zone', href: '/myzone', icon: User, childOf: 'My Music'},
    //{ name: '-People', href: '/mypeople', icon: Users, childOf: 'My Music'},
   // { name: 'Create Playlist', href: '/playlists/create', icon: PlusSquare },
   // { name: 'Liked Songs', href: '/liked', icon: Heart },
   // { name: 'Music World', href: '/musicworld', icon: Globe },

  ] : [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Discover', href: '/discover', icon: Binoculars },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Music World', href: '/musicworld', icon: Globe },

    









  ];

  const authLinks = !user ? [
    { name: 'Sign In', href: '/signin', icon: UserIcon},
    { name: 'Sign Up', href: '/signup', icon: UserPlus},


    //{ name: 'Sign In', href: '/signin', icon: LogIn },
   // { name: 'Register', href: '/register', icon: UserPlus },
   
  ] : [];

  const isActive = (path: string) => pathname === path;

  const mobileNav = navigation.filter(item => !item?.hideOnMobile);
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-2 left-2 z-50 p-2 rounded-lg bg-background"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed top-16 left-0 h-[calc(100vh-4rem)] w-46 bg-surface  border-border p-6 flex-col">
        <nav className="space-y-1 flex-1">
        {navigation.map((item) => {
  const Icon = item.icon;
var parent="";
  if (item.childOf){ 
    parent=item.childOf;
    
  if(item.childOf!==openParent)
    
   return null; // Proper conditional check
}
  return (
    <Link
      key={item.href+item.name}
      href={item.href}
      onClick={() => handleClick(item)} // Corrected syntax
      className={`flex items-center px-4  ${item.childOf&&'ml-6 space-y-2'}  py-3 text-sm rounded-lg transition-colors ${
        isActive(item.href)
          ? 'bg-violet-600 bg-opacity-10 text-primary'
          : 'hover:bg-secondary hover:bg-opacity-10'
      }`}
    >
      <Icon className="h-5 w-5 mr-3" />
      {item.name}    {item.href==="#"?(item.name==openParent? <ChevronUp size={16} /> : <ChevronDown size={16} />):("")}
    </Link>
  );
})}

          {authLinks.map((item) => {
            const Icon = item.icon;


            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-violet-600 bg-opacity-10 text-primary'
                    : 'hover:bg-secondary hover:bg-opacity-10'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
         
           
        </nav>

        {user && (
          <div className="mt-auto space-y-1 mb-14 overflow-auto">
            {user?.IsAdmin === '1' && (
              <Link
                href="/admin"
                className="flex items-center px-4 py-3 text-sm hover:bg-secondary hover:bg-opacity-10 rounded-lg"
              >
                <LayoutGrid className="h-5 w-5 mr-3" />
                Admin Dashboard
              </Link>
            )}
            <Link
              href="/profile/settings"
              className="flex items-center px-4 py-3 text-sm hover:bg-secondary hover:bg-opacity-10 rounded-lg"
            >
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Link>
            <button
              onClick={() => signOut()}
              className="flex items-center px-4 py-3 text-sm hover:bg-secondary hover:bg-opacity-10 rounded-lg w-full"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        )}
      </div>



      {/* Mobile Navigation */}
      <div className="hidden   md:hidden fixed bottom-0 left-0 right-0 bg-surface  border-border  z-40">
        <nav className="flex justify-between items-center h-9 px-10  ">
          {mobileNav.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center w-16 h-full ${
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-60 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`md:hidden fixed inset-0 bg-background z-40 transition-transform duration-300 ease-in-out pt-16 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="space-y-1 p-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-violet-600 bg-opacity-10 text-primary'
                    : 'hover:bg-secondary hover:bg-opacity-10'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
<div className="border-t border-border my-4 overflow-auto">

          {authLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-violet-600 bg-opacity-10 text-primary'
                    : 'hover:bg-secondary hover:bg-opacity-10'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
</div>
        </nav>

      </div>
    </>
  );
}