# EXAMPLE BULLET DESCRIPTION
{
    "speed" : 3, 
    "size" : 16,
    "lifetime" : 5,
    "damage" : 5,
    "direction" : 0,
    "angularVel" : 0,
    "accel" : 0
}
# EXAMPLE NPC DESCRIPTION
{
    "states" : {
        "spiralPtn" : {
            "behaviour" : ["shoot shotgun 1", "stateChangeTime 3 wait"]
        },
        "wait" : {
            "behaviour" : ["stateChangeTime 12 spiralPtn"]
        }
    },
    "defaultState" : "spiralPtn"
}