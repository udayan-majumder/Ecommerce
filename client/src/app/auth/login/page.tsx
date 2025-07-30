"use client";
import {
  Box,
  Image,
  InputGroup,
  Input,
  Field,
  Text,
  Button,
  Link,
  Toast,
} from "@chakra-ui/react";
import {
  PasswordInput,
  PasswordStrengthMeter,
} from "@/components/ui/password-input";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../hooks/userAuth";
import { redirect, usePathname } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Products from "../../../../store/Productstore";

function LoginComponent() {
  const [emailBorderColor, setemailBorderColor] = useState<string | null>(
    "red"
  );
  const [userEmail, setuserEmail] = useState<string | null>(null);
  const [passwordBorderColor, setpasswordBorderColor] = useState<string | null>(
    "red"
  );
  const [userPassword, setuserPassword] = useState<string | null>(null);
  const [loginBtn, setloginBtn] = useState<string | null>("#8B4513");
  const [divOpacity, setOpacity] = useState<number | null>(1);
  const { user, setUser } = useAuth();
  const { ProductList, loading } = Products();
  const pathname = usePathname();



  useEffect(() => {
    if (!user) {
      localStorage.setItem("path", pathname);
      return redirect("/");
    }
  }, []);

  async function loginHandler() {
    if (!userEmail && !userPassword) {
      return toast.error("Enter email and Password");
    }

    //  setloginBtn("#D09367");
    setOpacity(0.6);
    const loadId = toast.loading("verifying", { removeDelay: 3000 });
    const loginReq = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/user/login`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          password: userPassword,
        }),
      }
    );

    const res = await loginReq.json();

    if (res.message === "wrong email") {
      setOpacity(1);
      toast.dismiss();
      return toast.error("wrong email");
    } else if (res.message === "wrong password") {
      setOpacity(1);
      toast.dismiss();
      return toast.error("wrong Password");
    }

    toast.success("logged in successfully");
    toast.dismiss(loadId);
    setOpacity(1);
    setTimeout(() => {
      setUser(res.User);
      localStorage.setItem("token", res.token);
    }, 1000);
  }

  if (!user) {
    return (
      <Box
        height={["100vh"]}
        width={["100%"]}
        display={["flex"]}
        flexDirection={["column", "row"]}
        justifyContent={["center"]}
        alignItems={["center"]}
        bgColor={["whiteAlpha.950"]}
        opacity={`${divOpacity}`}
      >
        <Toaster />
        <Box
          height={["50%", "100%"]}
          width={["100%", "40%"]}
          className="flexed"
        >
          <Image
            src={"/LoginCover.jpeg"}
            borderRadius={["10px"]}
            height={["95%"]}
            width={["95%"]}
          />
        </Box>
        <Box
          height={["60%", "95%"]}
          width={["100%", "60%"]}
          className="flexed"
          flexDirection={["column"]}
          justifyContent={["start"]}
        >
          <Box
            height={["10%"]}
            width={["90%"]}
            className="flexed"
            display={["none", "flex"]}
            justifyContent={["right"]}
            alignItems={["start"]}
          >
            <Image
              src={"/logo.jpeg"}
              height={["80%"]}
              borderRadius={["100px"]}
            />
          </Box>

          <Box
            height={["90%", "80%"]}
            width={["80%", "40%"]}
            display={["flex"]}
            flexDirection={["column"]}
            justifyContent={["center"]}
            gap={[6, 8]}
            color={["#000"]}
          >
            <Text
              fontSize={["30px", "50px"]}
              fontFamily={["poppins"]}
              width={["100%"]}
              textAlign={["center"]}
              color={["#000"]}
            >
              Welcome Back
              <Text fontSize={["12px", "16px"]} color={["#353535"]}>
                Please enter login details below
              </Text>
            </Text>
            <Box spaceY={[2, 6]}>
              <InputGroup>
                <Field.Root>
                  <Field.Label
                    fontSize={["12px", "18px"]}
                    fontStyle={"italic"}
                    letterSpacing={0.5}
                  >
                    Email
                  </Field.Label>
                  <Input
                    fontFamily={["poppins"]}
                    letterSpacing={["0.5px"]}
                    bgColor={["#E7E4E4"]}
                    border={"none"}
                    placeholder="Enter your email"
                    onChange={(e) => {
                      setuserEmail(e.target.value);
                      e.target.value.includes("@gmail.com")
                        ? setemailBorderColor("green")
                        : setemailBorderColor("red");
                    }}
                    _focus={{ border: `1px solid ${emailBorderColor}` }}
                  ></Input>
                </Field.Root>
              </InputGroup>

              <InputGroup>
                <Field.Root>
                  <Field.Label
                    fontSize={["12px", "18px"]}
                    fontStyle={"italic"}
                    letterSpacing={0.5}
                  >
                    Password
                  </Field.Label>
                  <PasswordInput
                    bgColor={["#E7E4E4"]}
                    fontFamily={["poppins"]}
                    letterSpacing={["0.5px"]}
                    border={"none"}
                    placeholder="Enter your password"
                    onChange={(e) => {
                      setuserPassword(e.target.value);
                      e.target.value.length > 7
                        ? setpasswordBorderColor("green")
                        : setpasswordBorderColor("red");
                    }}
                    _focus={{ border: `1px solid ${passwordBorderColor}` }}
                  />
                </Field.Root>
              </InputGroup>
            </Box>

            <Box spaceY={1}>
              <Text width={["100%"]} textAlign={["right"]}>
                <Link
                  color={["#353535"]}
                  fontSize={["12px", "14px"]}
                  fontWeight={600}
                >
                  Forget Password?
                </Link>
              </Text>
              <Button
                width={["100%"]}
                fontSize={["16px", "20px"]}
                height={["40px", "50px"]}
                letterSpacing={1}
                bgColor={`${loginBtn}`}
                fontWeight={600}
                color={["#fff"]}
                _hover={{ bgColor: "#A0522D" }}
                onClick={() => {
                  loginHandler();
                }}
                _focus={{}}
              >
                Login
              </Button>
              <Text width={["100%"]} textAlign={["right"]}>
                <Link
                  href="/auth/register"
                  color={["#424242"]}
                  fontSize={["10px", "14px"]}
                  fontWeight={500}
                  fontStyle={"italic"}
                  borderBottom={["1px solid rgb(214, 213, 213)"]}
                  _hover={{ borderBottom: "none", color: "#000" }}
                >
                  don't have an account? Singup here
                </Link>
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

}

export default LoginComponent;
