//import {
//	Uniform
//} from '../../../src/Three';

declare namespace THREE {
    export const CopyShader: {
        uniforms: {
            tDiffuse: THREE.Uniform;
            opacity: THREE.Uniform;
        };
        vertexShader: string;
        fragmentShader: string;
    };
}
