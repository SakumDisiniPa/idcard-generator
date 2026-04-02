'use client';

import { useCallback } from 'react';

export function useAuth() {
  const verifyAccess = useCallback(async (accessId: string): Promise<boolean> => {
    const expectedId = process.env.NEXT_PUBLIC_SECRET_ACCESS_ID;
    return accessId === expectedId;
  }, []);

  return { verifyAccess };
}
