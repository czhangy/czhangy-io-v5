type PhotonProperties = {
    osm_id: number;
    osm_type: string;
    name?: string;
    state?: string;
    countrycode?: string;
};

type PhotonFeature = {
    properties: PhotonProperties;
};

type PhotonResponse = {
    features: PhotonFeature[];
};

const STATE_ABBREVIATIONS: Record<string, string> = {
    Alabama: 'AL',
    Alaska: 'AK',
    Arizona: 'AZ',
    Arkansas: 'AR',
    California: 'CA',
    Colorado: 'CO',
    Connecticut: 'CT',
    Delaware: 'DE',
    'District of Columbia': 'DC',
    Florida: 'FL',
    Georgia: 'GA',
    Hawaii: 'HI',
    Idaho: 'ID',
    Illinois: 'IL',
    Indiana: 'IN',
    Iowa: 'IA',
    Kansas: 'KS',
    Kentucky: 'KY',
    Louisiana: 'LA',
    Maine: 'ME',
    Maryland: 'MD',
    Massachusetts: 'MA',
    Michigan: 'MI',
    Minnesota: 'MN',
    Mississippi: 'MS',
    Missouri: 'MO',
    Montana: 'MT',
    Nebraska: 'NE',
    Nevada: 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    Ohio: 'OH',
    Oklahoma: 'OK',
    Oregon: 'OR',
    Pennsylvania: 'PA',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    Tennessee: 'TN',
    Texas: 'TX',
    Utah: 'UT',
    Vermont: 'VT',
    Virginia: 'VA',
    Washington: 'WA',
    'West Virginia': 'WV',
    Wisconsin: 'WI',
    Wyoming: 'WY',
};

export default class LocationHelpers {
    // -------------------------------------------------------------------------
    // PRIVATE
    // -------------------------------------------------------------------------

    private static formatName(props: PhotonProperties): string | null {
        const { name, state, countrycode } = props;
        if (!name) return null;

        if (countrycode === 'US' && state) {
            const abbrev = STATE_ABBREVIATIONS[state] ?? state;
            return `${name}, ${abbrev}`;
        }
        if (countrycode) {
            return `${name}, ${countrycode}`;
        }
        return name;
    }

    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    static async searchLocations(q: string): Promise<string[]> {
        const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=8&osm_tag=place`;
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'czhangy-io/1.0 (charleszhangmb@gmail.com)',
            },
        });
        if (!res.ok) return [];

        const data = (await res.json()) as PhotonResponse;
        const seen = new Set<string>();
        const results: string[] = [];

        for (const feature of data.features) {
            const props = feature.properties;
            const name = this.formatName(props);
            if (!name || seen.has(name)) continue;
            seen.add(name);
            results.push(name);
        }

        return results;
    }
}
