import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export default function Footer() {

    const props = usePage<SharedData>();
    const { name } = props.props;

    return (
        <footer className="bg-gradient-to-b from-blue-600 to-blue-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">{name}</h3>
                        <p className="text-sm text-gray-300">Mach deine Stimme sichtbar</p>
                    </div>

                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Schnellzugriff</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-gray-300 hover:text-white">
                                    Startseite
                                </Link>
                            </li>
                            <li>
                                <Link href="/votes" className="text-gray-300 hover:text-white">
                                    Alle Abstimmungen
                                </Link>
                            </li>
                            <li>
                                <Link href="/votes?filter=upcoming" className="text-gray-300 hover:text-white">
                                    Zukünftige Abstimmungen
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-300 hover:text-white">
                                    Über uns
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Ressourcen</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="text-gray-300 hover:text-white">
                                    Offizielle EU Parlament
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-300 hover:text-white">
                                    Abstimmungsprozeduren
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-300 hover:text-white">
                                    MEP Verzeichnis
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-300 hover:text-white">
                                    Gesetzgebungsprozess
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Kontakt</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="text-gray-300">info@abstimmung.eu</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t border-blue-600 pt-8 text-center text-sm text-gray-300">
                    <p>© {new Date().getFullYear()} {name}. Alle Rechte vorbehalten.</p>
                    <p className="mt-2">Diese Website ist nicht mit der Europäischen Union oder dem Europäischen Parlament verbunden.</p>
                </div>
            </div>
        </footer>
    );
}
