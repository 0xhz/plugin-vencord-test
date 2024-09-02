/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { addBadge, BadgePosition, ProfileBadge, removeBadge } from "@api/Badges";
import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { UserStore } from "@webpack/common";

const getUserId = () => {
    const id = UserStore.getCurrentUser()?.id;
    if (!id) throw new Error("User not yet logged in");
    return id;
};

let userId;

let EquippedBadges = [];

const badgeSettings = {
    discordStaffBadge: "Discord Staff",
    hypeSquadEventsBadge: "HypeSquad Events",
    moderatorProgrammesAlumniBadge: "Moderator Programmes Alumni",
    partneredServerOwnerBadge: "Partnered Server Owner",
    earlySupporterBadge: "Early Supporter",
    earlyVerifiedBotDeveloperBadge: "Early Verified Bot Developer",
    discordBugHunterGoldBadge: "Discord Bug Hunter Gold",
    discordBugHunterGreenBadge: "Discord Bug Hunter Green",
    nitroMemberBadge: "Nitro Member",
    activeDeveloperBadge: "Active Developer",
    boostingBadge: "Choose a boosting badge tier (0-9)",
};

const settings = definePluginSettings(
    Object.entries(badgeSettings).reduce((acc, [setting, badge]) => {
        acc[setting] = {
            type: badge === "Choose a boosting badge tier (0-9)" ? OptionType.NUMBER : OptionType.BOOLEAN,
            description: `${badge} ${badge === "Choose a boosting badge tier (0-9)" ? "" : "badge"}`,
            default: badge === "Choose a boosting badge tier (0-9)" ? 0 : false,
            restartNeeded: true,
        };
        return acc;
    }, {})
);

export default definePlugin({
    name: "FakeBadges",
    description: "Add Discord badges to your profile.",
    authors: [{
        name: "Ethan",
        id: 721717126523781240n
    }],
    settings,

    start() {
        userId = getUserId();
        addEnabledBadges();
    }
});

const addEnabledBadges = () => {
    assignBadges();
    updateBoostingBadge();
};

const TierToMonths = {
    1: 1,
    2: 2,
    3: 3,
    4: 6,
    5: 9,
    6: 12,
    7: 15,
    8: 18,
    9: 24,
};

const updateBoostingBadge = () => {
    let value = settings.store.boostingBadge;

    if (value > 9) {
        settings.store.boostingBadge = 9;
        value = 9;
    } else if (value < 0) {
        settings.store.boostingBadge = 0;
        value = 0;
    }

    let userProfile = chunk.find((m) => m?.exports?.default?.getUserProfile).exports.default;
    let profile = userProfile.getUserProfile(userId);
    const boostingBadge = profile.badges.find(b => b.id.startsWith("guild_booster_lvl"));
    const existingBoostingBadge = EquippedBadges.find(b => b.description === boostingBadge.description);

    if (value !== 0) {
        const date = new Date();

        date.setDate(date.getDate());
        date.setMonth(date.getMonth() - TierToMonths[value]);

        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "long" }).substring(0, 3);
        const year = date.getFullYear();

        boostingBadge.description = `Server Boosting since ${day} ${month} ${year}`;
        boostingBadge.icon = BadgeTier[value];
        if (existingBoostingBadge) {
            EquippedBadges = EquippedBadges.filter(b => b !== existingBoostingBadge);
            removeBadge(existingBoostingBadge);
        }
        EquippedBadges.push(boostingBadge);
        addBadge(boostingBadge);
    } else if (existingBoostingBadge) {
        EquippedBadges = EquippedBadges.filter(b => b !== existingBoostingBadge);
        removeBadge(existingBoostingBadge);
    }
};

