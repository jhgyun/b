
declare namespace THREE {
    export class EffectComposer {

        constructor(renderer: THREE.WebGLRenderer, renderTarget?: THREE.WebGLRenderTarget);
        renderer: THREE.WebGLRenderer;
        renderTarget1: THREE.WebGLRenderTarget;
        renderTarget2: THREE.WebGLRenderTarget;
        writeBuffer: THREE.WebGLRenderTarget;
        readBuffer: THREE.WebGLRenderTarget;
        passes: Pass[];
        copyPass: ShaderPass;
        clock: THREE.Clock;
        renderToScreen: boolean;

        swapBuffers(): void;
        addPass(pass: Pass): void;
        insertPass(pass: Pass, index: number): void;
        isLastEnabledPass(passIndex: number): boolean;
        render(deltaTime?: number): void;
        reset(renderTarget?: THREE.WebGLRenderTarget): void;
        setSize(width: number, height: number): void;
        setPixelRatio(pixelRatio: number): void;

    }
}
