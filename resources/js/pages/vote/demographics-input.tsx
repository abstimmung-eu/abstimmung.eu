import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { saveDemographicData } from '@/lib/demographics';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';

// Add new DemographicDialog component within the file
export default function DemographicInputDialog() {
    const [open, setOpen] = useState(false);
    const [birthYear, setBirthYear] = useState<string>('');
    const [voteData, setVoteData] = useState<{ voteId: number; votePosition: string } | null>(null);

    // Generate years for dropdown (from 1920 to current year)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1919 }, (_, i) => (currentYear - i).toString());

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

    const handleSubmit = () => {
        if (!birthYear || !voteData) return;

        // Save the demographic data
        saveDemographicData({ birthyear: birthYear });

        // Submit the vote
        router.post(
            '/votes/cast',
            {
                vote_id: voteData.voteId,
                vote_position: voteData.votePosition,
                demographics: { birthyear: birthYear },
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
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="birthYear" className="text-right">
                            Geburtsjahr
                        </Label>
                        <Select value={birthYear} onValueChange={setBirthYear}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Bitte wählen" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={() => setOpen(false)} variant="outline">
                        Abbrechen
                    </Button>
                    <Button onClick={handleSubmit} disabled={!birthYear}>
                        Speichern & Abstimmen
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
