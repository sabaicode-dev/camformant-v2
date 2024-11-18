export interface JobOpeningRequest {
    title: string;
    description: string;
    requirements: string;
    location: {
        city: string;
        country: string;
    };
}