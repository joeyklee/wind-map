import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

// Define a bounding box where your movers are going to spawn from
/**
 * @type {import('geojson').BBox}
 */
export const bbox = [
	-119.68271409305416, 33.28492388432518, -116.5798857475649, 35.092658659523266
];
// A sorted list of the data and the index -- the index is the processed result of the kdbush index
// created by running `npm run create-index` on the source data
export const fieldList = [
	{
		data: 'wind-rtma2p5-20250121_00z_LA_AREA.points.geojson',
		index: 'wind-rtma2p5-20250121_00z_LA_AREA.points.geojson.index'
	},
	{
		data: 'wind-rtma2p5-20250121_01z_LA_AREA.points.geojson',
		index: 'wind-rtma2p5-20250121_01z_LA_AREA.points.geojson.index'
	},
	{
		data: 'wind-rtma2p5-20250121_02z_LA_AREA.points.geojson',
		index: 'wind-rtma2p5-20250121_02z_LA_AREA.points.geojson.index'
	}
];

/**
 * @param {string} fileName
 */
export function parseTimestampFromFileName(fileName) {
	// wind-rtma2p5-20250121_02z_LA_AREA.points.geojson
	const dataName = fileName
		.split('.')[0]
		.replace('wind-rtma2p5-', '')
		.replace('_LA_AREA', '')
		.split('_');
	const [date, hour] = dataName;

	const myHour = hour.replace('z', '');
	const formattedDate = dayjs
		.utc(`${date} ${myHour}`, 'YYYYMMDD HH')
		.tz('America/Los_Angeles')
		.format('MMM D [at] h a');

	return formattedDate;
}
