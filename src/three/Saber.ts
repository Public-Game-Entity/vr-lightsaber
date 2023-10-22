import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

class SaberModel {
    model: THREE.Mesh;
    isAvailable: boolean;
    isOn: boolean;
    renderer: any;
    bladeLength: number;
    bladeModel: THREE.Mesh;
    onInterval: NodeJS.Timer;
    constructor(renderer: any) {
        this.isAvailable = false
        this.isOn = false
        this.bladeLength = 0
        this.model = this.addBoundingBox()
        this.renderer = renderer

        document.querySelector("body").addEventListener("click", this.switchBlade.bind(this))
        const controller1 = renderer.xr.getController(0);
        controller1.addEventListener('selectstart', this.switchBlade.bind(this));
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
        return cube
    }

    addBlade() {
        const length = 1.2
        const geometry = new THREE.CylinderGeometry( 0.01, 0.01, length, 32 );
        geometry.parameters
        const material = new THREE.MeshStandardMaterial();
        material.emissive = new THREE.Color(0xa1cbff)
        material.emissiveIntensity = 1
        material.needsUpdate = true

        const cylinder = new THREE.Mesh( geometry, material );
        cylinder.position.y = length/2

        for (let index = 0; index < 8; index++) {
            this.addBladeLight({
                cylinder: cylinder,
                y: -1 + (index/5)
            })            
        }


        return cylinder
    }

    setBladeLength({ scale }: any) {
        this.bladeModel.scale.y = scale
        this.bladeModel.position.y = scale/2 + 0.1

        console.log(this.bladeModel.scale)
    }



    switchBlade() {
        if (this.isOn) {
            this.offBlade()
            return 0
        }

        this.onBlade()
    }

    onBlade() {
        let scale = 0.001
        clearInterval(this.onInterval)
        this.onInterval = setInterval(() => {
            if (scale >= 1.1) {
                this.setBladeLength({ scale: 1.2 })
                this.isOn = true

                clearInterval(this.onInterval)
            }
            scale += 0.05
            this.setBladeLength({ scale: scale })
        }, 40)
    }

    offBlade() {
        let scale = 1.2001
        clearInterval(this.onInterval)
        this.onInterval = setInterval(() => {
            if (scale <= 0) {
                this.setBladeLength({ scale: 0.01 })
                this.isOn = false

                clearInterval(this.onInterval)
            }
            scale -= 0.05
            this.setBladeLength({ scale: scale })
        }, 40)
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
        const model = this.addModel()

        this.bladeModel = this.addBlade()
        model.add(this.bladeModel)

        addBoundingBox.add(model)

        return addBoundingBox
    }

}

export { SaberModel }