import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Library, Bookmark, TrendingUp, Users, LogIn } from "lucide-react";
import { getUserPrompts } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import type { FirebasePrompt } from "@/types/firebase";

export function PromptLibrary() {
  const { user } = useAuth();
  
  const { data: prompts, isLoading } = useQuery<FirebasePrompt[]>({
    queryKey: ['user-prompts', user?.uid],
    queryFn: () => user ? getUserPrompts(user.uid) : Promise.resolve([]),
    enabled: !!user,
  });

  const recentPrompts = prompts?.slice(0, 3) || [];

  const frameworkStats = [
    { name: 'TCREI Success Rate', value: 92, color: 'bg-violet-500' },
    { name: 'RSTI Enhancement', value: 87, color: 'bg-blue-500' },
    { name: 'TFCDC Accuracy', value: 94, color: 'bg-green-500' },
  ];

  const communityHighlights = [
    {
      title: 'Top Template: Technical Docs',
      subtitle: 'Used 247 times this week',
      gradient: 'from-blue-50 to-violet-50',
      border: 'border-blue-200'
    },
    {
      title: 'Rising: Creative Writing',
      subtitle: '+156% usage increase',
      gradient: 'from-green-50 to-blue-50',
      border: 'border-green-200'
    },
    {
      title: 'Featured: Code Review',
      subtitle: 'Community favorite',
      gradient: 'from-pink-50 to-red-50',
      border: 'border-pink-200'
    }
  ];

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Library className="h-6 w-6 text-secondary mr-2" />
        Prompt Library & Analytics
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recent Transformations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Transformations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {!user ? (
                <div className="text-center py-8 text-gray-500">
                  <LogIn className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Sign in to view your prompt library</p>
                </div>
              ) : isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : recentPrompts.length > 0 ? (
                recentPrompts.map((prompt) => (
                  <div key={prompt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium truncate max-w-32">
                        {prompt.originalInput.slice(0, 30)}...
                      </div>
                      <div className="text-xs text-gray-500">
                        {Array.isArray(prompt.frameworks) 
                          ? prompt.frameworks.join(' + ')
                          : 'Multiple frameworks'}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Bookmark className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Library className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent transformations</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Framework Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Framework Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {frameworkStats.map((stat) => (
                <div key={stat.name} className="flex items-center justify-between">
                  <span className="text-sm">{stat.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${stat.color} h-2 rounded-full`}
                        style={{ width: `${stat.value}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{stat.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Community Highlights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Community Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {communityHighlights.map((highlight, index) => (
                <div 
                  key={index}
                  className={`p-3 bg-gradient-to-r ${highlight.gradient} rounded-lg border ${highlight.border}`}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {highlight.title}
                  </div>
                  <div className="text-xs text-gray-600">
                    {highlight.subtitle}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
