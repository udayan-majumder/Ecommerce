"use client";

import { useAuth } from "../../hooks/userAuth";
import { redirect } from "next/navigation";
import { Box, Spinner, Text } from "@chakra-ui/react";

export default function Home() {
  const { user, setUser } = useAuth();

  setTimeout(() => {
    const path = localStorage.getItem("path");
    if (!path) {
      localStorage.removeItem("token");
      return redirect("/auth/login");
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
    }

    if (!user) {
      if (path?.includes("/user")) {
        return redirect("/auth/login");
      }
      return redirect(`${path}`);
    }

    if (path?.includes("/auth")) {
      return redirect("/user/home");
    }
    if(path?.includes("/admin")){
      if(user?.userType === 'admin'){
        return redirect(`${path}`)
      }
      return redirect('/user/home')
    }
    return redirect(`${path}`);
  }, 1500);

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
