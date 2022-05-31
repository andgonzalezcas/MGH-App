const fetch = (...args : any) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const filterHistoryByDate = (history: {} , date: Date) => {
  //date settings
  let yesterday = new Date(date).setDate(date.getDate() - 1)
  let prevMonth = new Date(date).setMonth(date.getMonth() - 1)
  let prevYear = new Date(date).setFullYear(date.getFullYear() - 1)

  //counters
  let yesterdayCounter = 0
  let prevMonthCounter = 0
  let prevYearCounter = 0

  //filter function
  for (const keyHistory in history) {
    if (new Date(history[keyHistory].timestamp) > yesterday)
      yesterdayCounter = yesterdayCounter + 1
    if (new Date(history[keyHistory].timestamp)> prevMonth) 
      prevMonthCounter = prevMonthCounter + 1
    if (new Date(history[keyHistory].timestamp) > prevYear)
      prevYearCounter = prevYearCounter + 1
  }
  return [ yesterdayCounter, prevMonthCounter, prevYearCounter ]
}

const sort = (Top: {}[], Aux: Number[], historyLenght: Number, data: {}) => {
  for (let i = 0; i < Aux.length; i++) {
    if (Aux[i] < historyLenght){
      Aux[i] = historyLenght
      Top[i] = {position: i+1, data}
      break
    }
  }
}

async function downloadMap(metaverse: string) {
	let response = {}, from = 0
  let totalTop = [{}, {}, {}, {}, {}], totalAux = [-1, -1, -1, -1, -1]
  let yesterdayTop = [{}, {}, {}, {}, {}], yesterdayAux = [-1, -1, -1, -1, -1]
  let monthTop = [{}, {}, {}, {}, {}], monthAux = [-1, -1, -1, -1, -1]
  let yearTop = [{}, {}, {}, {}, {}], yearAux = [-1, -1, -1, -1, -1]
	do {
		let url = "https://services.itrmachines.com/" + metaverse + "/requestMap?from=" + from + "&size=2000";
		from += 2000;
		console.log("> requesting " + metaverse + ":", from);
		response = await fetch(url, { method: 'GET' });
		response = await response.json();
		for (let key of Object.keys(response)){
      const date = new Date()
      const [yesterdayCounter, prevMonthCounter, prevYearCounter] = filterHistoryByDate(response[key].history, date)
      let totalCounter = 0
      if (response[key].history)
        totalCounter = response[key].history.length
      const data = {
        tokenId: key,
        requestDate: date,
        dataTable: {
          owner: response[key].owner ? response[key].owner : 'anonymous',
          asset: response[key].coords ? `(x:${response[key].coords.x}, y:${response[key].coords.y})` : `no-asset`,
          from: response[key].last_transaction ? response[key].last_transaction.seller.address : 'anonymous',
          price: response[key].history ? response[key].history[0] ? response[key].history[totalCounter - 1].price : 0 : 0,
          date: response[key].history ? response[key].history[0] ? response[key].history[totalCounter - 1].time : '00-00-0000' : '00-00-0000',
          symbol: response[key].last_transaction ? response[key].last_transaction.symbol : '(symbol)',
          external_link: response[key].external_link ? response[key].external_link : 'https://opensea.io/',
        },
        yesterdayCounter,
        prevMonthCounter,
        prevYearCounter,
        totalCounter,
      }
			sort(totalTop, totalAux, totalCounter, data)
      sort(yesterdayTop, yesterdayAux, yesterdayCounter, data)
      sort(monthTop, monthAux, prevMonthCounter, data)
      sort(yearTop, yearAux, prevYearCounter, data)
    }
	} while (Object.keys(response).length > 0);
	return {totalTop, yesterdayTop, monthTop, yearTop};
}

export default async function searchTopSellings (metaverse: string) {
  return await downloadMap(metaverse)
}