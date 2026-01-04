
import { HDType, HDAuthority, HDProfile } from './types';

export const TYPE_OPTIONS = Object.values(HDType);
export const AUTHORITY_OPTIONS = Object.values(HDAuthority);
export const PROFILE_OPTIONS = Object.values(HDProfile);

// Valid Authority mapping (Basic validation rules)
export const VALID_AUTHORITIES: Record<HDType, HDAuthority[]> = {
  [HDType.Generator]: [HDAuthority.Emotional, HDAuthority.Sacral],
  [HDType.ManifestingGenerator]: [HDAuthority.Emotional, HDAuthority.Sacral],
  [HDType.Manifestor]: [HDAuthority.Emotional, HDAuthority.Splenic, HDAuthority.Ego],
  [HDType.Projector]: [HDAuthority.Emotional, HDAuthority.Splenic, HDAuthority.Ego, HDAuthority.SelfProjected, HDAuthority.Environmental],
  [HDType.Reflector]: [HDAuthority.Lunar]
};
