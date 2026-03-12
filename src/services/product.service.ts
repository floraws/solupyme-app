import { LabelValuePair } from "@/types/api/common";
import {
    ProductCreateRequest,
    ProductUpdateRequest,
    ProductFiltersRequest,
    ProductResponse,
    ProductStatsResponse
} from "@/types/api";
import productsData from "@/data/products.json";

// Shared data - in a real app, this would be replaced with API calls
const products: ProductResponse[] = structuredClone(productsData) as ProductResponse[];

// Utility functions for common operations
const simulateDelay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

const getCurrentUser = () => "current_user"; // In real app, get from auth context

const calculateProfitMargin = (price?: number, costPrice?: number): number => {
    if (!price || !costPrice) return 0;
    return ((price - costPrice) / price) * 100;
};

// Product Service Interface
export interface IProductService {
    getAll: (filters?: ProductFiltersRequest) => Promise<ProductResponse[]>;
    getById: (id: string) => Promise<ProductResponse | null>;
    create: (productData: ProductCreateRequest) => Promise<ProductResponse>;
    update: (id: string, productData: ProductUpdateRequest) => Promise<ProductResponse | null>;
    delete: (id: string) => Promise<boolean>;
    getLabelValuesList: () => Promise<LabelValuePair[]>;
    getStats: () => Promise<ProductStatsResponse>;
    search: (query: string) => Promise<ProductResponse[]>;
    getByCategory: (category: string) => Promise<ProductResponse[]>;
    getByBrand: (brand: string) => Promise<ProductResponse[]>;
    getLowStockProducts: () => Promise<ProductResponse[]>;
    getOutOfStockProducts: () => Promise<ProductResponse[]>;
    updateStock: (id: string, newStock: number) => Promise<ProductResponse | null>;
    bulkUpdate: (updates: { id: string; data: Partial<ProductUpdateRequest> }[]) => Promise<ProductResponse[]>;
}

// Enhanced filtering logic
const applyFilters = (products: ProductResponse[], filters: ProductFiltersRequest): ProductResponse[] => {
    return products.filter(product => {
        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase().trim();
            if (!searchTerm) return true;

            const searchableFields = [
                product.name,
                product.description,
                product.sku,
                product.barcode,
                product.brand,
                product.category,
                product.subcategory,
                product.manufacturer,
                product.model
            ].filter(Boolean);

            const matches = searchableFields.some(field =>
                field?.toLowerCase().includes(searchTerm)
            );

            if (!matches) return false;
        }

        // Category filter
        if (filters.category &&
            !product.category?.toLowerCase().includes(filters.category.toLowerCase())) {
            return false;
        }

        // Brand filter
        if (filters.brand &&
            !product.brand?.toLowerCase().includes(filters.brand.toLowerCase())) {
            return false;
        }

        // Status filter
        if (filters.status && product.status !== filters.status) {
            return false;
        }

        // Available filter
        if (filters.available !== undefined && product.available !== filters.available) {
            return false;
        }

        // Price range filters
        if (filters.minPrice !== undefined && product.price < filters.minPrice) {
            return false;
        }

        if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
            return false;
        }

        // Stock filters
        if (filters.lowStock && product.stock > (product.reorderPoint || 0)) {
            return false;
        }

        if (filters.outOfStock && product.stock !== 0) {
            return false;
        }

        return true;
    });
};

// Generate unique product ID
const generateProductId = (): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return `prod_${timestamp}_${random}`;
};


