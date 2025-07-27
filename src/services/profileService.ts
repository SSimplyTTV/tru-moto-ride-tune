import { TuningProfile, DEFAULT_PROFILES } from '@/types/profiles';

const PROFILES_STORAGE_KEY = 'trumoto_profiles';
const ACTIVE_PROFILE_KEY = 'trumoto_active_profile';

export class ProfileService {
  static loadProfiles(): TuningProfile[] {
    try {
      const stored = localStorage.getItem(PROFILES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Initialize with default profiles
      this.saveProfiles(DEFAULT_PROFILES);
      return DEFAULT_PROFILES;
    } catch (error) {
      console.error('Failed to load profiles:', error);
      return DEFAULT_PROFILES;
    }
  }

  static saveProfiles(profiles: TuningProfile[]): void {
    try {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    } catch (error) {
      console.error('Failed to save profiles:', error);
    }
  }

  static saveProfile(profile: TuningProfile): void {
    const profiles = this.loadProfiles();
    const existingIndex = profiles.findIndex(p => p.id === profile.id);
    
    if (existingIndex >= 0) {
      profiles[existingIndex] = { ...profile, updatedAt: new Date().toISOString() };
    } else {
      profiles.push({ ...profile, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    this.saveProfiles(profiles);
  }

  static deleteProfile(profileId: string): void {
    const profiles = this.loadProfiles();
    const filtered = profiles.filter(p => p.id !== profileId);
    this.saveProfiles(filtered);
    
    // If we deleted the active profile, clear it
    if (this.getActiveProfileId() === profileId) {
      this.setActiveProfile(null);
    }
  }

  static getActiveProfileId(): string | null {
    return localStorage.getItem(ACTIVE_PROFILE_KEY);
  }

  static setActiveProfile(profileId: string | null): void {
    if (profileId) {
      localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
    } else {
      localStorage.removeItem(ACTIVE_PROFILE_KEY);
    }
  }

  static getActiveProfile(): TuningProfile | null {
    const activeId = this.getActiveProfileId();
    if (!activeId) return null;
    
    const profiles = this.loadProfiles();
    return profiles.find(p => p.id === activeId) || null;
  }

  static createProfile(name: string, throttleCurve: [number, number, number, number, number], regenBraking: number): TuningProfile {
    const profile: TuningProfile = {
      id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      throttleCurve,
      regenBraking,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.saveProfile(profile);
    return profile;
  }

  static renameProfile(profileId: string, newName: string): void {
    const profiles = this.loadProfiles();
    const profile = profiles.find(p => p.id === profileId);
    
    if (profile) {
      profile.name = newName;
      profile.updatedAt = new Date().toISOString();
      this.saveProfiles(profiles);
    }
  }
}

export const profileService = ProfileService;