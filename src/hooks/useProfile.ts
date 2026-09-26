"use client";

import { useEffect, useState } from "react";
import social from "@/constants/Social";

export interface PublicProfile {
  name: string;
  email: string;
  bio: string;
  image: string;
  github: string;
  linkedin: string;
  facebook: string;
  twitter: string | null;
  instagram: string | null;
  youtube: string | null;
  website: string | null;
  resume: string | null;
  role: string;
  skills: string[];
  achievements: string[];
  location: string | null;
  phone: string | null;
}

const fallbackProfile: PublicProfile = {
  name: social.title,
  email: social.email.replace("mailto:", ""),
  bio: social.description,
  image: social.profilePic,
  github: social.github,
  linkedin: social.linkedin,
  facebook: social.facebook,
  twitter: null,
  instagram: null,
  youtube: null,
  website: null,
  resume: null,
  role: social.description,
  skills: [],
  achievements: [],
  location: null,
  phone: null,
};

export function useProfile() {
  const [profile, setProfile] = useState<PublicProfile>(fallbackProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile/public");
        const data = await response.json();

        if (isMounted && data.success && data.data) {
          setProfile({
            name: data.data.name || fallbackProfile.name,
            email: data.data.email || fallbackProfile.email,
            bio: data.data.bio || fallbackProfile.bio,
            image: data.data.image || fallbackProfile.image,
            github: data.data.github || fallbackProfile.github,
            linkedin: data.data.linkedin || fallbackProfile.linkedin,
            facebook: data.data.facebook || fallbackProfile.facebook,
            twitter: data.data.twitter,
            instagram: data.data.instagram,
            youtube: data.data.youtube,
            website: data.data.website,
            resume: data.data.resume,
            role: data.data.role || fallbackProfile.role,
            skills: Array.isArray(data.data.skills) ? data.data.skills : [],
            achievements: Array.isArray(data.data.achievements) ? data.data.achievements : [],
            location: data.data.location || null,
            phone: data.data.phone || null,
          });
        }
      } catch (error) {
        console.error("Error fetching public profile:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  return { profile, loading };
}
