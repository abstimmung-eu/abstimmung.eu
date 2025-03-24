import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { Vote } from '@/types/vote';
import { useForm, usePage } from '@inertiajs/react';
import { Trash2, User } from 'lucide-react';
import { FormEventHandler, useMemo } from 'react';

// Maximum comment length
const MAX_COMMENT_LENGTH = 500;

// Function to format date in German style with month name
const formatGermanDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('de-DE', { month: 'long' });
    const year = date.getFullYear();
    return `${day}. ${month} ${year}`;
};

interface Comment {
    parent_id: number | null;
    content: string;
}

interface VoteCommentsProps {
    vote: Vote;
}

export default function VoteComments({ vote }: VoteCommentsProps) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, processing, errors, reset } = useForm<Required<Comment>>({
        parent_id: null,
        content: '',
    });

    // Form for delete operations
    const deleteForm = useForm({});

    // Calculate remaining characters
    const remainingChars = useMemo(() => {
        return MAX_COMMENT_LENGTH - data.content.length;
    }, [data.content]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (data.content.length > MAX_COMMENT_LENGTH) return;

        post(route('comments.store', { vote: vote.id }), {
            preserveScroll: true,
            onSuccess: () => reset('content'),
        });
    };

    const handleDelete = (commentId: number) => {
        if (confirm('Sind Sie sicher, dass Sie diesen Kommentar löschen möchten?')) {
            deleteForm.delete(route('comments.destroy', { comment: commentId }), {
                preserveScroll: true,
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-bold">Kommentare</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Textarea
                            placeholder="Schreiben Sie einen Kommentar..."
                            className="min-h-24 resize-none break-all whitespace-normal"
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            maxLength={MAX_COMMENT_LENGTH}
                        />
                        <div className="flex items-center justify-between">
                            <p
                                className={cn(
                                    'text-xs',
                                    remainingChars < 50 ? 'text-warning' : 'text-muted-foreground',
                                    remainingChars < 0 ? 'text-destructive' : '',
                                )}
                            >
                                {remainingChars} Zeichen übrig
                            </p>
                            <Button type="submit" disabled={processing || data.content.length === 0 || remainingChars < 0}>
                                {processing ? 'Wird gesendet...' : 'Kommentar senden'}
                            </Button>
                        </div>
                        {errors.content && (
                            <Alert variant="destructive" className="py-2">
                                <AlertDescription>{errors.content}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                </form>

                <div className="space-y-4">
                    {vote.comments.length === 0 ? (
                        <p className="text-muted-foreground py-6 text-center">Noch keine Kommentare vorhanden</p>
                    ) : (
                        vote.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-4 rounded-lg border p-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback>
                                        <User size={20} />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold">{comment.commentator?.username || 'Anonymous'}</p>
                                            <span className="text-muted-foreground text-xs">{formatGermanDate(comment.created_at)}</span>
                                        </div>
                                        {comment.commentator?.id === auth.user?.id && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDelete(comment.id)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        )}
                                    </div>
                                    <p className="mt-1 break-all whitespace-normal">{comment.comment}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
