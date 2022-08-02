import * as THREE from 'three';
import { CurvePath, Vector3 } from 'three';

export function rotateCamera(camera, time){
    camera.position.x = 30 * Math.cos(time/1000)
	camera.position.z = 30 * Math.sin(time/1000)
	camera.lookAt( 0, 0, 0 );
}

export function followPath(object, t){
    // let v = object.position;
    // let v = new THREE.Vector3(30,30,30)
    let s = 0.1
    
    let f = slerp(t*s - Math.floor(t*s));  // Cubic smoothing
    let path = [
        new THREE.Vector3(-10, 30, 30),
        new THREE.Vector3(10, 30, 30),
        new THREE.Vector3(5, 5, 15),
        new THREE.Vector3(10, 10, -30),
        new THREE.Vector3(-10, 40, -30),
        new THREE.Vector3(-10, 40, 30),
        new THREE.Vector3(-10, 30, 30)
    ]

    ///////////
    // const curve1 = new THREE.CubicBezierCurve3(
    //     new THREE.Vector3( -10, 30, 30 ),
    //     new THREE.Vector3( 5, 15, 0 ),
    //     new THREE.Vector3( 20, 15, 0 ),
    //     new THREE.Vector3( 10, 30, 0 )
    // );

    let curve1 = new THREE.CatmullRomCurve3(
        [
            new THREE.Vector3(503.8288636642929, 515.9146257869506, -190.35866285496937),
            new THREE.Vector3(119.7958265839832, 333.487425186678, -197.78324453437614),
            new THREE.Vector3(-324.93787262047164, 220.95401469768495, -79.68967908628815),
            new THREE.Vector3(-447.2447760224429, 271.7158917842591, 209.09895858600086),
            new THREE.Vector3(-195.33756099249837, 390.98475110442394, 491.55890315977416),
            new THREE.Vector3(152.6190401163031, 378.69878570007666, 621.1810709422615),
            new THREE.Vector3(503.8288636642929, 515.9146257869506, -190.35866285496937)
        ]
    )
    ///////////

    // let path = [
    //     new THREE.Vector3(0.5, 0, 0),
    //     new THREE.Vector3(0, 0, -0.5),
    //     new THREE.Vector3(-0.5, 0, 0),
    //     new THREE.Vector3(0, 0, 0.5)
    // ]

    let cycles = Math.floor(Math.floor(t*s) / (path.length-1))

    // let v = path[Math.floor(t*s) - cycles*(path.length-1)];
    // let vNext = path[Math.floor(t*s) + 1 - cycles*(path.length-1)];
    // v.lerp(vNext, f)

    // console.log(f)
    let v = curve1.getPoint(f)
    // console.log(v)

    // A velocty method 
    // object.position.x += v.x;
    // object.position.z += v.z;

    object.position.set(v.x/100, v.y/100, v.z/100);
    
    // object.lookAt(0, 0, 0)
    // object.lookAt(vNext.x, vNext.y, vNext.z)

}

function slerp(x) {
    // return -2*x**3 + 3*x**2
    return x
}