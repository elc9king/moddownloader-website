/*
 * ModDownloader website — single source of truth.
 * Update release information HERE ONLY; every page reads from this file.
 *
 * VERIFIED values below come from the actual build (pom.xml, packaged installer).
 * Values marked null must be replaced with verified information before publishing.
 */
window.SITE_CONFIG = {
  APP_NAME: "ModDownloader",
  APP_TAGLINE: "Your Minecraft mods, instances, and versions — all in one place.",

  // Verified: pom.xml version 0.1.0-SNAPSHOT, packaged 2026-09-26
  APP_VERSION: "0.1.0",
  RELEASE_DATE: "2026-09-26",

  // The build that ships: Inno Setup installer produced from the jpackage image.
  DOWNLOAD_FILENAME: "ShamaClient-Setup.exe",
  DOWNLOAD_SIZE: "44.9 MB",

  // [ADD VERIFIED INFORMATION]
  // Set this to the exact, official URL where ShamaClient-Setup.exe is published
  // (e.g. your GitHub Releases asset URL). While it is null, download buttons are
  // disabled and clearly say the link is not yet published. Do NOT point this at
  // any unofficial mirror.
  DOWNLOAD_URL: null,

  // Minecraft versions the current build targets. Verified against the running
  // launcher (live Mojang version manifest; default instances use 1.21.x).
  // Keep newest first. Updating a release: edit this list here.
  SUPPORTED_VERSIONS: [
    "1.21.11", "1.21.10", "1.21.9", "1.21.8", "1.21.7",
    "1.21.6", "1.21.5", "1.21.4", "1.21.3", "1.21.2", "1.21.1", "1.21"
  ],

  // Verified against the launcher's loader options and launch pipeline:
  // - Fabric: full merge via Fabric Meta (supported)
  // - NeoForge: selectable loader, CurseForge loader filter (supported)
  // - Quilt: selectable loader, merged like Fabric (supported)
  // - Forge: selectable, but launch falls back to vanilla when loader metadata
  //   is unavailable (experimental)
  SUPPORTED_LOADERS: [
    { name: "Fabric", status: "Supported" },
    { name: "NeoForge", status: "Supported" },
    { name: "Quilt", status: "Supported" },
    { name: "Forge", status: "Experimental" },
    { name: "Vanilla", status: "Supported" }
  ],

  // [ADD VERIFIED INFORMATION] — leave null until you have official URLs.
  GITHUB_URL: null,
  DISCORD_URL: null,
  CONTACT_EMAIL: null,

  PLATFORM: "Windows (64-bit)"
};
