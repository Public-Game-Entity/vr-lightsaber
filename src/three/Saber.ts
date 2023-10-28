import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBB } from 'three/examples/jsm/math/OBB';
import { Sound } from './Scene';


class SaberModel {
    model: THREE.Mesh;
    isAvailable: boolean;
    isOn: boolean;
    renderer: THREE.WebGLRenderer;
    bladeLength: number;
    bladeModel: THREE.Mesh;
    onInterval: NodeJS.Timer;
    obb: OBB
    sound: any;
    listener: THREE.AudioListener;

    constructor(renderer: THREE.WebGLRenderer, listener: THREE.AudioListener) {
        this.listener = listener
        this.isAvailable = false
        this.isOn = true
        this.bladeLength = 0
        this.model = this.addBoundingBox()
        this.renderer = renderer
        this.sound = {}
        this.initSound()

        const controller1 = renderer.xr.getController(0);
        controller1.addEventListener('selectstart', this.switchBlade.bind(this));
    }

    initSound() {
        const on = new Sound(this.listener, "/public/sound/on.mp3", false, false)
        this.sound.on = on

        const off = new Sound(this.listener, "/public/sound/off.mp3", false, false)
        this.sound.off = off
    }

    addModel() {
        const addBoundingBox = new THREE.Mesh(); 
        
        const loader = new GLTFLoader();

        loader.load( '/public/saber.glb', ( gltf ) => {
            this.isAvailable = true
            const saber = gltf.scene
            const scale = 0.02
            saber.scale.set(scale, scale, scale)
            saber.rotation.z = Math.PI/2

            addBoundingBox.add(saber)
        }, function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
        }, function ( error ) {
            console.log( 'An error happened' );
        });

        return addBoundingBox
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

    setBladeLength({ scale }: { scale: number }) {
        this.bladeModel.scale.y = scale
        this.bladeModel.position.y = scale/2 + 0.1
    }



    switchBlade() {
        if (this.isOn) {
            this.offBlade()
            this.sound.off.play()

            return 0
        }

        this.onBlade()
        this.sound.on.play()
        
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

    addBladeLight({ cylinder, y }: { cylinder: THREE.Mesh, y: number }) {
        const light = new THREE.PointLight( 0xa1cbff );
        light.intensity = 0.5
        light.decay = 400
        light.distance = 500
        light.position.y = y

        cylinder.add(light)
    }

    addBoundingBox() {

        const addBoundingBox = new THREE.Mesh(); 
        const model = this.addModel()
        this.bladeModel = this.addBlade()
        this.obb = new OBB(this.bladeModel.position, new THREE.Vector3(0.01,1.2,0.01))
        const boxHelper = new THREE.BoxHelper( this.bladeModel, 0xffff67)

        model.add(this.bladeModel)
        model.rotation.x = - Math.PI/3.6

        addBoundingBox.add(model)


        return addBoundingBox
    }



    animateSaber() {

    }
}

export { SaberModel }