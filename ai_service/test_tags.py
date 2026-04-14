import os
from dotenv import load_dotenv
load_dotenv()
from influxdb_client import InfluxDBClient

def main():
    token = os.environ.get('INFLUX_TOKEN')
    org = os.environ.get('INFLUX_ORG')
    url = os.environ.get('INFLUX_URL')
    bucket = os.environ.get('INFLUX_BUCKET')
    
    query = f'''
    import "influxdata/influxdb/schema"
    schema.tagValues(bucket: "{bucket}", tag: "building_id")
    '''
    with InfluxDBClient(url=url, token=token, org=org) as client:
        query_api = client.query_api()
        try:
            result = query_api.query(query)
            for table in result:
                for record in table.records:
                    print('DB TAG:', record.get_value())
        except Exception as e:
            print('Error:', e)

main()
