/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { findByDisplayName, findByProps } from "@webpack";
import { React } from "@webpack/common";

// Define the badge properties
const badge = {
    id: "bug_hunter_level_1",
    description: "Discord Bug Hunter",
    icon: "2717692c7dca7289b35297368a940dd0",
    link: "https://support.discord.com/hc/en-us/articles/360046057772-Discord-Bugs"
};

// Find the necessary modules
const UserProfileBadgeList = findByDisplayName("UserProfileBadgeList");
const MuteButton = findByDisplayName("MuteButton");
const VoiceModule = findByProps("isMute", "toggleSelfMute");

// Define plugin settings
const settings = definePluginSettings({
    enabled: {
        type: OptionType.BOOLEAN,
        description: "Enable/Disable the Badge Plugin",
        default: true,
    },
});

// Function to render the custom badge
const HardzyBadgePlugin = () => {
    if (!settings.store.enabled) return null;

    return (
        <UserProfileBadgeList
            badges={[badge]}
            user={user}
        />
    );
};

// Button component to toggle the plugin on/off
const ToggleButton = () => {
    return (
        <button
            style={{
                marginLeft: '10px',
                backgroundColor: '#5865F2',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '5px',
                cursor: 'pointer'
            }}
            onClick={() => {
                settings.store.enabled = !settings.store.enabled;
                settings.save();
            }}
        >
            {settings.store.enabled ? "Disable Badge" : "Enable Badge"}
        </button>
    );
};

// Patch the mute button to add the toggle button
const PatchedMuteButton = (props) => (
    <div style={{ display: "flex", alignItems: "center" }}>
        <MuteButton {...props} />
        <ToggleButton />
    </div>
);

// Define the plugin
export default definePlugin({
    name: "HardzyBadgePlugin",
    description: "This plugin adds a custom badge to your Discord profile.",
    authors: ["YourName"],

    settings,

    afterEnable: () => {
        // Replace the MuteButton component with the patched version
        VoiceModule.toggleSelfMute = () => {
            settings.store.enabled = !settings.store.enabled;
            settings.save();
        };

        return PatchedMuteButton;
    },

    patches: [
        {
            module: "UserProfileBadgeList",
            functionName: "render",
            callback: HardzyBadgePlugin,
        }
    ]
});
