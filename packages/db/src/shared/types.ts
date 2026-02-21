export interface TenantAccessInput {
  userId: string;
  tenantId: string;
}

export type TenantAccessChecker = (input: TenantAccessInput) => Promise<boolean>;

export interface TransactionExecutor<TClient> {
  transaction<T>(handler: (tx: TClient) => Promise<T>): Promise<T>;
}
