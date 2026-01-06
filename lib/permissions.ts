// Role-Based Access Control (RBAC) Logic

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN', // Can access /super-admin
  MERCHANT_OWNER = 'MERCHANT_OWNER', // Can access /app/settings, billing
  MERCHANT_STAFF = 'MERCHANT_STAFF', // Can access /app/orders, /app/products
  CUSTOMER = 'CUSTOMER' // Can access storefront only
}

type Permission = 
  | 'VIEW_PLATFORM_ANALYTICS'
  | 'MANAGE_TENANTS'
  | 'MANAGE_STORE_SETTINGS'
  | 'MANAGE_PRODUCTS'
  | 'VIEW_STOREFRONT';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: [
    'VIEW_PLATFORM_ANALYTICS',
    'MANAGE_TENANTS',
    'VIEW_STOREFRONT'
  ],
  [Role.MERCHANT_OWNER]: [
    'MANAGE_STORE_SETTINGS',
    'MANAGE_PRODUCTS',
    'VIEW_STOREFRONT'
  ],
  [Role.MERCHANT_STAFF]: [
    'MANAGE_PRODUCTS',
    'VIEW_STOREFRONT'
  ],
  [Role.CUSTOMER]: [
    'VIEW_STOREFRONT'
  ]
};

export const hasPermission = (userRole: Role, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

export const requireStoreContext = (userRole: Role): boolean => {
  return userRole === Role.MERCHANT_OWNER || userRole === Role.MERCHANT_STAFF;
};
