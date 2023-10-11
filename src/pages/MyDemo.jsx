import React, { Component } from 'react'
import ObjectInfo from '../components/ObjectInfo';
import PubSub from 'pubsub-js'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import Stats from 'three/examples/jsm/libs/stats.module.js'
//import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import './MyDemo.css'
let scene, camera, renderer, mod, controls, canvas,stats 
const re = /^\#|^render|^平面|^边几/;//不进行交互和显示name的物体
const objArr = []//显示name的物体和label 对 的数组
class PickHelper {//用于选择物体的类
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
    this.pickedObjectName=''
  }
  pick(normalizedPosition, scene, camera, time) {
    // 恢复上一个被拾取对象的颜色
    if (this.pickedObject) {
      if (this.pickedObject.material.emissive) {
        this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
      }
      this.pickedObject = undefined;
    }
    // 发出射线
    this.raycaster.setFromCamera(normalizedPosition, camera);
    // 获取与射线相交的对象
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      if (!re.test(intersectedObjects[0].object.name)) {
        // 找到第一个对象，它是离鼠标最近的对象
        this.pickedObject = intersectedObjects[0].object;
        if(this.pickedObjectName!=intersectedObjects[0].object.name){
          PubSub.publish('pickedObjectName',this.pickedObject.name);
        }
        this.pickedObjectName=intersectedObjects[0].object.name
        // 保存它的颜色
        if (this.pickedObject.material.emissive) {
          this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
          // 设置它的发光为 黄色/红色闪烁
          this.pickedObject.material.emissive.setHex((time * 3 / 1000) % 2 > 1 ? '' : 0xFF0000);
          
        }
      }
    }
  }
  outSelect(){

  }
}
const pickPosition = { x: 0, y: 0 };
function getCanvasRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width / rect.width,
    y: (event.clientY - rect.top) * canvas.height / rect.height,
  };
}
function setPickPosition(event) {//获取点击坐标
  const pos = getCanvasRelativePosition(event);
  pickPosition.x = (pos.x / canvas.width) * 2 - 1;
  pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
}
function createScene() {//创建场景/相机/光源
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75,
    window.innerWidth / window.innerHeight,//长宽比
    0.01,//近截面
    10000//远截面
  );
  camera.position.set(0, 0.42, 0.42);
  scene.add(camera);
  //加光源
  const light = new THREE.AmbientLight(0xFFFFFF, 1);
  scene.add(light);
  //加背景
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    './skybox/posx.jpg',
    './skybox/negx.jpg',
    './skybox/posy.jpg',
    './skybox/negy.jpg',
    './skybox/posz.jpg',
    './skybox/negz.jpg'
  ]);
  scene.background = texture;
}
function loadModel() {//加载外部模型
  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('./draco/gltf/')
  dracoLoader.setDecoderConfig({ type: 'js' })
  dracoLoader.preload()
  gltfLoader.setDRACOLoader(dracoLoader)
  gltfLoader.load('./city2.glb', function (gltf) {//model/EarthClouds_1_12756.glb//city.glb
    //console.log('load')
    mod = gltf.scene
    console.log(mod)
    scene.add(mod);
    setTimeout(createLabel(), 1000);
  }, undefined, function (error) {
    console.error(error);
  });
}
let hasCreateLabel = false
function createLabel() {//添加标签并广播物体名
  const labelContainerElem = document.querySelector('#labels');
  mod.children.forEach((item) => {
    if (!re.test(item.name)) {
      const elem = document.createElement('div');
      elem.textContent = item.name;
      labelContainerElem.appendChild(elem);
      objArr.push({ item, elem })
    }
  })
  hasCreateLabel = true
  PubSub.publish('objArr',objArr);
}
const tempV = new THREE.Vector3();
const raycaster = new THREE.Raycaster();
function positionLabel() {//定位标签
  objArr.forEach((cubeInfo, ndx) => {
    const { item, elem } = cubeInfo;
    if (item && elem) {
      // 获取物体中心的位置
      //console.log(item)
      item.updateWorldMatrix(true, false);
      item.getWorldPosition(tempV);
      // 获取标准化屏幕坐标，x和y都会在-1和1区间
      // x = -1 表示在最左侧
      // y = -1 表示在最底部
      tempV.project(camera);

      // // 调用Raycast获取所有相交的物体
      // // 以相机为起点，物体为终点
      // raycaster.setFromCamera(tempV, camera);
      // const intersectedObjects = raycaster.intersectObjects(scene.children);
      // // 如果第一个相交的是此物体，那么就是可见的
      // const show = intersectedObjects.length && item === intersectedObjects[0].object;

      // if (!show) {
      //   // 隐藏Label
      //   elem.style.display = 'none';
      // } else {
      //   // 显示Label
      //   elem.style.display = '';
      
      // 将标准屏幕坐标转化为CSS坐标
      const x = (tempV.x * .5 + .5) * canvas.clientWidth;
      const y = (tempV.y * -.5 + .5) * canvas.clientHeight;

      // 将元素移动到此位置
      elem.style.top=`${y-25}px`
      elem.style.left=`${x}px`
      // elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;//}
    }
  })
}
function showLabel(){//隐藏标签（开销大，只在释放鼠标时调用，避免掉帧）
  objArr.forEach((cubeInfo, ndx) => {
    const { item, elem } = cubeInfo;
    if (item && elem) {
      // 获取物体中心的位置
      //console.log(item)
      item.updateWorldMatrix(true, false);
      item.getWorldPosition(tempV);
      // 获取标准化屏幕坐标，x和y都会在-1和1区间
      // x = -1 表示在最左侧
      // y = -1 表示在最底部
      tempV.project(camera);

      // 调用Raycast获取所有相交的物体
      // 以相机为起点，物体为终点
      raycaster.setFromCamera(tempV, camera);
      const intersectedObjects = raycaster.intersectObjects(scene.children);
      // 如果第一个相交的是此物体，那么就是可见的
      const show = intersectedObjects.length && item === intersectedObjects[0].object;

      if (!show) {
        // 隐藏Label
        elem.style.display = 'none';
      } else {
        // 显示Label
        elem.style.display = '';

    }}
  })
}
function createRender() {//创建渲染器
  canvas = document.querySelector('#c');
  renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  //scene.background = new THREE.Color(0xbfe3dd);
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
}
function createControls() {//添加控制器和辅助器
  // 创建轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);
  //controls.enableDamping = true;//惯性
  // 添加坐标轴辅助器
  // const axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);
}
function changeSize() {//画布尺寸和分辨率实时变化
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);//渲染画布尺寸
    camera.aspect = canvas.clientWidth / canvas.clientHeight;//相机横纵比
    camera.updateProjectionMatrix();
  }
}
function createFPSreader(){// 创建性能监视器
 stats = new Stats()

// 设置监视器面板，传入面板id（0: fps, 1: ms, 2: mb）
stats.setMode(0)

// 设置监视器位置
stats.domElement.style.position = 'absolute'
stats.domElement.style.left = '0px'
stats.domElement.style.top = '0px'

// 将监视器添加到页面中
document.getElementById("container").appendChild(stats.domElement)


}
const pickHelper = new PickHelper();
function Srender(time) {//渲染函数
  changeSize();
  if (hasCreateLabel) positionLabel();
  if(stats) stats.update()
  pickHelper.pick(pickPosition, scene, camera, time);
  
  renderer.render(scene, camera);
  requestAnimationFrame(Srender);//下一帧渲染
}
function addRenderListener() {//按需渲染等监听器
  // controls.addEventListener('change', requestRenderIfNotRequested);
  window.addEventListener('mouseup', ()=>{if (hasCreateLabel) showLabel() });
  window.addEventListener('click', setPickPosition)
  Srender();
}
function initCanvas() {//初始化3D场景
  createScene();
  loadModel();
  createRender();
  createControls();
  addRenderListener();
  createFPSreader();
}
export default class MyDemo extends Component {
  render() {
    return (
      <div id="demo">
        <div id="container">
          <canvas id="c"></canvas>
          <div id="labels"></div>
        </div>
        <ObjectInfo></ObjectInfo>
      </div>
    )
  }
  componentDidMount() {
    // 将webgl渲染的canvas内容添加到body
    //document.getElementById('demo').appendChild(renderer.domElement);
    initCanvas();

  }
}
