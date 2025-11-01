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