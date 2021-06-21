import React,{useState,useEffect} from 'react'
import { gapi } from 'gapi-script';
import DHTMLXScheduler from './DHTMLXScheduler'
import _ from 'lodash';

function GoogleCalendar() {
  
  const CLIENT_ID = '30946104616-su4gi1ms8fd81k51enqnp4e019hpa071.apps.googleusercontent.com';
  const API_KEY = 'AIzaSyA40d59652-R8Q21t36mnYSdYhJvmZLtME';
  const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
  const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
  const [loadData,setLoadData]=useState([])
  const [isSign, setIsSign] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(false)
  
  useEffect(() => {
    gapi.load('client:auth2', initClient);
  }, [])

  useEffect(() => {
    if (loadData.length > 0) {
      setForceUpdate(true)
    }
  },[loadData])

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
  
  function delay(data) {
    return new Promise((resolve) => {
      gapi.client.calendar.events.list({
      calendarId: data.id,
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime'
      }).then((response) => resolve(response.result.items.map((item) =>
      {
        item['color'] = data.backgroundColor
        return item
      }
      )
      )
      )
    })
  }
  function listUpcomingEvents() {
      gapi.client.calendar.calendarList.list().then(function(response){
        const items = response.result.items
        const promise = items.map(async data => {
          return await delay(data).then((_response)=> _response)
        })

        
        const result = Promise.all(promise)
        result.then((__response) => {
          let list = []
          __response.forEach((items) => {
          if (items.length > 0) {
            items.forEach((item) => {
                let obj = {
                  start_date: item.start.date ? item.start.date : item.start.dateTime,
                  end_date: item.end.date ? item.end.date : item.end.dateTime,
                  text: item.summary,
                  color: item.color,
                  id: item.id
                }
              list.push(obj)
              })
            }
          })
          setLoadData(list)
        })
      });
    }
    console.log("loadData >>> ", loadData)
  
  return (
    <div>
      <input type="button" value="authorize" id="authorize" style={{ display: isSign ? 'none' : 'block' }} onClick={() => { gapi.auth2.getAuthInstance().signIn()}}/>
      <input type="button" value="logout" id="logout" style={{ display: isSign ? 'block' : 'none' }} onClick={() => { gapi.auth2.getAuthInstance().signOut() }} />
      {loadData.length > 0 ?
        <DHTMLXScheduler data={loadData} forceUpdate={ forceUpdate}/>
    :null}
    </div>
  )
}

export default GoogleCalendar
