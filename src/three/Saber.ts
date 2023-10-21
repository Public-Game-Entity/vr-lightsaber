import * as THREE from 'three';


class SaberModel {
    model: THREE.Mesh;
    isAvailable: boolean;
    constructor() {
        this.isAvailable = false
        this.model = this.addModel()
    }

    addModel() {
        const geometry = new THREE.BoxGeometry( 0.2, 1, 0.2 ); 
        const material = new THREE.MeshStandardMaterial()
        material.metalness = 0.45
        material.roughness = 0.65

        const cube = new THREE.Mesh( geometry, material ); 
        cube.receiveShadow = true
        cube.castShadow = true
        this.isAvailable = true
        return cube
    }
}

export { SaberModel }