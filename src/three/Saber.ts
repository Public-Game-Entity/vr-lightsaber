import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

class SaberModel {
    model: THREE.Mesh;
    isAvailable: boolean;
    renderer: any;
    constructor(renderer: any) {
        this.isAvailable = false
        this.model = this.addBoundingBox()
        this.renderer = renderer
    }

    addModel() {
        const geometry = new THREE.BoxGeometry( 0.05, 0.2, 0.05 ); 
        const material = new THREE.MeshStandardMaterial()
        material.metalness = 0.45
        material.roughness = 0.65

        const cube = new THREE.Mesh( geometry, material ); 
        cube.receiveShadow = true
        cube.castShadow = true
        cube.rotation.x = - Math.PI/3.6
        this.isAvailable = true

        cube.add(this.addBlade())

        return cube
    }

    addBlade() {
        const length = 1.6
        const geometry = new THREE.CylinderGeometry( 0.01, 0.01, length, 32 );
        const material = new THREE.MeshBasicMaterial( {color: 0xa1cbff} );


        const cylinder = new THREE.Mesh( geometry, material );
        cylinder.position.y = length/2

        return cylinder
    }

    addBoundingBox() {

        const addBoundingBox = new THREE.Mesh(); 

        addBoundingBox.add(this.addModel())

        return addBoundingBox
    }
}

export { SaberModel }