"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface EducationFormData {
  school: string;
  degree: string;
  fieldOfStudy: string;
  from: string;
  to?: string;
  description?: string;
}

interface AddEducationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSubmit: (data: EducationFormData) => Promise<void>;
}

export function AddEducationModal({ open, onClose, onSuccess, onSubmit }: AddEducationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<EducationFormData>();

  const onSubmitForm = async (data: EducationFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to add education", error);
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
          <DialogTitle>Add Education</DialogTitle>
          <DialogDescription>
            Add your educational background and qualifications.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="school">School/University *</Label>
            <Input
              id="school"
              {...register("school", { required: "School name is required" })}
              placeholder="e.g. Stanford University"
            />
            {errors.school && (
              <p className="text-sm text-destructive">{errors.school.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="degree">Degree *</Label>
              <Input
                id="degree"
                {...register("degree", { required: "Degree is required" })}
                placeholder="e.g. Bachelor's"
              />
              {errors.degree && (
                <p className="text-sm text-destructive">{errors.degree.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fieldOfStudy">Field of Study *</Label>
              <Input
                id="fieldOfStudy"
                {...register("fieldOfStudy", { required: "Field of study is required" })}
                placeholder="e.g. Computer Science"
              />
              {errors.fieldOfStudy && (
                <p className="text-sm text-destructive">{errors.fieldOfStudy.message}</p>
              )}
            </div>
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
              <Label htmlFor="to">End Date</Label>
              <Input
                id="to"
                type="date"
                {...register("to")}
              />
              <p className="text-xs text-muted-foreground">Leave blank if ongoing</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Activities, achievements, coursework, etc..."
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
              Add Education
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
