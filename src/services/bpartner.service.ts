import { LabelValuePair } from "@/types/api/common";
import { BPartnerResponse, BPartnerListResponse } from '@/types/api/responses/bpartner.response';
import bpartnersData from '@/data/bpartners.json';
import { fetchWrapper } from '@/helpers';
import { apiUrls } from '@/constants';
import { BPartnerRequest } from '@/types/api';

export interface IBPartnerService {
  getLabelValuesList: () => Promise<LabelValuePair[]>;
}

export class BPartnerServiceImpl implements IBPartnerService {
  private bpartners: BPartnerResponse[] = bpartnersData as BPartnerResponse[];


  async getLabelValuesList(): Promise<LabelValuePair[]> {
    return await fetchWrapper.get(apiUrls.bpartners.labelValuesList) as LabelValuePair[];
  }

  /**
   * Obtiene todos los business partners
   */
  async getAll(): Promise<BPartnerResponse[]> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.bpartners];
  }

  /**
   * Obtiene un business partner por ID
   */
  async getById(id: string): Promise<BPartnerResponse | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const bpartner = this.bpartners.find(bp => bp.id === id);
    return bpartner ? { ...bpartner } : null;
  }

  /**
   * Busca business partners por nombre, email o razón social
   */
  async search(query: string): Promise<BPartnerResponse[]> {
    await new Promise(resolve => setTimeout(resolve, 250));

    if (!query.trim()) {
      return this.getAll();
    }

    const searchTerm = query.toLowerCase();
    return this.bpartners.filter(bp =>
      bp.name.toLowerCase().includes(searchTerm) ||
      bp.legalName?.toLowerCase().includes(searchTerm) ||
      bp.email?.toLowerCase().includes(searchTerm) ||
      bp.tradeName?.toLowerCase().includes(searchTerm) ||
      bp.taxId?.toLowerCase().includes(searchTerm) ||
      bp.city?.toLowerCase().includes(searchTerm) ||
      bp.industry?.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Filtra business partners por tipo
   */
  async getByType(type: 'customer' | 'supplier' | 'both'): Promise<BPartnerResponse[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.bpartners.filter(bp => bp.type === type);
  }

  /**
   * Filtra business partners por estado
   */
  async getByStatus(status: 'active' | 'inactive' | 'pending'): Promise<BPartnerResponse[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.bpartners.filter(bp => bp.status === status);
  }

  /**
   * Filtra business partners por segmento
   */
  async getBySegment(segment: 'premium' | 'standard' | 'basic'): Promise<BPartnerResponse[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.bpartners.filter(bp => bp.segment === segment);
  }

  /**
   * Crea un nuevo business partner
   */
  /**
   * Crea un nuevo business partner
   */
  async create(bpartner: BPartnerRequest): Promise<BPartnerResponse> {
    try {
      const newBPartner = await fetchWrapper.post(apiUrls.bpartners.insert, bpartner) as BPartnerResponse;

      this.bpartners.push(newBPartner);
      return { ...newBPartner };
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'status' in error) {
        const err = error as { status?: number; data?: any; message?: string; details?: string[] };
        if (err.status === 400 || err.status === 409) {
          const errorData = err.data || err;

          // Error de código duplicado
          if (errorData.details && errorData.details[0]?.includes('duplicate key value violates unique constraint')) {
            throw new Error('DUPLICATE_CODE');
          }


          // Error de validación general
          if (errorData.message) {
            throw new Error(`VALIDATION_ERROR: ${errorData.message}`);
          }
        }

        // Error de servidor
        if (err.status && err.status >= 500) {
          throw new Error('SERVER_ERROR');
        }
      }

      // Error de red o desconocido
      throw new Error('NETWORK_ERROR');
    }
  }

  /**
   * Actualiza un business partner existente
   */
  async update(id: string, updates: Partial<BPartnerResponse>): Promise<BPartnerResponse | null> {
    await new Promise(resolve => setTimeout(resolve, 350));

    const index = this.bpartners.findIndex(bp => bp.id === id);
    if (index === -1) {
      return null;
    }

    this.bpartners[index] = {
      ...this.bpartners[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return { ...this.bpartners[index] };
  }

  /**
   * Elimina un business partner
   */
  async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = this.bpartners.findIndex(bp => bp.id === id);
    if (index === -1) {
      return false;
    }

    this.bpartners.splice(index, 1);
    return true;
  }

  /**
   * Obtiene estadísticas de business partners
   */
  async getStats(): Promise<{
    total: number;
    customers: number;
    suppliers: number;
    both: number;
    active: number;
    inactive: number;
    bySegment: Record<string, number>;
  }> {
    await new Promise(resolve => setTimeout(resolve, 150));

    const stats = {
      total: this.bpartners.length,
      customers: this.bpartners.filter(bp => bp.type === 'customer').length,
      suppliers: this.bpartners.filter(bp => bp.type === 'supplier').length,
      both: this.bpartners.filter(bp => bp.type === 'both').length,
      active: this.bpartners.filter(bp => bp.status === 'active').length,
      inactive: this.bpartners.filter(bp => bp.status === 'inactive').length,
      bySegment: {
        premium: this.bpartners.filter(bp => bp.segment === 'premium').length,
        standard: this.bpartners.filter(bp => bp.segment === 'standard').length,
        basic: this.bpartners.filter(bp => bp.segment === 'basic').length,
      }
    };

    return stats;
  }

  /**
   * Obtiene los top business partners por valor total
   */
  async getTopByValue(limit = 10): Promise<BPartnerResponse[]> {
    await new Promise(resolve => setTimeout(resolve, 200));

    return [...this.bpartners]
      .sort((a, b) => (b.totalLifetimeValue || 0) - (a.totalLifetimeValue || 0))
      .slice(0, limit);
  }
}

export const bPartnerService = new BPartnerServiceImpl();

