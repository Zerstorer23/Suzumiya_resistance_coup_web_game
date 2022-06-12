import {ObjectPool} from "system/cards/ObjectPool";
import objectionAudio from "resources/audios/objection.mp3";
import {LocalContextType, LocalField} from "system/context/localInfo/local-context";

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

    play(localCtx: LocalContextType, key: AudioFile) {
        if (localCtx.getVal(LocalField.Muted)) return;
        const audio: HTMLAudioElement = this.get(key);
        audio.play();
    }
}

export const audioPool = new AudioPool();
