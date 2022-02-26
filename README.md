# ENEMY SCRIPTING
## ```stateChangeTime <timerName> <waitTime> <newState>```

`timerName`: should be unique, this identifies the timer used

`waitTime`: time waited till state change

`newState`: the state to change to


## ```shoot <projectileName> <interval>```

`projectileName`: the name of the projectile in the 'projectiles' field of the ai description

`interval`: the interval between shots

## ```chase```

no fields, chases closest player.

# EXAMPLE ENEMY DESCRIPTION
```
{
    "states" : {
        "stationaryShoot" : {
            "behaviour" : ["shoot radialShotgun 2", "stateChangeTime waitTimer 6 wait"]
        },
        "wait" : {
            "behaviour" : ["stateChangeTime waitTimer 6 stationaryShoot"]
        }
    },
    "defaultState" : "stationaryShoot",
    "projectiles" : {
        "radialShotgun" : {
            "type" : "Radial",
            "shotCount" : 10,
            "direction" : 0,
            "projDesc": {
                "speed" : 20, 
                "size" : 16,
                "lifetime" : 3000,
                "damage" : 5
            }
        }
    }
}
```
