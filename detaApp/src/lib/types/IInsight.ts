export interface IInsight {
    // METADATA
    createdAt: number;  // Unix timestamp
    updatedAt: number;  // Unix timestamp

    // PAYLOAD
    project: string;    // Project associated with this insight
    insight: string;    // Insight name -> unique, simple and searchable e.g. "total_users", "last_time"
    title: string;      // Title to display for this insight
    value: string | number; // Last value to display for this insight
    icon: string;       // Icon to display for this insight
}