/**
 *
 */
export const apiUrls = {
    auth: {
        login: '/auth/login',
        refresh: '/auth/refresh',
        csrf: '/auth/csrf'
    },
    account: {
        update: (clientId: string) => `/accounts/${clientId}`,
        changePassword: '/accounts/change-password',
        getById: (id: string) => `/accounts/${id}`,
    },
    organizations: {
        getAll: '/organizations',
        getById: (id: string) => `/organization/${id}`,
        findByUserId: (id: string | null) => id ? `/organizations/findByUserId/${id}` : "",
        insert: '/organization',
        update: (id: string) => `/organization/${id}`,
        delete: (id: string) => `/organization/${id}`,
    },
    clients: {
        findByUserId: (id: string | null) => id ? `/clients/by-user?userId=${id}` : "",
    },
    airlines: {
        getAll: '/airlines',
        getById: (id: string) => `/airlines/${id}`,
        insert: '/airlines',
        update: (id: string) => `/airlines/${id}`,
        delete: (id: string) => `/airlines/${id}`,
    },
    users: {
        getUsers: '/users',
        getUserById: (id: string) => `/users/${id}`,
        addUser: (id: string) => `users/${id}`,
    },
    states: {
        getAll: '/states',
        getById: (id: string) => `/states/${id}`,
        insert: '/states',
        update: (id: string) => `/states/${id}`,
        delete: (id: string) => `/states/${id}`,
        labelValuesListByCountry: (countryId: string) => `/states/label-value-list?countryId=${countryId}`,
        createStatesColombia: '/states/create-states-co',
    },
    countries: {
        insert: '/countries',
        update: (id: string) => `/countries/${id}`,
        delete: (id: string) => `/countries/${id}`,
        getById: (id: string) => `/countries/${id}`,
        getAll: `/countries`,
        createCountryCo: '/countries/create-country-co',
        createAllCountries: '/countries/create-all-countries',
        labelValuesList: '/countries/label-value-list'
    }, cities: {
        getAll: '/cities',
        getById: (id: string) => `/cities/${id}`,
        insert: '/cities',
        update: (id: string) => `/cities/${id}`,
        delete: (id: string) => `/cities/${id}`,
        labelValuesList: (stateEntityId: string) => `/cities/label-value-list?stateId=${stateEntityId}`,
        createCitiesColombia: '/cities/create-cities-co',
    },
    ports: {
        getAll: '/ports',
        getById: (id: string) => `/ports/${id}`,
        insert: '/ports',
        update: (id: string) => `/ports/${id}`,
        delete: (id: string) => `/ports/${id}`,
    },
    employees: {
        getAll: '/employees',
        getById: (id: string) => `/employees/${id}`,
        insert: '/employees',
        update: (id: string) => `/employees/${id}`,
        delete: (id: string) => `/employees/${id}`,
        search: (query: string) => `/employees/search?q=${encodeURIComponent(query)}`,
        getByDepartment: (department: string) => `/employees?department=${encodeURIComponent(department)}`,
        getByStatus: (status: string) => `/employees?status=${status}`,
        getByEmploymentType: (type: string) => `/employees?employmentType=${type}`,
        getByLevel: (level: string) => `/employees?level=${level}`,
        getByLocation: (location: string) => `/employees?location=${encodeURIComponent(location)}`,
        getByManager: (managerId: string) => `/employees?manager=${managerId}`,
        getBySkill: (skill: string, level?: string) => `/employees/skills?skill=${encodeURIComponent(skill)}${level ? `&level=${level}` : ''}`,
        getPendingReviews: '/employees/pending-reviews',
        getExpiringCertifications: (days?: number) => `/employees/expiring-certifications${days ? `?days=${days}` : ''}`,
        getTopPerformers: (limit?: number) => `/employees/top-performers${limit ? `?limit=${limit}` : ''}`,
        getNewHires: (days?: number) => `/employees/new-hires${days ? `?days=${days}` : ''}`,
        getBirthdaysThisMonth: '/employees/birthdays-this-month',
        getStats: '/employees/stats',
        labelValuesList: '/employees/labelValuesList'
    },
    dischargePorts: {
        getAll: '/dischargePorts',
        getById: (id: string) => `/dischargePorts/${id}`,
        insert: '/dischargePorts',
        update: (id: string) => `/dischargePorts/${id}`,
        delete: (id: string) => `/dischargePorts/${id}`,
    },
    products: {
        getAll: '/products',
        getById: (id: string) => `/products/${id}`,
        insert: '/products',
        update: (id: string) => `/products/${id}`,
        delete: (id: string) => `/products/${id}`,
        labelValuesList: `/products/labelValueList`
    },
    colors: {
        getAll: '/colors',
        getById: (id: string) => `/colors/${id}`,
        insert: '/colors',
        update: (id: string) => `/colors/${id}`,
        delete: (id: string) => `/colors/${id}`,
        labelValuesList: `/colors/labelValueList`
    },
    varieties: {
        getAll: '/varieties',
        getById: (id: string) => `/varieties/${id}`,
        insert: '/varieties',
        update: (id: string) => `/varieties/${id}`,
        delete: (id: string) => `/varieties/${id}`,
        labelValuesList: `/varieties/labelValueList`
    },
    varietyTypes: {
        getAll: '/varietyTypes',
        getById: (id: string) => `/varietyTypes/${id}`,
        insert: '/varietyTypes',
        update: (id: string) => `/varietyTypes/${id}`,
        delete: (id: string) => `/varietyTypes/${id}`,
        labelValuesList: `/varietyTypes/labelValueList`
    },
    carriers: {
        getAll: '/carriers',
        getById: (id: string) => `/carriers/${id}`,
        insert: '/carriers',
        update: (id: string) => `/carriers/${id}`,
        delete: (id: string) => `/carriers/${id}`,
        labelValuesList: `/carriers/labelValueList`
    },
    unitsMeasure: {
        getAll: '/unitsMeasure',
        getById: (id: string) => `/unitsMeasure/${id}`,
        insert: '/unitsMeasure',
        update: (id: string) => `/unitsMeasure/${id}`,
        delete: (id: string) => `/unitsMeasure/${id}`,
        labelValuesList: `/unitsMeasure/labelValueList`
    },
    tariffItems: {
        getAll: '/tariffItems',
        getById: (id: string) => `/tariffItems/${id}`,
        insert: '/tariffItems',
        update: (id: string) => `/tariffItems/${id}`,
        delete: (id: string) => `/tariffItems/${id}`,
        labelValuesList: `/tariffItems/labelValueList`
    },
    categories: {
        getAll: '/categories',
        getById: (id: string) => `/categories/${id}`,
        insert: '/categories',
        update: (id: string) => `/categories/${id}`,
        delete: (id: string) => `/categories/${id}`,
        labelValuesList: `/categories/labelValueList`
    },
    flowersMeasure: {
        getAll: '/flowersMeasure',
        getById: (id: string) => `/flowersMeasure/${id}`,
        insert: '/flowersMeasure',
        update: (id: string) => `/flowersMeasure/${id}`,
        delete: (id: string) => `/flowersMeasure/${id}`,
        labelValuesList: `/flowersMeasure/labelValueList`
    },
    flowersSleeve: {
        getAll: '/flowersSleeve',
        getById: (id: string) => `/flowersSleeve/${id}`,
        insert: '/flowersSleeve',
        update: (id: string) => `/flowersSleeve/${id}`,
        delete: (id: string) => `/flowersSleeve/${id}`,
        labelValuesList: `/flowersSleeve/labelValueList`
    },
    customers: {
        getAll: '/customers',
        getById: (id: string) => `/customers/${id}`,
        insert: '/customers',
        update: (id: string) => `/customers/${id}`,
        delete: (id: string) => `/customers/${id}`,
        labelValuesList: `/customers/labelValueList`
    },
    growers: {
        getAll: '/growers',
        getById: (id: string) => `/growers/${id}`,
        insert: '/growers',
        update: (id: string) => `/growers/${id}`,
        delete: (id: string) => `/growers/${id}`,
        labelValuesList: `/growers/labelValueList`
    },
    productTypes: {
        getAll: '/productTypes',
        getById: (id: string) => `/productTypes/${id}`,
        insert: '/productTypes',
        update: (id: string) => `/productTypes/${id}`,
        delete: (id: string) => `/productTypes/${id}`,
        labelValuesList: `/productTypes/labelValueList`
    },
    businessPartnerLocations: {
        labelValuesListShipping: (businessPartnerId: string) => `/businessPartnerLocations/${businessPartnerId}/labelValueList/shipping`,
        labelValuesListBilling: (businessPartnerId: string) => `/businessPartnerLocations/${businessPartnerId}/labelValueList/billing`
    },
    orders: {
        findByPurchaseDate: (purchaseDate: string) => `/orders/findByPurchaseDate/${purchaseDate}`,
        getById: (id: string) => `/orders/${id}`,
        insert: '/orders',
        update: (id: string) => `/orders/${id}`,
        delete: (id: string) => `/orders/${id}`,
        clone: (id: string) => `/orders/${id}/clone`,
    },
    orderItems: {
        findByOrderItem: (orderItemId: string) => `/orders/details/${orderItemId}`,
        upsert: (orderId: string) => `/orders/details/${orderId}`,
        findOrderItems: (orderId: string) => `/orders/details/${orderId}/list`,

    },
    boxTypes: {
        getAll: '/boxTypes',
        getById: (id: string) => `/boxTypes/${id}`,
        insert: '/boxTypes',
        update: (id: string) => `/boxTypes/${id}`,
        delete: (id: string) => `/boxTypes/${id}`,
        labelValuesList: `/boxTypes/labelValueList`
    },
    invoices: {
        findLastInvoice: '/invoices/findLastInvoice',
        getAllInvoices: '/invoices',
        getInvoiceById: (id: string) => `/invoices/${id}`,
        insert: '/invoices',
        update: (id: string) => `/invoices/${id}`,
        delete: (id: string) => `/invoices/${id}`,
        labelValuesList: '/invoices/labelValuesList',
        findByInvoiceNumber: (invoiceNumber: string) => `/invoices/findByInvoiceNumber/${invoiceNumber}`,
    },
    bpartners: {
        getAll: '/bpartners',
        getById: (id: string) => `/bpartners/${id}`,
        insert: '/bpartners',
        update: (id: string) => `/bpartners/${id}`,
        delete: (id: string) => `/bpartners/${id}`,
        search: (query: string) => `/bpartners/search?q=${encodeURIComponent(query)}`,
        getByType: (type: string) => `/bpartners?type=${type}`,
        getByStatus: (status: string) => `/bpartners?status=${status}`,
        getBySegment: (segment: string) => `/bpartners?segment=${segment}`,
        getStats: '/bpartners/stats',
        getTopByValue: (limit?: number) => `/bpartners/top${limit ? `?limit=${limit}` : ''}`,
        labelValuesList: '/bpartners/labelValuesList'
    },
    employees: {
        getAll: '/employees',
        getById: (id: string) => `/employees/${id}`,
        insert: '/employees',
        update: (id: string) => `/employees/${id}`,
        delete: (id: string) => `/employees/${id}`,
        search: (query: string) => `/employees/search?q=${encodeURIComponent(query)}`,
        getByDepartment: (department: string) => `/employees?department=${encodeURIComponent(department)}`,
        getByStatus: (status: string) => `/employees?status=${status}`,
        getByEmploymentType: (type: string) => `/employees?employmentType=${type}`,
        getByLevel: (level: string) => `/employees?level=${level}`,
        getByLocation: (location: string) => `/employees?location=${encodeURIComponent(location)}`,
        getByManager: (managerId: string) => `/employees?manager=${managerId}`,
        getBySkill: (skill: string, level?: string) => `/employees/skills?skill=${encodeURIComponent(skill)}${level ? `&level=${level}` : ''}`,
        getPendingReviews: '/employees/pending-reviews',
        getExpiringCertifications: (days?: number) => `/employees/expiring-certifications${days ? `?days=${days}` : ''}`,
        getTopPerformers: (limit?: number) => `/employees/top-performers${limit ? `?limit=${limit}` : ''}`,
        getNewHires: (days?: number) => `/employees/new-hires${days ? `?days=${days}` : ''}`,
        getBirthdaysThisMonth: '/employees/birthdays-this-month',
        getStats: '/employees/stats',
        labelValuesList: '/employees/labelValuesList'
    },
}