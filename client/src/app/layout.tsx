"use client";
import {
  Geist,
  Geist_Mono,
  Poppins,
  Tektur,
  Rubik,
  Roboto,
  Open_Sans,
  Syncopate
} from "next/font/google";
import "./globals.css";
import { UserProvider } from "../../hooks/userAuth";
import { Suspense, useEffect } from "react";
import Products from "../../store/Productstore";
import { Provider } from "@/components/ui/provider";
import { useAuth } from "../../hooks/userAuth";
// import { ChakraProvider,extendTheme } from "@chakra-ui/react";

// const theme = extendTheme({
//   fonts: {
//     heading: "Meriva, sans-serif",
//     body: "Meriva, sans-serif",
//   },
// });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"], // Specify the font weights you need
  subsets: ["latin"], // Specify the subset(s) you need
  variable: "--font-poppins", // Define a CSS variable for the font
});
const tektur = Tektur({
  weight: ["400", "500", "600", "700"], // Specify the font weights you need
  subsets: ["latin"], // Specify the subset(s) you need
  variable: "--font-tektur", // Define a CSS variable for the font
});
const opensans = Open_Sans({
  weight: ["400", "500", "600", "700"], // Specify the font weights you need
  subsets: ["latin"], // Specify the subset(s) you need
  variable: "--font-Open_Sans", // Define a CSS variable for the font
});

const roboto = Roboto({
  weight: ["400", "500", "600", "700"], // Specify the font weights you need
  subsets: ["latin"], // Specify the subset(s) you need
  variable: "--font-Roboto", // Define a CSS variable for the font
});
const rubik = Rubik({
  weight: ["400", "500", "600", "700"], // Specify the font weights you need
  subsets: ["latin"], // Specify the subset(s) you need
  variable: "--font-Rubik", // Define a CSS variable for the font
});

const syncopate = Syncopate({
  weight: ["400", "700"], // ✅ Only valid weights
  subsets: ["latin"], // ✅ Correct
  variable: "--font-syncopate", // ✅ Descriptive CSS variable
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setProductList, setLoading, setCategory } = Products();

  const getproducts = async () => {
    let data;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
      }
    );

    data = await response.json();

    setProductList(data.list.rows);
    setCategory(data.category.rows);
    console.log(data.category.rows)
    setLoading(false);
  };

  useEffect(() => {
    getproducts();
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${opensans.variable} ${roboto.variable} ${rubik.variable}  ${tektur.variable} ${syncopate.variable}antialiased`}
      >
        <Provider>
          <UserProvider>
            <Suspense>{children}</Suspense>
          </UserProvider>
        </Provider>
      </body>
    </html>
  );
}
