import { Inter, Roboto_Mono, Roboto_Slab, Roboto } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
// import { Providers } from "../components/Providers";
// import FirestoreSubscription from "../components/FirestoreSubscription";

const inter = Inter({ subsets: ["latin"] });
const robotoMono = Roboto_Mono({ subsets: ["latin"] });
const robotoSlab = Roboto_Slab({ subsets: ["latin"], weights: ["400", "700"] });

export const metadata = {
   title: "ResumeFormatter - AI-Powered Resume Formatter",
   description: "Create professional resumes with AI-powered tools.",
};

export default function RootLayout({ children, pageProps }) {
   return (
      <html lang="en">
         <body className={robotoMono.className}>
            {/* <Providers> */}
            {/* <FirestoreSubscription /> */}
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            {/* </Providers> */}
         </body>
      </html>
   );
}
