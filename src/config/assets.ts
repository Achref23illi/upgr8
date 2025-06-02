/**
 * Asset configuration for the UpGr8 application
 * Maps selection values to image paths in the public directory
 */
export const AppAssets = {
  /**
   * Logo assets
   */
  logos: {
    siteLogo: '/next.svg',
  },
  
  /**
   * Coach certification levels
   * Keys match the exact select option values
   * Images are PNG files directly in the public folder
   */
  coachLevels: {
    'Initiation': '/Initiation.png',
    'Régional': '/Regional.png',
    'Provincial': '/Provincial.png',
    'National': '/National.png',
    'Haute Performance': '/High.png',
  },
  
  /**
   * Team age categories
   * Keys match the exact select option values
   * Images are PNG files directly in the public folder
   */
  teamCategories: {
    'U7 ( Pré-novice )': '/U7.png',
    'U9 ( Novice )': '/U9.png',
    'U11 ( Atome )': '/U11.png',
    'U13 ( Pee-wee )': '/U13.png',
    'U15 ( Bantam )': '/U15.png',
    'U17 ( Midget )': '/U18.png', // Using U18.png for U17
    'U18 ( Midget Espoir )': '/U18.png',
    'U21 ( Junior )': '/Junior.png',
    'Senior': '/Senior.png',
  },
  
  /**
   * Team competition levels - these are now text overlays, not images
   * Kept for reference but not used for image paths
   */
  teamLevels: {
    'Récréatif': 'REC',
    'C': 'C',
    'B': 'B',
    'A': 'A',
    'AA': 'AA',
    'AAA': 'AAA',
  },
  
  /**
   * Placeholder and default images
   */
  placeholders: {
    defaultBackground: '/placeholder.png',
    defaultPlayer: '/placeholder.png',
  },
  
  /**
   * Additional images that might be used
   */
  images: {
    defaultPlaceholder: '/placeholder.png',
  },
} as const;

/**
 * Type-safe keys for accessing assets
 */
export type CoachLevelKey = keyof typeof AppAssets.coachLevels;
export type TeamCategoryKey = keyof typeof AppAssets.teamCategories;
export type TeamLevelKey = keyof typeof AppAssets.teamLevels;