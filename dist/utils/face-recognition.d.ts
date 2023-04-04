/// <reference types="node" />
export declare const loadTrainingData: () => Promise<any[]>;
export declare const init: () => Promise<void>;
export declare const detectFace: (imageData: Buffer) => Promise<string[]>;
