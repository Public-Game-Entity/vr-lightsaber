import * as THREE from 'three';

import { OBB } from 'three/examples/jsm/math/OBB';

class GunModel {
    scene: THREE.Scene;
    bullets: Bullet[];
    prevTime: number;
    nowTime: number;

    constructor(scene: THREE.Scene) {
        this.scene = scene
        this.bullets = []

    }

    shot() {
        const bulletClass = new Bullet(this.scene)
        this.bullets.push(bulletClass)
    }

    animateBullet() {
        this.nowTime = Date.now()

        for (let index = 0; index < this.bullets.length; index++) {
            const deltaTime = this.nowTime - this.prevTime 

            const element = this.bullets[index];
            if (element.isAvailable == false) {
                continue
            }
            element.model.position.z += element.velocity.z * deltaTime
            element.model.position.y += element.velocity.y * deltaTime
            element.model.position.x += element.velocity.x * deltaTime

            const e = new THREE.Euler( element.velocity.x, element.velocity.y, element.velocity.z, 'XYZ' );
            const mx = new THREE.Matrix4().lookAt(new THREE.Vector3(element.velocity.x, element.velocity.y, element.velocity.z),new THREE.Vector3(0,0,0),new THREE.Vector3(0,1,0));
            const qt = new THREE.Quaternion().setFromRotationMatrix(mx);
            element.model.rotation.setFromQuaternion( qt )

            element.obb.center = element.model.position
        }

        this.prevTime = Date.now()

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
        this.velocity = {
            x: 0.00000000001,
            y: 0.00000000001,
            z: 0.2
        }
        this.model = this.addModel()


    }

    radianToPosition({ angle, offset }: { angle: number; offset: number }) {
        const x = Math.cos(angle * Math.PI / 180) * offset
        const y = Math.sin(angle * Math.PI / 180) * offset
    
        return { x: x, y: y }
    }

    addModel() {
        const addBoundingBox = new THREE.Mesh(); 
        const randomAngle = 170 + Math.random() * 30
        const randomPosition = this.radianToPosition({ angle: randomAngle, offset: 20 })
        addBoundingBox.position.z = randomPosition.x
        addBoundingBox.position.x = randomPosition.y

        const dir = new THREE.Vector3(); 

        const dirVector = dir.subVectors( new THREE.Vector3(0,2, 1), new THREE.Vector3(addBoundingBox.position.x, addBoundingBox.position.y, addBoundingBox.position.z) ).normalize();
        console.log(dirVector)
        this.velocity.z = dirVector.z / 100
        this.velocity.x = dirVector.x / 100

        addBoundingBox.position.y = 1.3
        const geometry = new THREE.CapsuleGeometry( 0.06, 1, 4, 8 ); 

        // const geometry = new THREE.BoxGeometry( 0.1, 0.1, 1 ); 
        const material = new THREE.MeshBasicMaterial( {color: 0xf73c28} ); 
        const cube = new THREE.Mesh( geometry, material ); 

        cube.rotation.x = Math.PI/2

        // const light = new THREE.PointLight( 0xf73c28 );
        // light.intensity = 100
        // light.decay = 40
        // light.distance = 10
        // cube.add(light)

        addBoundingBox.add(cube)

        this.scene.add( addBoundingBox );
        this.isAvailable = true
        this.obb = new OBB(addBoundingBox.position, new THREE.Vector3(0.07,0.07,0.07))
        return addBoundingBox
    }
}

export { GunModel }