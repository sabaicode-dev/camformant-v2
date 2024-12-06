import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { JobFormData } from '@/lib/types/job';

interface BenefitsFieldProps {
  form: UseFormReturn<JobFormData>;
}

export function BenefitsField({ form }: BenefitsFieldProps) {
  const [newBenefit, setNewBenefit] = useState('');
  const benefits = form.watch('benefit') || [];

  const addBenefit = () => {
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      const updatedBenefits = [...benefits, newBenefit.trim()];
      form.setValue('benefit', updatedBenefits);
      setNewBenefit('');
    }
  };

  const removeBenefit = (benefit: string) => {
    const updatedBenefits = benefits.filter((b) => b !== benefit);
    form.setValue('benefit', updatedBenefits);
  };

  return (
    <FormField
      control={form.control}
      name="benefit"
      render={() => (
        <FormItem className="space-y-4">
          <FormLabel>Benefits</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Add a benefit"
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addBenefit();
                }
              }}
            />
            <Button type="button" onClick={addBenefit}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {benefits.map((benefit) => (
              <Badge key={benefit} variant="secondary">
                {benefit}
                <button
                  type="button"
                  onClick={() => removeBenefit(benefit)}
                  className="ml-2"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <FormMessage>{form.formState.errors.benefit?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
}