import moment from 'moment-timezone'

function userTimestamp(timestamp) {
	if (window.Intl && typeof Intl.DateTimeFormat === 'function') {
		const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const timestampUserTimezone = moment(timestamp).tz(userTimezone).format();

		return timestampUserTimezone;
	} else {
		return timestamp;
	}
}

function timeExtract(timestamp) {
	const d = new Date(timestamp);
	return {
		year: String(d.getFullYear()).slice(2),
		month: String(d.getMonth() + 1).padStart(2, "0"),
		day: String(d.getDate()).padStart(2, "0"),
		hour: (d.getHours() % 12) ? d.getHours() : 12,
		minute: d.getMinutes(),
		second: d.getSeconds(),
		period: d.getHours() >= 12 ? "PM" : "AM"
	}
}

function saxophonify(timestamp) {
	timestamp = userTimestamp(timestamp);
	const {year, month, day, hour, minute, second, period} = timeExtract(timestamp);
	return `${month}/${day}/${year} ${hour}:${minute}:${second}${period}`
}


function timeFormatter(raindrops) {
	if (Array.isArray(raindrops)) {
		return raindrops.map(raindrop => ({...raindrop, timestamp: saxophonify(raindrop.timestamp)}))
	} else if (typeof raindrops === 'object') {
		return {...raindrops, timestamp: saxophonify(raindrops.timestamp)}
	}
}

export default timeFormatter;