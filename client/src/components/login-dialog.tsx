import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signInWithGoogle } from "@/lib/firebase";
import { LogIn, Brain, Shield, Cloud, AlertTriangle } from "lucide-react";
import { SiGoogle } from "react-icons/si";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      await signInWithGoogle();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Sign in failed:", error);
      if (error.message && error.message.includes('authorized domains')) {
        setError(error.message);
      } else if (error.code === 'auth/unauthorized-domain') {
        const currentDomain = window.location.hostname;
        setError(`Please add "${currentDomain}" to your Firebase authorized domains in the Firebase Console under Authentication > Settings > Authorized domains.`);
      } else if (error.code === 'auth/popup-blocked') {
        setError('Popup was blocked. Please allow popups for this site and try again.');
      } else {
        setError('Sign in failed. Please try again.');
      }
      setIsSigningIn(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Brain className="h-5 w-5 text-primary mr-2" />
            Welcome to PromptForge
          </DialogTitle>
          <DialogDescription>
            Sign in to save your prompt transformations and access advanced features
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          <Button 
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="w-full h-12 text-base"
            size="lg"
          >
            <SiGoogle className="h-5 w-5 mr-3" />
            {isSigningIn ? 'Signing in...' : 'Continue with Google'}
          </Button>
          
          <div className="text-sm text-gray-600 text-center">
            <p>Having trouble signing in?</p>
            <p className="text-xs mt-1">
              Add <code className="bg-gray-100 px-1 rounded">workspace.AkshatYadav7.repl.co</code> to Firebase authorized domains
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-6">
            <Card className="text-center p-3">
              <CardContent className="p-0">
                <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Secure Authentication</p>
              </CardContent>
            </Card>
            <Card className="text-center p-3">
              <CardContent className="p-0">
                <Cloud className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Cloud Sync</p>
              </CardContent>
            </Card>
            <Card className="text-center p-3">
              <CardContent className="p-0">
                <Brain className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">AI-Powered</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}