import * as THREE from 'three';
import { VRMExpressionManager } from './expressions/VRMExpressionManager';
import { VRMFirstPerson } from './firstPerson/VRMFirstPerson';
import { VRMHumanoid } from './humanoid/VRMHumanoid';
import { VRMLookAt } from './lookAt/VRMLookAt';
import { VRMMeta } from './meta/VRMMeta';
import { VRMCoreParameters } from './VRMCoreParameters';

/**
 * A class that represents a single VRM model.
 * This class only includes core spec of the VRM (`VRMC_vrm`).
 */
export class VRMCore {
  /**
   * `THREE.Group` that contains the entire VRM.
   */
  public readonly scene: THREE.Group;

  /**
   * Contains {@link VRMHumanoid} of the VRM.
   * You can control each bones using {@link VRMHumanoid.getBoneNode}.
   *
   * @TODO Add a link to VRM spec
   */
  public readonly humanoid?: VRMHumanoid;

  /**
   * Contains {@link VRMExpressionManager} of the VRM.
   * You might want to control these facial expressions via {@link VRMExpressionManager.setValue}.
   */
  public readonly expressionManager?: VRMExpressionManager;

  /**
   * Contains {@link VRMFirstPerson} of the VRM.
   * VRMFirstPerson is mostly used for mesh culling for first person view.
   */
  public readonly firstPerson?: VRMFirstPerson;

  /**
   * Contains {@link VRMLookAt} of the VRM.
   * You might want to use {@link VRMLookAt.target} to control the eye direction of your VRMs.
   */
  public readonly lookAt?: VRMLookAt;

  /**
   * Contains meta fields of the VRM.
   * You might want to refer these license fields before use your VRMs.
   */
  public readonly meta?: VRMMeta;

  /**
   * Create a new VRM instance.
   *
   * @param params [[VRMParameters]] that represents components of the VRM
   */
  public constructor(params: VRMCoreParameters) {
    this.scene = params.scene;
    this.humanoid = params.humanoid;
    this.expressionManager = params.expressionManager;
    this.firstPerson = params.firstPerson;
    this.lookAt = params.lookAt;
    this.meta = params.meta;
  }

  /**
   * **You need to call this on your update loop.**
   *
   * This function updates every VRM components.
   *
   * @param delta deltaTime
   */
  public update(delta: number): void {
    if (this.lookAt) {
      this.lookAt.update(delta);
    }

    if (this.expressionManager) {
      this.expressionManager.update();
    }

    if (this.humanoid?.humanoidRig) {
      this.humanoid.humanoidRig.update();
    }
  }
}
