import classes from "./MusicModule.module.css";
import {Fragment, useContext, useEffect, useState} from "react";
import YouTube, {YouTubeProps} from "react-youtube";
import {IProps} from "system/types/CommonTypes";
import MusicContext, {
    cleanMusic,
    MusicContextType,
    pushCurrentMusic
} from "pages/components/ui/MusicModule/musicInfo/MusicContextProvider";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {TurnManager} from "system/GameStates/TurnManager";

enum YtState {
    NotStarted = -1,
    Finished = 0,
    Playing = 1,
    Paused = 2,
    Buffering = 3,
    VideoSignaal = 5,
}

enum PlayerState {
    WaitingMusic,
    Injecting,
    Playing,
}

type YtProps = IProps & {
    videoId: string;
    onStateChange: (e: any) => void;
};

export function YoutubeModule(props: YtProps) {
    //https://developers.google.com/youtube/iframe_api_reference#onStateChange
    const opts: YouTubeProps["opts"] = {
        //https://www.npmjs.com/package/react-youtube
        height: "100",
        width: "300",
        playerVars: {
            autoplay: 1,
        },
    };
    return <YouTube videoId={props.videoId} opts={opts} onStateChange={props.onStateChange}/>;
}

export default function MusicModule() {
    const [showPanel, setShowPanel] = useState<boolean>(false);
    const [playerState, setPlayerState] = useState<PlayerState>(PlayerState.WaitingMusic);
    const [playerElem, setJSX] = useState(<Fragment/>);
    const musicCtx = useContext(MusicContext);
    const localCtx = useContext(LocalContext);
    const ctx = useContext(RoomContext);
    // const myId = localCtx.getVal(LocalField.Id);
    const amHost = TurnManager.amHost(ctx, localCtx);
    useEffect(() => {
        switch (playerState) {
            case PlayerState.WaitingMusic:
                setJSX(<Fragment/>);
                if (!amHost) return;
                const success = pollMusic(musicCtx);
                if (!success) {
                    cleanMusic();
                }
                break;
            case PlayerState.Injecting:
                setJSX(<p>로딩중</p>);
                setPlayerState((p) => PlayerState.Playing);
                break;
            case PlayerState.Playing:
                setJSX(<YoutubeModule videoId={musicCtx.current.entry.vid} onStateChange={onStateChange}/>);
                break;
        }
    }, [playerState]);
    useEffect(() => {
        console.log("Change in c " + musicCtx.current.c);
        if (musicCtx.current.c < 0) return;
        setPlayerState(PlayerState.Injecting);
    }, [musicCtx.current.c]);

    function onClickButton() {
        setShowPanel((b) => !b);
    }

    function onStateChange(e: any) {
        if (!amHost) return;
        const state = e.data as YtState;
        switch (state) {
            case YtState.Finished:
                setPlayerState(PlayerState.WaitingMusic);
                break;
            case YtState.Paused:
                setPlayerState(PlayerState.WaitingMusic);
                break;
        }
    }

    console.log("PLay state ", playerState);
    return <div className={classes.hudPanel}>
        <div className={(showPanel) ? classes.show : classes.hide}>
            {playerElem}
        </div>
        <button className={classes.ytButton} onClick={onClickButton}>음악</button>
    </div>;
}

function pollMusic(musicCtx: MusicContextType): boolean {
    const me = musicCtx.dequeue();
    if (me === null) return false;
    pushCurrentMusic(musicCtx.current.c, me);
    return true;
}