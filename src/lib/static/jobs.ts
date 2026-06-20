export type Job = {
    company: string;
    title: string;
    startDate: string;
    endDate: string | null; // null = Present
    logo: string; // path relative to /public, e.g. '/logos/company.png'
};

// Replace with actual job history — most recent first
export const JOBS: Job[] = [
    {
        company: 'Stripe',
        title: 'Software Engineer',
        startDate: 'Dec 2023',
        endDate: null,
        logo: '/career/stripe.jpeg',
    },
    {
        company: 'Capital One',
        title: 'Software Engineer Intern',
        startDate: 'Jun 2022',
        endDate: 'Aug 2022',
        logo: '/career/capital_one.jpeg',
    },
    {
        company: 'BruinShack',
        title: 'Front-End Lead',
        startDate: 'Nov 2021',
        endDate: 'Jun 2022',
        logo: '/career/bruinshack.jpeg',
    },
    {
        company: 'BruinShack',
        title: 'Full-Stack Developer',
        startDate: 'Feb 2021',
        endDate: 'Nov 2021',
        logo: '/career/bruinshack.jpeg',
    },
    {
        company: 'The Amplification Project',
        title: 'Front-End Developer',
        startDate: 'May 2021',
        endDate: 'Sep 2021',
        logo: '/career/amplification_project.png',
    },
];
