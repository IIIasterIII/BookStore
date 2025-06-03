"use client"

import Navbar from "@/components/organisms/navbar";
import "./globals.css";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "../../node_modules/@types/js-cookie";
import useAuthStore from "@/store/auth";
import { useRouter } from "next/navigation";
import { getProtected } from "@/api/authApi";
import ToastContainer from "@/components/organisms/toastContainer";

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  const pathname = usePathname()
  const[ logOutPanel, setLogOutPanel ] = useState<boolean>(false)
  const { setUser, clearUser} = useAuthStore()
  const router = useRouter()

  const handleLogOut = () => {
    Cookies.remove('access_token')
    if (Cookies.get('cart')) Cookies.remove('cart')
    clearUser()
    setLogOutPanel(false)
    router.replace('/auth')
  }

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("access_token");
      if (token) {
        try {
          console.log(token)
          const res = await getProtected(token);
          setUser(res)
        } catch (error) {
          console.error("Failed to fetch protected data", error);
          if (!pathname.includes("reset-password")) router.replace("/auth");
        }
      } else {
        if (!pathname.includes("reset-password")) router.replace("/auth");
      }
    };

    fetchUser();
  }, []);

  /*
    sm	40rem (640px)	@media (width >= 40rem) { ... }
    md	48rem (768px)	@media (width >= 48rem) { ... }
    lg	64rem (1024px)	@media (width >= 64rem) { ... }
    xl	80rem (1280px)	@media (width >= 80rem) { ... }
    2xl	96rem (1536px)	@media (width >= 96rem) { ... }
  */

  return (
    <html lang="en">
      <meta name="viewport" content="initial-scale=1, width=device-width" />  
      <link rel="icon" href="/next.svg" type="image/svg+xml" />
      <body className={`w-full mx-auto relative ${!pathname.includes('/auth') ? 'max-w-[1280px]' : 'w-full'}`}>
      <ToastContainer/>
        {!pathname.includes('/auth') && <Navbar setLogOutPanel={setLogOutPanel}/>}
        {children}
        {logOutPanel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-60"></div>
            <div className="relative bg-white p-8 rounded-lg shadow-lg z-10">
              <p className="text-lg font-semibold">Are you sure that you gonna log out?</p>
              <div className="w-full flex justify-between flex-row border">
                <button className="w-50 flex justify-center items-center" onClick={() => setLogOutPanel(false)}>Stay</button>
                <button onClick={() => handleLogOut()}>Log out</button>
              </div>
            </div>
          </div>

        )}     
    </body>
    </html>
  );
}
