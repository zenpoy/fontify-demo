import os

import redis
from rq import Worker, Queue, Connection

listen = ['high', 'default', 'low']

redis_url = os.getenv('REDISCLOUD_URL', 'redis://rediscloud:lO67Kl4EF5Wt736V@pub-redis-12572.us-east-1-4.3.ec2.garantiadata.com:12572')

conn = redis.from_url(redis_url)

if __name__ == '__main__':
	with Connection(conn):
	    worker = Worker(map(Queue, listen))
	    worker.work()