/**
 * V6.0 Orb Asset Management
 * Centralized asset path configuration and fallback handling
 */
export interface OrbAssetConfig {
  /** Primary PNG orb image path */
  orbImage: string;
  /** Fallback PNG paths */
  orbImageFallbacks: string[];
  /** Lottie animation path */
  lottieAnimation: string;
  /** Alternative Lottie animation */
  lottieAnimationV2: string;
  /** Asset validation */
  validateAssets: () => Promise<OrbAssetValidation>;
}
export interface OrbAssetValidation {
  orbImageValid: boolean;
  lottieValid: boolean;
  availableAssets: string[];
  recommendedMode: 'lottie' | 'png' | 'hybrid';
}
/**
 * V6.0 Orb asset configuration with intelligent fallbacks
 */
export const OrbAssets: OrbAssetConfig = {
  // Primary orb image path (highest quality)
  orbImage: '/orb/OrbRefined.png',
  // Fallback paths in order of preference
  orbImageFallbacks: [
    '/OrbRefined.png',
    '/images/OrbRefined.png',
    '/Orb.png',
    '/icons/Orb.png'
  ],
  // Lottie animations
  lottieAnimation: '/animations/living_orb_idle.json',
  lottieAnimationV2: '/animations/living_orb_idle_v05.lottie',
  // Asset validation function
  validateAssets: async (): Promise<OrbAssetValidation> => {
    const results: OrbAssetValidation = {
      orbImageValid: false,
      lottieValid: false,
      availableAssets: [],
      recommendedMode: 'png'
    };
    // Check PNG assets
    const allPngPaths = [OrbAssets.orbImage, ...OrbAssets.orbImageFallbacks];
    for (const path of allPngPaths) {
      try {
        const response = await fetch(path, { method: 'HEAD' });
        if (response.ok) {
          results.orbImageValid = true;
          results.availableAssets.push(path);
          break;
        }
      } catch (error) {
      }
    }
    // Check Lottie assets
    try {
      const lottieResponse = await fetch(OrbAssets.lottieAnimation, { method: 'HEAD' });
      if (lottieResponse.ok) {
        results.lottieValid = true;
        results.availableAssets.push(OrbAssets.lottieAnimation);
      }
    } catch (error) {
    }
    // Determine recommended mode
    if (results.lottieValid && results.orbImageValid) {
      results.recommendedMode = 'hybrid';
    } else if (results.lottieValid) {
      results.recommendedMode = 'lottie';
    } else {
      results.recommendedMode = 'png';
    }
    return results;
  }
};
/**
 * Get the best available orb image path
 */
export const getBestOrbImagePath = async (): Promise<string> => {
  const validation = await OrbAssets.validateAssets();
  if (validation.orbImageValid) {
    return validation.availableAssets.find(path => path.includes('.png')) || OrbAssets.orbImage;
  }
  // Return primary path as fallback (Next.js will handle 404)
  return OrbAssets.orbImage;
};
/**
 * Check if Lottie animations are available
 */
export const isLottieAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(OrbAssets.lottieAnimation, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};
/**
 * Preload orb assets for better performance
 */
export const preloadOrbAssets = async (): Promise<void> => {
  const validation = await OrbAssets.validateAssets();
  // Preload valid assets
  validation.availableAssets.forEach(assetPath => {
    if (assetPath.includes('.png') || assetPath.includes('.jpg')) {
      // Preload images
      const img = new Image();
      img.src = assetPath;
    } else if (assetPath.includes('.json') || assetPath.includes('.lottie')) {
      // Preload Lottie data
      fetch(assetPath)
        .then(response => response.json())
        .catch(() => {
          // Error handled silently
        });
    }
  });
};
/**
 * Get optimal orb configuration based on device capabilities
 */
export const getOptimalOrbConfig = (
  userAgent?: string,
  connectionType?: string
): { mode: 'lottie' | 'png' | 'hybrid'; optimized: boolean } => {
  const isMobile = /Mobi|Android/i.test(userAgent || navigator.userAgent);
  const isSlowConnection = connectionType === 'slow-2g' || connectionType === '2g';
  if (isMobile || isSlowConnection) {
    return { mode: 'png', optimized: true };
  }
  return { mode: 'hybrid', optimized: false };
};
/**
 * Asset performance monitoring
 */
export const trackOrbAssetPerformance = (assetPath: string, loadTime: number): void => {
  if (typeof window !== 'undefined') {
    // You can integrate with analytics here
    if ((window as any).gtag) {
      (window as any).gtag('event', 'orb_asset_load', {
        asset_path: assetPath,
        load_time: loadTime,
        category: 'performance'
      });
    }
  }
};
export default OrbAssets;