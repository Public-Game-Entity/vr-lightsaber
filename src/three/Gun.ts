import * as THREE from 'three';

import { OBB } from 'three/examples/jsm/math/OBB';

class GunModel {
    scene: THREE.Scene;
    bullets: Bullet[];

    constructor(scene: THREE.Scene) {
        this.scene = scene
        this.bullets = []

    }

    shot() {
        const bulletClass = new Bullet(this.scene)
        this.bullets.push(bulletClass)
    }

    animateBullet() {
        for (let index = 0; index < this.bullets.length; index++) {
            const element = this.bullets[index];
            if (element.isAvailable == false) {
                continue
            }
            element.model.position.z += element.velocity.z
            element.model.position.y += element.velocity.y
            element.model.position.x += element.velocity.x

            const e = new THREE.Euler( element.velocity.x, element.velocity.y, element.velocity.z, 'XYZ' );
            const mx = new THREE.Matrix4().lookAt(new THREE.Vector3(element.velocity.x, element.velocity.y, element.velocity.z),new THREE.Vector3(0,0,0),new THREE.Vector3(0,1,0));
            const qt = new THREE.Quaternion().setFromRotationMatrix(mx);
            element.model.rotation.setFromQuaternion( qt )

            element.obb.center = element.model.position
        }
    }
}

class Bullet {
    model: THREE.Mesh;
    scene: THREE.Scene;
    isAvailable: boolean;
    isCollisionAvailable: boolean;

    velocity: { x: number; y: number; z: number; };
    obb: OBB;

    constructor(scene: THREE.Scene) {
        this.isAvailable = false
        this.isCollisionAvailable = true
        this.scene = scene
        this.model = this.addModel()
        this.velocity = {
            x: 0.00000000001,
            y: 0.00000000001,
            z: 0.2
        }

    }

    addModel() {
        const geometry = new THREE.BoxGeometry( 0.1, 0.1, 1 ); 
        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
        const cube = new THREE.Mesh( geometry, material ); 
        cube.position.z = -30
        cube.position.y = 1
        this.scene.add( cube );
        this.isAvailable = true
        this.obb = new OBB(cube.position, new THREE.Vector3(0.07,0.07,0.07))
        return cube
    }
}

export { GunModel }