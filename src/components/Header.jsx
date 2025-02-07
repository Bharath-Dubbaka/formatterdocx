"use client";
import { useSelector } from "react-redux";
import { CheckCircle } from "lucide-react";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import Image from "next/image";
import { Roboto_Slab, Inter } from "next/font/google"; 
import AuthService from "../services/AuthService"; 
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] }); 
const robotoSlab = Roboto_Slab({ subsets: ["latin"] });

const Header = () => {
   const { user, loading: authLoading } = useSelector((state) => state.auth);
   const { quota, templates, loading: quotaLoading } = useSelector((state) => state.quota);
   const [isLoading, setIsLoading] = useState(false);
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

   const handleSignIn = async () => {
      try {
         setIsLoading(true);
         await AuthService.signInWithGoogle();
      } catch (error) {
         console.error("Login error:", error);
      } finally {
         setIsLoading(false);
      }
   };

   const handleSignOut = async () => {
      try {
         setIsLoading(true);
         await AuthService.signOut();
      } catch (error) {
         console.error("Logout error:", error);
      } finally {
         setIsLoading(false);
      }
   };

   // Close dropdown when clicking outside
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
            setIsDropdownOpen(false);
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, [isDropdownOpen]);

   console.log(user, "user");
   console.log(quota, "1234quota");
   console.log(templates, "TEMPLATE");
   return (
      <header className="border-b bg-white/70 backdrop-blur-md fixed top-0 w-full z-50">
         <div className="container mx-auto px-4">
            <div className="flex items-center space-x-2 justify-between h-[5.3rem]">
               {/* Logo */}
               <Link href="/" className="flex items-center space-x-2">
                  {/* <div className="flex flex-col"> */}
                  <span
                     className={`text-[2.3rem] pb-2 flex flex-col font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent hover:from-pink-500 hover:via-purple-600 hover:to-indigo-600 transition-all duration-300`}
                  >
                     Aioku
                     <span className="text-xs text-black font-normal">
                        prod by <span className="font-bold"> CVtoSalary</span>
                     </span>
                  </span>
                  {/* </div> */}
               </Link>
               {/* Navigation */}
               <nav className="hidden md:flex items-center space-x-8">
                  {["Faq", "Pricing", "About"].map((item) => (
                     <Link
                        key={item}
                        href={`/${item.toLowerCase()}`}
                        className="text-slate-600 hover:text-indigo-600 font-medium transition-colors duration-200 hover:scale-105 transform"
                     >
                        {item}
                     </Link>
                  ))}
               </nav>
               {/* User Section */}
               <div className="flex items-center space-x-4">
                  {authLoading ? (
                     <div className="animate-pulse bg-gray-200 h-10 w-24 rounded" />
                  ) : !user ? (
                     <Button
                        onClick={handleSignIn}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-pink-500 hover:via-purple-600 hover:to-indigo-600"
                     >
                        {isLoading ? (
                           <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Signing in...</span>
                           </div>
                        ) : (
                           "Sign in with Google"
                        )}
                     </Button>
                  ) : (
                     <div className="flex items-center gap-4 relative dropdown-container">
                        <div className="flex items-center gap-2">
                           {user.picture ? (
                              <img
                                 src={user.picture}
                                 alt={user.name}
                                 className="w-8 h-8 rounded-full"
                              />
                           ) : (
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                 {user.name?.charAt(0)}
                              </div>
                           )}
                           <button
                              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                              className="text-sm font-medium text-gray-700 hover:text-gray-900"
                           >
                              {user.name}
                           </button>
                        </div>

                        {isDropdownOpen && (
                           <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                              <div className="px-4 py-2 border-b border-gray-200">
                                 <p className="text-sm text-gray-600">
                                    {user.email}
                                 </p>
                              </div>

                              {quotaLoading ? (
                                 <div className="px-4 py-2 space-y-2">
                                    <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded" />
                                    <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded" />
                                 </div>
                              ) : quota ? (
                                 <div className="px-4 py-2 border-b border-gray-200">
                                    <p className="text-sm font-medium text-gray-900">
                                       Quota Usage
                                    </p>
                                    <div className="mt-1 text-sm text-gray-600">
                                       <p>
                                          Used: {quota.formats.used} /{" "}
                                          {quota.formats.limit}
                                       </p>
                                       <p className="text-xs text-gray-500">
                                          Plan: {quota.subscription.type}
                                       </p>
                                    </div>
                                 </div>
                              ) : null}

                              <button
                                 onClick={handleSignOut}
                                 disabled={isLoading}
                                 className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                              >
                                 {isLoading ? "Signing out..." : "Sign Out"}
                              </button>
                           </div>
                        )}
                     </div>
                  )}
               </div>
            </div>
         </div>
      </header>
   );
};

export default Header;
