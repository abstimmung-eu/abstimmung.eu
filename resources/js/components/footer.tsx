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
                        <p className="text-sm text-gray-300">Werden Sie Teil des demokratischen Dialogs</p>
                    </div>

                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Schnellzugriff</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/"
                                    className="border-b border-transparent text-blue-200 transition-colors duration-200 hover:border-white hover:text-white"
                                >
                                    Startseite
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/votes"
                                    className="border-b border-transparent text-blue-200 transition-colors duration-200 hover:border-white hover:text-white"
                                >
                                    Alle Abstimmungen
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="border-b border-transparent text-blue-200 transition-colors duration-200 hover:border-white hover:text-white"
                                >
                                    Über uns
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Ressourcen</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="https://www.bundestag.de"
                                    target="_blank"
                                    className="border-b border-transparent text-blue-200 transition-colors duration-200 hover:border-white hover:text-white"
                                >
                                    Website des Deutschen Bundestages
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.bundestag.de/abstimmung"
                                    target="_blank"
                                    className="border-b border-transparent text-blue-200 transition-colors duration-200 hover:border-white hover:text-white"
                                >
                                    Namentliche Abstimmungen
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/abstimmung-eu/abstimmung.eu"
                                    target="_blank"
                                    className="border-b border-transparent text-blue-200 transition-colors duration-200 hover:border-white hover:text-white"
                                >
                                    GitHub Repository
                                </a>
                            </li>
                            <li>
                                <a
                                    href={route('rss.index')}
                                    target="_blank"
                                    className="border-b border-transparent text-blue-200 transition-colors duration-200 hover:border-white hover:text-white"
                                >
                                    RSS Feed
                                </a>
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

                <div className="mt-8 border-t border-blue-600 pt-8 text-sm text-gray-300">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <p>
                                © {new Date().getFullYear()} {name}. Alle Rechte vorbehalten.
                            </p>
                            <p className="mt-2">Diese Website ist nicht mit dem Bundestag assoziiert.</p>
                        </div>
                        <div className="mt-4 space-x-4 md:mt-0">
                            <Link
                                href="/impressum"
                                className="border-b border-transparent text-blue-200 transition-colors duration-200 hover:border-white hover:text-white"
                            >
                                Impressum
                            </Link>
                            <Link
                                href="/datenschutz"
                                className="border-b border-transparent text-blue-200 transition-colors duration-200 hover:border-white hover:text-white"
                            >
                                Datenschutz
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
