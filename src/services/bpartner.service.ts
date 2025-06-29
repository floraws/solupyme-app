import { BPartnerResponse } from '@/types/api/responses/bpartner.response';
import bpartnersData from '@/data/bpartners.json';

export class BPartnerService {
  private static bpartners: BPartnerResponse[] = bpartnersData as BPartnerResponse[];

  /**
   * Obtiene todos los business partners
   */
  static async getAll(): Promise<BPartnerResponse[]> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.bpartners];
  }

  /**
   * Obtiene un business partner por ID
   */
  static async getById(id: string): Promise<BPartnerResponse | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const bpartner = this.bpartners.find(bp => bp.id === id);
    return bpartner ? { ...bpartner } : null;
  }

  /**
   * Busca business partners por nombre, email o razón social
   */
  static async search(query: string): Promise<BPartnerResponse[]> {
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
  static async getByType(type: 'customer' | 'supplier' | 'both'): Promise<BPartnerResponse[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.bpartners.filter(bp => bp.type === type);
  }

  /**
   * Filtra business partners por estado
   */
  static async getByStatus(status: 'active' | 'inactive' | 'pending'): Promise<BPartnerResponse[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.bpartners.filter(bp => bp.status === status);
  }

  /**
   * Filtra business partners por segmento
   */
  static async getBySegment(segment: 'premium' | 'standard' | 'basic'): Promise<BPartnerResponse[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.bpartners.filter(bp => bp.segment === segment);
  }

  /**
   * Crea un nuevo business partner
   */
  static async create(bpartner: Omit<BPartnerResponse, 'id' | 'createdAt' | 'updatedAt'>): Promise<BPartnerResponse> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newBPartner: BPartnerResponse = {
      ...bpartner,
      id: `bp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.bpartners.push(newBPartner);
    return { ...newBPartner };
  }

  /**
   * Actualiza un business partner existente
   */
  static async update(id: string, updates: Partial<BPartnerResponse>): Promise<BPartnerResponse | null> {
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
  static async delete(id: string): Promise<boolean> {
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
  static async getStats(): Promise<{
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
  static async getTopByValue(limit = 10): Promise<BPartnerResponse[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return [...this.bpartners]
      .sort((a, b) => (b.totalLifetimeValue || 0) - (a.totalLifetimeValue || 0))
      .slice(0, limit);
  }
}

export default BPartnerService;
