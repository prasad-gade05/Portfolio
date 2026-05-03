import {
  Folder,
  Code,
  Briefcase,
  GraduationCap,
  Trophy,
  Award,
  Heart,
  Music,
  Sun,
  Moon,
  Gamepad2,
  Joystick,
  User,
  BookOpen,
} from "lucide-react";

export const themes = [
  { id: "dark", label: "Dark", icon: Moon },
  { id: "light", label: "Light", icon: Sun },
  { id: "arcade-dark", label: "Arcade Dark", icon: Joystick },
  { id: "arcade-light", label: "Arcade Light", icon: Gamepad2 },
];

export const tabs = [
  { id: "projects", label: "Projects", icon: Folder },
  { id: "about", label: "About", icon: User, splitGroup: "about-skills" },
  { id: "skills", label: "Skills", icon: Code, splitGroup: "about-skills" },
  { id: "experience", label: "Experience", icon: Briefcase, splitGroup: "exp-edu" },
  { id: "education", label: "Education", icon: GraduationCap, splitGroup: "exp-edu" },
  { id: "achievements", label: "Achievements", icon: Trophy, splitGroup: "ach-cert" },
  { id: "certifications", label: "Certs", icon: Award, splitGroup: "ach-cert" },
  { id: "volunteering", label: "Volunteer", icon: Heart, splitGroup: "vol-hob" },
  { id: "hobbies", label: "Hobbies", icon: Music, splitGroup: "vol-hob" },
  { id: "blogs", label: "Blogs", icon: BookOpen },
];

export const splitGroups = {
  "about-skills": ["about", "skills"],
  "exp-edu": ["experience", "education"],
  "ach-cert": ["achievements", "certifications"],
  "vol-hob": ["volunteering", "hobbies"],
};
