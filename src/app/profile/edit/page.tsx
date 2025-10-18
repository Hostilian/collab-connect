// src/app/profile/edit/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

// Define types for component props
interface InputProps {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
}

interface TextareaProps {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
}

interface SelectProps {
  label: string;
  name: string;
  children: React.ReactNode;
  defaultValue?: string;
}


// Placeholder components for UI elements
const Input: React.FC<InputProps> = ({ label, name, type = "text", defaultValue, placeholder }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1">
      <input
        type={type}
        name={name}
        id={name}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </div>
  </div>
);

const Textarea: React.FC<TextareaProps> = ({ label, name, defaultValue, placeholder, rows = 3 }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <div className="mt-1">
            <textarea
                name={name}
                id={name}
                rows={rows}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                defaultValue={defaultValue}
                placeholder={placeholder}
            />
        </div>
    </div>
);

const Select: React.FC<SelectProps> = ({ label, name, children, defaultValue }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <select
            id={name}
            name={name}
            defaultValue={defaultValue}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
            {children}
        </select>
    </div>
);


export default async function EditProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/profile/edit");
  }

  // In a real app, you would fetch the user's profile from the database here
  // const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } });
  const profile = {
    bio: "This is a placeholder bio. I'm passionate about fighting the system and collaborating on cool projects.",
    location: "City, Country",
    preferredLanguage: "en",
    profileStyle: "minimalist",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Your Profile</h1>
        <p className="mt-2 text-sm text-gray-500">
          This is your public presence. Make it count. Full transparency is our goal.
        </p>

        <form action="#" method="POST" className="mt-8 space-y-8">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
              <p className="text-sm text-gray-500">This helps others connect with you.</p>
            </div>

            <div className="sm:col-span-4">
              <Input
                label="Full Name"
                name="name"
                defaultValue={session.user.name ?? ""}
                placeholder="Your full name"
              />
            </div>

            <div className="sm:col-span-4">
              <Input
                label="Email address"
                name="email"
                type="email"
                defaultValue={session.user.email ?? ""}
                placeholder="your.email@example.com"
              />
            </div>

            <div className="sm:col-span-6">
              <Textarea
                label="Bio"
                name="bio"
                defaultValue={profile.bio}
                placeholder="Tell your story. What are you passionate about? What collaborations are you looking for?"
                rows={5}
              />
            </div>

            <div className="sm:col-span-6">
                <h2 className="text-xl font-semibold text-gray-800 pt-4">Location & Language</h2>
                <p className="text-sm text-gray-500">Help us connect you with people nearby and in your language.</p>
            </div>

            <div className="sm:col-span-4">
              <Input
                label="Location"
                name="location"
                defaultValue={profile.location}
                placeholder="e.g., Berlin, Germany"
              />
              <p className="mt-2 text-xs text-gray-500">We'll use this to show you on the map. You can control the precision later.</p>
            </div>

            <div className="sm:col-span-3">
                <Select label="Preferred Language" name="language" defaultValue={profile.preferredLanguage}>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="ar">العربية</option>
                    <option value="zh">中文</option>
                </Select>
            </div>

            <div className="sm:col-span-6">
                <h2 className="text-xl font-semibold text-gray-800 pt-4">Interests & Hobbies</h2>
                <p className="text-sm text-gray-500">Tag your interests to find like-minded collaborators. (UI Placeholder)</p>
            </div>

            <div className="sm:col-span-6">
                {/* This would be a dynamic tag input component in a real app */}
                <div className="flex flex-wrap gap-2 p-4 border border-dashed border-gray-300 rounded-md">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">#real-estate-investing</span>
                    <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">#community-organizing</span>
                    <span className="bg-yellow-100 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">#art-and-design</span>
                    <span className="bg-purple-100 text-purple-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">#tech-for-good</span>
                    <input placeholder="Add a tag..." className="flex-grow p-1 focus:ring-0 border-none"/>
                </div>
            </div>

            <div className="sm:col-span-6">
                <h2 className="text-xl font-semibold text-gray-800 pt-4">Profile Style</h2>
                <p className="text-sm text-gray-500">Choose a theme for your public profile page.</p>
            </div>

            <div className="sm:col-span-3">
                <Select label="Profile Theme" name="profileStyle" defaultValue={profile.profileStyle}>
                    <option value="minimalist">Minimalist</option>
                    <option value="professional">Professional</option>
                    <option value="artistic">Artistic</option>
                    <option value="tech">Tech</option>
                </Select>
            </div>

          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Save Changes (Disabled)
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
