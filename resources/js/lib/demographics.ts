// Type for demographic data
export type DemographicData = {
    birthyear: string;
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
 * Save demographic data to localStorage
 */
export const saveDemographicData = (data: DemographicData): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

/**
 * Load demographic data from localStorage
 */
export const loadDemographicData = (): DemographicData => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return emptyDemographicData;
    
    try {
        return JSON.parse(stored) as DemographicData;
    } catch (e) {
        console.error('Failed to parse demographic data from localStorage', e);
        return emptyDemographicData;
    }
};

/**
 * Update a single field in demographic data
 */
export const updateDemographicField = (
    currentData: DemographicData, 
    field: keyof DemographicData, 
    value: string
): DemographicData => {
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