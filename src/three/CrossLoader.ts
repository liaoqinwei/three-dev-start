import { resolve } from "@protobufjs/path"
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader';
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

type CrossLoadAssetsType = THREE.Mesh | GLTF | THREE.Group | THREE.Points | THREE.SkinnedMesh | THREE.BufferGeometry

const suffixReg = /\.([a-zA-Z]+)$/

export default class CrossLoader {
  publicPath: string
  GLTFLoader: GLTFLoader
  DRACOLoader: DRACOLoader
  OBJLoader: OBJLoader
  PCDLoader: PCDLoader
  MMDLoader: MMDLoader


  constructor(opt: { publicPath?: string } = {}) {
    const { publicPath = "" } = opt
    this.publicPath = publicPath
    // gltf
    this.GLTFLoader = new GLTFLoader()
    this.DRACOLoader = new DRACOLoader()
    this.DRACOLoader.setDecoderPath(resolve(this.publicPath, "/draco/"))
    this.GLTFLoader.setDRACOLoader(this.DRACOLoader)

    // obj
    this.OBJLoader = new OBJLoader()

    // pcd and mmd
    this.PCDLoader = new PCDLoader()
    this.MMDLoader = new MMDLoader
  }
  public load(paths: indefinitePrams, opt: { progress?: (p: number) => void, cb?: (model: CrossLoadAssetsType) => void } = {}) {
    const pathList = typeof paths === "string" ? [paths] : paths;

    // let i = 0
    const N = pathList.length
    let allTotal = 0

    for (const path of pathList) {
      const innerOpt: { progress?: (e: ProgressEvent) => void, cb?: (model: CrossLoadAssetsType) => void } = { cb: opt.cb }
      if (opt.progress) {
        innerOpt.progress = (e) => {
          allTotal += e.loaded / e.total / N
          opt.progress!(allTotal);
        }
      }

      this.loadFile(resolve(this.publicPath, path), innerOpt)
    }
  }

  private async loadFile(path: string, opt: { progress?: (e: ProgressEvent) => void, cb?: (model: CrossLoadAssetsType) => void }) {
    const fileSuffix = path.match(suffixReg)![1]
    let loader: THREE.Loader
    switch (fileSuffix) {
      case "gltf":
      case "glb":
        loader = this.GLTFLoader;
        break;
      case "pmd":
        loader = this.MMDLoader;
        break;
      case "pcd":
        loader = this.PCDLoader;
        break;
      case "obj":
        loader = this.OBJLoader;
        break;
      case "drc":
        loader = this.DRACOLoader;
        break;
    }

    const res = await loader!.loadAsync(path, opt.progress)
    opt.cb && opt.cb(res)
  }

}

