import * as THREE from 'three';
import { VRMHumanBoneName, VRMHumanBones } from '.';
import { VRMHumanBoneList } from './VRMHumanBoneList';
import { VRMHumanBoneParentMap } from './VRMHumanBoneParentMap';
import { VRMHumanoid } from './VRMHumanoid';

const _v3A = new THREE.Vector3();
const _quatA = new THREE.Quaternion();

export class VRMHumanoidRig extends VRMHumanoid {
  protected static _setupTransforms(
    humanoid: VRMHumanoid,
  ): {
    rigBones: VRMHumanBones;
    root: THREE.Object3D;
    parentWorldRotations: { [boneName in VRMHumanBoneName]?: THREE.Quaternion };
    boneRotations: { [boneName in VRMHumanBoneName]?: THREE.Quaternion };
  } {
    const root = new THREE.Object3D();
    root.name = 'VRMHumanoidRig';

    // store boneWorldPositions and boneWorldRotations
    const boneWorldPositions: { [boneName in VRMHumanBoneName]?: THREE.Vector3 } = {};
    const boneWorldRotations: { [boneName in VRMHumanBoneName]?: THREE.Quaternion } = {};
    const boneRotations: { [boneName in VRMHumanBoneName]?: THREE.Quaternion } = {};

    VRMHumanBoneList.forEach((boneName) => {
      const boneNode = humanoid.getBoneNode(boneName);

      if (boneNode) {
        const boneWorldPosition = new THREE.Vector3();
        const boneWorldRotation = new THREE.Quaternion();

        boneNode.updateWorldMatrix(true, false);
        boneNode.matrixWorld.decompose(boneWorldPosition, boneWorldRotation, _v3A);

        boneWorldPositions[boneName] = boneWorldPosition;
        boneWorldRotations[boneName] = boneWorldRotation;
        boneRotations[boneName] = boneNode.quaternion.clone();
      }
    });

    // build rig hierarchy + store parentWorldRotations
    const parentWorldRotations: { [boneName in VRMHumanBoneName]?: THREE.Quaternion } = {};

    const rigBones: Partial<VRMHumanBones> = {};
    VRMHumanBoneList.forEach((boneName) => {
      const boneNode = humanoid.getBoneNode(boneName);

      if (boneNode) {
        const boneWorldPosition = boneWorldPositions[boneName] as THREE.Vector3;

        // see the nearest parent position
        let currentBoneName: VRMHumanBoneName | null = boneName;
        let parentWorldPosition: THREE.Vector3 | undefined;
        let parentWorldRotation: THREE.Quaternion | undefined;
        while (parentWorldPosition == null) {
          currentBoneName = VRMHumanBoneParentMap[currentBoneName];
          if (currentBoneName == null) {
            break;
          }
          parentWorldPosition = boneWorldPositions[currentBoneName];
          parentWorldRotation = boneWorldRotations[currentBoneName];
        }

        // add to hierarchy
        const rigBoneNode = new THREE.Object3D();
        rigBoneNode.name = 'humanoid' + boneNode.name;

        const parentRigBoneNode = (currentBoneName ? rigBones[currentBoneName]?.node : root) as THREE.Object3D;

        parentRigBoneNode.add(rigBoneNode);
        rigBoneNode.position.copy(boneWorldPosition);
        if (parentWorldPosition) {
          rigBoneNode.position.sub(parentWorldPosition);
        }

        rigBones[boneName] = { node: rigBoneNode };

        // store parentWorldRotation
        parentWorldRotations[boneName] = parentWorldRotation ?? new THREE.Quaternion();
      }
    });

    return {
      rigBones: rigBones as VRMHumanBones,
      root,
      parentWorldRotations,
      boneRotations,
    };
  }

  public readonly original: VRMHumanoid;
  public readonly root: THREE.Object3D;
  protected readonly _parentWorldRotations: { [boneName in VRMHumanBoneName]?: THREE.Quaternion };
  protected readonly _boneRotations: { [boneName in VRMHumanBoneName]?: THREE.Quaternion };

  public constructor(humanoid: VRMHumanoid) {
    const { rigBones, root, parentWorldRotations, boneRotations } = VRMHumanoidRig._setupTransforms(humanoid);

    super(rigBones);

    this.original = humanoid;
    this.root = root;
    this._parentWorldRotations = parentWorldRotations;
    this._boneRotations = boneRotations;
  }

  /**
   * Update this humanoid rig.
   */
  public update(): void {
    VRMHumanBoneList.forEach((boneName) => {
      const boneNode = this.original.getBoneNode(boneName);

      if (boneNode != null) {
        const rigBoneNode = this.getBoneNode(boneName)!;
        const parentWorldRotation = this._parentWorldRotations[boneName]!;
        const invParentWorldRotation = _quatA.copy(parentWorldRotation).invert();
        const boneRotation = this._boneRotations[boneName]!;

        boneNode.quaternion
          .copy(rigBoneNode.quaternion)
          .multiply(parentWorldRotation)
          .premultiply(invParentWorldRotation)
          .multiply(boneRotation);

        if (boneName === 'hips') {
          boneNode.position.copy(rigBoneNode.position);
        }
      }
    });
  }
}
