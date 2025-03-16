import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DemographicData, getDemographicFields, loadDemographicData, saveDemographicData } from '@/lib/demographics';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';

// Add new DemographicDialog component within the file
export default function DemographicInputDialog() {
    const [open, setOpen] = useState(false);
    const [demographicData, setDemographicData] = useState<DemographicData>(loadDemographicData());
    const [voteData, setVoteData] = useState<{ voteId: number; votePosition: string } | null>(null);

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

        // Save the demographic data
        saveDemographicData(demographicData);

        // Submit the vote
        router.post(
            '/votes/cast',
            {
                vote_id: voteData.voteId,
                vote_position: voteData.votePosition,
                demographics: loadDemographicData(),
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
            <DialogContent className="sm:max-w-[425px]">
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

                <DialogFooter>
                    <Button onClick={() => setOpen(false)} variant="outline">
                        Abbrechen
                    </Button>
                    <Button onClick={handleSubmit} disabled={!isFormValid}>
                        Speichern & Abstimmen
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
