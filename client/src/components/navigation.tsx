import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  ChartLine, 
  Home, 
  List, 
  BarChart3, 
  Briefcase, 
  Plus,
  UserCircle,
  LogOut
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

export function Navigation() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const navigationItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/transactions", label: "Transactions", icon: List },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/portfolio", label: "Portfolio", icon: Briefcase },
  ];

  const isActive = (path: string) => location === path;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <ChartLine className="h-8 w-8 text-primary mr-3" />
                <h1 className="text-xl font-bold text-gray-900">FinLedger</h1>
              </div>
              <div className="hidden md:ml-8 md:flex md:space-x-8">
                {navigationItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <a
                      className={`${
                        isActive(item.path)
                          ? "text-primary border-b-2 border-primary"
                          : "text-gray-500 hover:text-gray-700"
                      } px-1 pt-1 pb-2 text-sm font-medium transition-colors`}
                    >
                      {item.label}
                    </a>
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setShowAddTransaction(true)}
                className="bg-primary text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={user?.profileImageUrl || undefined} 
                        alt={user?.firstName || "User"} 
                      />
                      <AvatarFallback>
                        {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.firstName || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/api/logout" className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
        <div className="flex justify-around py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path}>
                <a
                  className={`flex flex-col items-center py-2 px-4 ${
                    isActive(item.path) ? "text-primary" : "text-gray-500"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </a>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile FAB */}
      <Button
        onClick={() => setShowAddTransaction(true)}
        className="fixed bottom-20 right-6 bg-primary text-white hover:bg-blue-700 h-14 w-14 rounded-full shadow-lg md:hidden z-30"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </>
  );
}
