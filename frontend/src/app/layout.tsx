import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Suspense } from "react";
import Analytics from "@/components/Analytics";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});


export const metadata = {
    title: "guru tea",
    description: "Online tea store",
};



export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <head>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}>
            <Suspense>
                <ClientLayout>
                    {children}
                    <Analytics />
                </ClientLayout>
            </Suspense>
        </body>
        </html>
    );
}