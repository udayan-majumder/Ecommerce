"use client";

import { useAuth } from "../../hooks/userAuth";
import { useRouter,usePathname } from "next/navigation";
import { Box, Spinner, Text } from "@chakra-ui/react";
import { useEffect } from "react";
export default function Home() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const path = localStorage.getItem("path") || pathname;
    const token = localStorage.getItem("token");
 
    if (!user || !token) {
      localStorage.setItem("path", pathname);
      router.push("/auth/login");
      return;
    }

    if (path.includes("/auth")) {
      router.push("/user/home");
      return;
    }

    if (path.includes("/admin")) {
      if (user?.userType === "admin") {
        router.push(path);
      } else {
        router.push("/user/home");
      }
      return;
    }

    router.push(path);
  }, [user]);
 
  return (
    <Box
      height={["100vh"]}
      width={["100%"]}
      className="flexed"
      flexDirection={["column"]}
      gap={2}
      bgColor={["#fff"]}
    >
      <Spinner size="xl" color={["#8B4513"]} />
      <Text fontFamily={["poppins"]} fontSize={["30px"]} color={["#8B4513"]}>
        Loading
      </Text>
    </Box>
  );
}
