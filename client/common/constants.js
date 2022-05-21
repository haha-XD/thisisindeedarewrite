//server stuff
export const SV_UPDATE_RATE = 1000/10;
export const SV_TICK_RATE = 1000/20;
export const TILE_SIZE = 32;
export const CHUNK_SIZE = 640;
export const FIRE_RATE = 1000/15;
export const ENTITY_CATEGORY = {
    walls : 'walls',
    players : 'players',
    enemies : 'enemies',
    projectiles : 'projectiles'
}

//client stuff
export const RENDER_OPTIONS = {
    DEBUG_MODE : false,
    LOW_SPEC_MODE : true,
    HEALTHBAR_FREEZE_TICKS : 45
}

export const CL_TICK_RATE = 1000/100;
export const PLAYER_PROJ_DESC = {
    speed: 100,
    size: 16,
    lifetime: 300,
    damage: 10,
    target: ENTITY_CATEGORY.enemies
}