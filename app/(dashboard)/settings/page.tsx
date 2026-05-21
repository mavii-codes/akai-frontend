"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Camera, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfileData = {
  name: string;
  email: string;
  about: string;
  profileImage?: string;
};

function readFileAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Unable to read file."));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [saved, setSaved] = useState(false);
  const [originalProfile, setOriginalProfile] = useState<ProfileData>({
    name: "",
    email: "",
    about: "",
    profileImage: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedData = window.localStorage.getItem("akai-profile");
    if (!savedData) return;

    try {
      const profile = JSON.parse(savedData) as ProfileData;
      setName(profile.name ?? "");
      setEmail(profile.email ?? "");
      setAbout(profile.about ?? "");
      setProfileImage(profile.profileImage ?? "");
      setOriginalProfile({
        name: profile.name ?? "",
        email: profile.email ?? "",
        about: profile.about ?? "",
        profileImage: profile.profileImage ?? "",
      });
    } catch {
      // ignore malformed saved profile
    }
  }, []);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const base64 = await readFileAsBase64(file);
    setProfileImage(base64);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (typeof window === "undefined") return;

    const profile = { name, email, about, profileImage };
    window.localStorage.setItem("akai-profile", JSON.stringify(profile));
    setOriginalProfile(profile);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => {
    setName(originalProfile.name);
    setEmail(originalProfile.email);
    setAbout(originalProfile.about);
    setProfileImage(originalProfile.profileImage ?? "");
    setSaved(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-3">
        <div className="inline-flex items-center gap-3 rounded-3xl bg-emerald-100/80 p-4 text-emerald-900 shadow-sm ring-1 ring-emerald-200">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-200 text-emerald-700">
            <Settings className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-800/70">
              Settings
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-emerald-950">
              Profile settings
            </h1>
          </div>
        </div>
        <p className="max-w-2xl text-sm text-emerald-700/90">
          Update your profile details and choose a profile image. Changes are saved locally in your browser.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-emerald-100">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] items-start">
          <div className="grid gap-2">
            <Label htmlFor="profileImage">Profile image</Label>
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-3xl border border-emerald-100 bg-emerald-50 shadow-sm">
                {profileImage ? (
                  <img src={profileImage} alt="Profile preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-emerald-500">
                    <Camera className="size-6" />
                  </div>
                )}
              </div>
              <div className="min-w-[190px]">
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file:mr-4 file:rounded-full file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-emerald-700"
                />
                <p className="text-xs text-emerald-600/80 mt-2">Upload a photo to personalize your account.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Jane Doe"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="jane@study.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="about">About you</Label>
            <textarea
              id="about"
              value={about}
              onChange={(event) => setAbout(event.target.value)}
              placeholder="I like organizing my study plan around creative projects..."
              className="min-h-[148px] rounded-xl border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit" className="rounded-xl px-6 py-2">
              Save profile
            </Button>
            <Button type="button" variant="outline" className="rounded-xl px-6 py-2" onClick={handleCancel}>
              Cancel changes
            </Button>
          </div>
          {saved ? (
            <p className="text-sm font-medium text-emerald-700">Profile saved locally.</p>
          ) : (
            <p className="text-sm text-emerald-600">Your profile data is stored in your browser.</p>
          )}
        </div>
      </form>
    </div>
  );
}
