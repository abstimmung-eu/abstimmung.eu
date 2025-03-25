import { CheckCircleIcon } from 'lucide-react';

export default function AppLogoIcon(props: { className?: string }) {
    return <CheckCircleIcon className={`text-blue-900 dark:text-blue-500 ${props.className}`}></CheckCircleIcon>;
}
