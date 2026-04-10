"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

interface UseAdminGuardResult {
  isLoading: boolean;
  isAuthorized: boolean;
}

export function useAdminGuard(): UseAdminGuardResult {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAccess = async () => {
      const result = await authService.validateAdminSession();

      if (!isMounted) {
        return;
      }

      if (result.ok) {
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      setIsAuthorized(false);
      setIsLoading(false);

      if (result.reason === "not-admin") {
        router.replace("/acesso-negado?next=/login?erro=acesso-restrito");
        return;
      }

      router.replace("/login");
    };

    void checkAccess();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return { isLoading, isAuthorized };
}
