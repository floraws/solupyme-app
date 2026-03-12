import { apiUrls } from "@/constants";
import { fetchWrapper } from "@/helpers";
import { 
    ErrorHandler, 
    StandardDeleteResult, 
    StandardQueryOptions, 
    PaginatedResponse,
    QueryBuilder 
} from "@/helpers/error-handler";
import { RegionResponse, CreateStateRequest, UpdateStateRequest } from "@/types/api";
import { LabelValuePair, PaginatedResponse as APIPaginatedResponse } from "@/types/api/common";

/**
 * Interfaz para el servicio de regiones con manejo de errores robusto
 */
export interface IRegionService {
    // Métodos CRUD básicos
    getAll: (options?: StandardQueryOptions) => Promise<RegionResponse[]>;
    getAllPaginated: (options?: StandardQueryOptions) => Promise<PaginatedResponse<RegionResponse>>;
    getById: (id: string) => Promise<RegionResponse>;
    create: (region: CreateStateRequest) => Promise<RegionResponse>;
    update: (id: string, region: UpdateStateRequest) => Promise<RegionResponse>;
    delete: (id: string) => Promise<StandardDeleteResult>;

    // Métodos específicos para regiones
    getByCountry: (countryId: string, options?: StandardQueryOptions) => Promise<RegionResponse[]>;
    search: (query: string, options?: StandardQueryOptions) => Promise<RegionResponse[]>;
    
    // Métodos utilitarios
    getLabelValuesListByCountry: (countryId: string) => Promise<LabelValuePair[]>;
    getAllAsLabelValues: () => Promise<LabelValuePair[]>;
    validateRegionExists: (id: string) => Promise<boolean>;
    
    // Métodos especiales
    createRegionsColombia: () => Promise<void>;
}

/**
 * Implementación del servicio de regiones con manejo de errores estándar
 */
class RegionServiceImpl implements IRegionService {
    private readonly RESOURCE_NAME = 'Región';

    /**
     * Obtiene todas las regiones con opciones de filtrado y ordenamiento
     */
    async getAll(options?: StandardQueryOptions): Promise<RegionResponse[]> {
        try {
            const queryString = options ? QueryBuilder.build(options) : '';
            const url = queryString ? `${apiUrls.regions.getAll}?${queryString}` : apiUrls.regions.getAll;
            
            const response = await fetchWrapper.get(url);
            return response as RegionResponse[];
        } catch (error) {
            ErrorHandler.handleHttpError(error, 'obtener regiones', this.RESOURCE_NAME);
        }
    }

    /**
     * Obtiene regiones paginadas
     */
    async getAllPaginated(options?: StandardQueryOptions): Promise<PaginatedResponse<RegionResponse>> {
        try {
            const queryParams = {
                page: options?.page || 0,
                limit: options?.limit || 10,
                ...options
            };
            
            const queryString = QueryBuilder.build(queryParams);
            const url = `${apiUrls.regions.getAll}/paginated?${queryString}`;
            
            const response = await fetchWrapper.get(url) as APIPaginatedResponse<RegionResponse>;
            
            return {
                data: response.content,
                pagination: {
                    page: response.number,
                    limit: response.size,
                    total: response.totalElements,
                    totalPages: response.totalPages,
                    hasNext: response.number < response.totalPages - 1,
                    hasPrev: response.number > 0
                }
            };
        } catch (error) {
            ErrorHandler.handleHttpError(error, 'obtener regiones paginadas', this.RESOURCE_NAME);
        }
    }

    /**
     * Obtiene una región por ID
     */
    async getById(id: string): Promise<RegionResponse> {
        try {
            ErrorHandler.validateId(id, 'ID de región');
            
            const response = await fetchWrapper.get(apiUrls.regions.getById(id));
            return response as RegionResponse;
        } catch (error) {
            ErrorHandler.handleHttpError(error, 'obtener región', this.RESOURCE_NAME);
        }
    }

    /**
     * Crea una nueva región
     */
    async create(region: CreateStateRequest): Promise<RegionResponse> {
        try {
            this.validateCreateRequest(region);
            
            const response = await fetchWrapper.post(apiUrls.regions.insert, region);
            return response as RegionResponse;
        } catch (error) {
            ErrorHandler.handleHttpError(error, 'crear región', this.RESOURCE_NAME);
        }
    }

    /**
     * Actualiza una región existente
     */
    async update(id: string, region: UpdateStateRequest): Promise<RegionResponse> {
        try {
            ErrorHandler.validateId(id, 'ID de región');
            this.validateUpdateRequest(region);
            
            const response = await fetchWrapper.put(apiUrls.regions.update(id), region);
            return response as RegionResponse;
        } catch (error) {
            ErrorHandler.handleHttpError(error, 'actualizar región', this.RESOURCE_NAME);
        }
    }

