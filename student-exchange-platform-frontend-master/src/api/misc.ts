// interface University {
//     name: string,
//     alpha_two_code: string,
//     country: string,
//     web_pages: string[],
//     state_province: string | null, // api named "state-province"
//     domains: string[]
// }

// interface UniversityApiResponse {
//     data: University[]
// }

// interface UniversityResponse {}

async function fetchUniversities(country: string, name: string): Promise<string[]> {
    if (country.length === 0 || name.length === 0) {
        return [];
    }

    if (country === "United States") {
        country = "USA";
    } else if (country === "Hong Kong S.A.R.") {
        country = "Hong Kong";
    } // there may be more edge cases

    country = country.replaceAll(" ", "%20");
    name = name.replaceAll(" ", "%20");
    
    const str = `http://universities.hipolabs.com/search?country=${country}&name=${name}`;
    const response = await fetch(str, { signal: AbortSignal.timeout(5000) });
    const data = await response.json();
    const mapped = data.map((uni: { [x: string]: any; }) => uni["name"])
    // console.log(str, country, name, mapped);
    return mapped;
}

export default fetchUniversities;