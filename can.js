import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class MyCan extends HTMLElement {
    constructor() {
        super();
        const CanTemplate = document.createElement("template");
        CanTemplate.innerHTML =
            `
        <style>
            :host {
                display: block;
                width: 100%;
            }

            * {
                box-sizing: border-box;
            }
                
            div {
                width: 100%;
                min-height: 100%;
            }

            #bg {
                width: 100%;
	            height: 100%;
	            display: block;
                background: url("images/CanText.svg") no-repeat center center;
            }

        </style>
        
        <div id="bg"></div>
        `
        this.attachShadow({ mode: 'open' });
        this.host = this.shadowRoot.host;
        this.shadowRoot.appendChild(CanTemplate.content.cloneNode(true));
        this.container = this.shadowRoot.querySelector("#bg");
    }

    connectedCallback() {
        this.init();
        this.animate();

        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;

        this.mouseX = width / 2;
        this.mouseY = height / 2;

        this.isMouseOver = false;

        this.container.addEventListener("mouseenter", () => {
            this.isMouseOver = true;
        });

        this.container.addEventListener("mouseleave", () => {
            this.isMouseOver = false;
        });

        this.container.addEventListener("mousemove", (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
    }

    init() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(50, this.container.offsetWidth / this.container.offsetHeight, 0.1, 100);
        console.log("camera:", this.host.offsetWidth, this.host.offsetHeight);

        this.object;

        this.controls;

        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;

        this.mouseX = width / 2;
        this.mouseY = height / 2;

        this.renderobject = "soda_can(1)";

        this.Loader = new GLTFLoader();

        this.Loader.load(
            `models/${this.renderobject}/scene.gltf`,

            (gltf) => {
                this.object = gltf.scene;
                this.scene.add(this.object);
            },

            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + "% loaded");
            },

            (error) => {
                console.error(error);
            }
        );

        this.renderer = new THREE.WebGLRenderer({ alpha: true });

        this.renderer.setSize(width, height, false);

        this.container.appendChild(this.renderer.domElement);

        this.camera.position.set(7, -3, 3);


        this.topLight = new THREE.DirectionalLight(0xffffff, 100);
        this.topLight.position.set(10, 10, 0);
        this.scene.add(this.topLight);

        this.topLight2 = new THREE.DirectionalLight(0xffffff, 100);
        this.topLight2.position.set(-10, 10, 0);
        this.scene.add(this.topLight2);

        if (this.renderobject === "soda_can(1)") {
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableZoom = false;
        }

        window.addEventListener("resize", () => {
            const width = this.container.offsetWidth;
            const height = this.container.offsetHeight;
            console.log(width, height)
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });

    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;

        const sensitivityX = 4.5; 
        const sensitivityY = 1.2;

        if (this.object) {
            if (this.isMouseOver) {
               
                this.object.rotation.y = (this.mouseX - width / 2) / width * sensitivityX; 
                this.object.rotation.x = (this.mouseY - height / 2) / height * sensitivityY; 
            } else {
                const targetRotationY = this.object.rotation.y + 0.01; 
                const targetRotationX = 0;
                const idleRotationSpeed = 0.05; 
                this.object.rotation.y += (targetRotationY - this.object.rotation.y) * idleRotationSpeed;
                this.object.rotation.x += (targetRotationX - this.object.rotation.x) * idleRotationSpeed;
            }
        }

        this.renderer.render(this.scene, this.camera);
    }
}

customElements.define('my-can', MyCan);