    /**
     * Elimina una región
     */
    async delete(id: string): Promise<StandardDeleteResult> {
        try {
            ErrorHandler.validateId(id, 'ID de región');
            
            await fetchWrapper.delete(apiUrls.regions.delete(id));
            
            return {
                success: true,
                message: "Región eliminada exitosamente",
                deletedId: id,
                deletedAt: new Date().toISOString()
            };
        } catch (error) {
            const errorMessage = 'eliminar región';
            
            try {
                ErrorHandler.handleHttpError(error, errorMessage, this.RESOURCE_NAME);
            } catch (handledError) {
                const errorObj = handledError as { message?: string; code?: string };
                return {
                    success: false,
                    message: errorObj.message || "Error al eliminar la región",
                    error: errorObj.code || "DELETE_ERROR"
                };
            }
        }
    }

    /**
     * Obtiene regiones filtradas por país
     */
    async getByCountry(countryId: string, options?: StandardQueryOptions): Promise<RegionResponse[]> {
        try {
            ErrorHandler.validateId(countryId, 'ID de país');
            
            const queryParams = { 
                ...options, 
                filters: { 
                    ...options?.filters, 
                    countryId 
                } 
            };
            
            return await this.getAll(queryParams);
        } catch (error) {
            ErrorHandler.handleHttpError(error, 'obtener regiones por país', this.RESOURCE_NAME);
        }
    }

    /**
     * Busca regiones por texto
     */
    async search(query: string, options?: StandardQueryOptions): Promise<RegionResponse[]> {
        try {
            ErrorHandler.validateRequired(query, 'Término de búsqueda');
            
            const searchOptions = {
                ...options,
                search: query.trim()
            };
            
            return await this.getAll(searchOptions);
        } catch (error) {
            ErrorHandler.handleHttpError(error, 'buscar regiones', this.RESOURCE_NAME);
        }
    }

    /**
     * Obtiene lista de regiones por país como pares label-value
     */
    async getLabelValuesListByCountry(countryId: string): Promise<LabelValuePair[]> {
        try {
            ErrorHandler.validateId(countryId, 'ID de país');
            
            const response = await fetchWrapper.get(apiUrls.regions.labelValuesListByCountry(countryId));
            return response as LabelValuePair[];
        } catch (error) {
            ErrorHandler.handleHttpError(error, 'obtener lista de regiones', this.RESOURCE_NAME);
        }
    }

    /**
     * Obtiene todas las regiones como pares label-value
     */
    async getAllAsLabelValues(): Promise<LabelValuePair[]> {
        try {
            const regions = await this.getAll();
            return regions.map(region => ({
                label: region.name,
                value: region.id
            }));
        } catch (error) {
            ErrorHandler.handleHttpError(error, 'obtener regiones como lista', this.RESOURCE_NAME);
        }
    }

    /**
     * Valida si una región existe
     */
    async validateRegionExists(id: string): Promise<boolean> {
        try {
            await this.getById(id);
            return true;
        } catch (error) {
            // Si es un error 404, la región no existe
            const errorObj = error as { status?: number };
            if (errorObj && errorObj.status === 404) {
                return false;
            }
            // Para otros errores, los propagamos
            throw error;
        }
    }

    /**
     * Crea regiones predefinidas para Colombia
     */
    async createRegionsColombia(): Promise<void> {
        try {
            await fetchWrapper.post(apiUrls.regions.createStatesColombia, {});
        } catch (error) {
            ErrorHandler.handleHttpError(error, 'crear regiones de Colombia', this.RESOURCE_NAME);
        }
    }

    /**
     * Valida datos para crear una región
     */
    private validateCreateRequest(region: CreateStateRequest): void {
        ErrorHandler.validateRequired(region.name, 'Nombre de la región');
        ErrorHandler.validateRequired(region.code, 'Código de la región');
        ErrorHandler.validateRequired(region.countryId, 'ID del país');
        
        ErrorHandler.validateLength(region.name, 'Nombre de la región', 2, 100);
        ErrorHandler.validateLength(region.code, 'Código de la región', 1, 10);
    }

    /**
     * Valida datos para actualizar una región
     */
    private validateUpdateRequest(region: UpdateStateRequest): void {
        if (region.name !== undefined) {
            ErrorHandler.validateRequired(region.name, 'Nombre de la región');
            ErrorHandler.validateLength(region.name, 'Nombre de la región', 2, 100);
        }
        
        if (region.code !== undefined) {
            ErrorHandler.validateRequired(region.code, 'Código de la región');
            ErrorHandler.validateLength(region.code, 'Código de la región', 1, 10);
        }
        
        if (region.countryId !== undefined) {
            ErrorHandler.validateRequired(region.countryId, 'ID del país');
        }
    }
}

export const regionService = new RegionServiceImpl();



