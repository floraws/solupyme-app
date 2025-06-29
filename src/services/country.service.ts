import { apiUrls } from "@/constants";
import { fetchWrapper } from "@/helpers";
import { CountryResponse, CountryRequest } from "@/types/api";
import { LabelValuePair } from "@/models";

export const countryService = {
    getAll,
    getById,
    create,
    update,
    getLabelValuesList,
    delete: async (id: string) => {
        return await fetchWrapper.delete(apiUrls.countries.delete(id));
    },    createAllCountries: async () => {
        return await fetchWrapper.post(apiUrls.countries.createAllCountries, {});
    }

}

async function getAll(){
    return await fetchWrapper.get(apiUrls.countries.getAll) as CountryResponse[];
}
async function getById(id: string){
    return await fetchWrapper.get(apiUrls.countries.getById(id)) as CountryResponse;
}
async function create(country: CountryRequest) {
    return await fetchWrapper.post(apiUrls.countries.insert, country);
}
async function update(id: string, country: CountryRequest) {
    return await fetchWrapper.put(apiUrls.countries.update(id), country);
}
async function getLabelValuesList(): Promise<LabelValuePair[]> {
    return await fetchWrapper.get(apiUrls.countries.labelValuesList) as LabelValuePair[];
}
