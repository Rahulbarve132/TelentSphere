"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Search } from "lucide-react";

export interface FilterState {
  keyword: string;
  category: string[];
  type: string[];
  experienceLevel: string[];
  locationType: string[];
  minBudget: string;
  maxBudget: string;
  skills: string;
}

interface JobFiltersProps {
  hideJobType?: boolean;
  excludedTypes?: string[];
  onApplyFilters: (filters: FilterState) => void;
}

export function JobFilters({ hideJobType = false, excludedTypes = [], onApplyFilters }: JobFiltersProps) {
  const [keyword, setKeyword] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);
  const [locationTypes, setLocationTypes] = useState<string[]>([]);
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [skills, setSkills] = useState("");

  const toggleSelection = (
    item: string,
    current: string[],
    setFn: (val: string[]) => void
  ) => {
    if (current.includes(item)) {
      setFn(current.filter((i) => i !== item));
    } else {
      setFn([...current, item]);
    }
  };

  const handleApply = () => {
    const slugify = (str: string) => str.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-");

    onApplyFilters({
      keyword,
      category: categories.map(slugify),
      type: types.map(slugify),
      experienceLevel: experienceLevels.map(slugify),
      locationType: locationTypes.map(slugify),
      minBudget,
      maxBudget,
      skills,
    });
  };

  const handleReset = () => {
    setKeyword("");
    setCategories([]);
    setTypes([]);
    setExperienceLevels([]);
    setLocationTypes([]);
    setMinBudget("");
    setMaxBudget("");
    setSkills("");

    onApplyFilters({
      keyword: "",
      category: [],
      type: [],
      experienceLevel: [],
      locationType: [],
      minBudget: "",
      maxBudget: "",
      skills: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Search</h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Keywords..." 
            className="pl-9 bg-white/50 dark:bg-black/50"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>

      <Accordion type="single" collapsible defaultValue="category" className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {["Web Development", "Mobile Development", "UI/UX Design", "Data Science", "DevOps"].map((cat) => (
                <div key={cat} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`cat-${cat}`} 
                    checked={categories.includes(cat)}
                    onCheckedChange={() => toggleSelection(cat, categories, setCategories)}
                  />
                  <Label htmlFor={`cat-${cat}`}>{cat}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {!hideJobType && (
        <AccordionItem value="type">
          <AccordionTrigger>Job Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {["Full-time", "Part-time", "Contract", "Freelance", "Internship"]
                .filter(type => !excludedTypes.includes(type))
                .map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`type-${type}`}
                    checked={types.includes(type)}
                    onCheckedChange={() => toggleSelection(type, types, setTypes)}
                  />
                  <Label htmlFor={`type-${type}`}>{type}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        )}
        
        <AccordionItem value="experience">
           <AccordionTrigger>Experience Level</AccordionTrigger>
           <AccordionContent>
             <div className="space-y-2">
               {["Entry", "Mid", "Senior", "Lead", "Executive"].map((level) => (
                 <div key={level} className="flex items-center space-x-2">
                   <Checkbox 
                    id={`exp-${level}`} 
                    checked={experienceLevels.includes(level)}
                    onCheckedChange={() => toggleSelection(level, experienceLevels, setExperienceLevels)}
                   />
                   <Label htmlFor={`exp-${level}`}>{level}</Label>
                 </div>
               ))}
             </div>
           </AccordionContent>
        </AccordionItem>


         <AccordionItem value="location">
           <AccordionTrigger>Location</AccordionTrigger>
           <AccordionContent>
             <div className="space-y-2">
               {["Remote", "On-site", "Hybrid"].map((loc) => (
                 <div key={loc} className="flex items-center space-x-2">
                   <Checkbox 
                    id={`loc-${loc}`} 
                    checked={locationTypes.includes(loc)}
                    onCheckedChange={() => toggleSelection(loc, locationTypes, setLocationTypes)}
                   />
                   <Label htmlFor={`loc-${loc}`}>{loc}</Label>
                 </div>
               ))}
             </div>
           </AccordionContent>
        </AccordionItem>

        <AccordionItem value="salary">
           <AccordionTrigger>Salary Range</AccordionTrigger>
           <AccordionContent>
             <div className="space-y-4">
               <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="min-budget" className="text-xs">Min</Label>
                    <Input 
                      id="min-budget"
                      type="number" 
                      placeholder="0" 
                      value={minBudget}
                      onChange={(e) => setMinBudget(e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="max-budget" className="text-xs">Max</Label>
                    <Input 
                      id="max-budget"
                      type="number" 
                      placeholder="Max" 
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                      className="h-8"
                    />
                  </div>
               </div>
             </div>
           </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="skills">
           <AccordionTrigger>Skills</AccordionTrigger>
           <AccordionContent>
             <div className="space-y-2">
               <Label htmlFor="skills-input">Enter skills (comma separated)</Label>
               <Input 
                 id="skills-input"
                 placeholder="React, Node.js, Python..." 
                 value={skills}
                 onChange={(e) => setSkills(e.target.value)}
               />
             </div>
           </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex flex-col gap-2">
        <Button className="w-full" onClick={handleApply}>Apply Filters</Button>
        <Button variant="outline" className="w-full" onClick={handleReset}>Reset Filters</Button>
      </div>
    </div>
  );
}