function assignBadges() {
    let userProfile = chunk.find((m) => m?.exports?.default?.getUserProfile).exports.default;
    let profile = userProfile.getUserProfile(userId);

    profile.badges = [
        {
            id: "staff",
            description: "Discord Staff",
            icon: "5e74e9b61934fc1f67c65515d1f7e60d",
            link: "https://discord.com/company",
        },
        {
            id: "partner",
            description: "Partnered Server Owner",
            icon: "3f9748e53446a137a052f3454e2de41e",
            link: "https://discord.com/partners",
        },
        {
            id: "certified_moderator",
            description: "Moderator Programs Alumni",
            icon: "fee1624003e2fee35cb398e125dc479b",
            link: "https://discord.com/safety",
        },
        {
            id: "hypesquad",
            description: "HypeSquad Events",
            icon: "bf01d1073931f921909045f3a39fd264",
            link: "https://discord.com/hypesquad",
        },
        {
            id: "hypesquad_house_1",
            description: "HypeSquad Bravery",
            icon: "8a88d63823d8a71cd5e390baa45efa02",
            link: "https://discord.com/settings/hypesquad-online",
        },
        {
            id: "hypesquad_house_2",
            description: "HypeSquad Brilliance",
            icon: "011940fd013da3f7fb926e4a1cd2e618",
            link: "https://discord.com/settings/hypesquad-online",
        },
        {
            id: "hypesquad_house_3",
            description: "HypeSquad Balance",
            icon: "3aa41de486fa12454c3761e8e223442e",
            link: "https://discord.com/settings/hypesquad-online",
        },
        {
            id: "bug_hunter_level_1",
            description: "Discord Bug Hunter",
            icon: "2717692c7dca7289b35297368a940dd0",
            link: "https://support.discord.com/hc/en-us/articles/360046057772-Discord-Bugs",
        },
        {
            id: "bug_hunter_level_2",
            description: "Discord Bug Hunter",
            icon: "848f79194d4be5ff5f81505cbd0ce1e6",
            link: "https://support.discord.com/hc/en-us/articles/360046057772-Discord-Bugs",
        },
        {
            id: "active_developer",
            description: "Active Developer",
            icon: "6bdc42827a38498929a4920da12695d9",
            link: "https://support-dev.discord.com/hc/en-us/articles/10113997751447?ref=badge",
        },
        {
            id: "verified_developer",
            description: "Early Verified Bot Developer",
            icon: "6df5892e0f35b051f8b61eace34f4967",
        },
        {
            id: "early_supporter",
            description: "Early Supporter",
            icon: "7060786766c9c840eb3019e725d2b358",
            link: "https://discord.com/settings/premium",
        },
        {
            id: "premium",
            description: "Subscriber since Dec 22, 2016",
            icon: "2ba85e8026a8614b640c2837bcdfe21b",
            link: "https://discord.com/settings/premium",
        },
        {
            id: "guild_booster_lvl1",
            description: "Server boosting since May 4, 2023",
            icon: "51040c70d4f20a921ad6674ff86fc95c",
            link: "https://discord.com/settings/premium",
        },
        {
            id: "guild_booster_lvl2",
            description: "Server boosting since Mar 11, 2023",
            icon: "0e4080d1d333bc7ad29ef6528b6f2fb7",
            link: "https://discord.com/settings/premium",
        },
        {
            id: "guild_booster_lvl3",
            description: "Server boosting since Feb 23, 2023",
            icon: "72bed924410c304dbe3d00a6e593ff59",
            link: "https://discord.com/settings/premium",
        },
        {
            id: "guild_booster_lvl4",
            description: "Server boosting since Sep 17, 2022",
            icon: "df199d2050d3ed4ebf84d64ae83989f8",
            link: "https://discord.com/settings/premium",
        },
        {
            id: "guild_booster_lvl5",
            description: "Server boosting since Feb 21, 2022",
            icon: "fc7b684a9d6192c42b753e7a02514207",
            link: "https://discord.com/settings/premium",
        },
        {
            id: "guild_booster_lvl6",
            description: "Server boosting since Feb 21, 2022",
            icon: "18419c84c0aeee1c61aada4569f61c8f",
            link: "https://discord.com/settings/premium",
        },
        {
            id: "guild_booster_lvl7",
            description: "Server boosting since Feb 21, 2022",
            icon: "d0750afaa496a5092063f2b7984c67bb",
            link: "https://discord.com/settings/premium",
        },
        {
            id: "guild_booster_lvl8",
            description: "Server boosting since Feb 21, 2022",
            icon: "7cc21de330415a45db500330974a5d35",
            link: "https://discord.com/settings/premium",
        },
        {
            id: "guild_booster_lvl9",
            description: "Server boosting since Feb 21, 2022",
            icon: "10b1898f7bdbb72639c9d674f89f7f58",
            link: "https://discord.com/settings/premium",
        }
    ];
}
