const STORAGE_KEY = 'd';

/**
 * Generate year options for birthyear select
 */
export const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 91 }, (_, i) => currentYear - 10 - i).map((year) => ({
        value: year.toString(),
        label: year.toString(),
    }));
};

/**
 * Map birthyear to age group
 */
export const mapYearToAgeGroup = (year: string) => {
    const age = new Date().getFullYear() - parseInt(year);
    if (age < 18) return '17_and_under';
    if (age < 25) return '18_to_24';
    if (age < 35) return '25_to_34';
    if (age < 45) return '35_to_44';
    if (age < 55) return '45_to_54';
    if (age < 65) return '55_to_64';
    return '65_plus';
};
const DEMOGRAPHIC_FIELDS = [
    { label: 'Geburtsjahr', key: 'birthyear', hidden: false, options: generateYearOptions() },
    {
        label: 'Alter',
        key: 'age_group',
        hidden: true,
        options: [],
    },
    {
        label: 'Geschlecht',
        key: 'gender',
        hidden: false,
        options: [
            {
                value: 'male',
                label: 'Männlich',
            },
            {
                value: 'female',
                label: 'Weiblich',
            },
            {
                value: 'other',
                label: 'Divers',
            },
            {
                value: 'prefer_not_to_say',
                label: 'Keine Angabe',
            },
        ],
    },
    {
        label: 'Familienstand',
        key: 'marital_status',
        hidden: false,
        options: [
            {
                value: 'single',
                label: 'Ledig',
            },
            {
                value: 'married_or_civil_union',
                label: 'Verheiratet oder in eingetragener Lebenspartnerschaft',
            },
            {
                value: 'separated',
                label: 'In Trennung lebend',
            },
            {
                value: 'divorced',
                label: 'Geschieden',
            },
            {
                value: 'widowed',
                label: 'Verwitwet',
            },
            {
                value: 'prefer_not_to_say',
                label: 'Keine Angabe',
            },
        ],
    },
    {
        label: 'Derzeitiger oder angestrebter Ausbildungsstand',
        key: 'education',
        hidden: false,
        options: [
            {
                value: 'no_degree',
                label: 'Kein Schulabschluss',
            },
            {
                value: 'primary',
                label: 'Hauptschulabschluss',
            },
            {
                value: 'secondary',
                label: 'Realschulabschluss / Mittlere Reife',
            },
            {
                value: 'vocational',
                label: 'Fachhochschulreife',
            },
            {
                value: 'abitur',
                label: 'Abitur / Allgemeine Hochschulreife',
            },
            {
                value: 'bachelor',
                label: 'Bachelor-Abschluss',
            },
            {
                value: 'master',
                label: 'Master-Abschluss',
            },
            {
                value: 'doctorate',
                label: 'Promotion / Doktortitel',
            },
            {
                value: 'prefer_not_to_say',
                label: 'Keine Angabe',
            },
        ],
    },
    {
        label: 'Aktuelle Tätigkeit',
        key: 'current_activity',
        hidden: false,
        options: [
            {
                value: 'attending_school',
                label: 'Besuch einer allgemeinbildenden Schule',
            },
            {
                value: 'studying',
                label: 'Studium',
            },
            {
                value: 'vocational_training',
                label: 'Berufliche Ausbildung',
            },
            {
                value: 'retraining',
                label: 'Umschulung',
            },
            {
                value: 'voluntary_military_service',
                label: 'Freiwilliger Wehrdienst',
            },
            {
                value: 'bfd_fsj_fej',
                label: 'Bundesfreiwilligendienst, freiwilliges soziales oder ökologisches Jahr',
            },
            {
                value: 'career_break',
                label: 'Erwerbsunterbrechung (z. B. Pflegezeit, Mutterschutz, Elternzeit ohne Teilzeit-Tätigkeit)',
            },
            {
                value: 'employed',
                label: 'Erwerbstätig (Vollzeit, Teilzeit oder geringfügig)',
            },
            {
                value: 'retired',
                label: 'Rentner*in / Pensionär*in',
            },
            {
                value: 'unemployed',
                label: 'Arbeitslos',
            },
            {
                value: 'permanently_unfit',
                label: 'Dauerhaft erwerbsunfähig',
            },
            {
                value: 'household_management',
                label: 'Hausfrau/Hausmann',
            },
            {
                value: 'other',
                label: 'Sonstige',
            },
            {
                value: 'prefer_not_to_say',
                label: 'Keine Angabe',
            },
        ],
    },
    {
        label: 'Haushaltsgröße',
        key: 'household_size',
        hidden: false,
        options: [
            {
                value: '1',
                label: '1 Person',
            },
            {
                value: '2',
                label: '2 Personen',
            },
            {
                value: '3',
                label: '3 Personen',
            },
            {
                value: '4',
                label: '4 Personen',
            },
            {
                value: '5',
                label: '5 Personen',
            },
            {
                value: '6',
                label: '6 Personen',
            },
            {
                value: '7',
                label: '7 Personen',
            },
            {
                value: '8',
                label: '8 Personen',
            },
            {
                value: '9',
                label: '9 Personen',
            },
            {
                value: '10_or_more',
                label: '10 oder mehr Personen',
            },
            {
                value: 'prefer_not_to_say',
                label: 'Keine Angabe',
            },
        ],
    },
    {
        label: 'Bundesland',
        key: 'federal_state',
        hidden: false,
        options: [
            {
                value: 'baden_wuerttemberg',
                label: 'Baden-Württemberg',
            },
            {
                value: 'bayern',
                label: 'Bayern',
            },
            {
                value: 'berlin',
                label: 'Berlin',
            },
            {
                value: 'brandenburg',
                label: 'Brandenburg',
            },
            {
                value: 'bremen',
                label: 'Bremen',
            },
            {
                value: 'hamburg',
                label: 'Hamburg',
            },
            {
                value: 'hessen',
                label: 'Hessen',
            },
            {
                value: 'mecklenburg_vorpommern',
                label: 'Mecklenburg-Vorpommern',
            },
            {
                value: 'niedersachsen',
                label: 'Niedersachsen',
            },
            {
                value: 'nordrhein_westfalen',
                label: 'Nordrhein-Westfalen',
            },
            {
                value: 'rheinland_pfalz',
                label: 'Rheinland-Pfalz',
            },
            {
                value: 'saarland',
                label: 'Saarland',
            },
            {
                value: 'sachsen',
                label: 'Sachsen',
            },
            {
                value: 'sachsen_anhalt',
                label: 'Sachsen-Anhalt',
            },
            {
                value: 'schleswig_holstein',
                label: 'Schleswig-Holstein',
            },
            {
                value: 'thueringen',
                label: 'Thüringen',
            },
            {
                value: 'prefer_not_to_say',
                label: 'Keine Angabe',
            },
        ],
    },
    {
        label: 'Nettoeinkommen',
        key: 'income',
        hidden: false,
        options: [
            {
                value: 'under_1000',
                label: 'Unter 1000 €',
            },
            {
                value: '1000_1999',
                label: '1.000 bis 1.999 €',
            },
            {
                value: '2000_2999',
                label: '2.000 bis 2.999 €',
            },
            {
                value: '3000_3999',
                label: '3.000 bis 3.999 €',
            },
            {
                value: '4000_4999',
                label: '4.000 bis 4.999 €',
            },
            {
                value: '5000_5999',
                label: '5.000 bis 5.999 €',
            },
            {
                value: '6000_6999',
                label: '6.000 bis 6.999 €',
            },
            {
                value: '7000_7999',
                label: '7.000 bis 7.999 €',
            },
            {
                value: '8000_8999',
                label: '8.000 bis 8.999 €',
            },
            {
                value: '9000_9999',
                label: '9.000 bis 9.999 €',
            },
            {
                value: '10000_plus',
                label: '10.000 € oder mehr',
            },
            {
                value: 'prefer_not_to_say',
                label: 'Keine Angabe',
            },
        ],
    },
    {
        label: 'Politische Einstellung',
        key: 'political_affiliation',
        hidden: false,
        options: [
            {
                value: 'very_conservative',
                label: 'Sehr konservativ',
            },
            {
                value: 'conservative',
                label: 'Konservativ',
            },
            {
                value: 'middle',
                label: 'Mitte',
            },
            {
                value: 'liberal',
                label: 'Liberal',
            },
            {
                value: 'very_liberal',
                label: 'Sehr liberal',
            },
            {
                value: 'no_opinion',
                label: 'Keine Meinung',
            },
            {
                value: 'prefer_not_to_say',
                label: 'Keine Angabe',
            },
        ],
    },
];
export const getDemographicFields = () => {
    return DEMOGRAPHIC_FIELDS.filter((field) => !field.hidden);
};

