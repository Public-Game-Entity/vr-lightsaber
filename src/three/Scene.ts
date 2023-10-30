import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import { SaberModel } from './Saber';
import { GunModel } from './Gun';
import { Collision } from './Collision';
import { Cube } from './Cube';

import { Sky } from 'three/examples/jsm/objects/Sky';

class Scene {
    scene: THREE.Scene
    camera: THREE.Camera
    renderer: THREE.WebGLRenderer
    saber: SaberModel;
    gun: GunModel;
    collisionDetect: Collision;
    sphere: THREE.Mesh[];
    skybox: SkyBox;
    listener: THREE.AudioListener;
    sound: any;

    constructor() {

        this.init()
    }

    async init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0xffffff );
        this.scene.fog = new THREE.Fog( 0xeddfdf, 10, 50 );
    
        
        this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.01, 100 );
        this.camera.position.set( 0, 3, 7 );
        this.scene.add(this.camera);

        this.listener = new THREE.AudioListener();
        this.camera.add( this.listener );

        this.sound = {}

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true
        this.renderer.xr.enabled = true;
        this.renderer.setAnimationLoop(this.animateXR.bind(this));

        document.querySelector("#screen").appendChild( this.renderer.domElement );
        document.querySelector("#screen").insertAdjacentElement("beforeend", VRButton.createButton( this.renderer ))

        const dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.position.set( -40, 400, -70 );
        dirLight.shadow.camera.top = 150;
        dirLight.shadow.camera.right = 150;
        dirLight.shadow.camera.bottom = -150;
        dirLight.shadow.camera.left = -150;
        dirLight.castShadow = true;
        this.scene.add(dirLight);
        
        const hemiLight = new THREE.HemisphereLight( 0x707070, 0x444444 );
        hemiLight.position.set( 0, 120, 0 );
        this.scene.add(hemiLight);
        
        const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ),new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: true} ) );
        mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;
        this.scene.add(mesh);

        this.saber = new SaberModel(this.renderer, this.listener)
        this.scene.add(this.saber.model)

        this.gun = new GunModel(this.scene)
        this.collisionDetect = new Collision()
    
        // const helper = new THREE.CameraHelper( dirLight.shadow.camera );
        // this.scene.add( helper );

        const newCube = new Cube({
            x: 2,
            y: 1,
            z: -2,

            xw: 1,
            yw: 4,
            zw: 2
        })

        const newCubeMesh = newCube.create()

        this.scene.add(newCubeMesh)

        this.skybox = new SkyBox(this.scene, this.renderer)
        
        this.animate();
        this.sphere = []

        // this.addSphere()
        document.querySelector("body").addEventListener("click", this.playIdleSound.bind(this))

        setInterval(() => {
            this.shotGun()
        }, 500)


    }

    private playIdleSound() {
        const idle = new Sound(this.listener, "/public/sound/idle.mp3", true, true)
        this.sound.idle = idle

        const impact1 = new Sound(this.listener, "/public/sound/impact1.mp3", false, false)
        this.sound['impact1'] = impact1

        const impact2 = new Sound(this.listener, "/public/sound/deflection.mp3", false, false)
        this.sound['impact2'] = impact2

        const impact3 = new Sound(this.listener, "/public/sound/impact2.mp3", false, false)
        this.sound['impact3'] = impact3
    }

    private playImpactSound() {
        let objectNames = ['impact1', 'impact2', 'impact3']
        objectNames.sort(() => Math.random() - 0.5)
        for (let index = 0; index < objectNames.length; index++) {
            const objectName = objectNames[index]
            if (this.sound[objectName].sound.isPlaying == false) {
                this.sound[objectName].sound.play()
                break
            }
        }
    }

    shotGun() {
        this.gun.shot({ initHeight: 0.6 + (Math.random() * 1) })
    }

    animate() {
        requestAnimationFrame( this.animate.bind(this) );

        this.renderer.render( this.scene, this.camera );
    }

    animateXR() {
        const controller = this.renderer.xr.getController(0); 
        // console.log(controller)



        const session = this.renderer.xr.getSession();
        // session.inputSources[0].gamepad.vibrationActuator.playEffect("dual-rumble", )

        this.saber.model.position.set(controller.position.x, controller.position.y, controller.position.z)
        this.saber.model.rotation.x = controller.rotation.x
        this.saber.model.rotation.y = controller.rotation.y
        this.saber.model.rotation.z = controller.rotation.z

        this.gun.animateBullet()
        this.saber.obb.center = this.saber.model.position        
        this.saber.obb.rotation.setFromMatrix4(this.saber.bladeModel.matrixWorld)

        console.log(this.gun.bullets.length)

        for (let index = 0; index < this.gun.bullets.length; index++) {
            if (this.gun.bullets[index].isCollisionAvailable == false) {
                continue
            }

            
            const isCollide  = this.saber.obb.intersectsOBB(this.gun.bullets[index].obb)

            if (isCollide) {
                this.playImpactSound()

                this.gun.bullets[index].velocity.z = -this.gun.bullets[index].velocity.z
                this.gun.bullets[index].velocity.x = -(this.gun.bullets[index].velocity.x + (Math.random() - 0.5) / 50)
                this.gun.bullets[index].velocity.y = (Math.random() - 0.5) / 40
                this.gun.bullets[index].isCollisionAvailable = false

            }
        }



        this.renderer.render( this.scene, this.camera );
    }


    addSphere() {
        const geometry = new THREE.SphereGeometry( 0.1, 32, 16 ); 
        const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
        const sphere = new THREE.Mesh( geometry, material ); 
        this.sphere.push(sphere)
        this.scene.add( sphere );
    }
    
}


class SkyBox {
    sky: Sky;
    scene: any;
    sun: THREE.Vector3;
    renderer: any;
    constructor(scene: any, renderer: any) {
        this.scene = scene
        this.renderer = renderer
        this.initSky()
    }

    private initSky() {

        this.sky = new Sky();
        this.sky.scale.setScalar( 450000 );
        this.scene.add( this.sky );

        this.sun = new THREE.Vector3();

        const effectController = {
            turbidity: 10,
            rayleigh: 3,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.7,
            elevation: 2,
            azimuth: 210,
            exposure: this.renderer.toneMappingExposure
        };

        const uniforms = this.sky.material.uniforms;
        uniforms[ 'turbidity' ].value = effectController.turbidity;
        uniforms[ 'rayleigh' ].value = effectController.rayleigh;
        uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
        uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

        const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
        const theta = THREE.MathUtils.degToRad( effectController.azimuth );

        this.sun.setFromSphericalCoords( 1, phi, theta );

        uniforms[ 'sunPosition' ].value.copy( this.sun );

        this.renderer.toneMappingExposure = effectController.exposure;
    }
}


class Sound {
    listener: THREE.AudioListener;
    sound: THREE.Audio<GainNode>;

    constructor(listener: THREE.AudioListener, audioURL: string, isPlay: boolean, isLoop: boolean) {
        this.listener = listener
        this.sound = new THREE.Audio( this.listener );

        const audioLoader = new THREE.AudioLoader();
        audioLoader.load( audioURL, ( buffer ) => {
            this.sound.setBuffer( buffer );
            this.sound.setLoop( isLoop );
            this.sound.setVolume( 0.4 );
            if (isPlay) {
                this.sound.play();
            }
        });
    }

    public play() {
        this.sound.play();
    }
}


export { Scene, Sound }