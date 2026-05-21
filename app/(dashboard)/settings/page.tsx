"use client";

import React, { useEffect, useState } from "react";

type Profile = {
  name: string;
  email: string;
  about: string;
  profileImage?: string;
};

const STORAGE_KEY = "akai-profile";

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile>({ name: "", email: "", about: "", profileImage: "" });
  const [original, setOriginal] = useState<Profile | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Profile;
        setProfile(parsed);
        setOriginal(parsed);
      } catch (e) {
        // ignore parse errors
      }
    }
  }, []);

  const readFileAsBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await readFileAsBase64(file);
      setProfile((p) => ({ ...p, profileImage: data }));
    } catch {
      // ignore
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setOriginal(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCancel = () => {
    if (original) setProfile(original);
    else setProfile({ name: "", email: "", about: "", profileImage: "" });
  };

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="w-28 h-28 rounded-full bg-emerald-50 overflow-hidden flex items-center justify-center">
            {profile.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.profileImage} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="text-emerald-400">No Image</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-emerald-700">Profile Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="mt-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-700">Name</label>
          <input name="name" value={profile.name} onChange={handleChange} className="mt-1 block w-full rounded-md border border-emerald-200 p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-700">Email</label>
          <input name="email" value={profile.email} onChange={handleChange} className="mt-1 block w-full rounded-md border border-emerald-200 p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-700">About</label>
          <textarea name="about" value={profile.about} onChange={handleChange} className="mt-1 block w-full rounded-md border border-emerald-200 p-2" rows={4} />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md">Save</button>
          <button type="button" onClick={handleCancel} className="px-4 py-2 border rounded-md">Cancel</button>
          {saved && <span className="text-sm text-emerald-600">Saved</span>}
        </div>
      </form>
    </div>
  );
}
