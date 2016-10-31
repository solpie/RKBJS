import {EloUtil} from "../../utils/EloUtil";
export var getEloRank = (gameDataArr, gameRecArr)=> {
    var playerMap = {};
    var gameArr = gameDataArr;
    for (var j = 0; j < gameArr.length; j++) {
        var game = gameArr[j];
        for (var i = 1; ; i++) {
            var gameData = game.data[i];
            if (gameData) {
                var leftPlayerData = gameData.left;
                var rightPlayerData = gameData.right;
                if (!playerMap[leftPlayerData.name])
                    playerMap[leftPlayerData.name] = {
                        name: leftPlayerData.name,
                        winGameCount: 0,
                        loseGameCount: 0,
                        roundCount: 0,
                        score: 0,
                        eloScore: 2000
                    };
                if (!playerMap[rightPlayerData.name])
                    playerMap[rightPlayerData.name] = {
                        name: rightPlayerData.name,
                        winGameCount: 0,
                        loseGameCount: 0,
                        roundCount: 0,
                        score: 0,
                        eloScore: 2000
                    };

                var leftPlayer = playerMap[leftPlayerData.name];
                var rightPlayer = playerMap[rightPlayerData.name];

                gameRecArr.push({
                    round: game.round,
                    left: {name: leftPlayer.name, score: leftPlayerData.score},
                    right: {name: rightPlayer.name, score: rightPlayerData.score}
                });

                var dt = EloUtil.classicMethod(leftPlayer.eloScore, rightPlayer.eloScore);
                leftPlayer.score += leftPlayerData.score;
                rightPlayer.score += rightPlayerData.score;

                if (leftPlayerData.score > rightPlayerData.score) {
                    leftPlayer.eloScore += dt;
                    rightPlayer.eloScore -= dt;

                    leftPlayer.winGameCount += 1;
                    rightPlayer.loseGameCount += 1;
                }
                else {
                    leftPlayer.eloScore -= dt;
                    rightPlayer.eloScore += dt;

                    leftPlayer.loseGameCount += 1;
                    rightPlayer.winGameCount += 1;
                }
            }
            else break;
        }
    }
    // for (var k in playerMap) {
    //     console.log(playerMap[k]);
    // }
    return playerMap;
};
