import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import { SaberModel } from './Saber';
import { GunModel } from './Gun';
import { Collision } from './Collision';


class Scene {
    scene: THREE.Scene
    camera: THREE.Camera
    renderer: THREE.WebGLRenderer
    saber: SaberModel;
    gun: GunModel;
    collisionDetect: Collision;
    sphere: THREE.Mesh[];

    constructor() {

        this.init()
    }

    async init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x000000 );
        this.scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );
    
        
        this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.01, 100 );
        this.camera.position.set( 0, 3, 7 );
        this.scene.add(this.camera);
    
    
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

        this.saber = new SaberModel(this.renderer)
        this.scene.add(this.saber.model)

        this.gun = new GunModel(this.scene)
        this.collisionDetect = new Collision()
    
        const helper = new THREE.CameraHelper( dirLight.shadow.camera );
        this.scene.add( helper );
        
        this.animate();
        this.sphere = []
        // this.addSphere()
        // document.querySelector("body").addEventListener("click", this.shotGun.bind(this))

        // setInterval(() => {
        //     this.shotGun()
        // }, 1000)


    }

    shotGun() {
        this.gun.shot()
    }

    animate() {
        requestAnimationFrame( this.animate.bind(this) );

        this.renderer.render( this.scene, this.camera );
    }

    animateXR() {
        const controller = this.renderer.xr.getController(0); 
        // console.log(controller)

        this.saber.model.position.set(controller.position.x, controller.position.y, controller.position.z)
        this.saber.model.rotation.x = controller.rotation.x
        this.saber.model.rotation.y = controller.rotation.y
        this.saber.model.rotation.z = controller.rotation.z

        this.gun.animateBullet()

        const vector = this.saber.bladeModel.getWorldDirection(new THREE.Vector3(0,10,0));

        this.saber.obb.center = this.saber.model.position

        for (let index = 0; index < this.gun.bullets.length; index++) {

            const isCollide  = this.saber.obb.intersectsOBB(this.gun.bullets[index].obb)

            // for (let index = 0; index <  this.sphere.length; index++) {
            //     this.sphere[index].position.x = this.saber.model.position.x + vector.x
            //     this.sphere[index].position.y = this.saber.model.position.y + vector.y
            //     this.sphere[index].position.z = this.saber.model.position.z + vector.z

            //     // this.sphere[index].position.add(vector.multiplyScalar(0.5));

            // }

            // const isCollide = this.collisionDetect.checkSphere({
            //     sphere1: {
            //         x: this.gun.bullets[index].model.position.x,
            //         y: this.gun.bullets[index].model.position.y,
            //         z: this.gun.bullets[index].model.position.z,
            //         scale: 0.1

            //     },
            //     sphere2: {
            //         x: this.saber.model.position.x,
            //         y: this.saber.model.position.y,
            //         z: this.saber.model.position.z,
            //         scale: 0.1

            //     }
            // })





            // console.log(isCollide)
            if (isCollide) {
                this.gun.bullets[index].velocity.z = -0.1
            }
            
            console.log(isCollide)

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




export { Scene }