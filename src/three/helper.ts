import CameraControls from 'camera-controls';
import { getContainer } from './index';


export function immediateRender(containerId: Symbol) {
  const container = getContainer(containerId)!
  const cameraControls = container.cameraControls as CameraControls

  const delta = container.clock.getDelta();
  cameraControls.update(delta);

  container.renderer.render(container.scene, container.camera);
}


// 按需渲染 controls改变时才渲染
export function demandRender(containerId: Symbol) {
  const container = getContainer(containerId)!
  const cameraControls = container.cameraControls as CameraControls

  const delta = container.clock.getDelta();
  const hasControlsUpdated = cameraControls.update(delta);

  if (hasControlsUpdated) {
    container.renderer.render(container.scene, container.camera);
  }
}

export function resolveUrlResourcesSuf(path: string) {
  const pathSufReg = /\.(\m)/
}