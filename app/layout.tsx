import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ChevronDown, FileText, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { getCurrentUser } from "./repositories/current-user-repository";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Form Builder",
  description: "Just a simple form builder",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  const homeUrl = currentUser?.email ? "/forms" : "/sign-in";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-slate-100`}
      >
        <header className="border-b bg-white">
          <div className="container mx-auto px-4 py-6 flex items-center justify-between">
            <Link className="flex items-center gap-2" href={homeUrl}>
              <FileText className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold">form.builder</span>
            </Link>

            {currentUser?.email ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 hover:bg-gray-100"
                  >
                    <span className="hidden sm:inline">
                      {currentUser.email}
                    </span>

                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <SignOutButton
                      className="w-full"
                      loadingState={
                        <div className="animate-pulse flex items-center gap-2">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Signing out...</span>
                        </div>
                      }
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </SignOutButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Sign in</Link>
                </Button>

                <Button className="bg-purple-600 hover:bg-purple-700" asChild>
                  <Link href="/sign-up">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
