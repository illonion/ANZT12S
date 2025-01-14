// Load mappool data
let allBeatmaps
const modIconsNm = document.getElementById("mod-icons-nm")
const modIconsHd = document.getElementById("mod-icons-hd")
const modIconsHr = document.getElementById("mod-icons-hr")
const modIconsDt = document.getElementById("mod-icons-dt")
const modIconsTb = document.getElementById("mod-icons-tb")
async function getBeatmaps() {
    const response = await fetch("../_data/beatmaps.json")
    const responseJson = await response.json()
    allBeatmaps = responseJson.beatmaps

    for (let i = 0; i < allBeatmaps.length; i++) {
        const modIconContainer = document.createElement("div")
        modIconContainer.classList.add("modIconContainer")
        const modIcon = document.createElement("img")
        modIcon.classList.add("mod-icon-inactive")
        modIcon.setAttribute("src", `static/mod-icons/${allBeatmaps[i].mod.toLowerCase()}${allBeatmaps[i].order}.png`)
        modIconContainer.append(modIcon)

        switch (allBeatmaps[i].mod) {
            case "NM":
                modIconsNm.append(modIconContainer)
                break
            case "HD":
                modIconsHd.append(modIconContainer)
                break
            case "HR":
                modIconsHr.append(modIconContainer)
                break
            case "DT":
                modIconsDt.append(modIconContainer)
                break
            default:
                modIconsTb.append(modIconContainer)
        }
    }
}
getBeatmaps()

const socket = createGosuWsSocket();

// Map metadata details
let mapId, mapMd5
const mapBackground = document.getElementById("map-background")
const songName = document.getElementById("song-name")
const artist = document.getElementById("artist")
const difficulty = document.getElementById("difficulty") 

// Map timing
const songLengthPassed = document.getElementById("song-length-passed")
const songCurrentTime = document.getElementById("song-current-time")
const songTotalTime = document.getElementById("song-total-time")

// Map Stats
const mapStatsSr = document.getElementById("map-stats-sr")
const mapStatsBpm = document.getElementById("map-stats-bpm")
const mapStatsCs = document.getElementById("map-stats-cs")
const mapStatsAr = document.getElementById("map-stats-ar")
const mapStatsOd = document.getElementById("map-stats-od")
const mapStatsAnimation = {
    mapStatsSr: new CountUp(mapStatsSr, 0, 0, 2, 0.5, { useEasing: true, useGrouping: true, separator: ",", decimal: "." }),
    mapStatsBpm: new CountUp(mapStatsBpm, 0, 0, 0, 0.5, { useEasing: true, useGrouping: true, separator: ",", decimal: "." }),
    mapStatsCs: new CountUp(mapStatsCs, 0, 0, 1, 0.5, { useEasing: true, useGrouping: true, separator: ",", decimal: "." }),
    mapStatsAr: new CountUp(mapStatsAr, 0, 0, 1, 0.5, { useEasing: true, useGrouping: true, separator: ",", decimal: "." }),
    mapStatsOd: new CountUp(mapStatsOd, 0, 0, 1, 0.5, { useEasing: true, useGrouping: true, separator: ",", decimal: "." }),
}

socket.onmessage = evnet => {
    const data = JSON.parse(evnet.data)

    // Set metadata
    if (mapId !== data.menu.bm.id || mapMd5 !== data.menu.bm.md5) {
        mapId = data.menu.bm.id
        mapMd5 = data.menu.bm.md5

        mapBackground.style.backgroundImage = `url("https://assets.ppy.sh/beatmaps/${data.menu.bm.set}/covers/cover.jpg")`
        const songMetadata = data.menu.bm.metadata
        songName.innerText = songMetadata.title
        artist.innerText = songMetadata.artist
        difficulty.innerText = `[${songMetadata.difficulty}]`
    }
    console.log(data)

    // Set current timing
    data.menu.bm.time.current = data.menu.bm.time.current > 0 ? data.menu.bm.time.current : 0
    songCurrentTime.innerText = displayTime(data.menu.bm.time.current)
    songTotalTime.innerText = displayTime(data.menu.bm.time.mp3)
    songLengthPassed.style.width = `${data.menu.bm.time.current / data.menu.bm.time.mp3 * 364}px`

    // Update map stats
    const currentStats = data.menu.bm.stats
    mapStatsAnimation.mapStatsSr.update(currentStats.fullSR)
    mapStatsAnimation.mapStatsBpm.update(currentStats.BPM.common)
    mapStatsAnimation.mapStatsCs.update(currentStats.CS)
    mapStatsAnimation.mapStatsAr.update(currentStats.AR)
    mapStatsAnimation.mapStatsOd.update(currentStats.OD)
}

// Display time
function displayTime(ms) {
    return `${Math.floor(ms / 60000)}:${String(Math.round(ms / 1000) % 60).padStart(2, '0')}`
}