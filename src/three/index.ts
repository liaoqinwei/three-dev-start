import * as THREE from "three"
import { rendererConfig } from "./config"
import { immediateRender } from "./helper"
import CameraControls from "camera-controls"
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer"


CameraControls.install({ THREE: THREE });

const containers: Array<Container> = []

export default function (canvas: HTMLCanvasElement): Symbol {

  initCanvasSize(canvas)

  const container = new Container(canvas)
  containers.push(container)
  const _resizeRendererToDisplaySize = resizeRendererToDisplaySize.bind(null, container.id)
  window.addEventListener("resize", _resizeRendererToDisplaySize)

  return container.id
}


function initCanvasSize(canvas: HTMLCanvasElement) {
  canvas.width = canvas.parentElement!.clientWidth
  canvas.height = canvas.parentElement!.clientHeight
}


function resizeRendererToDisplaySize(containerId: Symbol) {
  const container = getContainer(containerId)
  const camera = container!.camera
  const canvas = container!.renderer.domElement
  initCanvasSize(canvas)
  container?.renderer.setSize(canvas.width, canvas.height)
  container?.css2DRenderer.setSize(canvas.width, canvas.height)
  container?.css3DRenderer.setSize(canvas.width, canvas.height)
  
  if (camera instanceof THREE.PerspectiveCamera) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
}


export function getContainer(id?: Symbol): Container | undefined {
  return id ? containers.find(item => item.id === id) : containers[0]
}


class Container extends THREE.EventDispatcher<{ type: "beforeRender" | "afterRender" } & {target:Container}> {
  id: Symbol = Symbol("container Id")
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  cameraControls: CameraControls | THREE.EventDispatcher
  camera: THREE.Camera
  clock: THREE.Clock
  css2DRenderer: CSS2DRenderer
  css3DRenderer: CSS3DRenderer 
  canvas: HTMLCanvasElement
  effectComposer :EffectComposer


  constructor(
    canvas: HTMLCanvasElement
  ) {
    // init
    super()
    this.canvas = canvas

    this.css2DRenderer = new CSS2DRenderer();
    this.css3DRenderer = new CSS3DRenderer()

    this.renderer = new THREE.WebGLRenderer(Object.assign
      <THREE.WebGLRendererParameters, THREE.WebGLRendererParameters>(rendererConfig, { canvas }));
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.01, 1000);
    this.cameraControls = new CameraControls(this.camera as THREE.PerspectiveCamera, this.css2DRenderer.domElement);
    this.clock = new THREE.Clock  

    this._initCssRenderer()
    this._initProcessing()





    // render
    const renderTask = () => {
      this.dispatchEvent({ type: "beforeRender", target: this })
      immediateRender(this.id)
      this.css2DRenderer.render(this.scene, this.camera)
      this.css3DRenderer.render(this.scene, this.camera)

      this.dispatchEvent({ type: "afterRender", target: this })
      requestAnimationFrame(renderTask)
    }
    requestAnimationFrame(renderTask)
  }

  private _initCssRenderer() {
    this.css2DRenderer.setSize(this.canvas.width, this.canvas.height);
    this.canvas.parentElement!.appendChild(this.css2DRenderer.domElement);

    this.css3DRenderer.setSize(this.canvas.width, this.canvas.height);
    this.canvas.parentElement!.appendChild(this.css3DRenderer.domElement);

    this.css3DRenderer.domElement.style.position = this.css2DRenderer.domElement.style.position = 'absolute';
    this.css3DRenderer.domElement.style.top = this.css2DRenderer.domElement.style.top = '0px';
    this.css2DRenderer.domElement.style.zIndex = "1"
  }

  private _initProcessing(){
    this.effectComposer = new EffectComposer(this.renderer)
  }


 
}