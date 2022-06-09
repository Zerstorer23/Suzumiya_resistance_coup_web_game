import {ObjectPool} from "system/cards/ObjectPool";
import objectionAudio from "resources/audios/objection.mp3";

export enum AudioFile {
    Objection,
}

export class AudioPool extends ObjectPool<AudioFile, HTMLAudioElement> {
    instantiate(key: AudioFile): HTMLAudioElement {
        return new Audio(this.getFile(key));
    }

    getFile(key: AudioFile) {
        switch (key) {
            case AudioFile.Objection:
                return objectionAudio;
            default:
                return objectionAudio;
        }
    }

    play(key: AudioFile) {
        const audio: HTMLAudioElement = this.get(key);
        audio.play();
    }
}

export const audioPool = new AudioPool();
