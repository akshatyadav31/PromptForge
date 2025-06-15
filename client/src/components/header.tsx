import { useState } from "react";
import { Wand2, History, Bookmark, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/components/login-dialog";
import { UserMenu } from "@/components/user-menu";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { user, loading } = useAuth();

  return (
    <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Wand2 className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">PromptForge</h1>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              Advanced Prompt Engineering
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <History className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">History</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <Bookmark className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Saved</span>
                </Button>
              </>
            )}
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ) : user ? (
              <UserMenu user={user} />
            ) : (
              <Button onClick={() => setShowLoginDialog(true)} className="bg-primary hover:bg-blue-700">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog} 
      />
    </header>
  );
}
