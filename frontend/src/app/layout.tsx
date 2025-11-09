import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Suspense } from "react";
import Analytics from "@/components/Analytics";


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
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        </head>
        <body>
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