import {
  BarChart3, Cloud, Code2, Cpu, Database, Factory, Github, Globe, Instagram, Linkedin, Mail,
  Palette, Smartphone, Sparkles, Twitter, Users, Wrench, Youtube,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SkillIcon, SocialIcon } from "../config/types";

export const skillIcons: Record<SkillIcon, LucideIcon> = {
  code: Code2, cloud: Cloud, database: Database, wrench: Wrench, palette: Palette,
  users: Users, chart: BarChart3, cpu: Cpu, factory: Factory, sparkles: Sparkles, phone: Smartphone,
};

export const socialIcons: Record<SocialIcon, LucideIcon> = {
  github: Github, linkedin: Linkedin, twitter: Twitter, youtube: Youtube, instagram: Instagram, globe: Globe, mail: Mail,
};
