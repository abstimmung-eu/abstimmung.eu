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

export const DEMOGRAPHIC_FIELDS = [
    {
        label: 'Geburtsjahr',
        key: 'birthyear',
        options: generateYearOptions(),
        hidden: false,
    },
    {
        label: 'Alter',
        key: 'age_group',
        hidden: true,
        options: []
    },
    {
        label: 'Geschlecht',
        key: 'gender',
        options: [
            { value: 'male', label: 'Männlich' },
            { value: 'female', label: 'Weiblich' },
        ],
    },
    {
        label: 'Familienstand',
        key: 'marital_status',
        options: [
            { value: 'single', label: 'Single' },
            { value: 'married', label: 'Verheiratet' },
            { value: 'divorced', label: 'Getrennt lebend' },
            { value: 'widowed', label: 'Verwitwet' },
        ],
    },
    {
        label: 'Bildung',
        key: 'education',
        options: [
            { value: 'primary', label: 'Hauptschule' },
            { value: 'secondary', label: 'Realschule' },
            { value: 'vocational', label: 'Fachschule' },
            { value: 'university', label: 'Universität' },
        ],
    },
    {
        label: 'Beruf',
        key: 'profession',
        options: [
            { value: 'student', label: 'Student' },
            { value: 'employed', label: 'Angestellt' },
            { value: 'self_employed', label: 'Selbständig' },
            { value: 'retired', label: 'Rentner' },
        ],
    },
    {
        label: 'Haushaltsgröße',
        key: 'household_size',
        options: [
            { value: '1', label: '1 Person' },
            { value: '2', label: '2 Personen' },
            { value: '3', label: '3 Personen' },
            { value: '4', label: '4 Personen' },
        ],
    },
    {
        label: 'Einkommen',
        key: 'income',
        options: [
            { value: '1', label: 'Unter 1000 €' },
            { value: '2', label: '1000 - 1999 €' },
            { value: '3', label: '2000 - 2999 €' },
            { value: '4', label: '3000 - 3999 €' },
        ],
    },
];

// Type for demographic data
export type DemographicData = {
    birthyear: string;
    age_group: string;
    gender: string;
    marital_status: string;
    education: string;
    profession: string;
    household_size: string;
    income: string;
};

// Default empty demographic data
export const emptyDemographicData: DemographicData = {
    birthyear: '',
    age_group: '',
    gender: '',
    marital_status: '',
    education: '',
    profession: '',
    household_size: '',
    income: '',
};

// Storage key for demographic data
const STORAGE_KEY = 'demographics';

/**
 * Check if any demographic data is stored is empty
 */
export const isDemographicDataEmpty = (): boolean => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return true;

    const data = JSON.parse(stored) as DemographicData;
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
        mergedData.age_group = mapBirthyearToAgeGroup(mergedData.birthyear);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
};

/**
 * Load demographic data from localStorage
 */
export const loadDemographicData = (): DemographicData => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return emptyDemographicData;
    return JSON.parse(stored) as DemographicData;
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
 * Map birthyear to age group
 */
export const mapBirthyearToAgeGroup = (birthyear: string) => {
    const age = new Date().getFullYear() - parseInt(birthyear);
    if (age < 18) return '17_and_under';
    if (age < 25) return '18_to_24';
    if (age < 35) return '25_to_34';
    if (age < 45) return '35_to_44';
    if (age < 55) return '45_to_54';
    if (age < 65) return '55_to_64';
    return '65_plus';
};
