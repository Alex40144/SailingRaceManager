import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import SignOnTable from '../components/SignOnTable';
import * as DB from '../components/apiMethods'
import FleetResultsTable from '../components/FleetResultsTable';
import SeriesResultsTable from '../components/SeriesResultsTable';
import { set } from 'cypress/types/lodash';
import { active } from 'sortablejs';
const namespace = 'urn:x-cast:com.sailviz';

declare global {
    interface Window { castReceiverManager: any; messageBus: any; }
}

declare var cast: any;

const CastPage = () => {
    var interval: NodeJS.Timer | null = null
    const initializeCastApi = () => {
        // Initialize the CastReceiverManager with an application status message.
        // cast.receiver.logger.setLevelValue(0);
        window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
        console.log('Starting Receiver Manager');

        window.castReceiverManager.onReady = function (event: any) {
            setLastMessage('Received Ready event: ' + JSON.stringify(event.data));
            window.castReceiverManager.setApplicationState('chromecast-dashboard is ready...');
        };

        window.castReceiverManager.onSenderConnected = function (event: any) {
            console.log('Received Sender Connected event: ' + event.senderId);
        };

        window.castReceiverManager.onSenderDisconnected = function (event: any) {
            console.log('Received Sender Disconnected event: ' + event.senderId);
        };

        window.messageBus =
            window.castReceiverManager.getCastMessageBus(
                namespace, cast.receiver.CastMessageBus.MessageType.JSON);

        window.messageBus.onMessage = function (event: any) {
            //remove any existing intervals
            if (interval != null) { clearInterval(interval) }

            setLastMessage(JSON.stringify(event))
            console.log('Message [' + event.senderId + ']: ' + event.data);

            if (event.data['type'] == 'clubId') {
                window.messageBus.send(event.senderId, "test");
                setClubId(event.data['clubId'])
            } else if (event.data['type'] == 'showPage') {
                setClubId(event.data['clubId'])
                showPage(event.data['id'], event.data['pageType'])
                window.messageBus.send(event.senderId, new Date().toISOString());
            } else if (event.data['type'] == 'slideShow') {
                setClubId(event.data['clubId'])
                slideShow(event.data['ids'], event.data['pageType'])
                window.messageBus.send(event.senderId, new Date().toISOString());
            }
        }

        // Initialize the CastReceiverManager with an application status message.
        window.castReceiverManager.start({ statusText: 'Application is starting' });
        console.log('Receiver Manager started');


    }



    const slideShow = (ids: string[], type: string) => {
        var i = 0
        showPage(ids[i]!, type) // Run immediately
        interval = setInterval(() => {
            i++
            //reset count if at end of array.
            if (i >= ids.length) {
                i = 0
            }
            showPage(ids[i]!, type) // Run on interval
        }, 30000)
    }

    const showPage = async (id: string, type: string) => {
        // const home = document.getElementById("homepage")
        // home?.classList.add("hidden")
        // const race = document.getElementById("RaceResults")
        // const series = document.getElementById("SeriesResults")
        switch (type) {
            case "race":
                setActiveRaceData(await DB.getRaceById(id))
                // series?.classList.add("hidden")
                // race?.classList.remove("hidden")
                break;

            case "series":
                setActiveSeriesData(await DB.GetSeriesById(id))
                // race?.classList.add("hidden")
                // series?.classList.remove("hidden")

                break;
        }
    }

    const [clubId, setClubId] = useState<string>("")
    const [lastMessage, setLastMessage] = useState<string>("test")
    var [club, setClub] = useState<ClubDataType>({
        id: "",
        name: "",
        settings: {
            clockIP: "",
            hornIP: "",
            pursuitLength: 0,
            clockOffset: 0
        },
        series: [],
        boats: [],
    })
    var [activeRaceData, setActiveRaceData] = useState<RaceDataType>({
        id: "",
        number: 0,
        Time: "",
        OOD: "",
        AOD: "",
        SO: "",
        ASO: "",
        fleets: [{
            id: "",
            startTime: 0,
            raceId: "",
            fleetSettings: {
                id: "",
                name: "",
                boats: [],
                startDelay: 0,
                fleets: []
            } as FleetSettingsType,
            results: [{
                id: "",
                raceId: "",
                Helm: "",
                Crew: "",
                boat: {} as BoatDataType,
                SailNumber: "",
                finishTime: 0,
                CorrectedTime: 0,
                laps: [{
                    time: 0,
                    id: "",
                    resultId: ""
                }],
                PursuitPosition: 0,
                HandicapPosition: 0,
                resultCode: "",
                fleetId: ""
            } as ResultsDataType]

        }],
        Type: "",
        seriesId: "",
        series: {} as SeriesDataType
    })
    var [activeSeriesData, setActiveSeriesData] = useState<SeriesDataType>({
        id: "",
        name: "",
        clubId: "",
        settings: {
            numberToCount: 0
        },
        races: [],
        fleetSettings: [{
            id: "",
            name: "",
            boats: [],
            startDelay: 0,
            fleets: []
        } as FleetSettingsType]
    })

    useEffect(() => {
        if (clubId != "") {
            //catch if not fully updated
            if (clubId == "invalid") {
                return
            }
            DB.GetClubById(clubId).then((data) => {
                setClub(data)
            })
        }
    }, [clubId])


    return (
        <div className='bg-white h-full'>
            <Script type="text/javascript" src="//www.gstatic.com/cast/sdk/libs/receiver/2.0.0/cast_receiver.js" onReady={() => {
                initializeCastApi()
            }}></Script>
            <div id="homepage" className="p-4 hidden">
                <div className="text-6xl font-extrabold text-gray-700 p-6">
                    SailViz - Cast
                </div>
            </div>
            <div id="RaceResults" className="hidden" >
                <div className="p-4">
                    <div className="text-xl font-extrabold text-gray-700 p-6">
                        {activeRaceData.series.name}: {activeRaceData.number}
                    </div>
                    <FleetResultsTable data={activeRaceData.fleets.flatMap(fleet => fleet.results)} startTime={activeRaceData.fleets[0]?.startTime} key={activeRaceData.id} editable={false} showTime={false} />

                </div>
            </div>
            <div id="SeriesResults" className="" key={activeSeriesData.id}>
                <div className="p-4">
                    <div className="text-xl font-extrabold text-gray-700 px-6 pt-2">
                        {activeSeriesData.name}
                    </div>
                    <SeriesResultsTable data={activeSeriesData} editable={false} showTime={false} key={activeRaceData.id} />
                    {/* {JSON.stringify(activeSeriesData)} */}
                </div>
            </div>
            <div className="px-4">
                <div className="text-xl font-extrabold text-gray-700 p-6">
                    Full results available at sailviz.com/{club.name}
                </div>
            </div>
        </div>
    )
}

export default CastPage;