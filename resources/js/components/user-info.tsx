import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type User } from '@/types';
import { User as UserIcon } from 'lucide-react';

export function UserInfo({ user, showEmail = true }: { user: User, showEmail?: boolean }) {
    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    <UserIcon className="text-muted-foreground size-4" />
                </AvatarFallback>
            </Avatar>
            {showEmail && (
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.email}</span>
                </div>
            )}
        </>
    );
}
