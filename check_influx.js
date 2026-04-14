import dotenv from 'dotenv';
dotenv.config();
import { InfluxDB } from '@influxdata/influxdb-client';

const influx = new InfluxDB({ url: process.env.INFLUXDB_URL, token: process.env.INFLUXDB_TOKEN });
const queryApi = influx.getQueryApi(process.env.INFLUXDB_ORG);
const query = `
import "influxdata/influxdb/schema"
schema.tagValues(bucket: "${process.env.INFLUXDB_BUCKET}", tag: "building_id")
`;

const blds = new Set();
queryApi.queryRows(query, {
  next(row, tableMeta) {
    blds.add(tableMeta.toObject(row)._value);
  },
  error(error) { console.error('Query error:', error); },
  complete() { console.log('Building IDs in DB:', Array.from(blds)); }
});