// Type for demographic data
export type DemographicData = {
    birthyear: string;
    age_group: string;
    gender: string;
    marital_status: string;
    education: string;
    current_activity: string;
    household_size: string;
    income: string;
    political_affiliation: string;
};

// Default empty demographic data
export const emptyDemographicData: DemographicData = {
    birthyear: '',
    age_group: '',
    gender: '',
    marital_status: '',
    education: '',
    current_activity: '',
    household_size: '',
    income: '',
    political_affiliation: '',
};

/**
 * Encode data before storing in localStorage
 */
const encodeData = (data: DemographicData): string => {
    return btoa(JSON.stringify(data));
};

/**
 * Decode data after retrieving from localStorage
 */
const decodeData = (encoded: string): DemographicData | null => {
    try {
        return JSON.parse(atob(encoded));
    } catch (error) {
        console.error('Error decoding demographics data:', error);
        return null;
    }
};

/**
 * Check if any demographic data is stored is empty
 */
export const isDemographicDataEmpty = (): boolean => {
    if (typeof window === 'undefined') return true;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return true;

    const data = decodeData(stored) as DemographicData;
    if (!data) return true;

    return Object.values(data).some((value) => value === '');
};

/**
 * Save demographic data to localStorage
 * Accepts partial data and merges with existing data
 */
export const saveDemographicData = (data: Partial<DemographicData>): void => {
    const currentData = loadDemographicData();
    const mergedData = { ...currentData, ...data };

    if (mergedData.birthyear) {
        mergedData.age_group = mapYearToAgeGroup(mergedData.birthyear);
    }

    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, encodeData(mergedData));
    }
};

/**
 * Load demographic data from localStorage
 */
export const loadDemographicData = (): DemographicData => {
    if (typeof window === 'undefined') return emptyDemographicData;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return emptyDemographicData;

    const decoded = decodeData(stored);
    return decoded || emptyDemographicData;
};

/**
 * Update a single field in demographic data
 */
export const updateDemographicField = (field: keyof DemographicData, value: string): void => {
    const currentData = loadDemographicData();
    currentData[field] = value;
    saveDemographicData(currentData);
};

/**
 * Delete demographic data from localStorage
 */
export const deleteDemographicData = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
    }
};
