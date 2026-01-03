"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface ExperienceFormData {
  title: string;
  company: string;
  location?: string;
  from: string;
  to?: string;
  current: boolean;
  description?: string;
}

interface AddExperienceModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSubmit: (data: ExperienceFormData) => Promise<void>;
}

export function AddExperienceModal({ open, onClose, onSuccess, onSubmit }: AddExperienceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<ExperienceFormData>({
    defaultValues: {
      current: false,
    }
  });

  const isCurrent = watch("current");

  const onSubmitForm = async (data: ExperienceFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to add experience", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Work Experience</DialogTitle>
          <DialogDescription>
            Add your professional experience to showcase your career history.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              {...register("title", { required: "Job title is required" })}
              placeholder="e.g. Software Engineer"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              {...register("company", { required: "Company name is required" })}
              placeholder="e.g. Google"
            />
            {errors.company && (
              <p className="text-sm text-destructive">{errors.company.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="e.g. San Francisco, CA or Remote"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from">Start Date *</Label>
              <Input
                id="from"
                type="date"
                {...register("from", { required: "Start date is required" })}
              />
              {errors.from && (
                <p className="text-sm text-destructive">{errors.from.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="to">End Date {!isCurrent && "*"}</Label>
              <Input
                id="to"
                type="date"
                {...register("to", { 
                  required: !isCurrent && "End date is required" 
                })}
                disabled={isCurrent}
              />
              {errors.to && !isCurrent && (
                <p className="text-sm text-destructive">{errors.to.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="current"
              checked={isCurrent}
              onCheckedChange={(checked) => {
                setValue("current", checked as boolean);
                if (checked) {
                  setValue("to", "");
                }
              }}
            />
            <Label 
              htmlFor="current" 
              className="text-sm font-normal cursor-pointer"
            >
              I currently work here
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe your responsibilities and achievements..."
              className="h-32 resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {watch("description")?.length || 0} / 500 characters
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Experience
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
