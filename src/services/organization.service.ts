import { fetchWrapper } from "@/helpers";
import { apiUrls } from "@/constants";


export const organizationService = {
    findOrganizationByUserId: async (userId: string) => {
        try {
            const response = await fetchWrapper.get(apiUrls.organizations.findByUserId(userId));
            return response;
        } catch (error) {
            console.error("Error fetching organization by ID:", error);
            throw error;
        }
    }
}

