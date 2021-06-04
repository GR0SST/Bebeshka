/**
* @name Bebeshka
* @displayName Bebeshka
* @source https://github.com/GR0SST/Bebeshka/blob/main/Bebeshka.plugin.js
* @authorId 371336044022464523
*/
/*@cc_on
@if (@_jscript)
	
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/
const request = require("request");
const fs = require("fs");
const path = require("path");

const config = {
    info: {
        name: "Bebeshka",
        authors: [
            {
                name: "GROSST",
                discord_id: "3713360440224645238",
            }
        ],
        version: "1.0.3",
        description: "ЛГБТ+А",
        github: "https://github.com/GR0SST/Bebeshka/blob/main/Bebeshka.plugin.js",
        github_raw: "https://raw.githubusercontent.com/GR0SST/Bebeshka/main/Bebeshka.plugin.js",

    },
    changelog: [{
        title: "Bebeshka",
        type: "fixed",
        items: [
            "просто пкм по челику - wmute "
        ]
    }],
    defaultConfig: []
};

module.exports = !global.ZeresPluginLibrary ? class {
    constructor() {
        this._config = config;
    }

    getName() {
        return config.info.name;
    }

    getAuthor() {
        return config.info.authors.map(author => author.name).join(", ");
    }

    getDescription() {
        return config.info.description;
    }

    getVersion() {
        return config.info.version;
    }

    load() {
        BdApi.showConfirmationModal("Library plugin is needed",
            `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
            confirmText: "Download",
            cancelText: "Cancel",
            onConfirm: () => {
                request.get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", (error, response, body) => {
                    if (error) {
                        return electron.shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                    }

                    fs.writeFileSync(path.join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body);
                });
            }
        });
    }

    start() { }

    stop() { }
} : (([Plugin, Library]) => {
    const { DiscordModules, WebpackModules, Patcher, DiscordContextMenu, Settings, DiscordAPI } = Library;
    class Bebeshka extends Plugin {
        constructor() {
            super();
        }

        onStart() {
            this.patchUserContextMenus();
            this.patchChannelContextMenu();

        }

        onStop() {
            Patcher.unpatchAll();
        }


        patchUserContextMenus() {
            const UserContextMenus = WebpackModules.findAll(
                (m) => m.default && m.default.displayName.includes("UserContextMenu")
            );

            for (const UserContextMenu of UserContextMenus) {
                Patcher.after(UserContextMenu, "default", (thisObject, [props], returnValue) => {

                    returnValue.props.children.props.children.push(
                        
                        DiscordContextMenu.buildMenuChildren([
                            {
                                type: "group",
                                items: [
                                    {
                                        label: "Wmute",
                                        action: () => {
                                            let msg = `!wmute ${props.user.id}`

                                            DiscordAPI.Channel.fromId("825743467216764959").sendMessage(msg)
                                        },
                                    },
                                ],
                            },
                        ])
                    );
                }
                );
            }
        }


    }

    return Bebeshka;
})(global.ZeresPluginLibrary.buildPlugin(config));
