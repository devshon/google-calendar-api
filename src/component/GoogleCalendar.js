import React,{useState,useEffect} from 'react'
import { gapi } from 'gapi-script';
import DHTMLXScheduler from './DHTMLXScheduler'

function GoogleCalendar() {
  const data =  {
    start_date: "2020-06-10 6:00",
    end_date: "2020-06-10 8:00",
    text: "default event",
    id: 1,
  }
  
  const CLIENT_ID = '30946104616-su4gi1ms8fd81k51enqnp4e019hpa071.apps.googleusercontent.com';
  const API_KEY = 'AIzaSyA40d59652-R8Q21t36mnYSdYhJvmZLtME';
  const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
  const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
  const [loadData,setLoadData]=useState([])
  const [isSign,setIsSign]=useState(false)
  useEffect(() => {
    gapi.load('client:auth2', initClient);
  }, [])

   function initClient() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs:  DISCOVERY_DOCS,
        scope: SCOPES
      }).then(function () {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      }, function (error) {
        console.log("initClient >>> ",new Error(error))
      });
   }
  
  function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      listUpcomingEvents();
    }
    setIsSign(isSignedIn)
  }
  
    function listUpcomingEvents() {
      gapi.client.calendar.calendarList.list().then(function(response){
        const items = response.result.items
        const itemLength = items.length
        for (let index = 0; index < itemLength; index++) {
          const _id = items[index].id;
          gapi.client.calendar.events.list({
            calendarId: _id,
            showDeleted: false,
            singleEvents: true,
            maxResults: 10,
            orderBy: 'startTime'
          }).then(function (response) {
            console.log("response >>> ", response)
          });
        }
      });
    }
  
  return (
    <div>
      <input type="button" value="authorize" id="authorize" style={{ display: isSign ? 'none' : 'block' }} onClick={() => { gapi.auth2.getAuthInstance().signIn()}}/>
      <input type="button" value="logout" id="logout" style={{ display: isSign ? 'block' : 'none' }} onClick={() => { gapi.auth2.getAuthInstance().signOut() }}/>
      <DHTMLXScheduler data={data}/>
    </div>
  )
}

export default GoogleCalendar
