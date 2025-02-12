import { Inter, Roboto_Mono, Roboto_Slab, Roboto } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Providers } from "../components/Providers";

const inter = Inter({ subsets: ["latin"] });
const robotoMono = Roboto_Mono({ subsets: ["latin"] });
const robotoSlab = Roboto_Slab({ subsets: ["latin"] });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
   title: "Resume Formatter - Professional Resume Builder",
   description:
      "Transform your resume with our professional resume formatter. Create ATS-friendly resumes with custom templates and formatting options.",
   keywords: [
      "resume formatter",
      "resume builder",
      "ATS-friendly resume",
      "professional resume",
      "resume templates",
      "CV formatter",
   ],
   authors: [{ name: "Resume Formatter Team" }],
   openGraph: {
      title: "Resume Formatter - Professional Resume Builder",
      description:
         "Transform your resume with our professional resume formatter. Create ATS-friendly resumes with custom templates and formatting options.",
      type: "website",
      locale: "en_US",
      siteName: "Resume Formatter",
   },
   twitter: {
      card: "summary_large_image",
      title: "Resume Formatter - Professional Resume Builder",
      description:
         "Transform your resume with our professional resume formatter. Create ATS-friendly resumes with custom templates and formatting options.",
   },
   robots: {
      index: true,
      follow: true,
   },
};

export default function RootLayout({ children }) {
   return (
      <html lang="en">
         <head>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
         </head>
         <body className={robotoMono.className}>
            <Providers>
               <Header />
               <main className="min-h-screen">{children}</main>
               <Footer />
            </Providers>
         </body>
      </html>
   );
}
