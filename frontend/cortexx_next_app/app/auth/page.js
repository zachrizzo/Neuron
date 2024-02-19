"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { colorsDark } from "@/lib/utils";
import { Canvas } from "@react-three/fiber";
import { CameraShake, Html, OrbitControls } from "@react-three/drei";
import Particles from "@/components/threejs/particalNoise";

export default function Auth() {
  const [isPhone, setIsPhone] = useState(false);
  const props = {
    focus: isPhone ? 9 : 4.77,
    speed: 0.1,
    aperture: 4.3,
    fov: 4,
    curl: 0.32,
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsPhone(true);
      } else {
        setIsPhone(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const mainBackground = "#1A1A24";

  return (
    <main className="flex bg-[#1A1A24] overflow-x-hidden w-full h-screen z-0 min-h-screen flex-col items-center justify-center p-24">
      <Canvas
        className="w-full h-full"
        camera={{ position: isPhone ? [0, 0, 10] : [0, 0, 5.5], fov: 25 }}
      >
        <OrbitControls
          makeDefault
          autoRotate
          autoRotateSpeed={0.5}
          zoomSpeed={0.1}
          enableZoom={false}
          enableRotate={isPhone ? false : true}
        />

        <CameraShake
          yawFrequency={1}
          maxYaw={0.05}
          pitchFrequency={1}
          maxPitch={0.05}
          rollFrequency={0.5}
          maxRoll={0.5}
          intensity={0.2}
        />

        <Html center className="flex items-center justify-center">
          <Tabs defaultValue="Login" className=" w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="Login">Login</TabsTrigger>
              <TabsTrigger value="Create Account">Create Account</TabsTrigger>
            </TabsList>
            <TabsContent value="Login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Login to your account to continue.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="username">User name</Label>
                    <Input id="username" defaultValue="" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" defaultValue="" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className=" bg-[#1A1A24]">Save changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="Create Account">
              <Card>
                <CardHeader>
                  <CardTitle>New Account</CardTitle>
                  <CardDescription>
                    Create a new account to continue.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="current">Current password</Label>
                    <Input id="current" type="password" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new">New password</Label>
                    <Input id="new" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className=" bg-[#1A1A24] ">Save password</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </Html>

        <Particles {...props} />
      </Canvas>
    </main>
  );
}
