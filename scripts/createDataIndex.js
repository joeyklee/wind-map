// @ts-check
import fs from 'fs';
// import as a ES module
import KDBush from 'kdbush';

async function createIndex(fpath) {
	const data = await fs.promises.readFile(fpath).then((d) => JSON.parse(d));

	// initialize KDBush for 1000 items
	const index = new KDBush(data.features.length);

	// fill it with 1000 points
	for (let feat of data.features) {
		const [x, y] = feat.geometry.coordinates;
		index.add(x, y);
	}
	// perform the indexing
	index.finish();
	return fs.promises.writeFile(`${fpath}.index`, Buffer.from(index.data));
}

async function main() {
	const files = await fs.promises
		.readdir('./static')
		.then((d) => d.filter((f) => f.endsWith('.geojson')));

	await Promise.all(
		files.map((file) => {
			return createIndex(`./static/${file}`);
		})
	);
}
main();
