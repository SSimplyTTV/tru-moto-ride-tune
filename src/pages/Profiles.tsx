import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Edit, Trash2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  name: string;
  throttle: number;
  regen: number;
  isActive: boolean;
}

interface ProfilesProps {
  onBack: () => void;
}

export function Profiles({ onBack }: ProfilesProps) {
  const [profiles, setProfiles] = useState<Profile[]>([
    { id: "1", name: "Street", throttle: 50, regen: 30, isActive: true },
    { id: "2", name: "Race", throttle: 85, regen: 15, isActive: false },
    { id: "3", name: "Eco", throttle: 35, regen: 60, isActive: false },
  ]);
  const [newProfileName, setNewProfileName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleActivateProfile = (profileId: string) => {
    setProfiles(profiles.map(p => ({
      ...p,
      isActive: p.id === profileId
    })));
    
    const activatedProfile = profiles.find(p => p.id === profileId);
    toast({
      title: "Profile Activated",
      description: `${activatedProfile?.name} profile is now active`,
    });
  };

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) return;
    
    const newProfile: Profile = {
      id: Date.now().toString(),
      name: newProfileName,
      throttle: 50,
      regen: 30,
      isActive: false
    };
    
    setProfiles([...profiles, newProfile]);
    setNewProfileName("");
    setIsDialogOpen(false);
    
    toast({
      title: "Profile Created",
      description: `${newProfileName} profile has been created`,
    });
  };

  const handleDeleteProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile?.isActive) {
      toast({
        title: "Cannot Delete",
        description: "Cannot delete the active profile",
        variant: "destructive",
      });
      return;
    }
    
    setProfiles(profiles.filter(p => p.id !== profileId));
    toast({
      title: "Profile Deleted",
      description: "Profile has been removed",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-card/50 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Profiles</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80">
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Profile name"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateProfile()}
              />
              <Button onClick={handleCreateProfile} className="w-full">
                Create Profile
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="p-6 space-y-4">
        {profiles.map((profile) => (
          <Card 
            key={profile.id} 
            className={`p-4 transition-all duration-200 cursor-pointer hover:shadow-lg ${
              profile.isActive 
                ? 'border-primary bg-gradient-to-r from-primary/5 to-primary/10 shadow-lg shadow-primary/10' 
                : 'border-border hover:border-primary/30'
            }`}
            onClick={() => handleActivateProfile(profile.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  profile.isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                }`}>
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{profile.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Throttle: {profile.throttle}%</span>
                    <span>Regen: {profile.regen}%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {profile.isActive && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full font-medium">
                    Active
                  </span>
                )}
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Edit functionality could be added here
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProfile(profile.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}