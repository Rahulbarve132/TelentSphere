"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Camera, Plus, Trash2, Save, Loader2, X, 
  Linkedin, Github, Twitter, Globe, Building, 
  GraduationCap, Briefcase 
} from "lucide-react";
import { profileService } from "@/services/profileService";
import { UserProfile, UpdateProfileData, Experience, Education } from "@/types/user";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AddExperienceModal } from "@/components/profile/AddExperienceModal";
import { AddEducationModal } from "@/components/profile/AddEducationModal";

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [showExpModal, setShowExpModal] = useState(false);
  const [showEduModal, setShowEduModal] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm<UpdateProfileData>();

  useEffect(() => {
    const userId = user?._id || user?.id;
    if (userId) {
      loadProfile();
    }
  }, [user?._id, user?.id]);

  const loadProfile = async () => {
    const userId = user?._id || user?.id;
    if (!userId) return;
    
    setLoading(true);
    try {
      const data = await profileService.getProfile(userId);
      if (data.success && data.data.profile) {
        const p = data.data.profile;
        setProfile(p);
        setSkillsList(p.skills || []);
        
        reset({
          firstName: p.firstName || '',
          lastName: p.lastName || '',
          headline: p.headline || '',
          bio: p.bio || '',
          location: p.location || { city: '', state: '', country: '' },
          website: p.website || '',
          phone: p.phone || '',
          hourlyRate: p.hourlyRate,
          socialLinks: p.socialLinks || { linkedin: '', github: '', twitter: '', portfolio: '' },
          availability: p.availability || 'available',
          company: p.company || { name: '', website: '', size: '', industry: '' }
        });
      }
    } catch (error) {
      console.error("Failed to load profile", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: UpdateProfileData) => {
    // Support both 'id' and '_id' fields from backend
    const userId = user?._id || user?.id;
    
    if (!userId) {
      toast.error("User not authenticated. Please log in again.");
      return;
    }
    
    try {
      // Include skills in the update payload
      const payload: any = { ...data, skills: skillsList };
      
      // Only include company data if at least one field is filled
      if (!payload.company?.name && !payload.company?.website && !payload.company?.industry) {
        delete payload.company;
      }
      
      const response = await profileService.updateProfile(userId, payload);
      
      if (response.success) {
        toast.success("Profile updated successfully");
        setProfile(response.data.profile);
        loadProfile(); // Refresh to get latest data
      }
    } catch (error: any) {
      console.error("Update failed", error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || "Failed to update profile";
      toast.error(errorMessage);
    }
  };

  const handleAddSkill = () => {
    if (newSkill && !skillsList.map(s => s.toLowerCase()).includes(newSkill.toLowerCase())) {
        const updatedSkills = [...skillsList, newSkill];
        setSkillsList(updatedSkills);
        setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter(skill => skill !== skillToRemove));
  };

  const handleDeleteExperience = async (expId: string) => {
    const userId = user?._id || user?.id;
    if (!userId) return;
    if (!confirm("Are you sure you want to delete this experience?")) return;

    try {
      const response = await profileService.deleteExperience(userId, expId);
      if (response.success) {
        toast.success("Experience removed");
        if (profile) {
          setProfile({
            ...profile,
            experience: profile.experience.filter(e => e._id !== expId)
          });
        }
      }
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete experience");
    }
  };

  const handleDeleteEducation = async (eduId: string) => {
    const userId = user?._id || user?.id;
    if (!userId) return;
    if (!confirm("Are you sure you want to delete this education?")) return;

    try {
      const response = await profileService.deleteEducation(userId, eduId);
      if (response.success) {
        toast.success("Education removed");
        if (profile) {
          setProfile({
            ...profile,
            education: profile.education.filter(e => e._id !== eduId)
          });
        }
      }
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete education");
    }
  };
  
  const handleDeleteAvatar = async () => {
     const userId = user?._id || user?.id;
     if (!userId) return;
     if (!confirm("Remove profile picture?")) return;

     try {
         const response = await profileService.deleteAvatar(userId);
         if(response.success) {
             toast.success("Avatar removed");
              if (profile) {
                  setProfile({ ...profile, avatar: undefined });
              }
         }
     } catch (error) {
         toast.error("Failed to remove avatar");
     }
  }

  const handleAddExperience = async (data: any) => {
    const userId = user?._id || user?.id;
    if (!userId) return;

    try {
      const response = await profileService.addExperience(userId, data);
      if (response.success) {
        toast.success("Experience added successfully");
        setProfile(response.data.profile);
        loadProfile(); // Refresh to get latest data
      }
    } catch (error: any) {
      console.error("Add experience failed", error);
      const errorMessage = error?.response?.data?.message || "Failed to add experience";
      toast.error(errorMessage);
      throw error; // Re-throw to let modal handle it
    }
  };

  const handleAddEducation = async (data: any) => {
    const userId = user?._id || user?.id;
    if (!userId) return;

    try {
      const response = await profileService.addEducation(userId, data);
      if (response.success) {
        toast.success("Education added successfully");
        setProfile(response.data.profile);
        loadProfile(); // Refresh to get latest data
      }
    } catch (error: any) {
      console.error("Add education failed", error);
      const errorMessage = error?.response?.data?.message || "Failed to add education";
      toast.error(errorMessage);
      throw error; // Re-throw to let modal handle it
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">
            Please log in to view and edit your profile.
          </p>
          <Button onClick={() => window.location.href = '/login'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
           <p className="text-muted-foreground mt-1">Manage your public profile and professional details.</p>
        </div>
        <Button 
          type="submit"
          disabled={isSubmitting} 
          className="gap-2 shadow-lg shadow-primary/20"
        >
            {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />} 
            Save Changes
        </Button>
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Avatar & Quick Info */}
        <div className="space-y-6 lg:col-span-1">
             {/* Profile Picture */}
             <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    <div className="relative group">
                        <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                            <AvatarImage src={profile?.avatar || "/candidate_male.png"} />
                            <AvatarFallback className="text-4xl">
                              {profile?.firstName?.[0] || user?.email?.[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                           <Button variant="outline" size="sm" onClick={() => toast.info("Image upload feature coming soon!")}>Change</Button>
                           <Button variant="ghost" size="sm" className="text-destructive" onClick={handleDeleteAvatar}>Remove</Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                        JPG, GIF or PNG. 1MB max.
                    </p>
                </CardContent>
             </Card>

             {/* Profile Visibility */}
             <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                 <CardHeader>
                     <CardTitle>Availability Status</CardTitle>
                     <CardDescription>Let recruiters know your status.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                      <div className="space-y-2">
                         <Label>Current Status</Label>
                         <select 
                            className="w-full p-2 rounded-md border bg-background text-sm"
                            {...register("availability")}
                         >
                             <option value="available">🟢 Available for Work</option>
                             <option value="busy">🟡 Open to Opportunities</option>
                             <option value="not-available">🔴 Not Available</option>
                         </select>
                     </div>
                     {user?.role === 'developer' && (
                       <div className="space-y-2">
                         <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
                         <Input 
                           id="hourlyRate" 
                           type="number" 
                           {...register("hourlyRate")} 
                           placeholder="50" 
                         />
                       </div>
                     )}
                 </CardContent>
             </Card>

             {/* Quick Stats */}
             <Card className="border-border/50 bg-gradient-to-br from-primary/5 via-card/50 to-card/50 backdrop-blur-sm">
                 <CardHeader>
                     <CardTitle className="text-base">Profile Strength</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                     <div className="space-y-2">
                         <div className="flex justify-between text-sm">
                           <span className="font-medium">Completion</span>
                           <span className="text-primary font-semibold">
                             {Math.round(
                               ((profile?.firstName ? 1 : 0) +
                                (profile?.headline ? 1 : 0) +
                                (profile?.bio ? 1 : 0) +
                                (skillsList.length > 0 ? 1 : 0) +
                                ((profile?.experience?.length || 0) > 0 ? 1 : 0)) / 5 * 100
                             )}%
                           </span>
                         </div>
                         <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-primary rounded-full transition-all duration-500" 
                               style={{ 
                                 width: `${Math.round(
                                   ((profile?.firstName ? 1 : 0) +
                                    (profile?.headline ? 1 : 0) +
                                    (profile?.bio ? 1 : 0) +
                                    (skillsList.length > 0 ? 1 : 0) +
                                    ((profile?.experience?.length || 0) > 0 ? 1 : 0)) / 5 * 100
                                 )}%` 
                               }} 
                             />
                         </div>
                     </div>
                     <div className="space-y-2 pt-2 text-xs text-muted-foreground">
                         <p>✓ Complete all sections</p>
                         <p>✓ Add at least 5 skills</p>
                         <p>✓ Include work experience</p>
                     </div>
                 </CardContent>
             </Card>
        </div>

        {/* Right Column: Details Forms */}
        <div className="space-y-6 lg:col-span-2">
            
            {/* Basic Info */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>This is how others will see you on the platform.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input id="firstName" {...register("firstName")} placeholder="John" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input id="lastName" {...register("lastName")} placeholder="Doe" />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="headline">Professional Headline *</Label>
                        <Input 
                          id="headline" 
                          {...register("headline")} 
                          placeholder="e.g. Senior Full Stack Developer | React & Node.js Expert" 
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">About Me</Label>
                        <Textarea 
                          id="bio" 
                          {...register("bio")} 
                          placeholder="Tell us about yourself, your experience, and what you're looking for..." 
                          className="h-32 resize-none" 
                        />
                        <p className="text-xs text-muted-foreground">
                          {watch("bio")?.length || 0} / 500 characters
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" {...register("location.city")} placeholder="San Francisco" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" {...register("location.country")} placeholder="United States" />
                        </div>
                    </div>
                    
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" {...register("phone")} placeholder="+1 (555) 123-4567" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="website">Personal Website</Label>
                            <Input id="website" {...register("website")} placeholder="https://yourwebsite.com" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Social Links
                    </CardTitle>
                    <CardDescription>Connect your professional profiles.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="linkedin" className="flex items-center gap-2">
                            <Linkedin className="w-4 h-4 text-blue-600" />
                            LinkedIn
                        </Label>
                        <Input 
                          id="linkedin" 
                          {...register("socialLinks.linkedin")} 
                          placeholder="https://linkedin.com/in/username" 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="github" className="flex items-center gap-2">
                            <Github className="w-4 h-4" />
                            GitHub
                        </Label>
                        <Input 
                          id="github" 
                          {...register("socialLinks.github")} 
                          placeholder="https://github.com/username" 
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="twitter" className="flex items-center gap-2">
                                <Twitter className="w-4 h-4 text-sky-500" />
                                Twitter
                            </Label>
                            <Input 
                              id="twitter" 
                              {...register("socialLinks.twitter")} 
                              placeholder="@username" 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="portfolio">Portfolio</Label>
                            <Input 
                              id="portfolio" 
                              {...register("socialLinks.portfolio")} 
                              placeholder="https://portfolio.com" 
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Skills */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Skills & Expertise</CardTitle>
                    <CardDescription>Add skills to help employers find you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   {skillsList.length > 0 && (
                     <div className="flex flex-wrap gap-2">
                          {skillsList.map((skill) => (
                              <Badge 
                                key={skill} 
                                variant="secondary" 
                                className="px-3 py-1.5 text-sm gap-2 hover:bg-secondary/80 transition-colors"
                              >
                                  {skill}
                                  <button 
                                      className="hover:text-destructive transition-colors"
                                      onClick={() => handleRemoveSkill(skill)}
                                      type="button"
                                  >
                                      <X className="w-3 h-3" />
                                  </button>
                              </Badge>
                          ))}
                     </div>
                   )}
                   <div className="flex gap-2">
                       <Input 
                            placeholder="Add a skill (e.g. React, Python, UI/UX Design)" 
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddSkill();
                                }
                            }}
                       />
                       <Button 
                         variant="outline" 
                         onClick={handleAddSkill} 
                         type="button"
                         className="shrink-0"
                       >
                         <Plus className="w-4 h-4 mr-2" />
                         Add
                       </Button>
                   </div>
                   {skillsList.length === 0 && (
                     <p className="text-sm text-muted-foreground">No skills added yet. Add your first skill above!</p>
                   )}
                </CardContent>
            </Card>

            {/* Work Experience */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                          <Briefcase className="w-5 h-5" />
                          Work Experience
                        </CardTitle>
                        <CardDescription>Your professional career history.</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowExpModal(true)}
                      className="gap-2"
                      type="button"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    {profile?.experience && profile.experience.length > 0 ? (
                        profile.experience.map((exp) => (
                            <div key={exp._id} className="flex gap-4 group p-4 rounded-lg border border-border/40 bg-background/30 hover:bg-background/50 transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg select-none shrink-0">
                                    {exp.company?.charAt(0) || "W"}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-foreground">{exp.title}</h4>
                                            <p className="text-sm text-foreground/80">
                                              {exp.company}
                                              {exp.location && ` • ${exp.location}`}
                                            </p>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDeleteExperience(exp._id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '')} 
                                    </p>
                                    {exp.description && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                            {exp.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
                          <p className="text-sm">No experience added yet.</p>
                          <p className="text-xs mt-1">Click "Add" to include your work history.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Education */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                          <GraduationCap className="w-5 h-5" />
                          Education
                        </CardTitle>
                        <CardDescription>Your academic background.</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowEduModal(true)}
                      className="gap-2"
                      type="button"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    {profile?.education && profile.education.length > 0 ? (
                        profile.education.map((edu) => (
                            <div key={edu._id} className="flex gap-4 group p-4 rounded-lg border border-border/40 bg-background/30 hover:bg-background/50 transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg select-none shrink-0">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-foreground">{edu.degree}</h4>
                                            <p className="text-sm text-foreground/80">
                                              {edu.school} • {edu.fieldOfStudy}
                                            </p>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDeleteEducation(edu._id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                                    </p>
                                    {edu.description && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                            {edu.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-20" />
                          <p className="text-sm">No education added yet.</p>
                          <p className="text-xs mt-1">Click "Add" to include your academic background.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Company Information (Only for Clients/Recruiters) */}
            {(user?.role === 'client' || user?.role === 'recruiter') && (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        Company Information
                      </CardTitle>
                      <CardDescription>Details about your organization.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label htmlFor="companyName">Company Name</Label>
                              <Input 
                                id="companyName" 
                                {...register("company.name")} 
                                placeholder="Tech Corp Inc." 
                              />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="companyWebsite">Company Website</Label>
                              <Input 
                                id="companyWebsite" 
                                {...register("company.website")} 
                                placeholder="https://company.com" 
                              />
                          </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label htmlFor="companySize">Company Size</Label>
                              <select 
                                id="companySize"
                                className="w-full p-2 rounded-md border bg-background text-sm"
                                {...register("company.size")}
                              >
                                  <option value="">Select size</option>
                                  <option value="1-10">1-10 employees</option>
                                  <option value="11-50">11-50 employees</option>
                                  <option value="51-200">51-200 employees</option>
                                  <option value="201-500">201-500 employees</option>
                                  <option value="500+">500+ employees</option>
                              </select>
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="companyIndustry">Industry</Label>
                              <Input 
                                id="companyIndustry" 
                                {...register("company.industry")} 
                                placeholder="e.g. Technology, Finance" 
                              />
                          </div>
                      </div>
                  </CardContent>
              </Card>
            )}

        </div>
      </div>

      {/* Save Button at Bottom (Mobile) */}
      <div className="flex justify-end lg:hidden">
        <Button 
          type="submit"
          disabled={isSubmitting} 
          className="gap-2 w-full sm:w-auto shadow-lg shadow-primary/20"
        >
            {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />} 
            Save All Changes
        </Button>
      </div>

      <AddExperienceModal 
        open={showExpModal}
        onClose={() => setShowExpModal(false)}
        onSuccess={() => setShowExpModal(false)}
        onSubmit={handleAddExperience}
      />

      <AddEducationModal
        open={showEduModal}
        onClose={() => setShowEduModal(false)}
        onSuccess={() => setShowEduModal(false)}
        onSubmit={handleAddEducation}
      />
    </form>
  );
}