export class ProductServiceImpl implements IProductService {
    async getAll(filters?: ProductFiltersRequest): Promise<ProductResponse[]> {
        try {
            await simulateDelay();

            if (!filters || Object.keys(filters).length === 0) {
                return [...products];
            }

            return applyFilters(products, filters);
        } catch (error) {
            console.error("Error getting products:", error);
            throw error;
        }
    };
    async getById(id: string): Promise<ProductResponse | null> {
        try {
            if (!id?.trim()) {
                throw new Error("Product ID is required");
            }

            await simulateDelay(200);

            const product = products.find(p => p.id === id);
            return product ? { ...product } : null;
        } catch (error) {
            console.error("Error getting product by ID:", error);
            throw error;
        }
    }
    async create(productData: ProductCreateRequest): Promise<ProductResponse> {
        try {
            // Validation
            if (!productData.name?.trim()) {
                throw new Error("Product name is required");
            }

            if (!productData.sku?.trim()) {
                throw new Error("Product SKU is required");
            }

            // Check for duplicate SKU
            const existingSku = products.find(p => p.sku === productData.sku);
            if (existingSku) {
                throw new Error(`SKU "${productData.sku}" already exists`);
            }

            await simulateDelay(500);

            const now = new Date().toISOString();
            const newProduct: ProductResponse = {
                ...productData,
                id: generateProductId(),
                status: productData.status || 'active',
                available: productData.available ?? true,
                visibility: productData.visibility || 'public',
                createdAt: now,
                updatedAt: now,
                publishedAt: (productData.status || 'active') === 'active' ? now : undefined,
                createdBy: getCurrentUser(),
                updatedBy: getCurrentUser(),

                // Initialize analytics fields
                salesCount: 0,
                revenue: 0,
                averageRating: 0,
                reviewCount: 0,
                popularity: 0,
                profitMargin: calculateProfitMargin(productData.price, productData.costPrice),
                turnoverRate: 0
            };

            products.push(newProduct);
            return { ...newProduct };
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    }

    async update(id: string, productData: ProductUpdateRequest): Promise<ProductResponse | null> {
        try {
            if (!id?.trim()) {
                throw new Error("Product ID is required");
            }

            await simulateDelay(400);

            const productIndex = products.findIndex(p => p.id === id);

            if (productIndex === -1) {
                return null;
            }

            // Check for duplicate SKU if SKU is being updated
            if (productData.sku) {
                const duplicateSku = products.find(p => p.sku === productData.sku && p.id !== id);
                if (duplicateSku) {
                    throw new Error(`SKU "${productData.sku}" already exists`);
                }
            }

            const existingProduct = products[productIndex];
            const updatedProduct: ProductResponse = {
                ...existingProduct,
                ...productData,
                updatedAt: new Date().toISOString(),
                updatedBy: getCurrentUser(),
                profitMargin: calculateProfitMargin(
                    productData.price ?? existingProduct.price,
                    productData.costPrice ?? existingProduct.costPrice
                )
            };

            products[productIndex] = updatedProduct;
            return { ...updatedProduct };
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            if (!id?.trim()) {
                throw new Error("Product ID is required");
            }

            await simulateDelay(300);

            const productIndex = products.findIndex(p => p.id === id);

            if (productIndex === -1) {
                return false;
            }

            products.splice(productIndex, 1);
            return true;
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    }

    async getLabelValuesList(): Promise<LabelValuePair[]> {
        try {
            await simulateDelay(200);

            return products
                .filter(product => product.status === 'active' && product.available)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(product => ({
                    id: product.id,
                    label: `${product.name} - ${product.sku}`,
                    value: product.id,
                    additionalData: {
                        price: product.price,
                        stock: product.stock,
                        category: product.category
                    }
                }));
        } catch (error) {
            console.error("Error getting products label-value list:", error);
            throw error;
        }
    }

    async getStats(): Promise<ProductStatsResponse> {
        try {
            await simulateDelay(400);

            const totalProducts = products.length;
            const activeProducts = products.filter(p => p.status === 'active').length;
            const inactiveProducts = products.filter(p => p.status === 'inactive').length;
            const outOfStock = products.filter(p => p.stock === 0).length;
            const lowStock = products.filter(p => p.stock > 0 && p.stock <= (p.reorderPoint || 0)).length;

            const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
            const totalRevenue = products.reduce((sum, product) => sum + (product.revenue || 0), 0);

            const avgPrice = totalProducts > 0
                ? products.reduce((sum, product) => sum + product.price, 0) / totalProducts
                : 0;

            // Enhanced top categories calculation
            const categoryStats = products.reduce((acc, product) => {
                if (product.category) {
                    if (!acc[product.category]) {
                        acc[product.category] = { count: 0, value: 0 };
                    }
                    acc[product.category].count += 1;
                    acc[product.category].value += product.price * product.stock;
                }
                return acc;
            }, {} as Record<string, { count: number; value: number }>);

            // Enhanced top brands calculation
            const brandStats = products.reduce((acc, product) => {
                if (product.brand) {
                    if (!acc[product.brand]) {
                        acc[product.brand] = { count: 0, value: 0 };
                    }
                    acc[product.brand].count += 1;
                    acc[product.brand].value += product.price * product.stock;
                }
                return acc;
            }, {} as Record<string, { count: number; value: number }>);

            const stats: ProductStatsResponse = {
                totalProducts,
                activeProducts,
                inactiveProducts,
                outOfStock,
                lowStock,
                totalValue: Math.round(totalValue * 100) / 100,
                totalRevenue: Math.round(totalRevenue * 100) / 100,
                averagePrice: Math.round(avgPrice * 100) / 100,
                topCategories: Object.entries(categoryStats)
                    .sort(([, a], [, b]) => b.count - a.count)
                    .slice(0, 5)
                    .map(([name, stats]) => ({ name, count: stats.count })),
                topBrands: Object.entries(brandStats)
                    .sort(([, a], [, b]) => b.count - a.count)
                    .slice(0, 5)
                    .map(([name, stats]) => ({ name, count: stats.count })),
                recentActivity: {
                    recentlyAdded: products
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 5),
                    recentlyUpdated: products
                        .filter(p => p.updatedAt !== p.createdAt)
                        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                        .slice(0, 5),
                    recentlySold: products
                        .filter(p => p.lastSoldAt)
                        .sort((a, b) => new Date(b.lastSoldAt!).getTime() - new Date(a.lastSoldAt!).getTime())
                        .slice(0, 5)
                }
            };

            return stats;
        } catch (error) {
            console.error("Error getting product stats:", error);
            throw error;
        }
    }

    async search(query: string): Promise<ProductResponse[]> {
        return this.getAll({ search: query });
    }

    async getByCategory(category: string): Promise<ProductResponse[]> {
        return this.getAll({ category });
    }

    async getByBrand(brand: string): Promise<ProductResponse[]> {
        return this.getAll({ brand });
    }

    async getLowStockProducts(): Promise<ProductResponse[]> {
        return this.getAll({ lowStock: true });
    }

    async getOutOfStockProducts(): Promise<ProductResponse[]> {
        return this.getAll({ outOfStock: true });
    }
    async updateStock(id: string, newStock: number): Promise<ProductResponse | null> {
        try {
            if (!id?.trim()) {
                throw new Error("Product ID is required");
            }

            if (newStock < 0) {
                throw new Error("Stock cannot be negative");
            }

            await simulateDelay(200);

            const productIndex = products.findIndex(p => p.id === id);
            if (productIndex === -1) {
                return null;
            }

            const product = products[productIndex];
            const wasRestocked = newStock > product.stock;

            const updatedProduct: ProductResponse = {
                ...product,
                stock: newStock,
                updatedAt: new Date().toISOString(),
                updatedBy: getCurrentUser(),
                lastRestockedAt: wasRestocked ? new Date().toISOString() : product.lastRestockedAt
            };

            products[productIndex] = updatedProduct;
            return { ...updatedProduct };
        } catch (error) {
            console.error("Error updating stock:", error);
            throw error;
        }
    }

    async bulkUpdate(
        updates: { id: string; data: Partial<ProductUpdateRequest> }[]
    ): Promise<ProductResponse[]> {
        try {
            if (!Array.isArray(updates) || updates.length === 0) {
                throw new Error("Updates array is required and cannot be empty");
            }

            await simulateDelay(600);

            const updatedProducts: ProductResponse[] = [];
            const errors: string[] = [];

            // Validate all updates first
            for (const update of updates) {
                if (!update.id?.trim()) {
                    errors.push(`Invalid product ID: ${update.id}`);
                    continue;
                }

                const productExists = products.some(p => p.id === update.id);
                if (!productExists) {
                    errors.push(`Product not found: ${update.id}`);
                }

                // Check for SKU duplicates
                if (update.data.sku) {
                    const duplicateSku = products.find(p => p.sku === update.data.sku && p.id !== update.id);
                    if (duplicateSku) {
                        errors.push(`Duplicate SKU "${update.data.sku}" for product ${update.id}`);
                    }
                }
            }

            if (errors.length > 0) {
                throw new Error(`Bulk update validation failed: ${errors.join(', ')}`);
            }

            // Apply updates
            const now = new Date().toISOString();
            const currentUser = getCurrentUser();

            for (const update of updates) {
                const productIndex = products.findIndex(p => p.id === update.id);
                if (productIndex !== -1) {
                    const existingProduct = products[productIndex];
                    const updatedProduct: ProductResponse = {
                        ...existingProduct,
                        ...update.data,
                        updatedAt: now,
                        updatedBy: currentUser,
                        profitMargin: calculateProfitMargin(
                            update.data.price ?? existingProduct.price,
                            update.data.costPrice ?? existingProduct.costPrice
                        )
                    };

                    products[productIndex] = updatedProduct;
                    updatedProducts.push({ ...updatedProduct });
                }
            }

            return updatedProducts;
        } catch (error) {
            console.error("Error in bulk update:", error);
            throw error;
        }
    }

}

// Export service instance and individual functions
export const productService = new ProductServiceImpl();
