import { useEffect, useState } from "react";

const useUserRole = () => {
  const [userRole, setUserRole] = useState<
    "ADMIN" | "MANAGER" | "MEMBER" | null
  >(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("mpms_user");

      if (storedUser) {
        const parsed = JSON.parse(storedUser);

        if (parsed?.role) {
          setUserRole(parsed.role.toUpperCase());
        }
      }
    } catch (error) {
      console.warn("Session extraction error:", error);
    }
  }, []);

  return userRole;
};

export default useUserRole;
