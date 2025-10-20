import { useState, useCallback } from 'react';

interface SocialMediaData {
  username: string;
  platform: string;
  exists: boolean;
  followers?: number;
  subscribers?: number;
  verified?: boolean;
  profile_pic?: string;
  bio?: string;
  display_name?: string;
  channel_name?: string;
  description?: string;
}

interface ValidationState {
  isValidating: boolean;
  isValid: boolean;
  data: SocialMediaData | null;
  error: string | null;
}

export function useSocialValidation() {
  const [validationStates, setValidationStates] = useState<Record<string, ValidationState>>({});

  const validateUsername = useCallback(async (platform: string, username: string) => {
    if (!username.trim()) {
      setValidationStates(prev => ({
        ...prev,
        [platform]: {
          isValidating: false,
          isValid: false,
          data: null,
          error: null
        }
      }));
      return;
    }

    // Set validating state
    setValidationStates(prev => ({
      ...prev,
      [platform]: {
        isValidating: true,
        isValid: false,
        data: null,
        error: null
      }
    }));

    try {
      const response = await fetch(`/api/social-validation/${platform}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();

      if (response.ok) {
        setValidationStates(prev => ({
          ...prev,
          [platform]: {
            isValidating: false,
            isValid: true,
            data: result,
            error: null
          }
        }));
        return result;
      } else {
        setValidationStates(prev => ({
          ...prev,
          [platform]: {
            isValidating: false,
            isValid: false,
            data: null,
            error: result.message || result.error || 'Validation failed'
          }
        }));
        return null;
      }
    } catch (error) {
      console.error(`Error validating ${platform} username:`, error);
      setValidationStates(prev => ({
        ...prev,
        [platform]: {
          isValidating: false,
          isValid: false,
          data: null,
          error: 'Network error. Please try again.'
        }
      }));
      return null;
    }
  }, []);

  const getValidationState = useCallback((platform: string): ValidationState => {
    return validationStates[platform] || {
      isValidating: false,
      isValid: false,
      data: null,
      error: null
    };
  }, [validationStates]);

  const clearValidation = useCallback((platform: string) => {
    setValidationStates(prev => {
      const newState = { ...prev };
      delete newState[platform];
      return newState;
    });
  }, []);

  const getTotalFollowers = useCallback(() => {
    let total = 0;
    Object.values(validationStates).forEach(state => {
      if (state.data) {
        if (state.data.followers) {
          total += state.data.followers;
        } else if (state.data.subscribers) {
          total += state.data.subscribers;
        }
      }
    });
    return total;
  }, [validationStates]);

  const formatFollowerCount = useCallback((count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  }, []);

  return {
    validateUsername,
    getValidationState,
    clearValidation,
    getTotalFollowers,
    formatFollowerCount,
    validationStates
  };
}
