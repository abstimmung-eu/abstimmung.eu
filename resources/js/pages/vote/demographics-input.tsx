import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DemographicData, getDemographicFields, loadDemographicData, mapYearToAgeGroup, saveDemographicData } from '@/lib/demographics';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Add new DemographicDialog component within the file
export default function DemographicInputDialog() {
    const [open, setOpen] = useState(false);
    const [demographicData, setDemographicData] = useState<DemographicData>(loadDemographicData());
    const [voteData, setVoteData] = useState<{ voteId: number; votePosition: string } | null>(null);

    const FormSchema = z.object({
        saveDataLocally: z.boolean().default(true),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            saveDataLocally: true,
        },
    });

    React.useEffect(() => {
        const handleOpenDialog = (e: Event) => {
            const demographicDialogEvent = e as CustomEvent;
            setVoteData(demographicDialogEvent.detail);
            setOpen(true);
        };

        document.addEventListener('open-demographic-dialog', handleOpenDialog);
        return () => {
            document.removeEventListener('open-demographic-dialog', handleOpenDialog);
        };
    }, []);

    const updateField = (field: keyof DemographicData, value: string) => {
        setDemographicData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!voteData) return;

        // Check if at least one demographic field is filled
        const hasData = Object.values(demographicData).some((value) => value !== '');
        if (!hasData) return;

        // Save the demographic data if the checkbox is checked
        if (form.getValues().saveDataLocally) {
            saveDemographicData(demographicData);
        }

        // Ensure age_group is set correctly
        const dataToSubmit = { ...demographicData };
        if (dataToSubmit.birthyear && !dataToSubmit.age_group) {
            dataToSubmit.age_group = mapYearToAgeGroup(dataToSubmit.birthyear);
        }

        // Submit the vote
        router.post(
            '/votes/cast',
            {
                vote_id: voteData.voteId,
                vote_position: voteData.votePosition,
                demographics: dataToSubmit,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({ only: ['user_vote_participation'] });
                },
            },
        );

        setOpen(false);
    };

    // Check if all demographic fields have data
    const isFormValid = getDemographicFields().every(
        (field) => demographicData[field.key as keyof DemographicData] && demographicData[field.key as keyof DemographicData] !== '',
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Demografische Daten benötigt</DialogTitle>
                    <DialogDescription>
                        Um abzustimmen, benötigen wir einige demografische Informationen. Diese werden anonymisiert gespeichert.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {getDemographicFields().map((field) => (
                        <div key={field.key} className="grid gap-2">
                            <Label htmlFor={field.key}>{field.label}</Label>
                            <Select
                                value={demographicData[field.key as keyof DemographicData]}
                                onValueChange={(value) => updateField(field.key as keyof DemographicData, value)}
                            >
                                <SelectTrigger id={field.key}>
                                    <SelectValue placeholder={`Bitte wählen`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {field.options.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ))}
                </div>

                <Form {...form}>
                    <FormField
                        control={form.control}
                        name="saveDataLocally"
                        render={({ field }) => (
                            <FormItem className="mb-4 flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox id="save-data" checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel htmlFor="save-data">Daten für zukünftige Abstimmungen lokal auf diesem Gerät speichern</FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                </Form>

                <DialogFooter>
                    <Button onClick={() => setOpen(false)} variant="outline">
                        Abbrechen
                    </Button>
                    <Button onClick={handleSubmit} disabled={!isFormValid}>
                        Abstimmen
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
