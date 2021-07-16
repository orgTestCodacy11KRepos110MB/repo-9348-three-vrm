import type { MaterialsMToonOutlineWidthMode } from './MaterialsMToonOutlineWidthMode';
import type { MaterialsMToonShadingShiftTextureInfo } from './MaterialsMToonShadingShiftTextureInfo';
import type { MaterialsMToonTextureInfo } from './MaterialsMToonTextureInfo';

export interface VRMCMaterialsMToon {
  /**
   * Specification version of VRMC_materials_mtoon
   */
  specVersion: '1.0-draft';

  /**
   * enable depth buffer when renderMode is transparent
   */
  transparentWithZWrite?: boolean;

  /**
   *
   */
  renderQueueOffsetNumber?: number;

  /**
   *
   */
  shadeColorFactor?: number[];

  /**
   *
   */
  shadeMultiplyTexture?: MaterialsMToonTextureInfo;

  /**
   * Lighting
   */
  shadingShiftFactor?: number;

  /**
   *
   */
  shadingShiftTexture: MaterialsMToonShadingShiftTextureInfo;

  /**
   *
   */
  shadingToonyFactor?: number;

  /**
   *
   */
  giIntensityFactor?: number;

  /**
   * MatCap
   */
  matcapTexture?: MaterialsMToonTextureInfo;

  /**
   * Rim
   */
  parametricRimColorFactor?: number[];

  /**
   *
   */
  rimMultiplyTexture?: MaterialsMToonTextureInfo;

  /**
   *
   */
  rimLightingMixFactor?: number;

  /**
   *
   */
  parametricRimFresnelPowerFactor?: number;

  /**
   *
   */
  parametricRimLiftFactor?: number;

  /**
   * Outline
   */
  outlineWidthMode?: MaterialsMToonOutlineWidthMode;

  /**
   *
   */
  outlineWidthFactor?: number;

  /**
   *
   */
  outlineWidthMultiplyTexture?: MaterialsMToonTextureInfo;

  /**
   *
   */
  outlineColorFactor?: number[];

  /**
   *
   */
  outlineLightingMixFactor?: number;

  /**
   *
   */
  uvAnimationMaskTexture?: MaterialsMToonTextureInfo;

  /**
   *
   */
  uvAnimationScrollXSpeedFactor?: number;

  /**
   *
   */
  uvAnimationScrollYSpeedFactor?: number;

  /**
   *
   */
  uvAnimationRotationSpeedFactor?: number;

  extensions?: { [name: string]: any };
  extras?: any;
}