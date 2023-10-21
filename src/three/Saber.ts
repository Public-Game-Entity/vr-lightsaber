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
        const material = new THREE.MeshStandardMaterial();
        material.emissive = new THREE.Color(0xa1cbff)
        material.emissiveIntensity = 1
        material.needsUpdate = true

        const cylinder = new THREE.Mesh( geometry, material );
        cylinder.position.y = length/2

        for (let index = 0; index < 10; index++) {
            this.addBladeLight({
                cylinder: cylinder,
                y: -1 + (index/5)
            })            
        }


        return cylinder
    }

    addBladeLight({ cylinder, y }: any) {
        const light = new THREE.PointLight( 0xa1cbff );
        light.intensity = 0.2
        light.decay = 40
        light.position.y = y

        cylinder.add(light)
    }

    addBoundingBox() {

        const addBoundingBox = new THREE.Mesh(); 

        addBoundingBox.add(this.addModel())

        return addBoundingBox
    }
}

export { SaberModel }