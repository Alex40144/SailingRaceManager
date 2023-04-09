import React from 'react';
import { server } from './URL';
import dayjs from 'dayjs';


type RaceDataType = {
    [key: string]: any,
    id: string,
    number: number,
    OOD: string,
    AOD: string,
    SO: string,
    ASO: string,
    results: ResultsType[],
    Time: string,
    Type: string,
    seriesId: string
};

type SeriesDataType = {
    [key: string]: any,
    id: string,
    name: string,
    clubId: string,
    settings: SettingsType,
    races: RaceDataType[]
}

type ResultsType = {
    [key: string]: any,
    Helm: string,
    Crew: string,
    BoatClass: string,
    BoatNumber: string,
    Time: number,
    Laps: number,
    Position: number
}

type SettingsType = {
    [key: string]: any,
    numberToCount: number
}
type BoatDataType = {
    id: string,
    name: string,
    crew: number,
    py: number
}

export async function fetchSeries(club: string): Promise<SeriesDataType[]> {
    const body = {
        "club": club
    }
    return await fetch(`${server}/api/GetSeriesByClub`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data && data.error) {
                console.log(data.message)
            } else {
                return (data.series)
            }
        });
};

export async function fetchBoats(): Promise<BoatDataType[]> {
    const body = {
    }
    return await fetch(`${server}/api/GetBoats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data && data.error) {
                console.log(data.message)
            } else {
                return (data.boats)
            }
        });
};

export async function updateRaceSettings(raceData: RaceDataType) {
    const body = raceData
    return await fetch(`${server}/api/UpdateRaceById`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
        .then((res) => res.json())
        .then(async (data) => {
            if (data && data.error) {
                console.log(data.message)
            } else {
                console.log(data)
                //TODO reload series data.
            }
        });
};

export async function updateSeriesSettings(seriesData: SeriesDataType) {
    const body = seriesData
    return await fetch(`${server}/api/UpdateSeriesById`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data && data.error) {
                console.log(data.message)
            } else {
                console.log(data)
            }
        });
};

export async function createRace(club: string, seriesName: string): Promise<RaceDataType> {
    var time = dayjs().format('YYYY-MM-DD HH:mm')
    const body = {
        "club": club,
        "seriesName": seriesName,
        "time": time
    }
    return await fetch(`${server}/api/CreateRace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
        .then((res) => res.json())
        .then(async (data) => {
            if (data && data.error) {
                console.log(data.message)
            } else {
                console.log(data.race)
                return data.race
            }
        });
};

export async function deleteRace(id: string): Promise<RaceDataType> {
    const body = {
        "id": id,
    }
    return await fetch(`${server}/api/DeleteRaceById`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
        .then((res) => res.json())
        .then(async (data) => {
            if (data && data.error) {
                console.log(data.message)
            } else {
                return data.race
            }
        });
};