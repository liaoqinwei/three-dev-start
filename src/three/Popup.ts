import {  Camera, Scene, Sprite, SpriteMaterial } from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { ComponentOptionsBase } from 'vue';
import { renderToString } from 'vue/server-renderer';

type vec3 = [number, number, number]

export class Popup2D extends CSS2DObject {
  style: CSSStyleDeclaration
  name: string = "Popup2D"
  constructor(html: string, options: { position?: vec3 } = {}) {
    const { position = [0, 0, 0] } = options

    const element = htmlToElement(html)
    super(element)

    this.style = element.style
    this.position.set(position[0], position[1], position[2])
  }
}

export class Popup3D extends CSS3DObject {
  style: CSSStyleDeclaration
  name: string = "Popup3D"
  frontView:boolean = false

  constructor(html: string, options: { position?: vec3 } = {}) {
    const { position = [0, 0, 0] } = options

    const element = htmlToElement(html)
    super(element)

    this.style = element.style
    this.position.set(position[0], position[1], position[2])
  }

  onBeforeRender(renderer: unknown, scene: Scene, camera: Camera) {
    super.onBeforeRender(renderer,scene,camera)
    if(this.frontView)this.rotation.setFromRotationMatrix(camera.matrixWorld)
  };
}

export class PopupSprite extends Sprite {
  constructor(texture: THREE.Texture) {
    const material = new SpriteMaterial({ map: texture, color: 0xffffff });
    super(material)
    this.scale.set(200, 200, 1)
  }
}

function htmlToElement(html: string): HTMLElement {
  const outer = document.createElement("div")
  outer.innerHTML = html
  return outer.firstElementChild! as HTMLElement
}


export const getVuePopupString = async (component: ComponentOptionsBase<any, any, any, any, any, any, any, any, any, any>): Promise<string> => {
  let vnode
  const $setup = component.setup && component.setup({}, { slots: {}, attrs: {}, emit: () => { }, expose: () => null })
  if (component.render && import.meta.env.DEV) {
    vnode = component.render(null, null, null, $setup)
  } else {
    // @ts-ignore
    vnode = $setup()
  }
  vnode.scopeId = component.__scopeId
  const str = await (renderToString(vnode))!

  return str.replaceAll("&quot;", "")
}