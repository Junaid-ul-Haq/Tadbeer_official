"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminHome() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to manage users page
    router.push("/admin/manage-users");
  }, [router]);

  return null;
}
