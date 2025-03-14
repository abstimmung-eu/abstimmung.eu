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
 */
export const saveDemographicData = (data: DemographicData): void => {
    data.age_group = mapBirthyearToAgeGroup(data.birthyear);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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
export const updateDemographicField = (currentData: DemographicData, field: keyof DemographicData, value: string): DemographicData => {
    return { ...currentData, [field]: value };
};

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
