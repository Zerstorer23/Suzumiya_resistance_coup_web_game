import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {LocalContextType, LocalField} from "system/context/localInfo/local-context";
import {ChatContextType, ChatEntry, ChatFormat} from "pages/components/ui/ChatModule/chatInfo/ChatContextProvider";
import {MusicContextType} from "pages/components/ui/MusicModule/musicInfo/MusicContextProvider";
import {TurnManager} from "system/GameStates/TurnManager";
import TransitionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {DbFields, ReferenceManager} from "system/Database/ReferenceManager";
import {GameConfigs} from "system/Debugger/GameConfigs";
import {insert} from "lang/i18nHelper";

export class CommandParser {
    public static handleCommands(
        t: any,
        ctx: RoomContextType,
        localCtx: LocalContextType,
        chatCtx: ChatContextType,
        musicCtx: MusicContextType,
        command: string
    ) {
        const args = command.split(" ");
        const amHost = TurnManager.amHost(ctx, localCtx);
        switch (args[0]) {
            case "next":
                //Push to next turn
                if (!amHost) return;
                TransitionManager.pushEndTurn(ctx);
                break;
            case "reset":
                if (!amHost) return;
                TransitionManager.pushLobby(ctx.room.header.games);
                break;
            case "coi":
            case "coin":
            case "coins":
                if (!amHost) return;
                if (ctx.room.header.games > 2) return;
                ReferenceManager.updateReference(
                    DbFields.HEADER_games,
                    ctx.room.header.games + GameConfigs.addGames
                );
                chatCtx.loadChat({
                    format: ChatFormat.announcement,
                    name: "",
                    msg: t("_coins_inserted"),
                });
                break;
            case "help":
                CommandParser.printHelp(t, chatCtx);
                break;
            case "host":
                CommandParser.printHost(t, ctx, chatCtx);
                break;
            case "mute":
                CommandParser.muteSound(localCtx, chatCtx, t);
                break;
            case "who":
                CommandParser.printSongOwner(musicCtx, ctx, chatCtx, t);
                break;
        }
    }

    public static printHost(t: any, ctx: RoomContextType, chatCtx: ChatContextType) {
        const hostId = ctx.room.header.hostId;
        const host = ctx.room.playerMap.get(hostId);
        if (host === undefined) return;

        const chatEntry: ChatEntry = {
            format: ChatFormat.announcement,
            name: "",
            msg: insert(t, "_cmd_host", host.name),
        };
        chatCtx.loadChat(chatEntry);
    }

    public static printSongOwner(musicCtx: MusicContextType, ctx: RoomContextType, chatCtx: ChatContextType, t: any) {
        const curr = musicCtx.current.entry.pid;
        const owner = (ctx.room.playerMap.get(curr));
        if (owner === undefined || owner === null) return;
        chatCtx.loadChat({
            format: ChatFormat.announcement,
            name: "",
            msg: insert(t, "_song_owner_announce", owner.name),
        });
        return;
    }

    public static muteSound(localCtx: LocalContextType, chatCtx: ChatContextType, t: any) {
        const curr = !localCtx.getVal(LocalField.Muted);
        localCtx.setVal(LocalField.Muted, curr);
        chatCtx.loadChat({
            format: ChatFormat.announcement,
            name: "",
            msg: t(curr ? "_muted_true" : "_muted_false"),
        });
    }

    public static printHelp(t: any, chatCtx: ChatContextType) {
        const chatEntry: ChatEntry = {
            format: ChatFormat.announcement,
            name: "",
            msg: t("_cmd_help"),
        };
        chatCtx.loadChat(chatEntry);
    }
}