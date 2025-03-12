import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { DemographicData, getDemographicFields, loadDemographicData, updateDemographicField } from '@/lib/demographics';
import { BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Persönliche Daten',
        href: '/settings/demographics',
    },
];

export default function Demographics() {
    const [demographicData, setDemographicData] = useState<DemographicData>(loadDemographicData());
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setRecentlySuccessful(true);
    };

    const updateField = (field: keyof DemographicData, value: string) => {
        setRecentlySuccessful(false);
        updateDemographicField(field, value);
        setDemographicData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Persönliche Daten" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Persönliche Daten"
                        description="Aktualisieren Sie Ihre persönlichen Daten. Diese Daten werden nicht an unsere Server übertragen, sondern nur auf Ihrem Gerät gespeichert."
                    />

                    <form onSubmit={submit} className="space-y-6">
                        {getDemographicFields().map((field) => (
                            <>
                                <div key={field.key} className="grid gap-2">
                                    <Label htmlFor={field.key}>{field.label}</Label>
                                    <Select
                                        value={demographicData[field.key as keyof DemographicData]}
                                        onValueChange={(value) => updateField(field.key as keyof DemographicData, value)}
                                    >
                                        <SelectTrigger id={field.key} className="w-full">
                                            <SelectValue placeholder={field.label} />
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
                            </>
                        ))}

                        <div className="flex items-center gap-4">
                            <Button>Speichern</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Gespeichert</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
