//import {
//	Material,
//	WebGLRenderer,
//	WebGLRenderTarget
//} from '../../../src/Three';

declare namespace THREE {
    export class Pass {

        constructor();
        enabled: boolean;
        needsSwap: boolean;
        clear: boolean;
        renderToScreen: boolean;

        setSize(width: number, height: number): void;
        render(renderer: THREE.WebGLRenderer, writeBuffer: THREE.WebGLRenderTarget, readBuffer: THREE.WebGLRenderTarget, deltaTime: number, maskActive: boolean): void;

    }

    export namespace Pass {
        class FullScreenQuad {

            constructor(material?: THREE.Material);

            render(renderer: THREE.WebGLRenderer): void;
            dispose(): void;

            material: THREE.Material;

        }
    }
}
