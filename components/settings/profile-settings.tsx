"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  defaultProfile,
  loadProfile,
  saveProfile,
  type UserProfile,
} from "@/lib/profile-storage";

export function ProfileSettings() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [savedSnapshot, setSavedSnapshot] = useState<UserProfile>(defaultProfile);
  const [fileName, setFileName] = useState("No file chosen");
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loaded = loadProfile();
    setProfile(loaded);
    setSavedSnapshot(loaded);
    setFileName(loaded.profileImage ? "profile-image" : "No file chosen");
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setProfile((p) => ({ ...p, profileImage: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.email.trim().includes("@")) return;

    // Saves profile + syncs login session + notifies entire app
    saveProfile(profile);
    setSavedSnapshot(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => {
    setProfile(savedSnapshot);
    setFileName(savedSnapshot.profileImage ? "profile-image" : "No file chosen");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl"
    >
      <div className="rounded-2xl bg-emerald-100/90 border border-emerald-200/50 px-5 py-5 sm:px-6 sm:py-6 mb-4">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/80 text-emerald-600 shadow-sm">
            <Settings className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-widest text-emerald-600 uppercase">
              Settings
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-950 mt-0.5">
              Profile settings
            </h1>
          </div>
        </div>
      </div>

      <p className="text-sm text-emerald-800/75 mb-6 sm:mb-8 leading-relaxed">
        Update your profile details and choose a profile image. When you save,
        your name and email update everywhere in the app automatically.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12 md:gap-y-8">
          <div className="space-y-3">
            <Label className="text-emerald-900 font-medium">Profile image</Label>
            <div className="flex flex-col sm:flex-row md:flex-col items-start gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative size-24 sm:size-28 shrink-0 rounded-full border-2 border-dashed border-emerald-200 bg-emerald-50/80 overflow-hidden flex items-center justify-center hover:border-emerald-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                aria-label="Upload profile image"
              >
                {profile.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="size-full object-cover"
                  />
                ) : (
                  <Camera className="size-8 text-emerald-400/80" />
                )}
              </button>
              <div className="flex-1 min-w-0 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg border-emerald-200 text-emerald-800 bg-white hover:bg-emerald-50 text-sm font-normal h-9"
                >
                  Choose File
                </Button>
                <p className="text-xs text-emerald-700/60 truncate">{fileName}</p>
                <p className="text-xs text-emerald-600/70 leading-relaxed">
                  Upload a photo to personalize your account.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-emerald-900 font-medium">
              Full name
            </Label>
            <Input
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              className="h-11 rounded-lg border-emerald-200/80 bg-white shadow-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-emerald-900 font-medium">
              Email address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="jane@study.com"
              className="h-11 rounded-lg border-emerald-200/80 bg-white shadow-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about" className="text-emerald-900 font-medium">
              About you
            </Label>
            <Textarea
              id="about"
              name="about"
              value={profile.about}
              onChange={handleChange}
              placeholder="I like organizing my study plan around creative projects."
              rows={5}
              className="min-h-[120px] rounded-lg border-emerald-200/80 bg-white shadow-sm resize-y"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-emerald-100">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              className="rounded-lg h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
            >
              Save profile
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="rounded-lg h-10 text-emerald-800/80 hover:bg-emerald-50"
            >
              Cancel changes
            </Button>
            {saved && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-emerald-600 font-medium"
              >
                Account updated!
              </motion.span>
            )}
          </div>
          <p className="text-xs text-emerald-700/50 sm:text-right shrink-0">
            Updates sidebar, home greeting, and your saved profile.
          </p>
        </div>
      </form>
    </motion.div>
  );
}
