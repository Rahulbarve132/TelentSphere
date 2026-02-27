"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users, 
  FileText, 
  Plus, 
  X, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { profileService } from "@/services/profileService";

type JobType = 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
type JobCategory = 'web-development' | 'mobile-development' | 'ui-ux-design' | 'data-science' | 'devops' | 'cloud-computing' | 'cybersecurity' | 'blockchain' | 'ai-ml' | 'game-development' | 'other';
type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
type BudgetType = 'fixed' | 'hourly' | 'monthly';
type LocationType = 'remote' | 'onsite' | 'hybrid';

interface JobFormData {
  title: string;
  description: string;
  type: JobType;
  category: JobCategory;
  skillsRequired: string[];
  experienceLevel: ExperienceLevel;
  budget: {
    type: BudgetType;
    min: number;
    max: number;
    currency: string;
  };
  location: {
    type: LocationType;
    city?: string;
    state?: string;
    country?: string;
  };
  requirements: string[];
  benefits: string[];
  applicationDeadline?: string;
}

export default function PostJobPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [companyIncomplete, setCompanyIncomplete] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Check company details for recruiter role
  useEffect(() => {
    const userId = user?._id || (user as any)?.id;
    if (user?.role === 'recruiter' && userId) {
      setProfileLoading(true);
      profileService.getProfile(userId)
        .then((data) => {
          if (data.success && data.data.profile) {
            const company = data.data.profile.company;
            const missing: string[] = [];
            if (!company?.name?.trim())                                    missing.push('Company Name');
            if (!company?.website?.trim())                                 missing.push('Company Website');
            if (!company?.size?.trim())                                    missing.push('Company Size');
            if (!company?.industry?.trim())                                missing.push('Industry');
            if (!company?.description?.trim())                             missing.push('Company Description');
            if (!company?.city?.trim())                                    missing.push('City');
            if (!company?.contactEmail?.trim())                            missing.push('Contact Email');
            if (!company?.verificationMethod || company.verificationMethod === 'none') missing.push('Verification Method');
            setMissingFields(missing);
            setCompanyIncomplete(missing.length > 0);
          } else {
            setCompanyIncomplete(true);
            setMissingFields([
              'Company Name', 'Company Website', 'Company Size',
              'Industry', 'Company Description', 'City',
              'Contact Email', 'Verification Method'
            ]);
          }
        })
        .catch(() => {
          setCompanyIncomplete(true);
          setMissingFields(['Company profile could not be loaded']);
        })
        .finally(() => setProfileLoading(false));
    }
  }, [user?._id, (user as any)?.id, user?.role]);
  
  const isClient = user?.role === 'client';

  // Form state
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    description: "",
    type: isClient ? "freelance" : "full-time",
    category: "web-development",
    skillsRequired: [],
    experienceLevel: "mid",
    budget: {
      type: "fixed",
      min: 0,
      max: 0,
      currency: "USD"
    },
    location: {
      type: "remote",
      country: ""
    },
    requirements: [],
    benefits: []
  });

  // Temporary input states
  const [skillInput, setSkillInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");

  const jobTypes: { value: JobType; label: string; icon: string }[] = [
    { value: 'full-time', label: 'Full-time', icon: '💼' },
    { value: 'part-time', label: 'Part-time', icon: '⏰' },
    { value: 'contract', label: 'Contract', icon: '📝' },
    { value: 'freelance', label: 'Freelance', icon: '🚀' },
    { value: 'internship', label: 'Internship', icon: '🎓' }
  ];

  const categories: { value: JobCategory; label: string }[] = [
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-development', label: 'Mobile Development' },
    { value: 'ui-ux-design', label: 'UI/UX Design' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'devops', label: 'DevOps' },
    { value: 'cloud-computing', label: 'Cloud Computing' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'blockchain', label: 'Blockchain' },
    { value: 'ai-ml', label: 'AI/ML' },
    { value: 'game-development', label: 'Game Development' },
    { value: 'other', label: 'Other' }
  ];

  const experienceLevels: { value: ExperienceLevel; label: string }[] = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' },
    { value: 'lead', label: 'Lead' },
    { value: 'executive', label: 'Executive' }
  ];

  const locationTypes: { value: LocationType; label: string; icon: string }[] = [
    { value: 'remote', label: 'Remote', icon: '🌍' },
    { value: 'onsite', label: 'Onsite', icon: '🏢' },
    { value: 'hybrid', label: 'Hybrid', icon: '🔄' }
  ];

  const budgetTypes: { value: BudgetType; label: string }[] = [
    { value: 'fixed', label: 'Fixed Price' },
    { value: 'hourly', label: 'Hourly Rate' },
    { value: 'monthly', label: 'Monthly Salary' }
  ];

  // Add skill
  const addSkill = () => {
    if (skillInput.trim() && !formData.skillsRequired.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skillsRequired: [...formData.skillsRequired, skillInput.trim()]
      });
      setSkillInput("");
    }
  };

  // Remove skill
  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skillsRequired: formData.skillsRequired.filter(s => s !== skill)
    });
  };

  // Add requirement
  const addRequirement = () => {
    if (requirementInput.trim() && !formData.requirements.includes(requirementInput.trim())) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, requirementInput.trim()]
      });
      setRequirementInput("");
    }
  };

  // Remove requirement
  const removeRequirement = (req: string) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter(r => r !== req)
    });
  };

  // Add benefit
  const addBenefit = () => {
    if (benefitInput.trim() && !formData.benefits.includes(benefitInput.trim())) {
      setFormData({
        ...formData,
        benefits: [...formData.benefits, benefitInput.trim()]
      });
      setBenefitInput("");
    }
  };

  // Remove benefit
  const removeBenefit = (benefit: string) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter(b => b !== benefit)
    });
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.title.trim()) {
          toast.error("Please enter a job title");
          return false;
        }
        if (!formData.description.trim()) {
          toast.error("Please enter a job description");
          return false;
        }
        return true;
      case 2:
        if (formData.skillsRequired.length === 0) {
          toast.error("Please add at least one required skill");
          return false;
        }
        return true;
      case 3:
        if (formData.budget.min <= 0 || formData.budget.max <= 0) {
          toast.error("Please enter valid budget amounts");
          return false;
        }
        if (formData.budget.min > formData.budget.max) {
          toast.error("Minimum budget cannot be greater than maximum budget");
          return false;
        }
        return true;
      case 4:
        if (formData.location.type !== 'remote' && !formData.location.country?.trim()) {
          toast.error("Please enter a country for the job location");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  // Next step
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  // Previous step
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Submit job
  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    
    try {
      const payload = {
        ...formData,
        applicationDeadline: formData.applicationDeadline || undefined
      };

      const response = await api.post("/jobs", payload);
      
      if (response.data.success) {
        toast.success("Job posted successfully!");
        setCurrentStep(5); // Move to success step
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error posting job:", error);
      toast.error(error.response?.data?.message || "Failed to post job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Company details gate for recruiter role
  if (profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <span className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm">Checking company profile...</p>
        </div>
      </div>
    );
  }

  if (user?.role === 'recruiter' && companyIncomplete) {
    return (
      <div className="min-h-screen pb-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Post a New Job
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Find the perfect talent for your project
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8 shadow-xl shadow-amber-500/5">
            <div className="flex flex-col items-center text-center gap-6">
              {/* Icon */}
              <div className="w-20 h-20 rounded-full bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-amber-500" />
              </div>

              {/* Title */}
              <div>
                <h2 className="text-2xl font-bold mb-2">Company Profile Incomplete</h2>
                <p className="text-muted-foreground">
                  You need to complete your company profile before you can post a job.
                  Make sure the following details are filled in:
                </p>
              </div>

              {/* Missing fields */}
              <div className="w-full rounded-xl border border-border/50 bg-background/50 p-4 space-y-2">
                {missingFields.map((field) => (
                  <div key={field} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-foreground/80">{field}</span>
                    <span className="ml-auto text-xs text-amber-600 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full">Missing</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Link href="/dashboard/profile" className="flex-1">
                  <button className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary/25">
                    <ArrowRight className="w-4 h-4" />
                    Complete Company Profile
                  </button>
                </Link>
                <Link href="/dashboard" className="flex-1">
                  <button className="w-full h-11 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2">
                    Go to Dashboard
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {isClient ? "Post a New Requirement" : "Post a New Job"}
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          {isClient ? "Describe your freelance project and find the perfect talent" : "Find the perfect talent for your project"}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {[
            { num: 1, label: "Basic Info", icon: FileText },
            { num: 2, label: "Requirements", icon: Users },
            { num: 3, label: "Budget", icon: DollarSign },
            { num: 4, label: "Location", icon: MapPin },
            { num: 5, label: "Review", icon: CheckCircle2 }
          ].map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.num;
            const isCompleted = currentStep > step.num;
            
            return (
              <div key={step.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isActive ? 'border-primary bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/50' : ''}
                    ${isCompleted ? 'border-green-500 bg-green-500 text-white' : ''}
                    ${!isActive && !isCompleted ? 'border-border bg-background text-muted-foreground' : ''}
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs mt-2 font-medium transition-colors ${
                    isActive ? 'text-primary' : isCompleted ? 'text-green-500' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < 4 && (
                  <div className={`h-[2px] flex-1 transition-all duration-300 ${
                    isCompleted ? 'bg-green-500' : 'bg-border'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <Card className="max-w-4xl mx-auto border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
        <CardContent className="pt-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary" />
                  Basic Information
                </h2>
                <p className="text-muted-foreground">Tell us about the job you're posting</p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base">Job Title *</Label>
                  <Input 
                    id="title"
                    placeholder="e.g. Senior React Developer"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="text-lg h-12"
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground">{formData.title.length}/200 characters</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Job Type: hidden for clients (locked to freelance) */}
                  {isClient ? (
                    <div className="space-y-2">
                      <Label className="text-base">Job Type</Label>
                      <div className="flex items-center gap-3 h-12 px-4 rounded-lg border-2 border-primary/30 bg-primary/5">
                        <span className="text-2xl">🚀</span>
                        <span className="font-semibold text-primary text-sm">Freelance</span>
                        <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Auto-selected</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label className="text-base">Job Type *</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {jobTypes.map(type => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, type: type.value })}
                            className={`
                              p-3 rounded-lg border-2 transition-all duration-200 text-left
                              ${formData.type === type.value 
                                ? 'border-primary bg-primary/10 shadow-md' 
                                : 'border-border hover:border-primary/50 hover:bg-accent'
                              }
                            `}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{type.icon}</span>
                              <span className="font-medium text-sm">{type.label}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-base">Category *</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as JobCategory })}
                      className="w-full h-12 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceLevel" className="text-base">Experience Level *</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {experienceLevels.map(level => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, experienceLevel: level.value })}
                        className={`
                          p-3 rounded-lg border-2 transition-all duration-200
                          ${formData.experienceLevel === level.value 
                            ? 'border-primary bg-primary/10 shadow-md' 
                            : 'border-border hover:border-primary/50 hover:bg-accent'
                          }
                        `}
                      >
                        <span className="font-medium text-sm">{level.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base">Job Description *</Label>
                  <Textarea 
                    id="description"
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-[200px] text-base"
                    maxLength={10000}
                  />
                  <p className="text-xs text-muted-foreground">{formData.description.length}/10000 characters</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Requirements & Skills */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  Requirements & Skills
                </h2>
                <p className="text-muted-foreground">What skills and qualifications are needed?</p>
              </div>

              <Separator />

              <div className="space-y-6">
                {/* Skills Required */}
                <div className="space-y-3">
                  <Label className="text-base">Required Skills *</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="e.g. React, Node.js, TypeScript"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1"
                    />
                    <Button type="button" onClick={addSkill} variant="outline" size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[60px] p-4 rounded-lg border border-border bg-background/50">
                    {formData.skillsRequired.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No skills added yet</p>
                    ) : (
                      formData.skillsRequired.map(skill => (
                        <Badge key={skill} variant="secondary" className="px-3 py-1.5 text-sm gap-2">
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="hover:text-destructive">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))
                    )}
                  </div>
                </div>

                {/* Requirements */}
                <div className="space-y-3">
                  <Label className="text-base">Job Requirements</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="e.g. 2+ years of experience in React"
                      value={requirementInput}
                      onChange={(e) => setRequirementInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                      className="flex-1"
                    />
                    <Button type="button" onClick={addRequirement} variant="outline" size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.requirements.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic p-4 rounded-lg border border-dashed border-border">
                        No requirements added yet
                      </p>
                    ) : (
                      formData.requirements.map((req, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background/50 group hover:border-primary/50 transition-colors">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="flex-1 text-sm">{req}</p>
                          <button 
                            onClick={() => removeRequirement(req)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-3">
                  <Label className="text-base">Benefits & Perks</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="e.g. Health insurance, Remote work"
                      value={benefitInput}
                      onChange={(e) => setBenefitInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                      className="flex-1"
                    />
                    <Button type="button" onClick={addBenefit} variant="outline" size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.benefits.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic p-4 rounded-lg border border-dashed border-border">
                        No benefits added yet
                      </p>
                    ) : (
                      formData.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background/50 group hover:border-primary/50 transition-colors">
                          <Sparkles className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <p className="flex-1 text-sm">{benefit}</p>
                          <button 
                            onClick={() => removeBenefit(benefit)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Budget */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-primary" />
                  Budget & Compensation
                </h2>
                <p className="text-muted-foreground">Set the compensation for this position</p>
              </div>

              <Separator />

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base">Budget Type *</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {budgetTypes.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ 
                          ...formData, 
                          budget: { ...formData.budget, type: type.value }
                        })}
                        className={`
                          p-4 rounded-lg border-2 transition-all duration-200
                          ${formData.budget.type === type.value 
                            ? 'border-primary bg-primary/10 shadow-md' 
                            : 'border-border hover:border-primary/50 hover:bg-accent'
                          }
                        `}
                      >
                        <span className="font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minBudget" className="text-base">
                      Minimum {formData.budget.type === 'hourly' ? 'Rate' : formData.budget.type === 'monthly' ? 'Salary' : 'Budget'} *
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input 
                        id="minBudget"
                        type="number"
                        placeholder="0"
                        value={formData.budget.min || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          budget: { ...formData.budget, min: Number(e.target.value) }
                        })}
                        className="pl-10 h-12 text-lg"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxBudget" className="text-base">
                      Maximum {formData.budget.type === 'hourly' ? 'Rate' : formData.budget.type === 'monthly' ? 'Salary' : 'Budget'} *
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input 
                        id="maxBudget"
                        type="number"
                        placeholder="0"
                        value={formData.budget.max || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          budget: { ...formData.budget, max: Number(e.target.value) }
                        })}
                        className="pl-10 h-12 text-lg"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-base">Currency</Label>
                  <select
                    id="currency"
                    value={formData.budget.currency}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      budget: { ...formData.budget, currency: e.target.value }
                    })}
                    className="w-full h-12 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                </div>

                {formData.budget.min > 0 && formData.budget.max > 0 && (
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm font-medium text-center">
                      Budget Range: <span className="text-primary text-lg font-bold">
                        {formData.budget.currency} {formData.budget.min.toLocaleString()} - {formData.budget.max.toLocaleString()}
                      </span>
                      {formData.budget.type === 'hourly' && <span className="text-muted-foreground">/hour</span>}
                      {formData.budget.type === 'monthly' && <span className="text-muted-foreground">/month</span>}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Location & Deadline */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  Location & Timeline
                </h2>
                <p className="text-muted-foreground">Where will the work be done and when do you need it?</p>
              </div>

              <Separator />

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base">Work Location Type *</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {locationTypes.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ 
                          ...formData, 
                          location: { ...formData.location, type: type.value }
                        })}
                        className={`
                          p-4 rounded-lg border-2 transition-all duration-200
                          ${formData.location.type === type.value 
                            ? 'border-primary bg-primary/10 shadow-md' 
                            : 'border-border hover:border-primary/50 hover:bg-accent'
                          }
                        `}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-2xl">{type.icon}</span>
                          <span className="font-medium">{type.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {formData.location.type !== 'remote' && (
                  <div className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-base">City</Label>
                      <Input 
                        id="city"
                        placeholder="e.g. San Francisco"
                        value={formData.location.city || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          location: { ...formData.location, city: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-base">State/Province</Label>
                      <Input 
                        id="state"
                        placeholder="e.g. California"
                        value={formData.location.state || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          location: { ...formData.location, state: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-base">Country *</Label>
                      <Input 
                        id="country"
                        placeholder="e.g. United States"
                        value={formData.location.country || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          location: { ...formData.location, country: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                )}

                {formData.location.type === 'remote' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Label htmlFor="country" className="text-base">Country (Optional)</Label>
                    <Input 
                      id="country"
                      placeholder="e.g. United States (or leave blank for worldwide)"
                      value={formData.location.country || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        location: { ...formData.location, country: e.target.value }
                      })}
                    />
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Application Deadline (Optional)
                  </Label>
                  <Input 
                    id="deadline"
                    type="date"
                    value={formData.applicationDeadline || ''}
                    onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground">
                    If not set, applications will be accepted for 30 days
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {currentStep === 5 && (
            <div className="py-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Job Posted Successfully!</h2>
                <p className="text-muted-foreground text-lg">
                  Your job posting is now live and visible to talented candidates
                </p>
              </div>
              <div className="p-6 rounded-lg bg-primary/10 border border-primary/20 max-w-md mx-auto">
                <p className="text-sm font-medium mb-2">Job Title:</p>
                <p className="text-lg font-bold text-primary">{formData.title}</p>
              </div>
              <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 5 && (
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <div className="text-sm text-muted-foreground">
                Step {currentStep} of 4
              </div>

              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Posting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Post Job
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
