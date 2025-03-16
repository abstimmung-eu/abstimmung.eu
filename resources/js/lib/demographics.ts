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
    {
        label: 'Geburtsjahr',
        key: 'birthyear',
        hidden: false,
        options: generateYearOptions(),
    },
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
            { value: 'male', label: 'Männlich' },
            { value: 'female', label: 'Weiblich' },
            { value: 'non_binary', label: 'Non-binär' },
            { value: 'other', label: 'Divers' },
        ],
    },
    {
        label: 'Familienstand',
        key: 'marital_status',
        hidden: false,
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
        hidden: false,
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
        hidden: false,
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
        hidden: false,
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
        hidden: false,
        options: [
            { value: '1', label: 'Unter 1000 €' },
            { value: '2', label: '1000 - 1999 €' },
            { value: '3', label: '2000 - 2999 €' },
            { value: '4', label: '3000 - 3999 €' },
            { value: '5', label: '4000 - 4999 €' },
            { value: '6', label: '5000 - 5999 €' },
            { value: '7', label: '6000 - 6999 €' },
            { value: '8', label: '7000 - 7999 €' },
            { value: '9', label: '8000 - 8999 €' },
            { value: '10', label: '9000 - 9999 €' },
            { value: '11', label: '10000 - 10999 €' },
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

/**
 * Encode data before storing in localStorage
 */
const encodeData = (data: any): string => {
    return btoa(JSON.stringify(data));
};

/**
 * Decode data after retrieving from localStorage
 */
const decodeData = (encoded: string): any => {
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

    localStorage.setItem(STORAGE_KEY, encodeData(mergedData));
};

/**
 * Load demographic data from localStorage
 */
export const loadDemographicData = (): DemographicData => {
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

export const deleteDemographicData = (): void => {
    localStorage.removeItem(STORAGE_KEY);
};
