import * as THREE from 'three';


class GunModel {
    scene: THREE.Scene;
    bullets: Bullet[];

    constructor(scene: THREE.Scene) {
        this.scene = scene
        this.bullets = []

    }

    shot() {
        console.log(this)
        const bulletClass = new Bullet(this.scene)
        this.bullets.push(bulletClass)
    }

    animateBullet() {
        for (let index = 0; index < this.bullets.length; index++) {
            const element = this.bullets[index];
            if (element.isAvailable == false) {
                continue
            }
            
            element.model.position.z += 0.1
        }
    }
}

class Bullet {
    model: THREE.Mesh;
    scene: THREE.Scene;
    isAvailable: boolean;
    constructor(scene: THREE.Scene) {
        this.isAvailable = false
        this.scene = scene
        this.model = this.addModel()

    }

    addModel() {
        const geometry = new THREE.BoxGeometry( 0.1, 0.1, 1 ); 
        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
        const cube = new THREE.Mesh( geometry, material ); 
        cube.position.z = -10
        cube.position.y = 2
        this.scene.add( cube );
        this.isAvailable = true
        return cube
    }
}

export { GunModel }