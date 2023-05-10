import { getContainer } from ".";
import * as THREE from "three"
import CameraControls from "camera-controls"

import CrossLoader from "./CrossLoader";
import { Popup2D, Popup3D, PopupSprite, getVuePopupString } from "./Popup"

import ThreePopup3D from "../components/content/ThreePopup3D.vue"
import ThreePopup2D from "../components/content/ThreePopup2D.vue"


export default function () {

  const container = getContainer()!

  container.renderer.shadowMap.enabled = true
  container.scene = new THREE.Scene();
  container.scene.background = new THREE.Color(0x443333);
  // container.scene.fog = new THREE.Fog(0x443333, 1, 4);
  const controls: CameraControls = container.cameraControls as CameraControls
  controls.setLookAt(0.12162754099792884,
    0.31709901874589996, 0.26274222522874835, -0.,
    0., -0.)
  controls.polarRotateSpeed = 1.
  const loader = new CrossLoader()
  loader.load("/models/bunny.drc", {
    cb(models) {
      const geo: THREE.BufferGeometry = <THREE.BufferGeometry>models;
      geo.computeVertexNormals()
      const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xFFFFFF) })
      const mMesh = new THREE.Mesh(geo, material)
      mMesh.castShadow = true;
      container.scene.add(mMesh)
    }
  })

  // 
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshPhongMaterial({ color: 0x999999, specular: 0x101010 })
  );
  plane.rotation.x = - Math.PI / 2;
  plane.position.y = 0.03;
  plane.receiveShadow = true;
  container.scene.add(plane);

  // Lights
  const spotLight = new THREE.SpotLight();
  spotLight.intensity = .5
  spotLight.angle = Math.PI / 16;
  spotLight.penumbra = 0.5;
  spotLight.castShadow = true;
  spotLight.position.set(- 1, 1, 1);
  container.scene.add(spotLight);

  const ambienLight = new THREE.AmbientLight(0xFFFFBB, .5)
  container.scene.add(ambienLight)

  // Popup
  getVuePopupString(ThreePopup2D).then((vueComponentStr: string) => {
    const p = new Popup2D(vueComponentStr)
    container.scene.add(p)
  })

  // Popup3D
  getVuePopupString(ThreePopup3D).then((vueComponentStr: string) => {
    const p = new Popup3D(vueComponentStr,{position:[0,-11,0]})
    p.frontView = true
    p.scale.set(.01,.01,.01)
    container.scene.add(p)
  })

  // PopupSprite
  const map = new THREE.TextureLoader().load("/imgs/hello.jpg",(texture)=>{
    const p =new PopupSprite(texture)
    p.position.set(0,.2,0)
    p.scale.set(.1,.1,.1)
    container.scene.add(p)
  })
  const t = () => {
    requestAnimationFrame(t)
  }
  requestAnimationFrame(t)
}