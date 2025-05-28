import { apiUrls } from "@/constants";
import { fetchWrapper } from "@/helpers";
import { CountryResponse } from "@/models";
import { CountryRequest } from "@/models/CountryRequest";

export const countryService = {
    getAll,
    create,
    update,
    delete: async (id: string) => {
        return await fetchWrapper.delete(apiUrls.countries.delete(id));
    },
}

async function getAll(){
    return await fetchWrapper.get(apiUrls.countries.getAll) as CountryResponse[];
}
async function create(country: CountryRequest) {
    return await fetchWrapper.post(apiUrls.countries.insert, country);
}
async function update(id: string, country: CountryRequest) {
    return await fetchWrapper.put(apiUrls.countries.update(id), country);
}
