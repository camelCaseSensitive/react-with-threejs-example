import React, { Component } from 'react'
import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {PointerLockControls} from './PointerLockControls.js'
import {followPath, rotateCamera} from './cameraMovement.js'

// let mixer;
// let go = false;
let animStartTime = 0;
let camera;
let fps;

class VisWithClass extends Component {
  // let animStartTime = 0;
  constructor(props) {
    super(props)
    // console.log(props.time)
    animStartTime = props.time;
  }

  componentDidMount() {
    // const width = this.mount.clientWidth
    // const height = this.mount.clientHeight

    const width = 600;
    const height = 400;

    const scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0xff00ff })
    const cube = new THREE.Mesh(geometry, material)

    // const controls = new OrbitControls(camera, renderer.domElement);

    scene.background = new THREE.CubeTextureLoader()
    .setPath( 'src/cubemaps/' )
    .load( [
      'px.png',
      'nx.png',
      'py.png',
      'ny.png',
      'pz.png',
      'nz.png'
    ] );
    // scene.background = texture;

    fps = new PointerLockControls(camera, renderer.domElement)
    addEventListener('mousedown', (event) => {
      fps.lock()
    });

    // const gltfLoader = new GLTFLoader();
    const gltfLoader = new GLTFLoader().setPath( 'src/glb/' );
    this.clock = new THREE.Clock();

    this.mixer = "MIXER IS WAITING FOR LOADING"
    let thisComponent = this;
    // Load a glTF resource
    gltfLoader.load(
      // resource URL
      'dancer.glb',
      // called when the resource is loaded
      function ( gltf ) {
        scene.add( gltf.scene );
        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
        let mixer = new THREE.AnimationMixer(gltf.scene);
        // const clip = THREE.AnimationClip.findByName(gltf.animations, "Dance")
        const clip = THREE.AnimationClip.findByName(gltf.animations, "Dance")
        const action = mixer.clipAction(clip)
        animStartTime = Date.now() / 1000 % clip.duration;
        action.time = animStartTime;
        action.play()
        thisComponent.mixer = mixer;

        gltf.scene.traverse( function( object ) {
          if ( object.isMesh ) {
            object.castShadow = true;
            object.material.metalness = 0
          }
         } );

      },
      // called while loading is progressing
      function ( xhr ) {
        // console.log(xhr)

        // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

      },
      // called when loading has errors
      function ( error ) {

        console.log( 'An error happened' );

      }
    );

    camera.position.z = 4
    // controls.update()
    // scene.add(cube)
    renderer.setClearColor('#000000')
    renderer.setSize(width, height)

    let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(20, 100, 10);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    scene.add(light);

    //Create a plane that receives shadows (but does not cast them)
    const planeGeometry = new THREE.PlaneGeometry( 20, 20, 32, 32 );
    const planeMaterial = new THREE.MeshStandardMaterial( { color: 0xADD8E6 } )
    const plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI/2
    scene.add( plane );

    // light = new THREE.AmbientLight(0xFFFFFF, 4.0);
    // scene.add(light);

    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    this.material = material
    this.cube = cube

    // window.addEventListener('resize', this.handleResize)

    this.mount.appendChild(this.renderer.domElement)
    this.start()
  }

  componentWillUnmount() {
    window.removeEventListener('resize')
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  handleResize = () => {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight
    this.renderer.setSize(width, height)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop = () => {
    cancelAnimationFrame(this.frameId)
  }

  animate = (time) => {
    this.cube.rotation.x += 0.01
    this.cube.rotation.y += 0.01

    const dt = this.clock.getDelta();
    // if(go) mixer.update(dt)
    // console.log(dt)
    if(this.mixer == "MIXER IS WAITING FOR LOADING") {
      console.log("Waiting")
    } else {
      // console.log(go)
      this.mixer.update(dt)
    }

    followPath(camera, time/1000)
	  fps.update(15)  // argument is a camera smoothing value 

    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
    // controls.update()
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }

  render() {
    return (
      <div
        className="vis"
        ref={mount => {
          this.mount = mount
        }}
      />
    )
  }
}

export default VisWithClass
