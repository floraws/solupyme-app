import { apiUrls } from "@/constants";
import { fetchWrapper } from "@/helpers";
import { CountryResponse, CountryRequest } from "@/types/api";

export const countryService = {
    getAll,
    getById,
    create,
    update,
    delete: async (id: string) => {
        return await fetchWrapper.delete(apiUrls.countries.delete(id));
    },
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
