import { PageHeader } from '@/components/page-header';
import VotesList from '@/components/votes-list';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Vote } from '@/types/vote';
import { Head } from '@inertiajs/react';
import GitHistory from './history';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Git',
        href: '/git',
    },
];

type GitProps = {
    year: string;
    month: string | null;
    day: string | null;
    votes: {
        [key: string]: Vote[];
    };
    heatmap: Record<string, number>;
};

export default function Git(props: GitProps) {
    // Get app name from shared props
    const { year, month, day, heatmap, votes } = props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Git" />

            <section className="container mx-auto flex flex-col items-center justify-center gap-8 px-4 py-8">
                <div className="max-w-7xl w-full mt-8 text-center">
                    <PageHeader title={`Namentliche Abstimmungen ${year}`} />
                </div>

                <GitHistory year={year} month={month} day={day} heatmap={heatmap} />

                <div className="max-w-7xl w-full">
                    <div className="my-10 space-y-8 w-full">
                        <VotesList votes={votes} />
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
