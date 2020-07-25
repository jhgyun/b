//import {
//	Uniform
//} from '../../../src/Three';

declare namespace THREE {
    export const FXAAShader: {
        uniforms: {
            tDiffuse: THREE.Uniform;
            resolution: THREE.Uniform;
        };
        vertexShader: string;
        fragmentShader: string;
    };
}
