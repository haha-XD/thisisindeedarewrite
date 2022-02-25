# EXAMPLE ENEMY DESCRIPTION
```
{
    "states" : {
        "chaseShoot" : {
            "behaviour" : ["shoot radialShotgun 1", "stateChangeTime 3 wait"]
        },
        "wait" : {
            "behaviour" : ["stateChangeTime 12 chaseShoot"]
        }
    },
    "defaultState" : "spiralPtn",
    "projectiles" : {
        "radialShotgun" : {
            "type" : "Radial",
            "shotCount" : 10,
            "direction" : 0,
            "projDesc": {
                "speed" : 3, 
                "size" : 16,
                "lifetime" : 5,
                "damage" : 5
            }
        }
    }
}
```
