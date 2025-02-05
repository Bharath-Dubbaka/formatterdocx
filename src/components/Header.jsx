"use client";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../store/slices/authSlice";
// import { clearFirebaseData } from "../store/slices/firebaseSlice";
// import { auth } from "../services/firebase";
import { CheckCircle } from "lucide-react";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "../components/ui/button";
// import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { QuotaService } from "../services/QuotaService";
// import { UserDetailsService } from "../services/UserDetailsService";
// import { setUser } from "../store/slices/authSlice";
// import { setUserDetails, setUserQuota } from "../store/slices/firebaseSlice";
import { Roboto_Slab, Inter } from "next/font/google"; // Import Inter here!
// import AuthService from "../services/AuthService"; // Import AuthService

const inter = Inter({ subsets: ["latin"] }); // Initialize Inter font
const robotoSlab = Roboto_Slab({ subsets: ["latin"] });

const Header = () => {
   // const { user } = useSelector((state) => state.auth);
   // const { userQuota, userDetails } = useSelector((state) => state.firebase);
   // const dispatch = useDispatch();
   // const router = useRouter();
   // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   // const [isLoading, setIsLoading] = useState(false);

   // const handleLogout = async () => {
   //    try {
   //       await AuthService.signOut(dispatch, logout, clearFirebaseData);
   //    } catch (error) {
   //       console.error("Logout error:", error);
   //    }
   // };

   // const handleGetStarted = async () => {
   //    try {
   //       setIsLoading(true);
   //       await AuthService.handleAuthFlow(dispatch, router, user, userDetails, {
   //          setUser,
   //          setUserQuota,
   //          setUserDetails,
   //       });
   //    } catch (error) {
   //       console.error("Login error:", error);
   //    } finally {
   //       setIsLoading(false);
   //    }
   // };

   // const handleUpgradeClick = async () => {
   //    try {
   //       const response = await fetch("/api/payment/create-payment-link", {
   //          method: "POST",
   //          headers: { "Content-Type": "application/json" },
   //          body: JSON.stringify({
   //             userId: user.uid,
   //             userEmail: user.email,
   //             userName: user.name,
   //          }),
   //       });

   //       const { paymentLink } = await response.json();
   //       if (!paymentLink) throw new Error("Failed to create payment link");

   //       // Open payment in new window
   //       window.open(paymentLink, "_blank");

   //       // Start polling for payment status
   //       const checkPaymentStatus = setInterval(async () => {
   //          try {
   //             const verifyResponse = await fetch(
   //                "/api/payment/verify-payment",
   //                {
   //                   method: "POST",
   //                   headers: { "Content-Type": "application/json" },
   //                   body: JSON.stringify({
   //                      userId: user.uid,
   //                      paymentId: window.localStorage.getItem(
   //                         "razorpay_payment_id"
   //                      ),
   //                   }),
   //                }
   //             );

   //             const data = await verifyResponse.json();
   //             if (data.success) {
   //                clearInterval(checkPaymentStatus);
   //                // Refresh quota data
   //                const quota = await QuotaService.getUserQuota(user.uid);
   //                dispatch(setUserQuota(quota));
   //                setIsDropdownOpen(false);
   //             }
   //          } catch (error) {
   //             console.error("Error verifying payment:", error);
   //          }
   //       }, 2000);

   //       // Stop checking after 5 minutes
   //       setTimeout(() => {
   //          clearInterval(checkPaymentStatus);
   //       }, 300000);
   //    } catch (error) {
   //       console.error("Error initiating payment:", error);
   //    }
   // };

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
               {/*  */}
               <div className="flex items-center space-x-4">
                  <Button
                     // onClick={handleGetStarted}
                     variant="ghost"
                     className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors duration-200"
                  >
                     Sign In
                  </Button>
                  <Button
                     // onClick={handleGetStarted}
                     className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-pink-500 hover:via-purple-600 hover:to-indigo-600 text-white transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                     FREE Trial
                  </Button>
               </div>
            </div>
         </div>
      </header>
   );
};

export default Header;
